import { Request, Response } from 'express';
import { BrandService } from '../services/brand';
import { sendSuccess, sendPaginatedResponse } from '../utils/responses';
import { catchAsync } from '../middleware/errorHandler';

export const getBrands = catchAsync(async (req: Request, res: Response) => {
  const brands = await BrandService.getBrands();
  
  sendSuccess(res, 'Brands retrieved successfully', brands);
});

export const getBrandBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  const brand = await BrandService.getBrandBySlug(slug);
  
  sendSuccess(res, 'Brand retrieved successfully', brand);
});

export const getBrandProducts = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { page = '1', limit = '12' } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  
  const result = await BrandService.getBrandProducts(slug, pageNum, limitNum);
  
  sendPaginatedResponse(
    res,
    'Brand products retrieved successfully',
    result.products,
    result.pagination
  );
});