"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_1 = require("../utils/http");
const isValidEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidRole = (role) => role === undefined || role === 'ADMIN' || role === 'VIEWER';
// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                personId: true,
                person: { select: { fullName: true } },
                lastLogin: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan.' });
    }
};
exports.getAllUsers = getAllUsers;
// Create user (Admin only)
const createUser = async (req, res) => {
    try {
        const { email, password, role, personId } = req.body;
        if (!email || !password) {
            return (0, http_1.validationError)(res, 'Email dan password diperlukan.');
        }
        if (!isValidEmail(email)) {
            return (0, http_1.validationError)(res, 'Format email tidak valid.');
        }
        if (password.length < 6) {
            return (0, http_1.validationError)(res, 'Password minimal 6 karakter.');
        }
        if (!isValidRole(role)) {
            return (0, http_1.validationError)(res, 'Role harus ADMIN atau VIEWER.');
        }
        // Check for existing email
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing) {
            return (0, http_1.conflictError)(res, 'Email sudah digunakan.');
        }
        // Verify person if provided
        if (personId) {
            const person = await prisma_1.default.person.findUnique({ where: { id: personId } });
            if (!person) {
                return (0, http_1.validationError)(res, 'Anggota keluarga tidak ditemukan.');
            }
            // Check if person already linked to a user
            const linkedUser = await prisma_1.default.user.findUnique({ where: { personId } });
            if (linkedUser) {
                return (0, http_1.conflictError)(res, 'Anggota keluarga sudah terhubung dengan akun lain.');
            }
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                email,
                passwordHash,
                role: role || 'VIEWER',
                personId
            },
            select: {
                id: true,
                email: true,
                role: true,
                personId: true,
                createdAt: true
            }
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Create user error:', error);
        if (error.code === 'P2002') {
            return (0, http_1.conflictError)(res, 'Email atau anggota keluarga sudah terhubung dengan akun lain.');
        }
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat user.' });
    }
};
exports.createUser = createUser;
// Update user (Admin only)
const updateUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { email, password, role, personId } = req.body;
        const existing = await prisma_1.default.user.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'User tidak ditemukan.' });
        }
        const updateData = {};
        if (email && email !== existing.email) {
            if (!isValidEmail(email)) {
                return (0, http_1.validationError)(res, 'Format email tidak valid.');
            }
            const emailExists = await prisma_1.default.user.findUnique({ where: { email } });
            if (emailExists) {
                return (0, http_1.conflictError)(res, 'Email sudah digunakan.');
            }
            updateData.email = email;
        }
        if (password) {
            if (password.length < 6) {
                return (0, http_1.validationError)(res, 'Password minimal 6 karakter.');
            }
            updateData.passwordHash = await bcryptjs_1.default.hash(password, 10);
        }
        if (role) {
            if (!isValidRole(role)) {
                return (0, http_1.validationError)(res, 'Role harus ADMIN atau VIEWER.');
            }
            updateData.role = role;
        }
        if (personId !== undefined) {
            if (personId) {
                const person = await prisma_1.default.person.findUnique({ where: { id: personId } });
                if (!person) {
                    return (0, http_1.validationError)(res, 'Anggota keluarga tidak ditemukan.');
                }
                const linkedUser = await prisma_1.default.user.findFirst({
                    where: { personId, id: { not: id } }
                });
                if (linkedUser) {
                    return (0, http_1.conflictError)(res, 'Anggota keluarga sudah terhubung dengan akun lain.');
                }
            }
            updateData.personId = personId;
        }
        const user = await prisma_1.default.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                role: true,
                personId: true,
                createdAt: true
            }
        });
        res.json(user);
    }
    catch (error) {
        console.error('Update user error:', error);
        if (error.code === 'P2002') {
            return (0, http_1.conflictError)(res, 'Email atau anggota keluarga sudah terhubung dengan akun lain.');
        }
        res.status(500).json({ error: 'Terjadi kesalahan saat mengubah user.' });
    }
};
exports.updateUser = updateUser;
// Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (req.user?.id === id) {
            return (0, http_1.validationError)(res, 'Tidak bisa menghapus akun sendiri.');
        }
        const existing = await prisma_1.default.user.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'User tidak ditemukan.' });
        }
        await prisma_1.default.user.delete({ where: { id } });
        res.json({ message: 'User berhasil dihapus.' });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menghapus user.' });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map