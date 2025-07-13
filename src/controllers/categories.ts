import { Request, Response } from 'express';
import { CategoryService } from '../services/category';
import { sendSuccess, sendPaginatedResponse } from '../utils/responses';
import { catchAsync } from '../middleware/errorHandler';

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await CategoryService.getCategories();
  
  sendSuccess(res, 'Categories retrieved successfully', categories);
});

export const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  const category = await CategoryService.getCategoryBySlug(slug);
  
  sendSuccess(res, 'Category retrieved successfully', category);
});

export const getCategoryProducts = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { page = '1', limit = '12' } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  
  const result = await CategoryService.getCategoryProducts(slug, pageNum, limitNum);
  
  sendPaginatedResponse(
    res,
    'Category products retrieved successfully',
    result.products,
    result.pagination
  );
});