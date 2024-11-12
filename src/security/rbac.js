class RBAC {
  constructor() {
    this.roles = new Map();
    this.userRoles = new Map();
    this.setupDefaultRoles();
  }

  setupDefaultRoles() {
    this.addRole('MASTER_ADMIN', {
      permissions: ['ALL'],
      clearanceLevel: 5
    });

    this.addRole('ADMIN', {
      permissions: ['READ_ALL', 'WRITE_ALL', 'MANAGE_USERS'],
      clearanceLevel: 4
    });

    this.addRole('OPERATOR', {
      permissions: ['READ_ALL', 'WRITE_RESTRICTED'],
      clearanceLevel: 3
    });

    this.addRole('USER', {
      permissions: ['READ_RESTRICTED', 'WRITE_BASIC'],
      clearanceLevel: 2
    });
  }

  addRole(roleName, roleConfig) {
    this.roles.set(roleName, roleConfig);
  }

  assignRole(userId, roleName) {
    const role = this.roles.get(roleName);
    if (!role) throw new Error('Invalid role');
    this.userRoles.set(userId, roleName);
  }

  getUserPermissions(userId) {
    const roleName = this.userRoles.get(userId);
    return roleName ? this.roles.get(roleName) : null;
  }

  checkPermission(userId, permission) {
    const userRole = this.userRoles.get(userId);
    if (!userRole) return false;

    const roleConfig = this.roles.get(userRole);
    return roleConfig.permissions.includes('ALL') || 
           roleConfig.permissions.includes(permission);
  }

  getClearanceLevel(userId) {
    const userRole = this.userRoles.get(userId);
    return userRole ? this.roles.get(userRole).clearanceLevel : 0;
  }
}

export default RBAC;