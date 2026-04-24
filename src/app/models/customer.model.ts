import { BaseEntity } from '@app/models/base-entity.model';
import { User } from '@app/models/user.model';

export interface Customer extends BaseEntity {
  first_name: string;
  last_name: string;
  birthDate: string | null;
  phone: string;
  newsletter: boolean;
  document: string;
  gender: string | null;
  user?: User;
}

export interface CustomerPayload {
  first_name: string;
  last_name: string;
  birthDate?: string | null;
  phone: string;
  newsletter?: boolean;
  document: string;
  gender?: string | null;
  user: User | { uuid: string };
}
