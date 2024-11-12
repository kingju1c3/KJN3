import { logger } from '@/utils/logger';
import type { SecurityEvent } from '@/types/security';

export class AuditLog {
  private static instance: AuditLog;
  private logs: SecurityEvent[] = [];

  private constructor() {
    this.startPeriodicExport();
  }

  static getInstance(): AuditLog {
    if (!this.instance) {
      this.instance = new AuditLog();
    }
    return this.instance;
  }

  log(event: SecurityEvent): void {
    this.logs.push({
      ...event,
      timestamp: new Date().toISOString()
    });

    // Log critical events immediately
    if (event.severity === 'critical') {
      this.exportLogs([event]);
    }
  }

  private exportLogs(events: SecurityEvent[]): void {
    events.forEach(event => {
      logger.info('Security Event:', {
        ...event,
        sensitiveData: undefined // Remove sensitive data before logging
      });
    });
  }

  private startPeriodicExport(): void {
    setInterval(() => {
      if (this.logs.length > 0) {
        const logsToExport = [...this.logs];
        this.logs = [];
        this.exportLogs(logsToExport);
      }
    }, 5 * 60 * 1000); // Export every 5 minutes
  }

  getLogs(filters?: {
    severity?: SecurityEvent['severity'];
    type?: SecurityEvent['type'];
    startDate?: Date;
    endDate?: Date;
  }): SecurityEvent[] {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.severity) {
        filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
      }
      if (filters.type) {
        filteredLogs = filteredLogs.filter(log => log.type === filters.type);
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) >= filters.startDate!
        );
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) <= filters.endDate!
        );
      }
    }

    return filteredLogs;
  }
}