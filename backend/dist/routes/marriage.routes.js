"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marriage_controller_1 = require("../controllers/marriage.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const http_1 = require("../utils/http");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, marriage_controller_1.getAllMarriages);
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, marriage_controller_1.createMarriage);
router.put('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, marriage_controller_1.updateMarriage);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, marriage_controller_1.deleteMarriage);
router.all('/', http_1.methodNotAllowed);
router.all('/:id', http_1.methodNotAllowed);
exports.default = router;
//# sourceMappingURL=marriage.routes.js.map