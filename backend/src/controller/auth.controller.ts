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

        console.log(req.body);

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
                    path: "api/auth/refresh-token",
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
            path: "api/auth/refresh-token",
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
        const token = req.cookies.refreshToken;

        if (token) {
            jwt.verify(
                token,
                process.env.REFRESH_TOKEN_SECRET!,
                async (err: Error | null, decoded: string | JwtPayload | undefined) => {
                    if (err) {
                        if (err instanceof TokenExpiredError) {
                            next(new ApiError(401, "Refresh token expired!"));
                        } else if (err instanceof JsonWebTokenError) {
                            console.error("Invalid refresh token:", err);
                            next(new ApiError(401, "Invalid refresh token!"));
                        } else {
                            console.error("Unknown JWT error:", err);
                            next(new ApiError(401, "Refresh token error!"));
                        }
                        return;
                    }

                    if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
                        console.error("Invalid refresh token payload:", decoded);
                        throw new ApiError(401, "Refresh payload error!");
                    }

                    const userId = decoded.userId;
                    const user = await UserModel.findById(userId);

                    if (user) {
                        const newAccessToken = createAccessToken(userId);
                        res.status(200).json({ accessToken: newAccessToken });
                    } else {
                        throw new ApiError(404, "User not found!");
                    }
                }
            );
        }else {
            console.error("Refresh token not provided");
            throw new ApiError(401, "Refresh token not provided!");
        }
    } catch (e: any) {
        next(e);
    }
};
