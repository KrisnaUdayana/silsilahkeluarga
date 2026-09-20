import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { conflictError, validationError } from '../utils/http';

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

export const deleteGalleryMedia = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.mediaId);
    const existing = await prisma.galleryMedia.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Media galeri tidak ditemukan.' });
    }

    await prisma.galleryMedia.delete({ where: { id } });
    res.json({ message: 'Media galeri berhasil dihapus.' });
  } catch (error) {
    console.error('Delete gallery media error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus media galeri.' });
  }
};
