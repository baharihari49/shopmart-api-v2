import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class CategoryService {
  static async getCategories() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    return categories;
  }

  static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  static async getCategoryProducts(slug: string, page: number = 1, limit: number = 12) {
    const category = await prisma.category.findFirst({
      where: {
        slug,
        isActive: true,
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          categoryId: category.id,
          isActive: true,
          deletedAt: null,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: {
          categoryId: category.id,
          isActive: true,
          deletedAt: null,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      category,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}