"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_controller_1 = require("../controllers/media.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const http_1 = require("../utils/http");
const router = (0, express_1.Router)();
router.get('/:personId', auth_middleware_1.authenticate, media_controller_1.getPersonMedia);
router.post('/upload', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, media_controller_1.upload.single('file'), media_controller_1.uploadMedia);
router.post('/profile/:personId', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, media_controller_1.upload.single('file'), media_controller_1.uploadProfilePhoto);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, media_controller_1.deleteMedia);
router.all('/upload', http_1.methodNotAllowed);
router.all('/profile/:personId', http_1.methodNotAllowed);
router.all('/:personId', http_1.methodNotAllowed);
exports.default = router;
//# sourceMappingURL=media.routes.js.map