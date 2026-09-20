"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMarriage = exports.updateMarriage = exports.createMarriage = exports.getAllMarriages = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_1 = require("../utils/http");
// Get all marriages
const getAllMarriages = async (req, res) => {
    try {
        const marriages = await prisma_1.default.marriage.findMany({
            include: {
                husband: { select: { id: true, fullName: true, profilePhoto: true } },
                wife: { select: { id: true, fullName: true, profilePhoto: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(marriages);
    }
    catch (error) {
        console.error('Get marriages error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pernikahan.' });
    }
};
exports.getAllMarriages = getAllMarriages;
// Create marriage (Admin only)
const createMarriage = async (req, res) => {
    try {
        const { husbandId, wifeId, marriageDate, marriagePlace, divorceDate, orderNumber } = req.body;
        if (!husbandId || !wifeId) {
            return (0, http_1.validationError)(res, 'ID suami dan istri diperlukan.');
        }
        if (husbandId === wifeId) {
            return (0, http_1.validationError)(res, 'Suami dan istri tidak boleh orang yang sama.');
        }
        const parsedMarriageDate = (0, http_1.parseOptionalDate)(marriageDate, 'Tanggal pernikahan');
        if (!parsedMarriageDate.ok)
            return (0, http_1.validationError)(res, parsedMarriageDate.error);
        const parsedDivorceDate = (0, http_1.parseOptionalDate)(divorceDate, 'Tanggal perceraian');
        if (!parsedDivorceDate.ok)
            return (0, http_1.validationError)(res, parsedDivorceDate.error);
        if (parsedMarriageDate.value && parsedDivorceDate.value && parsedDivorceDate.value < parsedMarriageDate.value) {
            return (0, http_1.validationError)(res, 'Tanggal perceraian tidak boleh sebelum tanggal pernikahan.');
        }
        if (orderNumber !== undefined && (!Number.isInteger(Number(orderNumber)) || Number(orderNumber) < 1)) {
            return (0, http_1.validationError)(res, 'Nomor urutan pernikahan harus angka positif.');
        }
        // Validate husband
        const husband = await prisma_1.default.person.findUnique({ where: { id: husbandId } });
        if (!husband || husband.gender !== 'MALE') {
            return (0, http_1.validationError)(res, 'Suami tidak ditemukan atau bukan laki-laki.');
        }
        // Validate wife
        const wife = await prisma_1.default.person.findUnique({ where: { id: wifeId } });
        if (!wife || wife.gender !== 'FEMALE') {
            return (0, http_1.validationError)(res, 'Istri tidak ditemukan atau bukan perempuan.');
        }
        // Determine order number
        const existingMarriages = await prisma_1.default.marriage.count({
            where: { husbandId }
        });
        const finalOrderNumber = orderNumber ? Number(orderNumber) : (existingMarriages + 1);
        const marriage = await prisma_1.default.marriage.create({
            data: {
                husbandId,
                wifeId,
                marriageDate: parsedMarriageDate.value ?? null,
                marriagePlace,
                divorceDate: parsedDivorceDate.value ?? null,
                orderNumber: finalOrderNumber
            },
            include: {
                husband: { select: { id: true, fullName: true } },
                wife: { select: { id: true, fullName: true } }
            }
        });
        res.status(201).json(marriage);
    }
    catch (error) {
        console.error('Create marriage error:', error);
        if (error.code === 'P2002') {
            return (0, http_1.conflictError)(res, 'Pernikahan dengan urutan ini sudah ada.');
        }
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat data pernikahan.' });
    }
};
exports.createMarriage = createMarriage;
// Update marriage (Admin only)
const updateMarriage = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { marriageDate, marriagePlace, divorceDate, orderNumber } = req.body;
        const existing = await prisma_1.default.marriage.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Data pernikahan tidak ditemukan.' });
        }
        const parsedMarriageDate = (0, http_1.parseOptionalDate)(marriageDate, 'Tanggal pernikahan');
        if (!parsedMarriageDate.ok)
            return (0, http_1.validationError)(res, parsedMarriageDate.error);
        const parsedDivorceDate = (0, http_1.parseOptionalDate)(divorceDate, 'Tanggal perceraian');
        if (!parsedDivorceDate.ok)
            return (0, http_1.validationError)(res, parsedDivorceDate.error);
        const finalMarriageDate = parsedMarriageDate.value === undefined ? existing.marriageDate : parsedMarriageDate.value;
        const finalDivorceDate = parsedDivorceDate.value === undefined ? existing.divorceDate : parsedDivorceDate.value;
        if (finalMarriageDate && finalDivorceDate && finalDivorceDate < finalMarriageDate) {
            return (0, http_1.validationError)(res, 'Tanggal perceraian tidak boleh sebelum tanggal pernikahan.');
        }
        if (orderNumber !== undefined && (!Number.isInteger(Number(orderNumber)) || Number(orderNumber) < 1)) {
            return (0, http_1.validationError)(res, 'Nomor urutan pernikahan harus angka positif.');
        }
        const updateData = {};
        if (marriageDate !== undefined)
            updateData.marriageDate = parsedMarriageDate.value;
        if (marriagePlace !== undefined)
            updateData.marriagePlace = marriagePlace;
        if (divorceDate !== undefined)
            updateData.divorceDate = parsedDivorceDate.value;
        if (orderNumber !== undefined)
            updateData.orderNumber = Number(orderNumber);
        const marriage = await prisma_1.default.marriage.update({
            where: { id },
            data: updateData,
            include: {
                husband: { select: { id: true, fullName: true } },
                wife: { select: { id: true, fullName: true } }
            }
        });
        res.json(marriage);
    }
    catch (error) {
        console.error('Update marriage error:', error);
        if (error.code === 'P2002') {
            return (0, http_1.conflictError)(res, 'Pernikahan dengan urutan ini sudah ada.');
        }
        res.status(500).json({ error: 'Terjadi kesalahan saat mengubah data pernikahan.' });
    }
};
exports.updateMarriage = updateMarriage;
// Delete marriage (Admin only)
const deleteMarriage = async (req, res) => {
    try {
        const id = String(req.params.id);
        const existing = await prisma_1.default.marriage.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Data pernikahan tidak ditemukan.' });
        }
        await prisma_1.default.marriage.delete({ where: { id } });
        res.json({ message: 'Data pernikahan berhasil dihapus.' });
    }
    catch (error) {
        console.error('Delete marriage error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menghapus data pernikahan.' });
    }
};
exports.deleteMarriage = deleteMarriage;
//# sourceMappingURL=marriage.controller.js.map