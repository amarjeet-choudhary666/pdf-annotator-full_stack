"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
exports.registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, name, password, phone } = req.body;
    if (!email || !name || !password || !phone) {
        throw new apiError_1.ApiError(401, "All feilds are required");
    }
    const existing = await userModel_1.User.findOne({ email: email });
    if (existing) {
        throw new apiError_1.ApiError(409, "User already existing with this emailk");
    }
    const hashPassword = await bcrypt_1.default.hash(password, 10);
    if (!hashPassword) {
        throw new apiError_1.ApiError(401, "failed to hash password");
    }
    const user = await userModel_1.User.create({
        email,
        name,
        password: hashPassword,
        phone
    });
    if (!user) {
        throw new apiError_1.ApiError(500, "something went wrong while creating user");
    }
    const createdUser = await userModel_1.User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new apiError_1.ApiError(500, "something went wrong while creating user");
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(201, createdUser, "user created successfully"));
});
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new apiError_1.ApiError(401, "All feilds are required");
    }
    const user = await userModel_1.User.findOne({ email: email });
    if (!user) {
        throw new apiError_1.ApiError(401, "Invalid email or password");
    }
    const isPasswordMatched = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new apiError_1.ApiError(401, "Invalid email or password");
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user._id);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    return res.status(200).json(new apiResponse_1.ApiResponse(200, { user, accessToken, refreshToken }, "user logged in successfully"));
});
//# sourceMappingURL=userController.js.map