import { describe, it, expect } from 'vitest';
import RBAC from '../../../src/security/rbac';

describe('RBAC', () => {
  it('initializes with default roles', () => {
    const rbac = new RBAC();
    expect(rbac.roles.size).toBeGreaterThan(0);
  });

  it('assigns roles correctly', () => {
    const rbac = new RBAC();
    const userId = 'test-user';
    
    rbac.assignRole(userId, 'ADMIN');
    const permissions = rbac.getUserPermissions(userId);
    
    expect(permissions).toBeDefined();
    expect(permissions.clearanceLevel).toBe(4);
  });

  it('checks permissions correctly', () => {
    const rbac = new RBAC();
    const userId = 'test-user';
    
    rbac.assignRole(userId, 'OPERATOR');
    
    expect(rbac.checkPermission(userId, 'READ_ALL')).toBe(true);
    expect(rbac.checkPermission(userId, 'MANAGE_USERS')).toBe(false);
  });
});