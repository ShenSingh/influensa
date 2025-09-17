import mongoose, { Schema } from "mongoose";
import {getAllBusinessDetails} from "../controller/businessDitails.controller";

export type BusinessDetail = {
    userId?: Schema.Types.ObjectId;
    businessName: string;
    businessType?: string;
    description?: string;
    targetAudience?: string;
    additionalInfo: string;
}

const businessDetailSchema = new mongoose.Schema<BusinessDetail>({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            unique: true,
        },
        businessName: {
            type: String,
            required: [true, "Business Name is required"],
            trim: true,
            minlength: [2,"Business Name must be at least 2 characters"],
        },
        businessType: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description can't be more than 500 characters"],
        },
        targetAudience: {
            type: String,
            trim: true,
        },
        additionalInfo: {
            type: String,
            trim: true,
            maxlength: [1000, "Additional Info can't be more than 1000 characters"],
        }
    },
    {
        timestamps: true,
    }

)

export const BusinessDetailModel = mongoose.model<BusinessDetail>("BusinessDetail", businessDetailSchema);

