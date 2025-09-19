import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken"
import { ApiError } from "../errors/ApiError"

// Middleware to authenticate JWT access token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(" ")[1] // Expect "Bearer TOKEN"

        if (!token) {
            console.error("Access token missing")
            return next(new ApiError(401, "Access token missing"))
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
            if (err) {
                if (err instanceof TokenExpiredError) {
                    console.log("Access token expired 11:", err)
                    return next(new ApiError(403, "Access token expired"))
                } else if (err instanceof JsonWebTokenError) {
                    console.error("Invalid access token:", err)
                    return next(new ApiError(401, "Invalid access token"))
                } else {
                    console.error("JWT verification error:", err)
                    return next(new ApiError(401, "Could not authenticate token"))
                }
            }
            if (!decoded || typeof decoded === "string") {
                console.error("Invalid token payload:", decoded)
                throw new ApiError(401, "Invalid token payload")
            }
            next()
        })
    } catch (err) {
        next(err)
    }
}
