import {NextFunction, Request, Response} from "express";
import {BusinessDetailModel} from "../models/BusinessDitails";


export const getAllBusinessDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try{
        const businessDetails = await BusinessDetailModel.find();

        if (businessDetails.length > 0) {
            res.status(200).json(businessDetails);
        } else {
            res.status(404).json({ message: "No Business Details Found!" });
        }
    }catch (error) {
        next(error)
    }
}

export const getBusinessDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const businessDetail = await BusinessDetailModel.findOne({ userId: id });
        if (businessDetail) {
            res.status(200).json(businessDetail);
        } else {
            res.status(404).json({ message: "Business Detail Not Found!" });
        }
    } catch (error) {
        next(error);
    }
}

export const updateBusinessDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const updatedBusinessDetail = await BusinessDetailModel.findOneAndUpdate({ userId: id }, req.body, { new: true });
        if (updatedBusinessDetail) {
            res.status(200).json(updatedBusinessDetail);
        } else {
            res.status(404).json({ message: "Business Detail Not Found!" });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteBusinessDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const deletedBusinessDetail = await BusinessDetailModel.findOneAndDelete({ userId: id });
        if (!deletedBusinessDetail) {
            res.status(404).json({ message: "Business Detail Not Found!" });
        } else {
            res.status(200).json({ message: "Business Detail deleted successfully" });
        }
    } catch (error) {
        next(error);
    }
};

// create business detail
export const createBusinessDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const existingDetail = await BusinessDetailModel.findOne({ userId: req.body.userId });
        if (existingDetail) {
            res.status(400).json({ message: "Business Detail for this user already exists!" });
            return;
        }
        const businessDetail = new BusinessDetailModel(req.body);
        const savedBusinessDetail = await businessDetail.save();
        res.status(201).json(savedBusinessDetail);
    }catch (error) {
        next(error)
    }
}
