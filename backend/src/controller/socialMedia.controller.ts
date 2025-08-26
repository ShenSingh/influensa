import {NextFunction, Request, Response} from "express";
import {SocialMediaModel} from "../models/SocialMedia";
import {ApiError} from "../errors/ApiError";

export const getAllSocialMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try{
        const socialMedias = await SocialMediaModel.find();

        if (socialMedias.length > 0) {
            res.status(200).json(socialMedias);
        } else {
            throw new ApiError(404, "Influencer Not Found!");
        }
    }catch (e) {
        next(e)
    }
}

export const deleteSocialMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const deletedSocialMedia = await SocialMediaModel.findOneAndDelete({ _id: id });
        if (!deletedSocialMedia) {
            throw new ApiError(404, "Social Media Not Found!");
        } else {
            res.status(200).json({ message: "Social Media deleted successfully" });
        }
    } catch (e) {
        next(e);
    }
};

export const getSocialMediaByInfluencerId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const { influencerId } = req.params;
        const socialMedia = await SocialMediaModel.find({ influencer: influencerId });
        if (socialMedia) {
            res.status(200).json(socialMedia);
        } else {
            throw new ApiError(404, "Social Media Not Found!")
        }

    }catch (e) {
        next(e)
    }
}

export const createSocialMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newSocialMedia = new SocialMediaModel(req.body);
        const savedSocialMedia = await newSocialMedia.save();
        res.status(201).json(savedSocialMedia);
    } catch (e) {
        next(e);
    }
}

