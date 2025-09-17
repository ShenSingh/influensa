import {Router} from "express";
import {deleteUser, getAllUser, getUserById, getUserByToken, updateUser, changePassword, forgotPassword} from "../controller/user.controller";
import {authenticateToken} from "../middlwares /authenticateToken";

export const userRouter = Router()

userRouter.use(authenticateToken) // all router

userRouter.get("/getAll", getAllUser)
userRouter.get("/getUserByToken", getUserByToken); // Move this BEFORE the /:id route
userRouter.put("/change-password", changePassword); // Add change password route
userRouter.post("/forgot-password", forgotPassword); // Add forgot password route (no auth needed)
userRouter.delete("/:id", deleteUser)
userRouter.get("/:id", getUserById)
userRouter.put("/:id", updateUser)
