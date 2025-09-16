/// <reference path="../express/index.d.ts" />
import { Request, Response } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
const { v4: uuidv4 } = require('uuid');
import fs from 'fs';
import path from 'path';
import { PDF } from '../models/pdfSchema';

// Upload PDF
export const uploadPDF = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const file = req.file;

    if (!file) {
        throw new ApiError(400, 'No file uploaded');
    }

    const pdfUuid = uuidv4();
    const filename = file.originalname;
    const filepath = file.path;

    const pdf = await PDF.create({
        uuid: pdfUuid,
        filename,
        filepath,
        user: userId
    });

    if (!pdf) {
        throw new ApiError(500, 'Failed to save PDF');
    }

    return res.status(201).json(
        new ApiResponse(201, { uuid: pdf.uuid, filename: pdf.filename }, 'PDF uploaded successfully')
    );
});

export const getPDFs = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const pdfs = await PDF.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, pdfs, 'PDFs fetched successfully')
    );
});

export const deletePDF = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { uuid } = req.params;

    const pdf = await PDF.findOne({ uuid, user: userId });

    if (!pdf) {
        throw new ApiError(404, 'PDF not found');
    }

    fs.unlink(pdf.filepath, err => {
        if (err) {
            console.error('File deletion error:', err);
        }
    });

    await pdf.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, 'PDF deleted successfully')
    );
});

export const renamePDF = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { uuid } = req.params;
    const { newFilename } = req.body;

    if (!newFilename) {
        throw new ApiError(400, 'New filename is required');
    }

    const pdf = await PDF.findOne({ uuid, user: userId });

    if (!pdf) {
        throw new ApiError(404, 'PDF not found');
    }

    pdf.filename = newFilename;
    await pdf.save();

    return res.status(200).json(
        new ApiResponse(200, pdf, 'PDF renamed successfully')
    );
});

export const getPDFFile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { uuid } = req.params;

    const pdf = await PDF.findOne({ uuid, user: userId });

    if (!pdf) {
        throw new ApiError(404, 'PDF not found');
    }

    const filePath = path.resolve(pdf.filepath);
    res.sendFile(filePath);
});
