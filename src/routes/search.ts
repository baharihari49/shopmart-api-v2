import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import { sendSuccess } from '../utils/responses';

const router = Router();

// Placeholder routes - to be implemented later
router.get('/', (req, res) => {
  sendSuccess(res, 'General search endpoint - coming soon', []);
});

router.get('/suggestions', (req, res) => {
  sendSuccess(res, 'Search suggestions endpoint - coming soon', []);
});

router.get('/popular', (req, res) => {
  sendSuccess(res, 'Popular searches endpoint - coming soon', []);
});

router.post('/track', optionalAuth, (req, res) => {
  sendSuccess(res, 'Track search endpoint - coming soon');
});

export default router;