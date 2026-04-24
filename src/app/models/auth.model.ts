import { UserRole } from '@app/models/user-role.model';
import { CreateUserRequest } from '@app/models/user.model';

export interface SessionUser {
  uuid?: string;
  email: string;
  role: UserRole;
  customerUuid?: string;
}

export interface AuthSession {
  accessToken: string;
  issuedAt: string;
  expiresAt?: string;
  user: SessionUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends CreateUserRequest {}
