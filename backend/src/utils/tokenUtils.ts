import jwt, { JwtPayload } from "jsonwebtoken";

export const getUserIdFromAccessToken = (accessToken: string): string | null => {
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
        return decoded.userId || null;
    } catch (err) {
        console.error("Invalid or expired access token:", err);
        return null;
    }
};
