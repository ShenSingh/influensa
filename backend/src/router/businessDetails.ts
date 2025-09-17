import {Router} from "express";
import {authenticateToken} from "../middlwares /authenticateToken";
import {
    createBusinessDetail,
    deleteBusinessDetail,
    getAllBusinessDetails,
    getBusinessDetail,
    getBusinessById,
    updateBusinessDetail
} from "../controller/businessDitails.controller";

export const businessDetailsRouter = Router()

businessDetailsRouter.use(authenticateToken) // all router

businessDetailsRouter.get("/getAll", getAllBusinessDetails)
businessDetailsRouter.get("/user", getBusinessDetail)
businessDetailsRouter.get("/:id", getBusinessById) // Add route for getting single business by ID
businessDetailsRouter.delete("/:id", deleteBusinessDetail)
businessDetailsRouter.put("/:id", updateBusinessDetail)
businessDetailsRouter.post("/", createBusinessDetail)
