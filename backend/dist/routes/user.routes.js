"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const http_1 = require("../utils/http");
const router = (0, express_1.Router)();
// All user management routes are admin-only
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, user_controller_1.getAllUsers);
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, user_controller_1.createUser);
router.put('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, user_controller_1.updateUser);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, user_controller_1.deleteUser);
router.all('/', http_1.methodNotAllowed);
router.all('/:id', http_1.methodNotAllowed);
exports.default = router;
//# sourceMappingURL=user.routes.js.map