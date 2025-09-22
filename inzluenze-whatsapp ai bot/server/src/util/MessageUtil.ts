import {RecommendInfluencer} from "../model/RecommendInfluencer";

export const createMessage = (influencers: RecommendInfluencer[], from: string) => {

    const validInfluencers = influencers.filter(influencer => influencer.similarity_score * 100 > 0);

    if (validInfluencers.length === 0) {
        return `*Hi ${from}*,\n\n❌ Sorry, we couldn't find any suitable influencers for your business based on the description provided. Please try again with a different description or check back later.\n\nBest regards,\nInfluenza Team`;
    }

    if (validInfluencers.length > 0) {
        let messageText = `*Hi ${from}*,\n\n✅ We found ${validInfluencers.length} suitable influencers for your business:\n\n`;
        validInfluencers.forEach((rec: any, i: number) => {
            messageText += `${i + 1}. @${rec.username}\n*Similarity Score:* ${(rec.similarity_score * 100).toFixed(2)}%\n*Likes:* ${Math.round(rec.avg_likes)}\n*Comments:* ${Math.round(rec.avg_comments)}\n*Profile:* https://instagram.com/${rec.username}\n\n`;
        });
        messageText += `Best regards,\nInfluenza Team`;
        return messageText;
    }
}
