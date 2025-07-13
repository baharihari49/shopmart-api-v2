import { Router } from 'express';
import * as brandController from '../controllers/brands';

const router = Router();

router.get('/', brandController.getBrands);
router.get('/:slug', brandController.getBrandBySlug);
router.get('/:slug/products', brandController.getBrandProducts);

export default router;