import {NextFunction, Request, Response} from "express";
import {BusinessDetailModel} from "../models/BusinessDitails";
import jwt from "jsonwebtoken";


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
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    const idFromToken = getUserIdFromToken(token);

    if (!idFromToken) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }

    try {
        const businessDetails = await BusinessDetailModel.find({ userId: idFromToken });
        if (businessDetails.length > 0) {
            res.status(200).json(businessDetails);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        next(error);
    }
}

// Get single business by ID
export const getBusinessById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const businessDetail = await BusinessDetailModel.findById(id);
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
        const updatedBusinessDetail = await BusinessDetailModel.findByIdAndUpdate(id, req.body, { new: true });
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
        const deletedBusinessDetail = await BusinessDetailModel.findByIdAndDelete(id);
        if (!deletedBusinessDetail) {
            res.status(404).json({ message: "Business Detail Not Found!" });
        } else {
            res.status(200).json({ message: "Business Detail deleted successfully" });
        }
    } catch (error) {
        next(error);
    }
};

export const createBusinessDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const idFromToken = getUserIdFromToken(token);

        if (!idFromToken) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }

        req.body.userId = idFromToken;

        const businessDetail = new BusinessDetailModel(req.body);
        const savedBusinessDetail = await businessDetail.save();
        res.status(201).json(savedBusinessDetail);
    }catch (error) {
        next(error)
    }
}

const getUserIdFromToken = (token: string): string | null => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;
        return decoded.userId || decoded.id || null;
    } catch (error) {
        return null;
    }
};
