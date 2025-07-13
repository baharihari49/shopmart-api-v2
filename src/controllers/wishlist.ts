import { Response } from 'express';
import { WishlistService } from '../services/wishlist';
import { sendSuccess } from '../utils/responses';
import { catchAsync } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

export const getWishlist = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  
  const wishlist = await WishlistService.getWishlist(userId);
  
  sendSuccess(res, 'Wishlist retrieved successfully', wishlist);
});

export const addItem = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { productId } = req.body;
  
  const wishlistItem = await WishlistService.addItem(userId, productId);
  
  sendSuccess(res, 'Item added to wishlist', wishlistItem, 201);
});

export const removeItem = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  
  const result = await WishlistService.removeItem(userId, id);
  
  sendSuccess(res, result.message);
});

export const removeByProductId = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { productId } = req.params;
  
  const result = await WishlistService.removeByProductId(userId, productId);
  
  sendSuccess(res, result.message);
});

export const clearWishlist = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  
  const result = await WishlistService.clearWishlist(userId);
  
  sendSuccess(res, result.message);
});

export const checkItem = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { productId } = req.params;
  
  const isInWishlist = await WishlistService.isInWishlist(userId, productId);
  
  sendSuccess(res, 'Wishlist status checked', { isInWishlist });
});

export const moveToCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  
  const result = await WishlistService.moveToCart(userId, id);
  
  sendSuccess(res, result.message);
});