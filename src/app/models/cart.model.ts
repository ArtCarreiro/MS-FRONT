import { Product } from '@app/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}
