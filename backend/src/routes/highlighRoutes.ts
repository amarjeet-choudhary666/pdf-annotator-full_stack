import { Router } from "express";
import { createHighlight, deleteHighlight, getHighlights, updateHighlight } from "../controllers/highlightController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.route("/").post(authenticateJWT, createHighlight)
router.route("/:pdfUuid").get(authenticateJWT, getHighlights)
router.route("/:id").put(authenticateJWT, updateHighlight)
router.route("/:id").delete(authenticateJWT, deleteHighlight)

export default router;
