import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@app/models/product.model';
import { tokenizeKeywords } from '@app/shared/utils/product.util';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  protected readonly categories = computed(() => tokenizeKeywords(this.product().keywords).slice(0, 3));
  protected readonly imagePath = computed(() => this.product().files?.[0]?.path ?? null);

  protected handleAddToCart(): void {
    this.addToCart.emit(this.product());
  }
}
