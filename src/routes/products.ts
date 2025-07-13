import { Router } from 'express';
import * as productController from '../controllers/products';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes (with optional auth)
router.get('/', optionalAuth, productController.getProducts);
router.get('/search', optionalAuth, productController.searchProducts);
router.get('/autocomplete', productController.getProductAutocomplete);
router.get('/trending', productController.getTrendingProducts);

// Product-specific routes
router.get('/:id', optionalAuth, productController.getProductById);
router.post('/:id/view', optionalAuth, productController.trackProductView);
router.get('/:id/reviews', productController.getProductReviews);
router.get('/:id/recommendations', productController.getRelatedProducts);

export default router;