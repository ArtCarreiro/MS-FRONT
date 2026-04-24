import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ProductCardComponent } from '@app/components/product-card/product-card.component';
import { ApiError } from '@app/models/api-error.model';
import { Product } from '@app/models/product.model';
import { CartService } from '@app/services/cart.service';
import { ProductService } from '@app/services/product.service';
import { extractProductCategories } from '@app/shared/utils/product.util';

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, ProductCardComponent, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);

  protected readonly feedbackMessage = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);

  protected readonly featuredProducts$ = this.productService.list().pipe(
    map((products) => products.slice(0, 4)),
    catchError((error: ApiError) => {
      this.loadError.set(error.message);
      return of([]);
    }),
  );

  protected readonly categories$ = this.productService.list().pipe(
    map((products) => extractProductCategories(products).slice(0, 8)),
    catchError(() => of([])),
  );

  protected addProductToCart(product: Product): void {
    this.cartService.addItem(product);
    this.feedbackMessage.set(`${product.name} adicionado ao carrinho.`);

    if (typeof window !== 'undefined') {
      window.setTimeout(() => this.feedbackMessage.set(null), 2200);
    }
  }
}
