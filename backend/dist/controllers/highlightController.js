"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHighlight = exports.updateHighlight = exports.getHighlights = exports.createHighlight = void 0;
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const highlightsSchema_1 = __importDefault(require("../models/highlightsSchema"));
exports.createHighlight = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const { pdfUuid, page, text, position } = req.body;
    if (!pdfUuid || page === undefined || !text || !position) {
        throw new apiError_1.ApiError(400, 'All fields are required');
    }
    const highlight = await highlightsSchema_1.default.create({
        pdfUuid,
        user: userId,
        page,
        text,
        position
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, highlight, 'Highlight created successfully'));
});
exports.getHighlights = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const { pdfUuid } = req.params;
    const highlights = await highlightsSchema_1.default.find({
        pdfUuid,
        user: userId
    }).sort({ timestamp: -1 });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, highlights, 'Highlights fetched successfully'));
});
exports.updateHighlight = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const { text, position } = req.body;
    const highlight = await highlightsSchema_1.default.findOne({ _id: id, user: userId });
    if (!highlight) {
        throw new apiError_1.ApiError(404, 'Highlight not found');
    }
    if (text !== undefined)
        highlight.text = text;
    if (position !== undefined)
        highlight.position = position;
    await highlight.save();
    return res.status(200).json(new apiResponse_1.ApiResponse(200, highlight, 'Highlight updated successfully'));
});
exports.deleteHighlight = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const highlight = await highlightsSchema_1.default.findOne({ _id: id, user: userId });
    if (!highlight) {
        throw new apiError_1.ApiError(404, 'Highlight not found');
    }
    await highlight.deleteOne();
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Highlight deleted successfully'));
});
//# sourceMappingURL=highlightController.js.map