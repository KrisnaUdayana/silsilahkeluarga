import { Router } from 'express';
import { getPublicStats, getStats } from '../controllers/stats.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { methodNotAllowed } from '../utils/http';

const router = Router();

// Public stats - no authentication required
router.get('/public', getPublicStats);

// Admin stats
router.get('/', authenticate, requireAdmin, getStats);

router.all('/public', methodNotAllowed);
router.all('/', methodNotAllowed);

export default router;
