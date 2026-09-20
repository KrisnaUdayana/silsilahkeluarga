"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodNotAllowed = exports.getAllowedOrigins = exports.getJwtSecret = exports.parseOptionalDate = exports.conflictError = exports.validationError = void 0;
const validationError = (res, error) => res.status(422).json({ error });
exports.validationError = validationError;
const conflictError = (res, error) => res.status(409).json({ error });
exports.conflictError = conflictError;
const parseOptionalDate = (value, fieldName) => {
    if (value === undefined) {
        return { ok: true, value: undefined };
    }
    if (value === null || value === '') {
        return { ok: true, value: null };
    }
    if (typeof value !== 'string' && !(value instanceof Date)) {
        return { ok: false, error: `${fieldName} harus berupa tanggal yang valid.` };
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return { ok: false, error: `${fieldName} harus berupa tanggal yang valid.` };
    }
    return { ok: true, value: date };
};
exports.parseOptionalDate = parseOptionalDate;
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET wajib diisi di production.');
    }
    return secret || 'development-secret';
};
exports.getJwtSecret = getJwtSecret;
const getAllowedOrigins = () => {
    const configured = process.env.CORS_ORIGIN || process.env.CORS_ORIGINS;
    if (configured) {
        return configured.split(',').map(origin => origin.trim()).filter(Boolean);
    }
    return ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
};
exports.getAllowedOrigins = getAllowedOrigins;
const methodNotAllowed = (req, res) => res.status(405).json({ error: 'Method Not Allowed' });
exports.methodNotAllowed = methodNotAllowed;
//# sourceMappingURL=http.js.map