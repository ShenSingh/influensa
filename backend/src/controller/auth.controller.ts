import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import {UserModel} from "../models/User";
import jwt, {JsonWebTokenError, JwtPayload, TokenExpiredError} from "jsonwebtoken"
import {ApiError} from "../errors/ApiError";

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> => {
    try{
        const email = req.body.email;
        const isUser =await UserModel.findOne({ email });
        if (!isUser){
            if (req.body){
                const saltRounds = 10;
                req.body.password = await bcrypt.hash(req.body.password, saltRounds);
                const user = new UserModel(req.body);
                await user.save();

                res.status(201).json(user);
            }
        }else {
            res.status(401).send("User already Exit!");
        }
    }catch (e) {
        console.log(e)
        next(e);
    }
}

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch){
                const accessToken = createAccessToken(user._id.toString());
                const refreshToken = createRefreshToken(user._id.toString());

                const isProd:boolean = process.env.NODE_ENV === "production";

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: isProd,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    path: "/",
                    sameSite: 'strict'
                });

                const userWithoutPassword = {
                    _id: user.id,
                    name: user.userName,
                    email: user.email,
                    accessToken,
                };
                res.status(200).json(userWithoutPassword);
            }else {
                res.status(401).send("Invalid credentials!");
            }
        } else {
            throw new ApiError(404, "User not found!");
        }
    }catch (e) {
        next(e);
    }
}

export const signOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: isProd,
            maxAge: 0,
            path: "/",
        });
        res.status(200).json({ message: "Logged out successfully!" });
    } catch (e: any) {
        console.error("Error during sign out:", e);
        next(e);
    }
};

const createAccessToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
    );
};

const createRefreshToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" }
    );
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            console.log("Refresh token not provided");
            return next(new ApiError(401, "Refresh token not provided"));
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err: any, decoded: any) => {
            if (err) {
                if (err instanceof TokenExpiredError) {
                    console.log("Refresh token expired:", err);
                    return next(new ApiError(403, "Refresh token expired"));
                } else if (err instanceof JsonWebTokenError) {
                    console.error("Invalid refresh token:", err);
                    return next(new ApiError(401, "Invalid refresh token"));
                } else {
                    console.error("Refresh token verification error:", err);
                    return next(new ApiError(401, "Could not verify refresh token"));
                }
            }

            if (!decoded || typeof decoded === "string") {
                console.error("Invalid refresh token payload:", decoded);
                return next(new ApiError(401, "Invalid refresh token payload"));
            }

            // Verify user still exists
            const user = await UserModel.findById(decoded.userId);
            if (!user) {
                return next(new ApiError(404, "User not found"));
            }

            // Generate new access token
            const newAccessToken = createAccessToken(user._id.toString());

            res.status(200).json({
                accessToken: newAccessToken,
                message: "Token refreshed successfully"
            });
        });
    } catch (e) {
        console.error("Error in refresh token:", e);
        next(e);
    }
};
