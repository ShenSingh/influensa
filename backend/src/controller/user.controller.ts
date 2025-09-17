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

// Forgot Password - Complete Implementation
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    console.log("awa hh")
    try {
        const { email } = req.body;

        if (!email) {
            throw new ApiError(400, "Email is required");
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            // For security, don't reveal if email exists or not
            console.log(`Password reset requested for non-existent email: ${email}`);
            res.status(200).json({
                message: "If an account with that email exists, we've sent a password reset link",
                info: "Check your email for reset instructions"
            });
            return;
        }

        // Step 1: Generate a secure reset token
        const resetToken = TokenGenerator.generateSecureToken(); // 64-character hex string
        const hashedToken = TokenGenerator.hashToken(resetToken); // Hash for database storage

        // Step 2: Store hashed token in database with expiration (1 hour)
        const tokenExpiration = TokenGenerator.createTokenExpiration(1); // 1 hour from now

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = tokenExpiration;
        await user.save();

        // Step 3: Send email with reset link containing the plain token
        try {
            await EmailService.sendPasswordResetEmail(email, resetToken, user.userName);

            console.log(`Password reset email sent to: ${email}`);
            console.log(`Reset token generated (expires in 1 hour): ${resetToken.substring(0, 10)}...`);

            res.status(200).json({
                message: "Password reset email sent successfully",
                info: "Check your email for reset instructions"
            });
        } catch (emailError) {
            // If email fails, clean up the reset token
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            console.error('Failed to send reset email:', emailError);
            throw new ApiError(500, "Failed to send reset email. Please try again later.");
        }

    } catch (e) {
        console.log("Error in forgotPassword:", e);
        next(e);
    }
}

// Reset Password - New endpoint for handling the reset
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            throw new ApiError(400, "Reset token and new password are required");
        }

        if (newPassword.length < 6) {
            throw new ApiError(400, "Password must be at least 6 characters long");
        }

        // Hash the provided token to compare with stored hash
        const hashedToken = TokenGenerator.hashToken(token);

        // Find user with matching token that hasn't expired
        const user = await UserModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() } // Token must not be expired
        });

        if (!user) {
            throw new ApiError(400, "Invalid or expired reset token");
        }

        // Hash the new password before saving (FIXED: was storing plain text)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        console.log(`Password reset successful for user: ${user.email}`);

        res.status(200).json({
            message: "Password reset successfully",
            info: "You can now login with your new password"
        });

    } catch (e) {
        console.log("Error in resetPassword:", e);
        next(e);
    }
}
