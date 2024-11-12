import { sign, verify } from 'jsonwebtoken';
import { createHash, randomBytes } from 'crypto';
import { ClearanceLevel } from '../ClearanceLevel';
import { logger } from '@/utils/logger';

const MASTER_CREDENTIALS = {
  username: 'KingJu1c3',
  identifier: ClearanceLevel.MASTER.identifier,
  // Hash of master credentials - would be in secure env vars in production
  hash: '8a9d8c7b6a5b4c3d2e1f0g9h8i7j6k5l4m3n2o1p'
};

export class MasterAuth {
  private static instance: MasterAuth;
  private mfaSecrets: Map<string, string> = new Map();
  private failedAttempts: Map<string, number> = new Map();
  private lockouts: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): MasterAuth {
    if (!this.instance) {
      this.instance = new MasterAuth();
    }
    return this.instance;
  }

  async authenticateMaster(credentials: {
    username: string;
    password: string;
    mfaToken?: string;
  }): Promise<{ token: string; refreshToken: string } | null> {
    try {
      // Check lockout
      if (this.isLocked(credentials.username)) {
        logger.warn(`Blocked attempt from locked account: ${credentials.username}`);
        throw new Error('Account is temporarily locked');
      }

      // Verify master credentials
      if (!this.verifyMasterCredentials(credentials)) {
        this.handleFailedAttempt(credentials.username);
        throw new Error('Invalid credentials');
      }

      // Verify MFA if enabled
      if (!this.verifyMFA(credentials.username, credentials.mfaToken)) {
        this.handleFailedAttempt(credentials.username);
        throw new Error('Invalid MFA token');
      }

      // Generate tokens
      const token = this.generateToken(credentials.username);
      const refreshToken = this.generateRefreshToken(credentials.username);

      // Log successful auth
      logger.info(`Master authentication successful: ${credentials.username}`);

      // Reset failed attempts
      this.failedAttempts.delete(credentials.username);

      return { token, refreshToken };

    } catch (error) {
      logger.error('Master authentication error:', error);
      throw error;
    }
  }

  private verifyMasterCredentials(credentials: { username: string; password: string }): boolean {
    if (credentials.username !== MASTER_CREDENTIALS.username) {
      return false;
    }

    const hash = createHash('sha256')
      .update(credentials.password)
      .digest('hex');

    return hash === MASTER_CREDENTIALS.hash;
  }

  private generateToken(username: string): string {
    return sign(
      {
        username,
        clearanceLevel: ClearanceLevel.MASTER.level,
        permissions: ClearanceLevel.MASTER.permissions,
        identifier: MASTER_CREDENTIALS.identifier
      },
      process.env.JWT_SECRET || 'master-secret',
      { expiresIn: '1h' }
    );
  }

  private generateRefreshToken(username: string): string {
    return sign(
      { username },
      process.env.REFRESH_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    );
  }

  private verifyMFA(username: string, token?: string): boolean {
    if (!token) return false;
    const secret = this.mfaSecrets.get(username);
    if (!secret) return false;
    // Implement actual TOTP verification here
    return token.length === 6 && /^\d+$/.test(token);
  }

  private isLocked(username: string): boolean {
    const lockTime = this.lockouts.get(username);
    if (!lockTime) return false;
    
    const now = Date.now();
    if (now - lockTime > 15 * 60 * 1000) { // 15 minutes
      this.lockouts.delete(username);
      return false;
    }
    return true;
  }

  private handleFailedAttempt(username: string): void {
    const attempts = (this.failedAttempts.get(username) || 0) + 1;
    this.failedAttempts.set(username, attempts);

    if (attempts >= 3) {
      this.lockouts.set(username, Date.now());
      logger.warn(`Account locked due to multiple failed attempts: ${username}`);
    }
  }

  setupMFA(username: string): string {
    const secret = randomBytes(20).toString('hex');
    this.mfaSecrets.set(username, secret);
    return secret;
  }
}