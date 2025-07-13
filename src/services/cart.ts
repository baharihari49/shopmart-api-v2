import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { CartItemData } from '../types';

export class CartService {
  static async getCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new AppError('User ID or session ID is required', 400);
    }

    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
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
                stockCount: true,
                brand: {
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

    if (!cart) {
      // Create a new cart
      cart = await prisma.cart.create({
        data: {
          userId,
          sessionId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
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
                  stockCount: true,
                  brand: {
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

    // Calculate totals
    const subtotal = cart.items.reduce((total, item) => {
      return total + Number(item.priceAtTime) * item.quantity;
    }, 0);

    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    return {
      ...cart,
      subtotal,
      itemCount,
    };
  }

  static async addItem(userId: string | undefined, sessionId: string | undefined, itemData: CartItemData) {
    const { productId, quantity } = itemData;

    if (!userId && !sessionId) {
      throw new AppError('User ID or session ID is required', 400);
    }

    // Check if product exists and is in stock
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

    if (!product.inStock || product.stockCount < quantity) {
      throw new AppError('Product is out of stock or insufficient quantity', 400);
    }

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          sessionId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stockCount < newQuantity) {
        throw new AppError('Insufficient stock for requested quantity', 400);
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              originalPrice: true,
              images: true,
              inStock: true,
              stockCount: true,
            },
          },
        },
      });

      return updatedItem;
    } else {
      // Create new cart item
      const cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          priceAtTime: product.price,
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
              stockCount: true,
            },
          },
        },
      });

      return cartItem;
    }
  }

  static async updateItem(userId: string | undefined, sessionId: string | undefined, itemId: string, quantity: number) {
    if (!userId && !sessionId) {
      throw new AppError('User ID or session ID is required', 400);
    }

    // Find the cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: userId ? { userId } : { sessionId },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    // Check stock availability
    if (cartItem.product.stockCount < quantity) {
      throw new AppError('Insufficient stock for requested quantity', 400);
    }

    // Update the item
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            originalPrice: true,
            images: true,
            inStock: true,
            stockCount: true,
          },
        },
      },
    });

    return updatedItem;
  }

  static async removeItem(userId: string | undefined, sessionId: string | undefined, itemId: string) {
    if (!userId && !sessionId) {
      throw new AppError('User ID or session ID is required', 400);
    }

    // Find the cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: userId ? { userId } : { sessionId },
      },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    // Delete the item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from cart' };
  }

  static async clearCart(userId: string | undefined, sessionId: string | undefined) {
    if (!userId && !sessionId) {
      throw new AppError('User ID or session ID is required', 400);
    }

    // Find the cart
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    // Delete all items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'Cart cleared successfully' };
  }

  static async syncGuestCart(userId: string, guestCartItems: CartItemData[]) {
    // Get or create user cart
    let userCart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: {
          userId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Add guest cart items to user cart
    for (const item of guestCartItems) {
      await this.addItem(userId, undefined, item);
    }

    return { message: 'Guest cart synced successfully' };
  }
}