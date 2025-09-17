import crypto from 'crypto';

export class TokenGenerator {
    /**
     * Generate a cryptographically secure random token
     * @param length - Length of the token (default: 32 bytes = 64 hex characters)
     * @returns Secure random token as hex string
     */
    static generateSecureToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Generate a hashed version of the token for database storage
     * @param token - Plain token to hash
     * @returns SHA256 hash of the token
     */
    static hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    /**
     * Create token expiration date (1 hour from now)
     * @param hours - Hours until expiration (default: 1)
     * @returns Date object for expiration
     */
    static createTokenExpiration(hours: number = 1): Date {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + hours);
        return expiration;
    }

    /**
     * Verify if a token has expired
     * @param expirationDate - Token expiration date
     * @returns True if token has expired
     */
    static isTokenExpired(expirationDate: Date): boolean {
        return new Date() > expirationDate;
    }
}

export default TokenGenerator;
