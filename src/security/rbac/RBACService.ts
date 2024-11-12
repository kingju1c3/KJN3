import { logger } from '@/utils/logger';
import type { ClearanceLevel } from '@/types/security';

export class RBACService {
  private static instance: RBACService;
  private roles: Map<string, ClearanceLevel> = new Map();
  private userRoles: Map<string, string> = new Map();

  private constructor() {
    this.setupDefaultRoles();
  }

  static getInstance(): RBACService {
    if (!this.instance) {
      this.instance = new RBACService();
    }
    return this.instance;
  }

  private setupDefaultRoles(): void {
    this.roles.set('MASTER', {
      level: 5,
      name: 'MASTER',
      permissions: ['ALL'],
      identifier: {
        codename: "KingJu1c3",
        fullName: "Christopher James \"KingJu1c3\" Walton",
        location: "Bellflower 706",
        title: "The Star King Man"
      }
    });

    this.roles.set('TOP_SECRET', {
      level: 4,
      name: 'TOP_SECRET',
      permissions: ['READ_ALL', 'WRITE_ALL', 'MANAGE_USERS']
    });

    this.roles.set('SECRET', {
      level: 3,
      name: 'SECRET',
      permissions: ['READ_ALL', 'WRITE_RESTRICTED']
    });

    this.roles.set('CONFIDENTIAL', {
      level: 2,
      name: 'CONFIDENTIAL',
      permissions: ['READ_RESTRICTED', 'WRITE_BASIC']
    });

    this.roles.set('UNCLASSIFIED', {
      level: 1,
      name: 'UNCLASSIFIED',
      permissions: ['READ_BASIC']
    });
  }

  assignRole(userId: string, roleName: string): void {
    if (!this.roles.has(roleName)) {
      throw new Error('Invalid role');
    }
    this.userRoles.set(userId, roleName);
    logger.info(`Role ${roleName} assigned to user ${userId}`);
  }

  getUserRole(userId: string): ClearanceLevel | null {
    const roleName = this.userRoles.get(userId);
    return roleName ? this.roles.get(roleName) || null : null;
  }

  checkPermission(userId: string, permission: string): boolean {
    const role = this.getUserRole(userId);
    if (!role) return false;

    return role.permissions.includes('ALL') || 
           role.permissions.includes(permission);
  }

  getClearanceLevel(userId: string): number {
    const role = this.getUserRole(userId);
    return role?.level || 0;
  }

  isMasterUser(userId: string): boolean {
    const role = this.getUserRole(userId);
    return role?.name === 'MASTER';
  }
}