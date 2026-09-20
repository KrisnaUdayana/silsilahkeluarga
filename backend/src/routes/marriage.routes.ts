import { Router } from 'express';
import { 
  getAllMarriages, 
  createMarriage, 
  updateMarriage, 
  deleteMarriage 
} from '../controllers/marriage.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { methodNotAllowed } from '../utils/http';

const router = Router();

router.get('/', authenticate, getAllMarriages);
router.post('/', authenticate, requireAdmin, createMarriage);
router.put('/:id', authenticate, requireAdmin, updateMarriage);
router.delete('/:id', authenticate, requireAdmin, deleteMarriage);

router.all('/', methodNotAllowed);
router.all('/:id', methodNotAllowed);

export default router;
