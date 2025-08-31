import mongoose, { Schema } from "mongoose";
import {getAllBusinessDetails} from "../controller/businessDitails.controller";

export type BusinessDetail = {
    userId?: Schema.Types.ObjectId;
    name: string;
    logoUrl?: string;
    websiteUrl?: string;
    description?: string;
}

const businessDetailSchema = new mongoose.Schema<BusinessDetail>({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Business Name is required"],
            trim: true,
            minlength: [2,"Business Name must be at least 2 characters"],
        },
        logoUrl: {
            type: String,
            trim: true,
        },
        websiteUrl: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description can't be more than 500 characters"],
        },
    },
    {
        timestamps: true,
    }

)

export const BusinessDetailModel = mongoose.model<BusinessDetail>("BusinessDetail", businessDetailSchema);

