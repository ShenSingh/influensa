import {Request,Response,NextFunction} from "express";
import {ApiError} from "../errors/ApiError";
import {UserModel} from "../models/User";
import {getUserIdFromAccessToken} from "../utils/tokenUtils";

export const getAllUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const users = await UserModel.find();
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            throw new ApiError(404, "User Not Found!");        }
    } catch (e) {
        next(e);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        const deletedUser = await UserModel.findOneAndDelete({ _id: id });
        if (!deletedUser) {
            throw new ApiError(404, "User Not Found!");
        } else {
            res.status(200).json({ message: "User deleted successfully" });
        }
    } catch (e) {
        next(e);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        const user = await UserModel.findOne({ _id: id });
        if (user) {
            res.status(200).json(user);
        } else {
            throw new ApiError(404, "User Not Found!")
        }
    } catch (e) {
        next(e);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        const updatedUser = await UserModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            throw new ApiError(404, "User Not Found!");
        }
    } catch (e) {
        next(e);
    }
};

export const getUserByToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            throw new ApiError(401, "Access token is required");
        }

        const userId = getUserIdFromAccessToken(accessToken);
        if (!userId) {
            throw new ApiError(401, "Invalid access token");
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ApiError(404, "User Not Found!");
        }
        res.status(200).json(user);

    } catch (e) {
        console.log("Error in getUserByToken:", e);
        next(e);
    }
}
