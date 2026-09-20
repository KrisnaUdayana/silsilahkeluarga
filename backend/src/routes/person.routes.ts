import { Router } from 'express';
import { 
  getAllPersons, 
  getPersonById, 
  createPerson, 
  updatePerson, 
  deletePerson,
  getFamilyTree,
  getChildren,
  getSiblings,
  searchPersons
} from '../controllers/person.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { methodNotAllowed } from '../utils/http';

const router = Router();

// Public routes - no authentication required
router.get('/', getAllPersons);
router.get('/tree', getFamilyTree);
router.get('/search', searchPersons);
router.get('/:id', getPersonById);
router.get('/:id/children', getChildren);
router.get('/:id/siblings', getSiblings);

// Admin only routes
router.post('/', authenticate, requireAdmin, createPerson);
router.put('/:id', authenticate, requireAdmin, updatePerson);
router.delete('/:id', authenticate, requireAdmin, deletePerson);

router.all('/', methodNotAllowed);
router.all('/tree', methodNotAllowed);
router.all('/search', methodNotAllowed);
router.all('/:id/children', methodNotAllowed);
router.all('/:id/siblings', methodNotAllowed);
router.all('/:id', methodNotAllowed);

export default router;
