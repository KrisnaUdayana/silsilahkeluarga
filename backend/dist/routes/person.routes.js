"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const person_controller_1 = require("../controllers/person.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const http_1 = require("../utils/http");
const router = (0, express_1.Router)();
// Public routes - no authentication required
router.get('/', person_controller_1.getAllPersons);
router.get('/tree', person_controller_1.getFamilyTree);
router.get('/search', person_controller_1.searchPersons);
router.get('/:id', person_controller_1.getPersonById);
router.get('/:id/children', person_controller_1.getChildren);
router.get('/:id/siblings', person_controller_1.getSiblings);
// Admin only routes
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, person_controller_1.createPerson);
router.put('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, person_controller_1.updatePerson);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, person_controller_1.deletePerson);
router.all('/', http_1.methodNotAllowed);
router.all('/tree', http_1.methodNotAllowed);
router.all('/search', http_1.methodNotAllowed);
router.all('/:id/children', http_1.methodNotAllowed);
router.all('/:id/siblings', http_1.methodNotAllowed);
router.all('/:id', http_1.methodNotAllowed);
exports.default = router;
//# sourceMappingURL=person.routes.js.map