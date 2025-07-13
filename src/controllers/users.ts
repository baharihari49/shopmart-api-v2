import { Response } from 'express';
import { UserService } from '../services/user';
import { sendSuccess } from '../utils/responses';
import { catchAsync } from '../middleware/errorHandler';
import { AuthRequest, AddressData, PaymentMethodData } from '../types';

export const getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  
  const user = await UserService.getUserProfile(userId);
  
  sendSuccess(res, 'Profile retrieved successfully', user);
});

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const updateData = req.body;
  
  const user = await UserService.updateProfile(userId, updateData);
  
  sendSuccess(res, 'Profile updated successfully', user);
});

export const updatePreferences = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const preferences = req.body;
  
  const user = await UserService.updatePreferences(userId, preferences);
  
  sendSuccess(res, 'Preferences updated successfully', user);
});

export const deleteAccount = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  
  const result = await UserService.deleteAccount(userId);
  
  sendSuccess(res, result.message);
});

// Address management
export const getAddresses = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  
  const addresses = await UserService.getAddresses(userId);
  
  sendSuccess(res, 'Addresses retrieved successfully', addresses);
});

export const createAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const addressData: AddressData = req.body;
  
  const address = await UserService.createAddress(userId, addressData);
  
  sendSuccess(res, 'Address created successfully', address, 201);
});

export const updateAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  const addressData = req.body;
  
  const address = await UserService.updateAddress(userId, id, addressData);
  
  sendSuccess(res, 'Address updated successfully', address);
});

export const deleteAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  
  const result = await UserService.deleteAddress(userId, id);
  
  sendSuccess(res, result.message);
});

export const setDefaultAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  
  const address = await UserService.setDefaultAddress(userId, id);
  
  sendSuccess(res, 'Default address set successfully', address);
});

// Payment method management
export const getPaymentMethods = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  
  const paymentMethods = await UserService.getPaymentMethods(userId);
  
  sendSuccess(res, 'Payment methods retrieved successfully', paymentMethods);
});

export const createPaymentMethod = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const paymentData: PaymentMethodData = req.body;
  
  const paymentMethod = await UserService.createPaymentMethod(userId, paymentData);
  
  sendSuccess(res, 'Payment method created successfully', paymentMethod, 201);
});

export const updatePaymentMethod = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  const paymentData = req.body;
  
  const paymentMethod = await UserService.updatePaymentMethod(userId, id, paymentData);
  
  sendSuccess(res, 'Payment method updated successfully', paymentMethod);
});

export const deletePaymentMethod = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  
  const result = await UserService.deletePaymentMethod(userId, id);
  
  sendSuccess(res, result.message);
});

export const setDefaultPaymentMethod = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  
  const paymentMethod = await UserService.setDefaultPaymentMethod(userId, id);
  
  sendSuccess(res, 'Default payment method set successfully', paymentMethod);
});