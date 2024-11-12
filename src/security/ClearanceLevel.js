export const ClearanceLevel = {
  MASTER: {
    level: 5,
    name: 'MASTER',
    permissions: ['ALL'],
    identifier: {
      codename: "KingJu1c3",
      fullName: "Christopher James \"KingJu1c3\" Walton",
      location: "Bellflower 706",
      title: "The Star King Man"
    }
  },
  TOP_SECRET: {
    level: 4,
    name: 'TOP_SECRET',
    permissions: ['READ_ALL', 'WRITE_ALL', 'MANAGE_USERS']
  },
  SECRET: {
    level: 3,
    name: 'SECRET',
    permissions: ['READ_ALL', 'WRITE_RESTRICTED']
  },
  CONFIDENTIAL: {
    level: 2,
    name: 'CONFIDENTIAL',
    permissions: ['READ_RESTRICTED', 'WRITE_BASIC']
  },
  UNCLASSIFIED: {
    level: 1,
    name: 'UNCLASSIFIED',
    permissions: ['READ_BASIC']
  }
};