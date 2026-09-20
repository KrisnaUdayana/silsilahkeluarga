import { Router } from 'express';
import { 
  uploadMedia, 
  getPersonMedia, 
  deleteMedia,
  uploadProfilePhoto,
  upload
} from '../controllers/media.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { methodNotAllowed } from '../utils/http';

const router = Router();

router.get('/:personId', authenticate, getPersonMedia);
router.post('/upload', authenticate, requireAdmin, upload.single('file'), uploadMedia);
router.post('/profile/:personId', authenticate, requireAdmin, upload.single('file'), uploadProfilePhoto);
router.delete('/:id', authenticate, requireAdmin, deleteMedia);

router.all('/upload', methodNotAllowed);
router.all('/profile/:personId', methodNotAllowed);
router.all('/:personId', methodNotAllowed);

export default router;
