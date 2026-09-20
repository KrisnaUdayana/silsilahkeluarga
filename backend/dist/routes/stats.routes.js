"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = require("../controllers/stats.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const http_1 = require("../utils/http");
const router = (0, express_1.Router)();
// Public stats - no authentication required
router.get('/public', stats_controller_1.getPublicStats);
// Admin stats
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, stats_controller_1.getStats);
router.all('/public', http_1.methodNotAllowed);
router.all('/', http_1.methodNotAllowed);
exports.default = router;
//# sourceMappingURL=stats.routes.js.map