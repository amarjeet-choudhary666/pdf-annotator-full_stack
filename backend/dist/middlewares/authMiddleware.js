"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = require("../utils/apiError");
const userModel_1 = require("../models/userModel");
const authenticateJWT = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new apiError_1.ApiError(401, 'Authorization header missing or malformed'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await userModel_1.User.findById(decoded.id);
        if (!user) {
            return next(new apiError_1.ApiError(401, 'User not found'));
        }
        req.user = user;
        next();
    }
    catch (_error) {
        return next(new apiError_1.ApiError(401, 'Invalid or expired token'));
    }
};
exports.authenticateJWT = authenticateJWT;
//# sourceMappingURL=authMiddleware.js.map