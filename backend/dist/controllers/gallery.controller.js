"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGalleryMedia = exports.uploadGalleryMedia = exports.updateGalleryMedia = exports.createGalleryMedia = exports.deleteGalleryEvent = exports.updateGalleryEvent = exports.createGalleryEvent = exports.deleteGalleryYear = exports.updateGalleryYear = exports.createGalleryYear = exports.getGalleryYears = exports.galleryUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_1 = require("../utils/http");
const safeUnlink = (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
    catch (error) {
        console.error('Failed to delete file:', error);
    }
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const filename = `${crypto_1.default.randomUUID()}${ext}`;
        cb(null, filename);
    }
});
const galleryFileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/ogg', 'video/3gpp'];
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Tipe file tidak diizinkan. Gunakan format gambar (JPG, PNG, WebP, GIF) atau video (MP4, WebM, MOV).'));
    }
};
exports.galleryUpload = (0, multer_1.default)({
    storage,
    fileFilter: galleryFileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_GALLERY_FILE_SIZE || '52428800') // 50MB default
    }
});
const galleryInclude = {
    events: {
        orderBy: { sortOrder: 'asc' },
        include: {
            media: {
                orderBy: { sortOrder: 'asc' }
            }
        }
    }
};
const parseSortOrder = (value, fallback = 0) => {
    if (value === undefined || value === null || value === '')
        return fallback;
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
};
const getGalleryYears = async (req, res) => {
    try {
        const years = await prisma_1.default.galleryYear.findMany({
            orderBy: [{ sortOrder: 'asc' }, { yearLabel: 'asc' }],
            include: galleryInclude
        });
        res.json(years);
    }
    catch (error) {
        console.error('Get gallery years error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data galeri.' });
    }
};
exports.getGalleryYears = getGalleryYears;
const createGalleryYear = async (req, res) => {
    try {
        const { yearLabel, title, location, status, description, featured, sortOrder } = req.body;
        if (!yearLabel || !title) {
            return (0, http_1.validationError)(res, 'Tahun dan judul galeri diperlukan.');
        }
        const parsedSortOrder = parseSortOrder(sortOrder);
        if (parsedSortOrder === null) {
            return (0, http_1.validationError)(res, 'Urutan harus berupa angka.');
        }
        const year = await prisma_1.default.galleryYear.create({
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
    }
    catch (error) {
        console.error('Create gallery year error:', error);
        if (error.code === 'P2002') {
            return (0, http_1.conflictError)(res, 'Tahun galeri ini sudah ada.');
        }
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat tahun galeri.' });
    }
};
exports.createGalleryYear = createGalleryYear;
const updateGalleryYear = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { yearLabel, title, location, status, description, featured, sortOrder } = req.body;
        const existing = await prisma_1.default.galleryYear.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Tahun galeri tidak ditemukan.' });
        }
        const parsedSortOrder = parseSortOrder(sortOrder, existing.sortOrder);
        if (parsedSortOrder === null) {
            return (0, http_1.validationError)(res, 'Urutan harus berupa angka.');
        }
        const data = {};
        if (yearLabel !== undefined)
            data.yearLabel = yearLabel;
        if (title !== undefined)
            data.title = title;
        if (location !== undefined)
            data.location = location;
        if (status !== undefined)
            data.status = status;
        if (description !== undefined)
            data.description = description;
        if (featured !== undefined)
            data.featured = Boolean(featured);
        if (sortOrder !== undefined)
            data.sortOrder = parsedSortOrder;
        const year = await prisma_1.default.galleryYear.update({
            where: { id },
            data,
            include: galleryInclude
        });
        res.json(year);
    }
    catch (error) {
        console.error('Update gallery year error:', error);
        if (error.code === 'P2002') {
            return (0, http_1.conflictError)(res, 'Tahun galeri ini sudah ada.');
        }
        res.status(500).json({ error: 'Terjadi kesalahan saat mengubah tahun galeri.' });
    }
};
exports.updateGalleryYear = updateGalleryYear;
const deleteGalleryYear = async (req, res) => {
    try {
        const id = String(req.params.id);
        const existing = await prisma_1.default.galleryYear.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Tahun galeri tidak ditemukan.' });
        }
        await prisma_1.default.galleryYear.delete({ where: { id } });
        res.json({ message: 'Tahun galeri berhasil dihapus.' });
    }
    catch (error) {
        console.error('Delete gallery year error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menghapus tahun galeri.' });
    }
};
exports.deleteGalleryYear = deleteGalleryYear;
const createGalleryEvent = async (req, res) => {
    try {
        const galleryYearId = String(req.params.yearId);
        const { title, eventDate, summary, sortOrder } = req.body;
        if (!title) {
            return (0, http_1.validationError)(res, 'Judul acara diperlukan.');
        }
        const year = await prisma_1.default.galleryYear.findUnique({ where: { id: galleryYearId } });
        if (!year) {
            return res.status(404).json({ error: 'Tahun galeri tidak ditemukan.' });
        }
        const parsedSortOrder = parseSortOrder(sortOrder);
        if (parsedSortOrder === null) {
            return (0, http_1.validationError)(res, 'Urutan harus berupa angka.');
        }
        const event = await prisma_1.default.galleryEvent.create({
            data: { galleryYearId, title, eventDate, summary, sortOrder: parsedSortOrder },
            include: { media: { orderBy: { sortOrder: 'asc' } } }
        });
        res.status(201).json(event);
    }
    catch (error) {
        console.error('Create gallery event error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat acara galeri.' });
    }
};
exports.createGalleryEvent = createGalleryEvent;
const updateGalleryEvent = async (req, res) => {
    try {
        const id = String(req.params.eventId);
        const { title, eventDate, summary, sortOrder } = req.body;
        const existing = await prisma_1.default.galleryEvent.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Acara galeri tidak ditemukan.' });
        }
        const parsedSortOrder = parseSortOrder(sortOrder, existing.sortOrder);
        if (parsedSortOrder === null) {
            return (0, http_1.validationError)(res, 'Urutan harus berupa angka.');
        }
        const data = {};
        if (title !== undefined)
            data.title = title;
        if (eventDate !== undefined)
            data.eventDate = eventDate;
        if (summary !== undefined)
            data.summary = summary;
        if (sortOrder !== undefined)
            data.sortOrder = parsedSortOrder;
        const event = await prisma_1.default.galleryEvent.update({
            where: { id },
            data,
            include: { media: { orderBy: { sortOrder: 'asc' } } }
        });
        res.json(event);
    }
    catch (error) {
        console.error('Update gallery event error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengubah acara galeri.' });
    }
};
exports.updateGalleryEvent = updateGalleryEvent;
const deleteGalleryEvent = async (req, res) => {
    try {
        const id = String(req.params.eventId);
        const existing = await prisma_1.default.galleryEvent.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Acara galeri tidak ditemukan.' });
        }
        await prisma_1.default.galleryEvent.delete({ where: { id } });
        res.json({ message: 'Acara galeri berhasil dihapus.' });
    }
    catch (error) {
        console.error('Delete gallery event error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menghapus acara galeri.' });
    }
};
exports.deleteGalleryEvent = deleteGalleryEvent;
const createGalleryMedia = async (req, res) => {
    try {
        const galleryEventId = String(req.params.eventId);
        const { mediaType, url, caption, thumbnailUrl, sortOrder } = req.body;
        if (mediaType !== 'PHOTO' && mediaType !== 'VIDEO') {
            return (0, http_1.validationError)(res, 'Tipe media harus PHOTO atau VIDEO.');
        }
        if (!url) {
            return (0, http_1.validationError)(res, 'URL media diperlukan.');
        }
        const event = await prisma_1.default.galleryEvent.findUnique({ where: { id: galleryEventId } });
        if (!event) {
            return res.status(404).json({ error: 'Acara galeri tidak ditemukan.' });
        }
        const parsedSortOrder = parseSortOrder(sortOrder);
        if (parsedSortOrder === null) {
            return (0, http_1.validationError)(res, 'Urutan harus berupa angka.');
        }
        const media = await prisma_1.default.galleryMedia.create({
            data: { galleryEventId, mediaType, url, caption, thumbnailUrl, sortOrder: parsedSortOrder }
        });
        res.status(201).json(media);
    }
    catch (error) {
        console.error('Create gallery media error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat media galeri.' });
    }
};
exports.createGalleryMedia = createGalleryMedia;
const updateGalleryMedia = async (req, res) => {
    try {
        const id = String(req.params.mediaId);
        const { mediaType, url, caption, thumbnailUrl, sortOrder } = req.body;
        const existing = await prisma_1.default.galleryMedia.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Media galeri tidak ditemukan.' });
        }
        if (mediaType !== undefined && mediaType !== 'PHOTO' && mediaType !== 'VIDEO') {
            return (0, http_1.validationError)(res, 'Tipe media harus PHOTO atau VIDEO.');
        }
        const parsedSortOrder = parseSortOrder(sortOrder, existing.sortOrder);
        if (parsedSortOrder === null) {
            return (0, http_1.validationError)(res, 'Urutan harus berupa angka.');
        }
        const data = {};
        if (mediaType !== undefined)
            data.mediaType = mediaType;
        if (url !== undefined)
            data.url = url;
        if (caption !== undefined)
            data.caption = caption;
        if (thumbnailUrl !== undefined)
            data.thumbnailUrl = thumbnailUrl;
        if (sortOrder !== undefined)
            data.sortOrder = parsedSortOrder;
        const media = await prisma_1.default.galleryMedia.update({ where: { id }, data });
        res.json(media);
    }
    catch (error) {
        console.error('Update gallery media error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengubah media galeri.' });
    }
};
exports.updateGalleryMedia = updateGalleryMedia;
const uploadGalleryMedia = async (req, res) => {
    try {
        const galleryEventId = String(req.params.eventId);
        const { caption, sortOrder } = req.body;
        const event = await prisma_1.default.galleryEvent.findUnique({
            where: { id: galleryEventId },
            include: { media: true }
        });
        if (!event) {
            if (req.files && Array.isArray(req.files)) {
                req.files.forEach((f) => safeUnlink(f.path));
            }
            else if (req.file) {
                safeUnlink(req.file.path);
            }
            return res.status(404).json({ error: 'Acara galeri tidak ditemukan.' });
        }
        const files = req.files || (req.file ? [req.file] : []);
        if (!files || files.length === 0) {
            return (0, http_1.validationError)(res, 'File foto atau video tidak ditemukan.');
        }
        const initialSortOrder = parseSortOrder(sortOrder, event.media.length + 1) || 1;
        const createdMediaList = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const isVideo = file.mimetype.startsWith('video/');
            const mediaType = isVideo ? 'VIDEO' : 'PHOTO';
            const fileUrl = `/uploads/${file.filename}`;
            const itemCaption = caption || (files.length === 1 ? '' : path_1.default.parse(file.originalname).name);
            const media = await prisma_1.default.galleryMedia.create({
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
    }
    catch (error) {
        console.error('Upload gallery media error:', error);
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach((f) => safeUnlink(f.path));
        }
        else if (req.file) {
            safeUnlink(req.file.path);
        }
        res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah media galeri.' });
    }
};
exports.uploadGalleryMedia = uploadGalleryMedia;
const deleteGalleryMedia = async (req, res) => {
    try {
        const id = String(req.params.mediaId);
        const existing = await prisma_1.default.galleryMedia.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Media galeri tidak ditemukan.' });
        }
        // Unlink local file if stored in /uploads
        if (existing.url && existing.url.startsWith('/uploads/')) {
            const filePath = path_1.default.join(process.env.UPLOAD_DIR || './uploads', path_1.default.basename(existing.url));
            safeUnlink(filePath);
        }
        await prisma_1.default.galleryMedia.delete({ where: { id } });
        res.json({ message: 'Media galeri berhasil dihapus.' });
    }
    catch (error) {
        console.error('Delete gallery media error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menghapus media galeri.' });
    }
};
exports.deleteGalleryMedia = deleteGalleryMedia;
//# sourceMappingURL=gallery.controller.js.map