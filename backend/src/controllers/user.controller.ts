import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { conflictError, validationError } from '../utils/http';

const isValidEmail = (email: unknown) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidRole = (role: unknown) => role === undefined || role === 'ADMIN' || role === 'VIEWER';

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
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
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan.' });
  }
};

// Create user (Admin only)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role, personId } = req.body;

    if (!email || !password) {
      return validationError(res, 'Email dan password diperlukan.');
    }

    if (!isValidEmail(email)) {
      return validationError(res, 'Format email tidak valid.');
    }

    if (password.length < 6) {
      return validationError(res, 'Password minimal 6 karakter.');
    }

    if (!isValidRole(role)) {
      return validationError(res, 'Role harus ADMIN atau VIEWER.');
    }

    // Check for existing email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return conflictError(res, 'Email sudah digunakan.');
    }

    // Verify person if provided
    if (personId) {
      const person = await prisma.person.findUnique({ where: { id: personId } });
      if (!person) {
        return validationError(res, 'Anggota keluarga tidak ditemukan.');
      }
      
      // Check if person already linked to a user
      const linkedUser = await prisma.user.findUnique({ where: { personId } });
      if (linkedUser) {
        return conflictError(res, 'Anggota keluarga sudah terhubung dengan akun lain.');
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
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
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error.code === 'P2002') {
      return conflictError(res, 'Email atau anggota keluarga sudah terhubung dengan akun lain.');
    }
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat user.' });
  }
};

// Update user (Admin only)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { email, password, role, personId } = req.body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    const updateData: any = {};

    if (email && email !== existing.email) {
      if (!isValidEmail(email)) {
        return validationError(res, 'Format email tidak valid.');
      }

      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return conflictError(res, 'Email sudah digunakan.');
      }
      updateData.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return validationError(res, 'Password minimal 6 karakter.');
      }
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    if (role) {
      if (!isValidRole(role)) {
        return validationError(res, 'Role harus ADMIN atau VIEWER.');
      }
      updateData.role = role;
    }

    if (personId !== undefined) {
      if (personId) {
        const person = await prisma.person.findUnique({ where: { id: personId } });
        if (!person) {
          return validationError(res, 'Anggota keluarga tidak ditemukan.');
        }
        
        const linkedUser = await prisma.user.findFirst({ 
          where: { personId, id: { not: id } } 
        });
        if (linkedUser) {
          return conflictError(res, 'Anggota keluarga sudah terhubung dengan akun lain.');
        }
      }
      updateData.personId = personId;
    }

    const user = await prisma.user.update({
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
  } catch (error: any) {
    console.error('Update user error:', error);
    if (error.code === 'P2002') {
      return conflictError(res, 'Email atau anggota keluarga sudah terhubung dengan akun lain.');
    }
    res.status(500).json({ error: 'Terjadi kesalahan saat mengubah user.' });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    if (req.user?.id === id) {
      return validationError(res, 'Tidak bisa menghapus akun sendiri.');
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: 'User berhasil dihapus.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus user.' });
  }
};
