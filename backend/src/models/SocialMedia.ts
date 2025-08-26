import mongoose, {Schema, Types} from "mongoose";

export type SocialMedia = {
    influencer: Types.ObjectId;
    platform: "Instagram" | "YouTube" | "TikTok" | "Twitter" | "Facebook" | "LinkedIn";
    url: string;
    followersCount?: number;
    createdAt: Date;
}

const socialMediaSchema = new mongoose.Schema<SocialMedia>(
    {
        influencer: {
            type: Schema.Types.ObjectId,
            ref: "Influencer",
            required: [true, "Influencer is required"],
        },
        platform: {
            type: String,
            enum: ["Instagram", "YouTube", "TikTok", "Twitter", "Facebook", "LinkedIn"],
            required: [true, "Platform is required"],
        },
        url: {
            type: String,
            required: [true, "URL is required"],
            trim: true,
            match: [/^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-.]*)*\/?$/, "Invalid URL"]
        },
        followersCount: {
            type: Number,
            default: 0,
            min: [0, "Followers count cannot be negative"],
        },
    },
    {
        timestamps: true,
    }
)

export const SocialMediaModel = mongoose.model<SocialMedia>("SocialMedia", socialMediaSchema);
