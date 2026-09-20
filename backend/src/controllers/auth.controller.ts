import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { getJwtSecret, validationError } from '../utils/http';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return validationError(res, 'Email dan password diperlukan.');
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { person: { select: { fullName: true, profilePhoto: true } } }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat login.' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Tidak terautentikasi.' });
    }

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan.' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // For JWT, logout is handled on client side by removing token
  res.json({ message: 'Berhasil logout.' });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Tidak terautentikasi.' });
    }

    const token = jwt.sign(
      { userId: req.user.id, role: req.user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan.' });
  }
};
