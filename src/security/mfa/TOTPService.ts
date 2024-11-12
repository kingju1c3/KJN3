import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { logger } from '@/utils/logger';

export class TOTPService {
  private static instance: TOTPService;
  private secrets: Map<string, string> = new Map();

  private constructor() {
    authenticator.options = { 
      window: 1,        // Allow 30 seconds before/after
      step: 30          // 30-second period
    };
  }

  static getInstance(): TOTPService {
    if (!this.instance) {
      this.instance = new TOTPService();
    }
    return this.instance;
  }

  async setupMFA(username: string): Promise<{ secret: string; qrCode: string }> {
    try {
      const secret = authenticator.generateSecret();
      this.secrets.set(username, secret);

      const otpauth = authenticator.keyuri(
        username,
        'KJ Network',
        secret
      );

      const qrCode = await QRCode.toDataURL(otpauth);

      logger.info(`MFA setup completed for user: ${username}`);

      return { secret, qrCode };
    } catch (error) {
      logger.error('MFA setup failed:', error);
      throw new Error('Failed to setup MFA');
    }
  }

  verifyToken(username: string, token: string): boolean {
    try {
      const secret = this.secrets.get(username);
      if (!secret) {
        throw new Error('MFA not setup for user');
      }

      return authenticator.verify({ token, secret });
    } catch (error) {
      logger.error('MFA verification failed:', error);
      return false;
    }
  }

  removeMFA(username: string): void {
    this.secrets.delete(username);
    logger.info(`MFA removed for user: ${username}`);
  }
}