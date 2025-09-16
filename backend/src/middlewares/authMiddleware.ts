import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError';
import { User } from '../models/userModel';
import type { IUser } from '../models/userModel';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const authenticateJWT = async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(401, 'Authorization header missing or malformed'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.ACCESS_TOKEN_SECRET!;
        const decoded = jwt.verify(token, secret) as { userId: string };

        const user = await User.findById(decoded.userId);
        if (!user) {
            return next(new ApiError(401, 'User not found'));
        }

        req.user = user;
        next();
    } catch (_error) {
        return next(new ApiError(401, 'Invalid or expired token'));
    }
};
