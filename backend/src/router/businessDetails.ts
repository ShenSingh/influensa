import {Router} from "express";
import {authenticateToken} from "../middlwares /authenticateToken";
import {
    createBusinessDetail,
    deleteBusinessDetail,
    getAllBusinessDetails,
    getBusinessDetail,
    updateBusinessDetail
} from "../controller/businessDitails.controller";

export const businessDetailsRouter = Router()

businessDetailsRouter.use(authenticateToken) // all router

businessDetailsRouter.get("/getAll", getAllBusinessDetails)
businessDetailsRouter.delete("/:id", deleteBusinessDetail)
businessDetailsRouter.get("/:id", getBusinessDetail)
businessDetailsRouter.put("/:id", updateBusinessDetail)
businessDetailsRouter.post("/", createBusinessDetail)
