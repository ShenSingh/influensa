import {Router} from "express";
import {deleteUser, getAllUser, getUserById, getUserByToken, updateUser, changePassword, forgotPassword, resetPassword} from "../controller/user.controller";
import {authenticateToken} from "../middlwares /authenticateToken";

export const userRouter = Router()

// Public routes
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

// Protected routes
userRouter.use(authenticateToken);

userRouter.get("/getAll", getAllUser)
userRouter.get("/getUserByToken", getUserByToken);
userRouter.put("/change-password", changePassword);
userRouter.delete("/:id", deleteUser)
userRouter.get("/:id", getUserById)
userRouter.put("/:id", updateUser)
