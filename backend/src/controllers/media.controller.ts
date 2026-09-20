import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { validationError } from '../utils/http';

const safeUnlink = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Failed to delete file:', error);
  }
};

// Configure multer for file uploads
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

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipe file tidak diizinkan. Gunakan JPEG, PNG, GIF, atau WebP.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  }
});

// Upload media (Admin only)
export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const { personId, caption, mediaType = 'PHOTO' } = req.body;

    if (!personId) {
      return validationError(res, 'ID anggota keluarga diperlukan.');
    }

    if (!req.file) {
      return validationError(res, 'File tidak ditemukan.');
    }

    if (mediaType !== 'PHOTO' && mediaType !== 'DOCUMENT') {
      safeUnlink(req.file.path);
      return validationError(res, 'Tipe media harus PHOTO atau DOCUMENT.');
    }

    // Verify person exists
    const person = await prisma.person.findUnique({ where: { id: personId } });
    if (!person) {
      // Delete uploaded file
      safeUnlink(req.file.path);
      return res.status(404).json({ error: 'Anggota keluarga tidak ditemukan.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const media = await prisma.media.create({
      data: {
        personId,
        fileUrl,
        caption,
        mediaType
      }
    });

    res.status(201).json(media);
  } catch (error) {
    console.error('Upload media error:', error);
    // Clean up file if upload failed
    if (req.file) {
      safeUnlink(req.file.path);
    }
    res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah file.' });
  }
};

// Get media for a person
export const getPersonMedia = async (req: Request, res: Response) => {
  try {
    const personId = String(req.params.personId);

    const media = await prisma.media.findMany({
      where: { personId },
      orderBy: { uploadedAt: 'desc' }
    });

    res.json(media);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan.' });
  }
};

// Delete media (Admin only)
export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return res.status(404).json({ error: 'Media tidak ditemukan.' });
    }

    // Delete file from filesystem
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads', path.basename(media.fileUrl));
    safeUnlink(filePath);

    await prisma.media.delete({ where: { id } });

    res.json({ message: 'Media berhasil dihapus.' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus media.' });
  }
};

// Upload profile photo (Admin only)
export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    const personId = String(req.params.personId);

    if (!req.file) {
      return validationError(res, 'File tidak ditemukan.');
    }

    const person = await prisma.person.findUnique({ where: { id: personId } });
    if (!person) {
      safeUnlink(req.file.path);
      return res.status(404).json({ error: 'Anggota keluarga tidak ditemukan.' });
    }

    // Delete old profile photo if exists
    if (person.profilePhoto) {
      const oldPath = path.join(process.env.UPLOAD_DIR || './uploads', path.basename(person.profilePhoto));
      safeUnlink(oldPath);
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const updated = await prisma.person.update({
      where: { id: personId },
      data: { profilePhoto: fileUrl }
    });

    res.json({ profilePhoto: updated.profilePhoto });
  } catch (error) {
    console.error('Upload profile photo error:', error);
    if (req.file) {
      safeUnlink(req.file.path);
    }
    res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah foto.' });
  }
};
