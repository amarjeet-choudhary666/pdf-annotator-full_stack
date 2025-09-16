import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    phone: number;
    password: string;
    refreshToken?: string;
}

const userSchema: Schema<IUser>  = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
