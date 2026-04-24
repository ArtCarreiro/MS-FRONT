import { BaseEntity } from '@app/models/base-entity.model';
import { UserRole } from '@app/models/user-role.model';

export interface User extends BaseEntity {
  email: string;
  role: UserRole;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  email: string;
  role: UserRole;
}
