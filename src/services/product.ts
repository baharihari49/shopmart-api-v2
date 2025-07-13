import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { ProductQuery } from '../types';

export class ProductService {
  static async getProducts(query: ProductQuery) {
    const {
      page = '1',
      limit = '12',
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      inStock = 'true',
    } = query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    if (inStock === 'true') {
      where.inStock = true;
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (brand) {
      where.brand = {
        slug: brand,
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'rating') {
      orderBy.rating = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    };
  }

  static async getProductById(id: string, userId?: string) {
    const product = await prisma.product.findFirst({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Track product view
    if (userId) {
      await this.trackProductView(userId, id);
    }

    return product;
  }

  static async searchProducts(query: string, limit: number = 10) {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
      select: {
        id: true,
        name: true,
        price: true,
        originalPrice: true,
        images: true,
        rating: true,
        inStock: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: limit,
      orderBy: {
        rating: 'desc',
      },
    });

    return products;
  }

  static async getProductReviews(productId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          isApproved: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.review.count({
        where: {
          productId,
          isApproved: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getRelatedProducts(productId: string, limit: number = 8) {
    // Get the product's category and brand
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true, brandId: true },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Find related products in the same category or brand
    const relatedProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productId } },
          { isActive: true },
          { deletedAt: null },
          {
            OR: [
              { categoryId: product.categoryId },
              { brandId: product.brandId },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        price: true,
        originalPrice: true,
        images: true,
        rating: true,
        reviewCount: true,
        inStock: true,
        badge: true,
      },
      take: limit,
      orderBy: {
        rating: 'desc',
      },
    });

    return relatedProducts;
  }

  static async trackProductView(userId: string, productId: string, sessionId?: string) {
    await prisma.productView.create({
      data: {
        userId,
        productId,
        sessionId,
      },
    });

    // Update user behavior
    const userBehavior = await prisma.userBehavior.findUnique({
      where: { userId },
    });

    if (userBehavior) {
      const viewedProducts = Array.isArray(userBehavior.viewedProducts) 
        ? userBehavior.viewedProducts as string[]
        : [];
      const updatedViewed = [productId, ...viewedProducts.filter(id => id !== productId)].slice(0, 50);

      await prisma.userBehavior.update({
        where: { userId },
        data: {
          viewedProducts: updatedViewed,
        },
      });
    } else {
      await prisma.userBehavior.create({
        data: {
          userId,
          viewedProducts: [productId],
          purchasedProducts: [],
          searchHistory: [],
        },
      });
    }
  }

  static async getProductAutocomplete(query: string, limit: number = 5) {
    const suggestions = await prisma.product.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        name: {
          contains: query,
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: limit,
      orderBy: {
        rating: 'desc',
      },
    });

    return suggestions.map(product => ({
      id: product.id,
      value: product.name,
      label: product.name,
    }));
  }

  static async getTrendingProducts(limit: number = 10) {
    // Get products with most views in the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const productViews = await prisma.productView.groupBy({
      by: ['productId'],
      _count: {
        productId: true,
      },
      where: {
        createdAt: {
          gte: weekAgo,
        },
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: limit,
    });

    const productIds = productViews.map(pv => pv.productId);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        price: true,
        originalPrice: true,
        images: true,
        rating: true,
        reviewCount: true,
        inStock: true,
        badge: true,
      },
    });

    // Sort products by view count
    const sortedProducts = productIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);

    return sortedProducts;
  }
}