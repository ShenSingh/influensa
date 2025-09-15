import {NextFunction, Request, Response} from "express";
import {ApiError} from "../errors/ApiError";
import {UserModel} from "../models/User";
import {InfluencerModel} from "../models/Influencer";

export const getAllInfluencers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try{
        const influencers = await InfluencerModel.find();

        if (influencers.length > 0) {
            res.status(200).json(influencers);
        } else {
            throw new ApiError(404, "Influencer Not Found!");
        }
    }catch (e: any) {
        next(e)
    }
}

export const deleteInfluencer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const deletedInfluencer = await InfluencerModel.findOneAndDelete({ _id: id });
        if (!deletedInfluencer) {
            throw new ApiError(404, "Influencer Not Found!");
        } else {
            res.status(200).json({ message: "Influencer deleted successfully" });
        }
    } catch (e: any) {
        next(e);
    }
};

export const getInfluencerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const influencer = await InfluencerModel.findOne({ _id: id });
        if (influencer) {
            res.status(200).json(influencer);
        } else {
            throw new ApiError(404, "Influencer Not Found!")
        }
    } catch (e: any) {
        next(e);
    }
};

export const updateInfluencer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const updatedInfluencer = await InfluencerModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (updatedInfluencer) {
            res.status(200).json(updatedInfluencer);
        } else {
            throw new ApiError(404, "Influencer Not Found!");
        }
    } catch (e: any) {
        next(e);
    }
};

export const createInfluencer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const body = req.body;
        const { socialName } = req.body.socialName;

        const existingInfluencer = await InfluencerModel.findOne({ socialName });
        if (!existingInfluencer) {

            const newInfluencer = new InfluencerModel(body);
            const savedInfluencer = await newInfluencer.save();
            res.status(201).json(savedInfluencer);
        }else {
            res.status(401).send("Influencer already Exit!");
        }
    }catch (e: any) {
        console.log(e)
        next(e);
    }
}
