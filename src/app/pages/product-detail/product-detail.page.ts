import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, filter, map, of, shareReplay, switchMap } from 'rxjs';
import { ApiError } from '@app/models/api-error.model';
import { Product } from '@app/models/product.model';
import { CartService } from '@app/services/cart.service';
import { ProductService } from '@app/services/product.service';
import { tokenizeKeywords } from '@app/shared/utils/product.util';

@Component({
  selector: 'app-product-detail-page',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './product-detail.page.html',
  styleUrl: './product-detail.page.css',
})
export class ProductDetailPage {
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  protected readonly feedbackMessage = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);

  protected readonly product$ = this.route.paramMap.pipe(
    map((params) => params.get('uuid')),
    filter((uuid): uuid is string => Boolean(uuid)),
    switchMap((uuid) => this.productService.getById(uuid).pipe(
      catchError((error: ApiError) => {
        this.loadError.set(error.message);
        return of(null);
      }),
    )),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  protected addProductToCart(product: Product): void {
    this.cartService.addItem(product);
    this.feedbackMessage.set(`${product.name} adicionado ao carrinho.`);

    if (typeof window !== 'undefined') {
      window.setTimeout(() => this.feedbackMessage.set(null), 2200);
    }
  }

  protected categoriesFor(product: Product): string[] {
    return tokenizeKeywords(product.keywords);
  }
}
