import { Response } from 'express';
import { CartService } from '../services/cart';
import { sendSuccess } from '../utils/responses';
import { catchAsync } from '../middleware/errorHandler';
import { AuthRequest, CartItemData } from '../types';

export const getCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const sessionId = req.headers['x-session-id'] as string;
  
  const cart = await CartService.getCart(userId, sessionId);
  
  sendSuccess(res, 'Cart retrieved successfully', cart);
});

export const addItem = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const sessionId = req.headers['x-session-id'] as string;
  const itemData: CartItemData = req.body;
  
  const cartItem = await CartService.addItem(userId, sessionId, itemData);
  
  sendSuccess(res, 'Item added to cart', cartItem, 201);
});

export const updateItem = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const sessionId = req.headers['x-session-id'] as string;
  const { id } = req.params;
  const { quantity } = req.body;
  
  const cartItem = await CartService.updateItem(userId, sessionId, id, quantity);
  
  sendSuccess(res, 'Cart item updated', cartItem);
});

export const removeItem = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const sessionId = req.headers['x-session-id'] as string;
  const { id } = req.params;
  
  const result = await CartService.removeItem(userId, sessionId, id);
  
  sendSuccess(res, result.message);
});

export const clearCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const sessionId = req.headers['x-session-id'] as string;
  
  const result = await CartService.clearCart(userId, sessionId);
  
  sendSuccess(res, result.message);
});

export const syncCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { items } = req.body;
  
  const result = await CartService.syncGuestCart(userId, items);
  
  sendSuccess(res, result.message);
});