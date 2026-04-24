export interface BaseEntity {
  uuid: string;
  created: string | null;
  modified: string | null;
  active: boolean;
  deleted: boolean;
}
