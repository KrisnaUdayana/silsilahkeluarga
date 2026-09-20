"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logout = exports.getMe = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_1 = require("../utils/http");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return (0, http_1.validationError)(res, 'Email dan password diperlukan.');
        }
        const user = await prisma_1.default.user.findUnique({
            where: { email },
            include: { person: { select: { fullName: true, profilePhoto: true } } }
        });
        if (!user) {
            return res.status(401).json({ error: 'Email atau password salah.' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Email atau password salah.' });
        }
        // Update last login
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, (0, http_1.getJwtSecret)(), { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                personId: user.personId,
                person: user.person
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat login.' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Tidak terautentikasi.' });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user.id },
            include: { person: { select: { fullName: true, profilePhoto: true } } }
        });
        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan.' });
        }
        res.json({
            id: user.id,
            email: user.email,
            role: user.role,
            personId: user.personId,
            person: user.person
        });
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan.' });
    }
};
exports.getMe = getMe;
const logout = async (req, res) => {
    // For JWT, logout is handled on client side by removing token
    res.json({ message: 'Berhasil logout.' });
};
exports.logout = logout;
const refreshToken = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Tidak terautentikasi.' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: req.user.id, role: req.user.role }, (0, http_1.getJwtSecret)(), { expiresIn: '7d' });
        res.json({ token });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan.' });
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.controller.js.map