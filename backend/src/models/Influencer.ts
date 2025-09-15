import mongoose, { Schema } from "mongoose";

export type Influencer = {
    socialName: string;
    name: string;
    niche: string;
    followers: string;
    engagement: number;
    location: string;
    image: string;
    verified: boolean;
};

const influencerSchema = new mongoose.Schema<Influencer>({
        socialName: {
            type: String,
            required: [true, "Full Name is required"],
            trim: true,
            minlength: [2,"Full Name must be at least 2 characters"],
        },
        name: {
            type: String,
            required: [true, "User Name is required"],
            trim: true,
            minlength: [2,"User Name must be at least 2 characters"],
        },
        niche: {
            type: String,
            required: [true, "Niche is required"],
            trim: true,
            minlength: [2,"Niche must be at least 2 characters"],
        },
        followers: {
            type: String,
            required: [true, "Followers count is required"],
            trim: true,
        },
        engagement: {
            type: Number,
            required: [true, "Engagement rate is required"],
            min: [0, "Engagement rate cannot be negative"],
            max: [100, "Engagement rate cannot exceed 100"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
            minlength: [2,"Location must be at least 2 characters"],
        },

        image: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: true,
    }
)
export const InfluencerModel = mongoose.model<Influencer>("Influencer", influencerSchema);
