export interface ClearanceLevel {
  level: number;
  name: string;
  permissions: string[];
  identifier?: {
    codename?: string;
    fullName?: string;
    location?: string;
    title?: string;
  };
}

export interface SecurityMetrics {
  encryptionStrength: number;
  lastSecurityScan: string;
  threatLevel: 'low' | 'medium' | 'high';
  activeConnections: number;
}

export interface SecurityConfig {
  maxRetries: number;
  lockoutDuration: number;
  sessionTimeout: number;
  requireMFA: boolean;
  allowedOrigins: string[];
  encryptionAlgorithm: 'AES-256' | 'RSA-4096';
}

export interface SecurityEvent {
  timestamp: string;
  type: 'auth' | 'access' | 'threat' | 'system';
  severity: 'info' | 'warning' | 'critical';
  description: string;
  sourceIp?: string;
  userId?: string;
  nodeId?: string;
}