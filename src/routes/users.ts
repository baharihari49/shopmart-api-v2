import { Router } from 'express';
import * as userController from '../controllers/users';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  updateProfileValidation,
  addressValidation,
  paymentMethodValidation,
  preferencesValidation,
} from '../validators/user';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, validateRequest, userController.updateProfile);
router.put('/preferences', preferencesValidation, validateRequest, userController.updatePreferences);
router.delete('/account', userController.deleteAccount);

// Address routes
router.get('/addresses', userController.getAddresses);
router.post('/addresses', addressValidation, validateRequest, userController.createAddress);
router.put('/addresses/:id', addressValidation, validateRequest, userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);
router.put('/addresses/:id/default', userController.setDefaultAddress);

// Payment method routes
router.get('/payment-methods', userController.getPaymentMethods);
router.post('/payment-methods', paymentMethodValidation, validateRequest, userController.createPaymentMethod);
router.put('/payment-methods/:id', paymentMethodValidation, validateRequest, userController.updatePaymentMethod);
router.delete('/payment-methods/:id', userController.deletePaymentMethod);
router.put('/payment-methods/:id/default', userController.setDefaultPaymentMethod);

export default router;