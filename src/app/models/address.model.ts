import { BaseEntity } from '@app/models/base-entity.model';
import { Customer } from '@app/models/customer.model';

export interface Address extends BaseEntity {
  street: string;
  neighborhood: string;
  country: string;
  zipCode: string;
  complement: string;
  customer?: Pick<Customer, 'uuid' | 'first_name' | 'last_name'>;
}

export interface AddressPayload {
  street: string;
  neighborhood: string;
  country: string;
  zipCode: string;
  complement: string;
  customer: { uuid: string };
}
