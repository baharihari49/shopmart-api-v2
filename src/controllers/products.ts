import { Request, Response } from 'express';
import { ProductService } from '../services/product';
import { sendSuccess, sendPaginatedResponse } from '../utils/responses';
import { catchAsync } from '../middleware/errorHandler';
import { AuthRequest, ProductQuery } from '../types';

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as ProductQuery;
  
  const result = await ProductService.getProducts(query);
  
  sendPaginatedResponse(
    res,
    'Products retrieved successfully',
    result.products,
    result.pagination
  );
});

export const getProductById = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  
  const product = await ProductService.getProductById(id, userId);
  
  sendSuccess(res, 'Product retrieved successfully', product);
});

export const getProductBySlug = catchAsync(async (req: AuthRequest, res: Response) => {
  const { slug } = req.params;
  const userId = req.userId;
  
  const product = await ProductService.getProductBySlug(slug, userId);
  
  sendSuccess(res, 'Product retrieved successfully', product);
});

export const searchProducts = catchAsync(async (req: Request, res: Response) => {
  const { q, limit } = req.query;
  
  if (!q || typeof q !== 'string') {
    sendSuccess(res, 'Search results', []);
    return;
  }
  
  const limitNum = limit ? parseInt(limit as string) : 10;
  const products = await ProductService.searchProducts(q, limitNum);
  
  sendSuccess(res, 'Search results', products);
});

export const getProductAutocomplete = catchAsync(async (req: Request, res: Response) => {
  const { q, limit } = req.query;
  
  if (!q || typeof q !== 'string') {
    sendSuccess(res, 'Autocomplete suggestions', []);
    return;
  }
  
  const limitNum = limit ? parseInt(limit as string) : 5;
  const suggestions = await ProductService.getProductAutocomplete(q, limitNum);
  
  sendSuccess(res, 'Autocomplete suggestions', suggestions);
});

export const trackProductView = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  const sessionId = req.headers['x-session-id'] as string;
  
  if (userId) {
    await ProductService.trackProductView(userId, id, sessionId);
  }
  
  sendSuccess(res, 'Product view tracked');
});

export const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = '1', limit = '10' } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  
  const result = await ProductService.getProductReviews(id, pageNum, limitNum);
  
  sendPaginatedResponse(
    res,
    'Product reviews retrieved successfully',
    result.reviews,
    result.pagination
  );
});

export const getRelatedProducts = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit = '8' } = req.query;
  
  const limitNum = parseInt(limit as string);
  const products = await ProductService.getRelatedProducts(id, limitNum);
  
  sendSuccess(res, 'Related products retrieved successfully', products);
});

export const getTrendingProducts = catchAsync(async (req: Request, res: Response) => {
  const { limit = '10' } = req.query;
  
  const limitNum = parseInt(limit as string);
  const products = await ProductService.getTrendingProducts(limitNum);
  
  sendSuccess(res, 'Trending products retrieved successfully', products);
});

export const getFeaturedProducts = catchAsync(async (req: Request, res: Response) => {
  const { limit = '12' } = req.query;
  
  const result = await ProductService.getProducts({
    badge: 'FEATURED',
    limit: limit as string,
    inStock: 'true',
    sortBy: 'rating',
    sortOrder: 'desc',
  });
  
  sendSuccess(res, 'Featured products retrieved successfully', result.products);
});