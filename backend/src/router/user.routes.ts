import {Router} from "express";
import {deleteUser, getAllUser, getUserById, getUserByToken, updateUser} from "../controller/user.controller";
import {authenticateToken} from "../middlwares /authenticateToken";

export const userRouter = Router()

userRouter.use(authenticateToken) // all router

userRouter.get("/getAll", getAllUser)
userRouter.delete("/:id", deleteUser)
userRouter.get("/:id", getUserById)
userRouter.put("/:id", updateUser)
userRouter.post("/getUserByToken", getUserByToken);
