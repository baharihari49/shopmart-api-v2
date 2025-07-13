import { Router } from 'express';
import * as categoryController from '../controllers/categories';

const router = Router();

router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.get('/:slug/products', categoryController.getCategoryProducts);

export default router;