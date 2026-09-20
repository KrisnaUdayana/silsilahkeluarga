import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { conflictError, parseOptionalDate, validationError } from '../utils/http';

// Get all marriages
export const getAllMarriages = async (req: Request, res: Response) => {
  try {
    const marriages = await prisma.marriage.findMany({
      include: {
        husband: { select: { id: true, fullName: true, profilePhoto: true } },
        wife: { select: { id: true, fullName: true, profilePhoto: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(marriages);
  } catch (error) {
    console.error('Get marriages error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pernikahan.' });
  }
};

// Create marriage (Admin only)
export const createMarriage = async (req: Request, res: Response) => {
  try {
    const { husbandId, wifeId, marriageDate, marriagePlace, divorceDate, orderNumber } = req.body;

    if (!husbandId || !wifeId) {
      return validationError(res, 'ID suami dan istri diperlukan.');
    }

    if (husbandId === wifeId) {
      return validationError(res, 'Suami dan istri tidak boleh orang yang sama.');
    }

    const parsedMarriageDate = parseOptionalDate(marriageDate, 'Tanggal pernikahan');
    if (!parsedMarriageDate.ok) return validationError(res, parsedMarriageDate.error);

    const parsedDivorceDate = parseOptionalDate(divorceDate, 'Tanggal perceraian');
    if (!parsedDivorceDate.ok) return validationError(res, parsedDivorceDate.error);

    if (parsedMarriageDate.value && parsedDivorceDate.value && parsedDivorceDate.value < parsedMarriageDate.value) {
      return validationError(res, 'Tanggal perceraian tidak boleh sebelum tanggal pernikahan.');
    }

    if (orderNumber !== undefined && (!Number.isInteger(Number(orderNumber)) || Number(orderNumber) < 1)) {
      return validationError(res, 'Nomor urutan pernikahan harus angka positif.');
    }

    // Validate husband
    const husband = await prisma.person.findUnique({ where: { id: husbandId } });
    if (!husband || husband.gender !== 'MALE') {
      return validationError(res, 'Suami tidak ditemukan atau bukan laki-laki.');
    }

    // Validate wife
    const wife = await prisma.person.findUnique({ where: { id: wifeId } });
    if (!wife || wife.gender !== 'FEMALE') {
      return validationError(res, 'Istri tidak ditemukan atau bukan perempuan.');
    }

    // Determine order number
    const existingMarriages = await prisma.marriage.count({
      where: { husbandId }
    });
    
    const finalOrderNumber = orderNumber ? Number(orderNumber) : (existingMarriages + 1);

    const marriage = await prisma.marriage.create({
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
  } catch (error: any) {
    console.error('Create marriage error:', error);
    if (error.code === 'P2002') {
      return conflictError(res, 'Pernikahan dengan urutan ini sudah ada.');
    }
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat data pernikahan.' });
  }
};

// Update marriage (Admin only)
export const updateMarriage = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { marriageDate, marriagePlace, divorceDate, orderNumber } = req.body;

    const existing = await prisma.marriage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Data pernikahan tidak ditemukan.' });
    }

    const parsedMarriageDate = parseOptionalDate(marriageDate, 'Tanggal pernikahan');
    if (!parsedMarriageDate.ok) return validationError(res, parsedMarriageDate.error);

    const parsedDivorceDate = parseOptionalDate(divorceDate, 'Tanggal perceraian');
    if (!parsedDivorceDate.ok) return validationError(res, parsedDivorceDate.error);

    const finalMarriageDate = parsedMarriageDate.value === undefined ? existing.marriageDate : parsedMarriageDate.value;
    const finalDivorceDate = parsedDivorceDate.value === undefined ? existing.divorceDate : parsedDivorceDate.value;
    if (finalMarriageDate && finalDivorceDate && finalDivorceDate < finalMarriageDate) {
      return validationError(res, 'Tanggal perceraian tidak boleh sebelum tanggal pernikahan.');
    }

    if (orderNumber !== undefined && (!Number.isInteger(Number(orderNumber)) || Number(orderNumber) < 1)) {
      return validationError(res, 'Nomor urutan pernikahan harus angka positif.');
    }

    const updateData: any = {};
    if (marriageDate !== undefined) updateData.marriageDate = parsedMarriageDate.value;
    if (marriagePlace !== undefined) updateData.marriagePlace = marriagePlace;
    if (divorceDate !== undefined) updateData.divorceDate = parsedDivorceDate.value;
    if (orderNumber !== undefined) updateData.orderNumber = Number(orderNumber);

    const marriage = await prisma.marriage.update({
      where: { id },
      data: updateData,
      include: {
        husband: { select: { id: true, fullName: true } },
        wife: { select: { id: true, fullName: true } }
      }
    });

    res.json(marriage);
  } catch (error: any) {
    console.error('Update marriage error:', error);
    if (error.code === 'P2002') {
      return conflictError(res, 'Pernikahan dengan urutan ini sudah ada.');
    }
    res.status(500).json({ error: 'Terjadi kesalahan saat mengubah data pernikahan.' });
  }
};

// Delete marriage (Admin only)
export const deleteMarriage = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const existing = await prisma.marriage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Data pernikahan tidak ditemukan.' });
    }

    await prisma.marriage.delete({ where: { id } });

    res.json({ message: 'Data pernikahan berhasil dihapus.' });
  } catch (error) {
    console.error('Delete marriage error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus data pernikahan.' });
  }
};
