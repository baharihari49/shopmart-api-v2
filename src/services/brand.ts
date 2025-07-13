import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class BrandService {
  static async getBrands() {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
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

    return brands;
  }

  static async getBrandBySlug(slug: string) {
    const brand = await prisma.brand.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
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

    if (!brand) {
      throw new AppError('Brand not found', 404);
    }

    return brand;
  }

  static async getBrandProducts(slug: string, page: number = 1, limit: number = 12) {
    const brand = await prisma.brand.findFirst({
      where: {
        slug,
        isActive: true,
      },
    });

    if (!brand) {
      throw new AppError('Brand not found', 404);
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          brandId: brand.id,
          isActive: true,
          deletedAt: null,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
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
          brandId: brand.id,
          isActive: true,
          deletedAt: null,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      brand,
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