import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Order } from '@app/models/order.model';

@Component({
  selector: 'app-orders-page',
  imports: [CurrencyPipe],
  templateUrl: './orders.page.html',
  styleUrl: './orders.page.css',
})
export class OrdersPage {
  protected readonly orders: Order[] = [
    {
      id: 'PED-001',
      createdAt: '2026-04-20T12:30:00Z',
      status: 'paid',
      total: 3999.9,
      items: [
        { productName: 'Notebook Pro 16', quantity: 1, unitPrice: 3999.9 },
      ],
    },
    {
      id: 'PED-002',
      createdAt: '2026-04-21T09:15:00Z',
      status: 'shipped',
      total: 598.0,
      items: [
        { productName: 'Mouse Carbon', quantity: 2, unitPrice: 299.0 },
      ],
    },
  ];
}
