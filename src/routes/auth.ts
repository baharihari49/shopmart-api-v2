import { Router } from 'express';
import * as authController from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { validateRequest } from '../middleware/validation';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../validators/auth';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, registerValidation, validateRequest, authController.register);
router.post('/login', authLimiter, loginValidation, validateRequest, authController.login);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, validateRequest, authController.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidation, validateRequest, authController.resetPassword);
router.post('/refresh', authLimiter, authController.refreshToken);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authLimiter, authController.resendVerification);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);

export default router;