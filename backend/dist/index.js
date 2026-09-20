"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const person_routes_1 = __importDefault(require("./routes/person.routes"));
const marriage_routes_1 = __importDefault(require("./routes/marriage.routes"));
const media_routes_1 = __importDefault(require("./routes/media.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const gallery_routes_1 = __importDefault(require("./routes/gallery.routes"));
const http_1 = require("./utils/http");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: (0, http_1.getAllowedOrigins)(),
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/persons', person_routes_1.default);
app.use('/api/marriages', marriage_routes_1.default);
app.use('/api/media', media_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/stats', stats_routes_1.default);
app.use('/api/gallery', gallery_routes_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE'
            ? 'Ukuran file melebihi batas yang diizinkan.'
            : 'Upload file tidak valid.';
        return res.status(422).json({ error: message });
    }
    if (err?.message?.includes('Tipe file tidak diizinkan')) {
        return res.status(422).json({ error: err.message });
    }
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map