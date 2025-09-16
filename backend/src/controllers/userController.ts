import { User } from "../models/userModel";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";


export const registerUser = asyncHandler(async(req, res) => {
    const {email, name, password, phone} = req.body;

    if(!email || !name || !password || !phone){
        throw new ApiError(401, "All feilds are required")
    }

    const existing = await User.findOne(
        {email: email}
    )

    if(existing){
        throw new ApiError(409, "User already existing with this emailk")
    }

    
    const hashPassword = await bcrypt.hash(password, 10)

    if(!hashPassword){
        throw new ApiError(401, "failed to hash password")
    }

    const user = await User.create({
        email,
        name,
        password: hashPassword,
        phone
    })

    if(!user){
        throw new ApiError(500, "something went wrong while creating user")
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "something went wrong while creating user")
    }

    return res.status(200).json(
        new ApiResponse(201, createdUser, "user created successfully")
    )
})


export const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        throw new ApiError(401, "All feilds are required")
    }

    const user = await User.findOne({email: email}) 

    if(!user){
        throw new ApiError(401, "Invalid email or password")
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if(!isPasswordMatched){
        throw new ApiError(401, "Invalid email or password")
    }

    const accessToken = generateAccessToken(user._id as string)
    const refreshToken = generateRefreshToken(user._id as string)

    user.refreshToken = refreshToken
    await user.save()

    return res.status(200).json(
        new ApiResponse(200, {user, accessToken, refreshToken}, "user logged in successfully")
    )
})