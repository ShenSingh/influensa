import {Request,Response,NextFunction} from "express";
import {ApiError} from "../errors/ApiError";
import {UserModel} from "../models/User";
import {getUserIdFromAccessToken} from "../utils/tokenUtils";
import EmailService from "../utils/emailService";
import TokenGenerator from "../utils/tokenGenerator";
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
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            console.log("Access token missing in headers");
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
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new ApiError(400, "Current password is incorrect");
        }

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
            console.log(`Password reset request : ${email}`);
            res.status(200).json({
                message: "If an account with that email exists, we've sent a password reset link",
                info: "Check your email for reset instructions"
            });
            return;
        }
        const resetToken = TokenGenerator.generateSecureToken();
        const hashedToken = TokenGenerator.hashToken(resetToken);

        const tokenExpiration = TokenGenerator.createTokenExpiration(1);

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = tokenExpiration;
        await user.save();

        try {
            await EmailService.sendPasswordResetEmail(email, resetToken, user.userName);

            console.log(`Password reset email sent to: ${email}`);
            res.status(200).json({
                message: "Password reset email sent successfully",
                info: "Check your email for reset instructions"
            });
        } catch (emailError) {
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            throw new ApiError(500, "Failed to send reset email. Please try again later.");
        }
    } catch (e) {
        console.log("Error in forgotPassword:", e);
        next(e);
    }
}

// Reset Password
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    console.log("Reset password request received");
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            throw new ApiError(400, "Reset token and new password are required");
        }
        if (newPassword.length < 6) {
            throw new ApiError(400, "Password must be at least 6 characters long");
        }

        const hashedToken = TokenGenerator.hashToken(token);

        const user = await UserModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() } // Token must not be expired
        });

        if (!user) {
            throw new ApiError(400, "Invalid or expired reset token");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({
            message: "Password reset successfully",
            info: "You can now login with your new password"
        });

    } catch (e) {
        console.log("Error in resetPassword:", e);
        next(e);
    }
}
