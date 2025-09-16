"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdfController_1 = require("../controllers/pdfController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
router.route("/upload").post(authMiddleware_1.authenticateJWT, upload_1.default.single('pdf'), pdfController_1.uploadPDF);
router.get('/', authMiddleware_1.authenticateJWT, pdfController_1.getPDFs);
router.get('/:uuid/view', authMiddleware_1.authenticateJWT, pdfController_1.getPDFFile);
router.delete('/:uuid', authMiddleware_1.authenticateJWT, pdfController_1.deletePDF);
router.put('/:uuid/rename', authMiddleware_1.authenticateJWT, pdfController_1.renamePDF);
exports.default = router;
//# sourceMappingURL=pdfRoutes.js.map