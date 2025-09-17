import {Request,Response,NextFunction} from "express";
import {ApiError} from "../errors/ApiError";
import {UserModel} from "../models/User";
import {getUserIdFromAccessToken} from "../utils/tokenUtils";
import bcrypt from "bcrypt";

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

    console.log("awa")
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
        console.log("User found by token:", user);
        res.status(200).json(user);

    } catch (e) {
        console.log("Error in getUserByToken:", e);
        next(e);
    }
}

// Change Password
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        const { currentPassword, newPassword } = req.body;

        if (!accessToken) {
            throw new ApiError(401, "Access token is required");
        }

        if (!currentPassword || !newPassword) {
            throw new ApiError(400, "Current password and new password are required");
        }

        const userId = getUserIdFromAccessToken(accessToken);
        if (!userId) {
            throw new ApiError(401, "Invalid access token");
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ApiError(404, "User Not Found!");
        }

        // Use bcrypt to compare the current password with the hashed password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new ApiError(400, "Current password is incorrect");
        }

        // Hash the new password before saving
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });

    } catch (e) {
        console.log("Error in changePassword:", e);
        next(e);
    }
}

// Forgot Password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new ApiError(400, "Email is required");
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User with this email not found");
        }

        // In a real application, you would:
        // 1. Generate a secure reset token
        // 2. Store it in the database with expiration
        // 3. Send an email with the reset link
        // For now, we'll just return a success message

        console.log(`Password reset requested for email: ${email}`);

        res.status(200).json({
            message: "Password reset email sent successfully",
            // In production, don't expose user details
            info: "Check your email for reset instructions"
        });

    } catch (e) {
        console.log("Error in forgotPassword:", e);
        next(e);
    }
}
