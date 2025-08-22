import { ROLES } from './user.type';
import { User } from '../../users/entities/user.entity';

export interface JwtPayload {
  email: string;
  sub: string;
  role: ROLES;
}

export type AuthUserResult = Omit<User, 'hashPassword'>;

export class AuthResponse {
  token: string;
  expires_in: string;
  token_type: token_type;
}

export enum token_type {
  access_token = 'access_token',
  refresh_token = 'refresh_token',
}
