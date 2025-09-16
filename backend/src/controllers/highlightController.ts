// controllers/highlightController.ts
import {  Response } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import Highlight from '../models/highlightsSchema';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createHighlight = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { pdfUuid, page, text, position } = req.body;

    if (!pdfUuid || page === undefined || !text || !position) {
        throw new ApiError(400, 'All fields are required');
    }

    const highlight = await Highlight.create({
        pdfUuid,
        user: userId,
        page,
        text,
        position
    });

    return res.status(201).json(
        new ApiResponse(201, highlight, 'Highlight created successfully')
    );
});

export const getHighlights = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { pdfUuid } = req.params;

    const highlights = await Highlight.find({
        pdfUuid,
        user: userId
    }).sort({ timestamp: -1 });

    return res.status(200).json(
        new ApiResponse(200, highlights, 'Highlights fetched successfully')
    );
});

export const updateHighlight = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const { text, position } = req.body;

    const highlight = await Highlight.findOne({ _id: id, user: userId });

    if (!highlight) {
        throw new ApiError(404, 'Highlight not found');
    }

    if (text !== undefined) highlight.text = text;
    if (position !== undefined) highlight.position = position;
    await highlight.save();

    return res.status(200).json(
        new ApiResponse(200, highlight, 'Highlight updated successfully')
    );
});

export const deleteHighlight = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { id } = req.params;

    const highlight = await Highlight.findOne({ _id: id, user: userId });

    if (!highlight) {
        throw new ApiError(404, 'Highlight not found');
    }

    await highlight.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, 'Highlight deleted successfully')
    );
});
