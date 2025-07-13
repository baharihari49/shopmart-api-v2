import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class WishlistService {
  static async getWishlist(userId: string) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                originalPrice: true,
                images: true,
                inStock: true,
                rating: true,
                reviewCount: true,
                badge: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!wishlist) {
      // Create a new wishlist
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  originalPrice: true,
                  images: true,
                  inStock: true,
                  rating: true,
                  reviewCount: true,
                  badge: true,
                  brand: {
                    select: {
                      name: true,
                    },
                  },
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return wishlist;
  }

  static async addItem(userId: string, productId: string) {
    // Check if product exists and is active
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Get or create wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
      });
    }

    // Check if item already exists
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    if (existingItem) {
      throw new AppError('Product is already in wishlist', 409);
    }

    // Add item to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            originalPrice: true,
            images: true,
            inStock: true,
            rating: true,
            reviewCount: true,
            badge: true,
          },
        },
      },
    });

    return wishlistItem;
  }

  static async removeItem(userId: string, itemId: string) {
    // Find the wishlist item
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        wishlist: { userId },
      },
    });

    if (!wishlistItem) {
      throw new AppError('Wishlist item not found', 404);
    }

    // Delete the item
    await prisma.wishlistItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from wishlist' };
  }

  static async removeByProductId(userId: string, productId: string) {
    // Find the wishlist item by product ID
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        productId,
        wishlist: { userId },
      },
    });

    if (!wishlistItem) {
      throw new AppError('Product not found in wishlist', 404);
    }

    // Delete the item
    await prisma.wishlistItem.delete({
      where: { id: wishlistItem.id },
    });

    return { message: 'Item removed from wishlist' };
  }

  static async clearWishlist(userId: string) {
    // Find the wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      throw new AppError('Wishlist not found', 404);
    }

    // Delete all items
    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id },
    });

    return { message: 'Wishlist cleared successfully' };
  }

  static async isInWishlist(userId: string, productId: string) {
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        productId,
        wishlist: { userId },
      },
    });

    return !!wishlistItem;
  }

  static async moveToCart(userId: string, itemId: string) {
    // Find the wishlist item
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        wishlist: { userId },
      },
      include: {
        product: true,
      },
    });

    if (!wishlistItem) {
      throw new AppError('Wishlist item not found', 404);
    }

    // Check if product is in stock
    if (!wishlistItem.product.inStock || wishlistItem.product.stockCount < 1) {
      throw new AppError('Product is out of stock', 400);
    }

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: wishlistItem.productId,
      },
    });

    if (existingCartItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: wishlistItem.productId,
          quantity: 1,
          priceAtTime: wishlistItem.product.price,
        },
      });
    }

    // Remove from wishlist
    await prisma.wishlistItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item moved to cart successfully' };
  }
}