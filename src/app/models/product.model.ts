import { BaseEntity } from '@app/models/base-entity.model';
import { FileResource } from '@app/models/file.model';

export interface Product extends BaseEntity {
  name: string;
  price: number;
  estoque: number;
  skuCode: string;
  keywords: string | null;
  files?: FileResource[];
}

export interface CreateProductRequest {
  name: string;
  price: number;
  estoque: number;
  skuCode: string;
  keywords?: string | null;
}

export interface UpdateProductRequest {
  name: string;
  price: number;
  estoque: number;
  keywords?: string | null;
}
