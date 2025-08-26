import mongoose, { Schema } from "mongoose";

export type Influencer = {
    influencerName: string;
    imageUrl?: string;
    score?: number;
    createdAt: Date;
};

const influencerSchema = new mongoose.Schema<Influencer>({
        influencerName: {
            type: String,
            required: [true, "User Name is required"],
            trim: true,
            minlength: [2,"User Name must be at least 2 characters"],
        },

    },
    {
        timestamps: true,
    }
)
export const InfluencerModel = mongoose.model<Influencer>("Influencer", influencerSchema);
