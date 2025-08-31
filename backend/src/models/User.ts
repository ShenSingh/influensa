import mongoose, { Schema } from "mongoose";

export type User = {
    userName: string;
    email: string;
    password: string;
    createdAt: Date;
};

const userSchema = new mongoose.Schema<User>({
    userName: {
        type: String,
        required: [true, "User Name is required"],
        trim: true,
        minlength: [2,"User Name must be at least 2 characters"],
    },
    email: {
        type: String,
        required:[true, "Email is required"],
        unique:[true,"User already exit!"],
        index: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, "Invalid email"]
    },
    password: {
        type:String,
        required: [true, "Password is required"],
        trim: true,
        minlength: [6,"Password must be at least 2 characters"],
    },
},
    {
        timestamps: true,
    }
)
export const UserModel = mongoose.model<User>("User", userSchema);
