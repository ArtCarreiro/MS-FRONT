import { BaseEntity } from '@app/models/base-entity.model';

export interface FileResource extends BaseEntity {
  name: string;
  path: string;
}
