import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../../libs/types/user.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLES[]) => SetMetadata(ROLES_KEY, roles);
