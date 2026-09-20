import { Request, Response } from 'express';

export const validationError = (res: Response, error: string) =>
  res.status(422).json({ error });

export const conflictError = (res: Response, error: string) =>
  res.status(409).json({ error });

export const parseOptionalDate = (value: unknown, fieldName: string) => {
  if (value === undefined) {
    return { ok: true as const, value: undefined };
  }

  if (value === null || value === '') {
    return { ok: true as const, value: null };
  }

  if (typeof value !== 'string' && !(value instanceof Date)) {
    return { ok: false as const, error: `${fieldName} harus berupa tanggal yang valid.` };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { ok: false as const, error: `${fieldName} harus berupa tanggal yang valid.` };
  }

  return { ok: true as const, value: date };
};

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET wajib diisi di production.');
  }

  return secret || 'development-secret';
};

export const getAllowedOrigins = () => {
  const configured = process.env.CORS_ORIGIN || process.env.CORS_ORIGINS;

  if (configured) {
    return configured.split(',').map(origin => origin.trim()).filter(Boolean);
  }

  return ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
};

export const methodNotAllowed = (req: Request, res: Response) =>
  res.status(405).json({ error: 'Method Not Allowed' });
