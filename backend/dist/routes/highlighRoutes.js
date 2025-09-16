"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const highlightController_1 = require("../controllers/highlightController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.route("/").post(authMiddleware_1.authenticateJWT, highlightController_1.createHighlight);
router.route("/:pdfUuid").get(authMiddleware_1.authenticateJWT, highlightController_1.getHighlights);
router.route("/:id").put(authMiddleware_1.authenticateJWT, highlightController_1.updateHighlight);
router.route("/:id").delete(authMiddleware_1.authenticateJWT, highlightController_1.deleteHighlight);
exports.default = router;
//# sourceMappingURL=highlighRoutes.js.map