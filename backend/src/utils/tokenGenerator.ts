import crypto from 'crypto';

export class TokenGenerator {

    static generateSecureToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    static hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    static createTokenExpiration(hours: number = 1): Date {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + hours);
        return expiration;
    }

    static isTokenExpired(expirationDate: Date): boolean {
        return new Date() > expirationDate;
    }
}

export default TokenGenerator;
