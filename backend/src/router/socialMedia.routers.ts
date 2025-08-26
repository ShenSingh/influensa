import {Router} from "express";
import {authenticateToken} from "../middlwares /authenticateToken";
import {
    createSocialMedia,
    deleteSocialMedia,
    getAllSocialMedia,
    getSocialMediaByInfluencerId
} from "../controller/socialMedia.controller";


export const socialMediaRouter = Router()

socialMediaRouter.use(authenticateToken) // all router

socialMediaRouter.get("/getAll", getAllSocialMedia)
socialMediaRouter.delete("/:id", deleteSocialMedia)
socialMediaRouter.get("/:id", getSocialMediaByInfluencerId)
socialMediaRouter.post("/", createSocialMedia)

