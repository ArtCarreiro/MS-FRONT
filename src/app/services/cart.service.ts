import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Cart, CartItem } from '@app/models/cart.model';
import { Product } from '@app/models/product.model';
import { APP_STORAGE_KEYS } from '@app/shared/constants/local-storage';
import { readStorageItem, writeStorageItem } from '@app/shared/utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartSubject = new BehaviorSubject<Cart>(this.readInitialCart());

  readonly cart$ = this.cartSubject.asObservable();
  readonly items$ = this.cart$.pipe(map((cart) => cart.items));
  readonly totalItems$ = this.cart$.pipe(
    map((cart) => cart.items.reduce((total, item) => total + item.quantity, 0)),
  );
  readonly subtotal$ = this.cart$.pipe(
    map((cart) => cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)),
  );

  get snapshot(): Cart {
    return this.cartSubject.value;
  }

  addItem(product: Product, quantity = 1): void {
    const cart = this.cartSubject.value;
    const existingItem = cart.items.find((item) => item.product.uuid === product.uuid);

    if (existingItem) {
      this.updateQuantity(product.uuid, existingItem.quantity + quantity);
      return;
    }

    const nextItem: CartItem = {
      product,
      quantity: Math.max(1, Math.min(quantity, product.estoque)),
    };

    this.syncCart({
      items: [...cart.items, nextItem],
      updatedAt: new Date().toISOString(),
    });
  }

  updateQuantity(productUuid: string, quantity: number): void {
    const items = this.cartSubject.value.items
      .map((item) => {
        if (item.product.uuid !== productUuid) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(1, Math.min(quantity, item.product.estoque)),
        };
      })
      .filter((item) => item.quantity > 0);

    this.syncCart({
      items,
      updatedAt: new Date().toISOString(),
    });
  }

  removeItem(productUuid: string): void {
    const items = this.cartSubject.value.items.filter((item) => item.product.uuid !== productUuid);

    this.syncCart({
      items,
      updatedAt: new Date().toISOString(),
    });
  }

  clear(): void {
    this.syncCart({
      items: [],
      updatedAt: new Date().toISOString(),
    });
  }

  private readInitialCart(): Cart {
    return readStorageItem<Cart>(APP_STORAGE_KEYS.cart) ?? {
      items: [],
      updatedAt: new Date().toISOString(),
    };
  }

  private syncCart(cart: Cart): void {
    this.cartSubject.next(cart);
    writeStorageItem(APP_STORAGE_KEYS.cart, cart);
  }
}
