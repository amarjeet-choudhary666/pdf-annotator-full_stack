import { Router } from "express";
import { deletePDF, getPDFs, getPDFFile, renamePDF, uploadPDF } from "../controllers/pdfController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import upload from "../middlewares/upload";

const router = Router();

router.route("/upload").post( authenticateJWT, upload.single('pdf'), uploadPDF)
router.get('/', authenticateJWT, getPDFs);
router.get('/:uuid/view', authenticateJWT, getPDFFile);
router.delete('/:uuid', authenticateJWT, deletePDF);
router.put('/:uuid/rename', authenticateJWT, renamePDF);

export default router;
