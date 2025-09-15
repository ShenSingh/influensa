import {Router} from "express";
import {authenticateToken} from "../middlwares /authenticateToken";
import {
    createInfluencer,
    deleteInfluencer,
    getAllInfluencers,
    getInfluencerById,
    updateInfluencer
} from "../controller/influencer.controller";

export const influencerRouter = Router()

//influencerRouter.use(authenticateToken) // all router

influencerRouter.get("/getAll", getAllInfluencers)
influencerRouter.delete("/:id", deleteInfluencer)
influencerRouter.get("/:id", getInfluencerById)
influencerRouter.put("/:id", updateInfluencer)
influencerRouter.post("/", createInfluencer)
