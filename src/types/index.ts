import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User;
  userId?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ProductQuery extends PaginationQuery {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  inStock?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface CartItemData {
  productId: string;
  quantity: number;
}

export interface AddressData {
  type: 'HOME' | 'WORK' | 'OTHER';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface PaymentMethodData {
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER';
  stripePaymentMethodId?: string;
  isDefault?: boolean;
}

export interface ReviewData {
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface CheckoutData {
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethodId: string;
  shippingMethodId: string;
  promoCodeId?: string;
  giftMessage?: string;
}