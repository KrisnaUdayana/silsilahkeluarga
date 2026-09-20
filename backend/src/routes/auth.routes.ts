import { Router } from 'express';
import { login, getMe, logout, refreshToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { methodNotAllowed } from '../utils/http';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/refresh', authenticate, refreshToken);

router.all('/login', methodNotAllowed);
router.all('/logout', methodNotAllowed);
router.all('/me', methodNotAllowed);
router.all('/refresh', methodNotAllowed);

export default router;
