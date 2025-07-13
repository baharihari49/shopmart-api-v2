import { Router } from 'express';
import * as cartController from '../controllers/cart';
import { optionalAuth, authenticateToken } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';

const router = Router();

const addItemValidation = [
  body('productId').isUUID().withMessage('Product ID must be a valid UUID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

const updateItemValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

const syncCartValidation = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.productId').isUUID().withMessage('Product ID must be a valid UUID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

// Cart routes (with optional auth for guest carts)
router.get('/', optionalAuth, cartController.getCart);
router.post('/items', optionalAuth, addItemValidation, validateRequest, cartController.addItem);
router.put('/items/:id', optionalAuth, updateItemValidation, validateRequest, cartController.updateItem);
router.delete('/items/:id', optionalAuth, cartController.removeItem);
router.delete('/', optionalAuth, cartController.clearCart);

// Sync guest cart (requires authentication)
router.post('/sync', authenticateToken, syncCartValidation, validateRequest, cartController.syncCart);

export default router;