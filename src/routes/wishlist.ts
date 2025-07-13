import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist';
import { authenticateToken } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';

const router = Router();

const addItemValidation = [
  body('productId').isUUID().withMessage('Product ID must be a valid UUID'),
];

// All routes require authentication
router.use(authenticateToken);

router.get('/', wishlistController.getWishlist);
router.post('/items', addItemValidation, validateRequest, wishlistController.addItem);
router.delete('/items/:id', wishlistController.removeItem);
router.delete('/products/:productId', wishlistController.removeByProductId);
router.delete('/', wishlistController.clearWishlist);
router.get('/check/:productId', wishlistController.checkItem);
router.post('/items/:id/move-to-cart', wishlistController.moveToCart);

export default router;