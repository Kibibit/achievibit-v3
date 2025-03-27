import { Role } from './roles.enum';
import { Permission } from './permissions.enum';

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    Permission.VIEW_PULL_REQUESTS
  ],
  [Role.USER]: [],
  [Role.GUEST]: [],
};
