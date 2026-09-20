import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import prisma from '../utils/prisma';
import { conflictError, validationError } from '../utils/http';

const safeUnlink = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Failed to delete file:', error);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    cb(null, filename);
  }
});

const galleryFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/ogg', 'video/3gpp'];
  
  if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipe file tidak diizinkan. Gunakan format gambar (JPG, PNG, WebP, GIF) atau video (MP4, WebM, MOV).'));
  }
};

export const galleryUpload = multer({
  storage,
  fileFilter: galleryFileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_GALLERY_FILE_SIZE || '52428800') // 50MB default
  }
});

const galleryInclude = {
  events: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      media: {
        orderBy: { sortOrder: 'asc' as const }
      }
    }
  }
};

const parseSortOrder = (value: unknown, fallback = 0) => {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

export const getGalleryYears = async (req: Request, res: Response) => {
  try {
    const years = await prisma.galleryYear.findMany({
      orderBy: [{ sortOrder: 'asc' }, { yearLabel: 'asc' }],
      include: galleryInclude
    });

    res.json(years);
  } catch (error) {
    console.error('Get gallery years error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data galeri.' });
  }
};

export const createGalleryYear = async (req: Request, res: Response) => {
  try {
    const { yearLabel, title, location, status, description, featured, sortOrder } = req.body;

    if (!yearLabel || !title) {
      return validationError(res, 'Tahun dan judul galeri diperlukan.');
    }

    const parsedSortOrder = parseSortOrder(sortOrder);
    if (parsedSortOrder === null) {
      return validationError(res, 'Urutan harus berupa angka.');
    }

    const year = await prisma.galleryYear.create({
      data: {
        yearLabel,
        title,
        location,
        status,
        description,
        featured: Boolean(featured),
        sortOrder: parsedSortOrder
      },
      include: galleryInclude
    });

    res.status(201).json(year);
  } catch (error: any) {
    console.error('Create gallery year error:', error);
    if (error.code === 'P2002') {
      return conflictError(res, 'Tahun galeri ini sudah ada.');
    }
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat tahun galeri.' });
  }
};

export const updateGalleryYear = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { yearLabel, title, location, status, description, featured, sortOrder } = req.body;

    const existing = await prisma.galleryYear.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Tahun galeri tidak ditemukan.' });
    }

    const parsedSortOrder = parseSortOrder(sortOrder, existing.sortOrder);
    if (parsedSortOrder === null) {
      return validationError(res, 'Urutan harus berupa angka.');
    }

    const data: any = {};
    if (yearLabel !== undefined) data.yearLabel = yearLabel;
    if (title !== undefined) data.title = title;
    if (location !== undefined) data.location = location;
    if (status !== undefined) data.status = status;
    if (description !== undefined) data.description = description;
    if (featured !== undefined) data.featured = Boolean(featured);
    if (sortOrder !== undefined) data.sortOrder = parsedSortOrder;

    const year = await prisma.galleryYear.update({
      where: { id },
      data,
      include: galleryInclude
    });

    res.json(year);
  } catch (error: any) {
    console.error('Update gallery year error:', error);
    if (error.code === 'P2002') {
      return conflictError(res, 'Tahun galeri ini sudah ada.');
    }
    res.status(500).json({ error: 'Terjadi kesalahan saat mengubah tahun galeri.' });
  }
};

export const deleteGalleryYear = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.galleryYear.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Tahun galeri tidak ditemukan.' });
    }

    await prisma.galleryYear.delete({ where: { id } });
    res.json({ message: 'Tahun galeri berhasil dihapus.' });
  } catch (error) {
    console.error('Delete gallery year error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus tahun galeri.' });
  }
};

export const createGalleryEvent = async (req: Request, res: Response) => {
  try {
    const galleryYearId = String(req.params.yearId);
    const { title, eventDate, summary, sortOrder } = req.body;

    if (!title) {
      return validationError(res, 'Judul acara diperlukan.');
    }

    const year = await prisma.galleryYear.findUnique({ where: { id: galleryYearId } });
    if (!year) {
      return res.status(404).json({ error: 'Tahun galeri tidak ditemukan.' });
    }

    const parsedSortOrder = parseSortOrder(sortOrder);
    if (parsedSortOrder === null) {
      return validationError(res, 'Urutan harus berupa angka.');
    }

    const event = await prisma.galleryEvent.create({
      data: { galleryYearId, title, eventDate, summary, sortOrder: parsedSortOrder },
      include: { media: { orderBy: { sortOrder: 'asc' } } }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create gallery event error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat acara galeri.' });
  }
};

export const updateGalleryEvent = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.eventId);
    const { title, eventDate, summary, sortOrder } = req.body;

    const existing = await prisma.galleryEvent.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Acara galeri tidak ditemukan.' });
    }

    const parsedSortOrder = parseSortOrder(sortOrder, existing.sortOrder);
    if (parsedSortOrder === null) {
      return validationError(res, 'Urutan harus berupa angka.');
    }

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (eventDate !== undefined) data.eventDate = eventDate;
    if (summary !== undefined) data.summary = summary;
    if (sortOrder !== undefined) data.sortOrder = parsedSortOrder;

    const event = await prisma.galleryEvent.update({
      where: { id },
      data,
      include: { media: { orderBy: { sortOrder: 'asc' } } }
    });

    res.json(event);
  } catch (error) {
    console.error('Update gallery event error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengubah acara galeri.' });
  }
};

export const deleteGalleryEvent = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.eventId);
    const existing = await prisma.galleryEvent.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Acara galeri tidak ditemukan.' });
    }

    await prisma.galleryEvent.delete({ where: { id } });
    res.json({ message: 'Acara galeri berhasil dihapus.' });
  } catch (error) {
    console.error('Delete gallery event error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus acara galeri.' });
  }
};

export const createGalleryMedia = async (req: Request, res: Response) => {
  try {
    const galleryEventId = String(req.params.eventId);
    const { mediaType, url, caption, thumbnailUrl, sortOrder } = req.body;

    if (mediaType !== 'PHOTO' && mediaType !== 'VIDEO') {
      return validationError(res, 'Tipe media harus PHOTO atau VIDEO.');
    }

    if (!url) {
      return validationError(res, 'URL media diperlukan.');
    }

    const event = await prisma.galleryEvent.findUnique({ where: { id: galleryEventId } });
    if (!event) {
      return res.status(404).json({ error: 'Acara galeri tidak ditemukan.' });
    }

    const parsedSortOrder = parseSortOrder(sortOrder);
    if (parsedSortOrder === null) {
      return validationError(res, 'Urutan harus berupa angka.');
    }

    const media = await prisma.galleryMedia.create({
      data: { galleryEventId, mediaType, url, caption, thumbnailUrl, sortOrder: parsedSortOrder }
    });

    res.status(201).json(media);
  } catch (error) {
    console.error('Create gallery media error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat media galeri.' });
  }
};

export const updateGalleryMedia = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.mediaId);
    const { mediaType, url, caption, thumbnailUrl, sortOrder } = req.body;

    const existing = await prisma.galleryMedia.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Media galeri tidak ditemukan.' });
    }

    if (mediaType !== undefined && mediaType !== 'PHOTO' && mediaType !== 'VIDEO') {
      return validationError(res, 'Tipe media harus PHOTO atau VIDEO.');
    }

    const parsedSortOrder = parseSortOrder(sortOrder, existing.sortOrder);
    if (parsedSortOrder === null) {
      return validationError(res, 'Urutan harus berupa angka.');
    }

    const data: any = {};
    if (mediaType !== undefined) data.mediaType = mediaType;
    if (url !== undefined) data.url = url;
    if (caption !== undefined) data.caption = caption;
    if (thumbnailUrl !== undefined) data.thumbnailUrl = thumbnailUrl;
    if (sortOrder !== undefined) data.sortOrder = parsedSortOrder;

    const media = await prisma.galleryMedia.update({ where: { id }, data });
    res.json(media);
  } catch (error) {
    console.error('Update gallery media error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengubah media galeri.' });
  }
};

export const uploadGalleryMedia = async (req: Request, res: Response) => {
  try {
    const galleryEventId = String(req.params.eventId);
    const { caption, sortOrder } = req.body;

    const event = await prisma.galleryEvent.findUnique({
      where: { id: galleryEventId },
      include: { media: true }
    });
    if (!event) {
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((f: Express.Multer.File) => safeUnlink(f.path));
      } else if (req.file) {
        safeUnlink(req.file.path);
      }
      return res.status(404).json({ error: 'Acara galeri tidak ditemukan.' });
    }

    const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);
    if (!files || files.length === 0) {
      return validationError(res, 'File foto atau video tidak ditemukan.');
    }

    const initialSortOrder = parseSortOrder(sortOrder, event.media.length + 1) || 1;
    const createdMediaList = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.mimetype.startsWith('video/');
      const mediaType = isVideo ? 'VIDEO' : 'PHOTO';
      const fileUrl = `/uploads/${file.filename}`;
      const itemCaption = caption || (files.length === 1 ? '' : path.parse(file.originalname).name);

      const media = await prisma.galleryMedia.create({
        data: {
          galleryEventId,
          mediaType,
          url: fileUrl,
          caption: itemCaption,
          thumbnailUrl: '',
          sortOrder: initialSortOrder + i
        }
      });
      createdMediaList.push(media);
    }

    res.status(201).json(createdMediaList.length === 1 ? createdMediaList[0] : createdMediaList);
  } catch (error) {
    console.error('Upload gallery media error:', error);
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((f: Express.Multer.File) => safeUnlink(f.path));
    } else if (req.file) {
      safeUnlink(req.file.path);
    }
    res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah media galeri.' });
  }
};

export const deleteGalleryMedia = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.mediaId);
    const existing = await prisma.galleryMedia.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Media galeri tidak ditemukan.' });
    }

    // Unlink local file if stored in /uploads
    if (existing.url && existing.url.startsWith('/uploads/')) {
      const filePath = path.join(process.env.UPLOAD_DIR || './uploads', path.basename(existing.url));
      safeUnlink(filePath);
    }

    await prisma.galleryMedia.delete({ where: { id } });
    res.json({ message: 'Media galeri berhasil dihapus.' });
  } catch (error) {
    console.error('Delete gallery media error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus media galeri.' });
  }
};
