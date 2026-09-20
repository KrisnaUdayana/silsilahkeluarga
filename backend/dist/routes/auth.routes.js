"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const http_1 = require("../utils/http");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_middleware_1.authenticate, auth_controller_1.logout);
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.getMe);
router.post('/refresh', auth_middleware_1.authenticate, auth_controller_1.refreshToken);
router.all('/login', http_1.methodNotAllowed);
router.all('/logout', http_1.methodNotAllowed);
router.all('/me', http_1.methodNotAllowed);
router.all('/refresh', http_1.methodNotAllowed);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map