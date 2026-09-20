import { Router } from 'express';
import { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/user.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { methodNotAllowed } from '../utils/http';

const router = Router();

// All user management routes are admin-only
router.get('/', authenticate, requireAdmin, getAllUsers);
router.post('/', authenticate, requireAdmin, createUser);
router.put('/:id', authenticate, requireAdmin, updateUser);
router.delete('/:id', authenticate, requireAdmin, deleteUser);

router.all('/', methodNotAllowed);
router.all('/:id', methodNotAllowed);

export default router;
