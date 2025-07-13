import { Request, Response } from 'express';
import { AuthService } from '../services/auth';
import { sendSuccess, sendError } from '../utils/responses';
import { catchAsync } from '../middleware/errorHandler';
import { RegisterData, LoginCredentials } from '../types';

export const register = catchAsync(async (req: Request, res: Response) => {
  const userData: RegisterData = req.body;
  
  const result = await AuthService.register(userData);
  
  // TODO: Send verification email with result.verificationToken
  
  sendSuccess(
    res,
    'User registered successfully. Please check your email for verification.',
    {
      user: result.user,
      tokens: result.tokens,
    },
    201
  );
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const credentials: LoginCredentials = req.body;
  
  const result = await AuthService.login(credentials);
  
  sendSuccess(res, 'Login successful', result);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  
  await AuthService.logout(userId);
  
  sendSuccess(res, 'Logout successful');
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    sendError(res, 'Refresh token is required', 400);
    return;
  }
  
  const tokens = await AuthService.refreshToken(refreshToken);
  
  sendSuccess(res, 'Token refreshed successfully', tokens);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  
  const result = await AuthService.forgotPassword(email);
  
  // TODO: Send password reset email with result.resetToken
  
  sendSuccess(res, result.message);
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  
  const result = await AuthService.resetPassword(token, password);
  
  sendSuccess(res, result.message);
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  
  const result = await AuthService.verifyEmail(token);
  
  sendSuccess(res, result.message);
});

export const resendVerification = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  
  const result = await AuthService.resendVerification(email);
  
  // TODO: Send verification email with result.verificationToken
  
  sendSuccess(res, result.message);
});