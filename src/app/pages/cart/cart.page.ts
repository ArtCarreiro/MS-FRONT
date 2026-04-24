import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '@app/models/cart.model';
import { CartService } from '@app/services/cart.service';

@Component({
  selector: 'app-cart-page',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.css',
})
export class CartPage {
  private readonly cartService = inject(CartService);

  protected readonly cart$ = this.cartService.cart$;
  protected readonly subtotal$ = this.cartService.subtotal$;
  protected readonly totalItems$ = this.cartService.totalItems$;

  protected increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.uuid, item.quantity + 1);
  }

  protected decreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      this.cartService.removeItem(item.product.uuid);
      return;
    }

    this.cartService.updateQuantity(item.product.uuid, item.quantity - 1);
  }

  protected removeItem(productUuid: string): void {
    this.cartService.removeItem(productUuid);
  }

  protected clearCart(): void {
    this.cartService.clear();
  }
}
