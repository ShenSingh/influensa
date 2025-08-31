import {Router} from "express";
import {refreshToken, signIn, signOut, signUp} from "../controller/auth.controller";



const authRouters = Router()

authRouters.post("/signup", signUp)
authRouters.post("/signin", signIn)
authRouters.post("/logout", signOut)
authRouters.post("/refresh-token", refreshToken);

export default authRouters
