export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}
