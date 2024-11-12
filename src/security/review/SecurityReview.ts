import { AuditLog } from '../audit/AuditLog';
import { logger } from '@/utils/logger';
import type { SecurityEvent, SecurityMetrics } from '@/types/security';

export class SecurityReview {
  private static instance: SecurityReview;
  private lastReview: Date | null = null;
  private auditLog = AuditLog.getInstance();

  private constructor() {
    this.scheduleAutomatedReviews();
  }

  static getInstance(): SecurityReview {
    if (!this.instance) {
      this.instance = new SecurityReview();
    }
    return this.instance;
  }

  async performReview(): Promise<SecurityMetrics> {
    try {
      const events = this.auditLog.getLogs({
        startDate: this.lastReview || new Date(Date.now() - 24 * 60 * 60 * 1000)
      });

      const metrics = this.analyzeSecurityEvents(events);
      this.lastReview = new Date();

      // Log review completion
      logger.info('Security review completed', { metrics });

      return metrics;
    } catch (error) {
      logger.error('Security review failed:', error);
      throw error;
    }
  }

  private analyzeSecurityEvents(events: SecurityEvent[]): SecurityMetrics {
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    const threatLevel = this.calculateThreatLevel(events);

    return {
      encryptionStrength: 256, // AES-256
      lastSecurityScan: new Date().toISOString(),
      threatLevel,
      activeConnections: this.countActiveConnections(events)
    };
  }

  private calculateThreatLevel(events: SecurityEvent[]): 'low' | 'medium' | 'high' {
    const criticalCount = events.filter(e => e.severity === 'critical').length;
    const warningCount = events.filter(e => e.severity === 'warning').length;

    if (criticalCount > 5 || warningCount > 20) return 'high';
    if (criticalCount > 2 || warningCount > 10) return 'medium';
    return 'low';
  }

  private countActiveConnections(events: SecurityEvent[]): number {
    const uniqueNodes = new Set(
      events
        .filter(e => e.type === 'access' && e.nodeId)
        .map(e => e.nodeId)
    );
    return uniqueNodes.size;
  }

  private scheduleAutomatedReviews(): void {
    setInterval(async () => {
      try {
        await this.performReview();
      } catch (error) {
        logger.error('Automated security review failed:', error);
      }
    }, 6 * 60 * 60 * 1000); // Every 6 hours
  }
}