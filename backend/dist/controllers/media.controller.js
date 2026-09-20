"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePhoto = exports.deleteMedia = exports.getPersonMedia = exports.uploadMedia = exports.upload = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
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
// Configure multer for file uploads
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
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Tipe file tidak diizinkan. Gunakan JPEG, PNG, GIF, atau WebP.'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
    }
});
// Upload media (Admin only)
const uploadMedia = async (req, res) => {
    try {
        const { personId, caption, mediaType = 'PHOTO' } = req.body;
        if (!personId) {
            return (0, http_1.validationError)(res, 'ID anggota keluarga diperlukan.');
        }
        if (!req.file) {
            return (0, http_1.validationError)(res, 'File tidak ditemukan.');
        }
        if (mediaType !== 'PHOTO' && mediaType !== 'DOCUMENT') {
            safeUnlink(req.file.path);
            return (0, http_1.validationError)(res, 'Tipe media harus PHOTO atau DOCUMENT.');
        }
        // Verify person exists
        const person = await prisma_1.default.person.findUnique({ where: { id: personId } });
        if (!person) {
            // Delete uploaded file
            safeUnlink(req.file.path);
            return res.status(404).json({ error: 'Anggota keluarga tidak ditemukan.' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        const media = await prisma_1.default.media.create({
            data: {
                personId,
                fileUrl,
                caption,
                mediaType
            }
        });
        res.status(201).json(media);
    }
    catch (error) {
        console.error('Upload media error:', error);
        // Clean up file if upload failed
        if (req.file) {
            safeUnlink(req.file.path);
        }
        res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah file.' });
    }
};
exports.uploadMedia = uploadMedia;
// Get media for a person
const getPersonMedia = async (req, res) => {
    try {
        const personId = String(req.params.personId);
        const media = await prisma_1.default.media.findMany({
            where: { personId },
            orderBy: { uploadedAt: 'desc' }
        });
        res.json(media);
    }
    catch (error) {
        console.error('Get media error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan.' });
    }
};
exports.getPersonMedia = getPersonMedia;
// Delete media (Admin only)
const deleteMedia = async (req, res) => {
    try {
        const id = String(req.params.id);
        const media = await prisma_1.default.media.findUnique({ where: { id } });
        if (!media) {
            return res.status(404).json({ error: 'Media tidak ditemukan.' });
        }
        // Delete file from filesystem
        const filePath = path_1.default.join(process.env.UPLOAD_DIR || './uploads', path_1.default.basename(media.fileUrl));
        safeUnlink(filePath);
        await prisma_1.default.media.delete({ where: { id } });
        res.json({ message: 'Media berhasil dihapus.' });
    }
    catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menghapus media.' });
    }
};
exports.deleteMedia = deleteMedia;
// Upload profile photo (Admin only)
const uploadProfilePhoto = async (req, res) => {
    try {
        const personId = String(req.params.personId);
        if (!req.file) {
            return (0, http_1.validationError)(res, 'File tidak ditemukan.');
        }
        const person = await prisma_1.default.person.findUnique({ where: { id: personId } });
        if (!person) {
            safeUnlink(req.file.path);
            return res.status(404).json({ error: 'Anggota keluarga tidak ditemukan.' });
        }
        // Delete old profile photo if exists
        if (person.profilePhoto) {
            const oldPath = path_1.default.join(process.env.UPLOAD_DIR || './uploads', path_1.default.basename(person.profilePhoto));
            safeUnlink(oldPath);
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        const updated = await prisma_1.default.person.update({
            where: { id: personId },
            data: { profilePhoto: fileUrl }
        });
        res.json({ profilePhoto: updated.profilePhoto });
    }
    catch (error) {
        console.error('Upload profile photo error:', error);
        if (req.file) {
            safeUnlink(req.file.path);
        }
        res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah foto.' });
    }
};
exports.uploadProfilePhoto = uploadProfilePhoto;
//# sourceMappingURL=media.controller.js.map