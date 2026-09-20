import { Router } from 'express';
import {
  createGalleryEvent,
  createGalleryMedia,
  createGalleryYear,
  deleteGalleryEvent,
  deleteGalleryMedia,
  deleteGalleryYear,
  getGalleryYears,
  updateGalleryEvent,
  updateGalleryMedia,
  updateGalleryYear,
} from '../controllers/gallery.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { methodNotAllowed } from '../utils/http';

const router = Router();

router.get('/', getGalleryYears);

router.post('/', authenticate, requireAdmin, createGalleryYear);
router.put('/:id', authenticate, requireAdmin, updateGalleryYear);
router.delete('/:id', authenticate, requireAdmin, deleteGalleryYear);

router.post('/:yearId/events', authenticate, requireAdmin, createGalleryEvent);
router.put('/events/:eventId', authenticate, requireAdmin, updateGalleryEvent);
router.delete('/events/:eventId', authenticate, requireAdmin, deleteGalleryEvent);

router.post('/events/:eventId/media', authenticate, requireAdmin, createGalleryMedia);
router.put('/media/:mediaId', authenticate, requireAdmin, updateGalleryMedia);
router.delete('/media/:mediaId', authenticate, requireAdmin, deleteGalleryMedia);

router.all('/', methodNotAllowed);
router.all('/:id', methodNotAllowed);
router.all('/:yearId/events', methodNotAllowed);
router.all('/events/:eventId', methodNotAllowed);
router.all('/events/:eventId/media', methodNotAllowed);
router.all('/media/:mediaId', methodNotAllowed);

export default router;
