"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPDFFile = exports.renamePDF = exports.deletePDF = exports.getPDFs = exports.uploadPDF = void 0;
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const { v4: uuidv4 } = require('uuid');
const fs_1 = __importDefault(require("fs"));
const pdfSchema_1 = require("../models/pdfSchema");
// Upload PDF
exports.uploadPDF = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const file = req.file;
    if (!file) {
        throw new apiError_1.ApiError(400, 'No file uploaded');
    }
    const pdfUuid = uuidv4();
    const filename = file.originalname;
    const filepath = file.path;
    const pdf = await pdfSchema_1.PDF.create({
        uuid: pdfUuid,
        filename,
        filepath,
        user: userId
    });
    if (!pdf) {
        throw new apiError_1.ApiError(500, 'Failed to save PDF');
    }
    return res.status(201).json(new apiResponse_1.ApiResponse(201, { uuid: pdf.uuid, filename: pdf.filename }, 'PDF uploaded successfully'));
});
exports.getPDFs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const pdfs = await pdfSchema_1.PDF.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, pdfs, 'PDFs fetched successfully'));
});
exports.deletePDF = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const { uuid } = req.params;
    const pdf = await pdfSchema_1.PDF.findOne({ uuid, user: userId });
    if (!pdf) {
        throw new apiError_1.ApiError(404, 'PDF not found');
    }
    fs_1.default.unlink(pdf.filepath, err => {
        if (err) {
            console.error('File deletion error:', err);
        }
    });
    await pdf.deleteOne();
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'PDF deleted successfully'));
});
exports.renamePDF = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const { uuid } = req.params;
    const { newFilename } = req.body;
    if (!newFilename) {
        throw new apiError_1.ApiError(400, 'New filename is required');
    }
    const pdf = await pdfSchema_1.PDF.findOne({ uuid, user: userId });
    if (!pdf) {
        throw new apiError_1.ApiError(404, 'PDF not found');
    }
    pdf.filename = newFilename;
    await pdf.save();
    return res.status(200).json(new apiResponse_1.ApiResponse(200, pdf, 'PDF renamed successfully'));
});
exports.getPDFFile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const { uuid } = req.params;
    const pdf = await pdfSchema_1.PDF.findOne({ uuid, user: userId });
    if (!pdf) {
        throw new apiError_1.ApiError(404, 'PDF not found');
    }
    res.sendFile(pdf.filepath, { root: '.' });
});
//# sourceMappingURL=pdfController.js.map