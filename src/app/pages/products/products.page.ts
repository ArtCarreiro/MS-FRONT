import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, distinctUntilChanged, map, of, startWith, catchError } from 'rxjs';
import { ProductCardComponent } from '@app/components/product-card/product-card.component';
import { ApiError } from '@app/models/api-error.model';
import { Product } from '@app/models/product.model';
import { CartService } from '@app/services/cart.service';
import { ProductService } from '@app/services/product.service';
import {
  ProductSortKey,
  extractProductCategories,
  filterProducts,
  sortProducts,
} from '@app/shared/utils/product.util';

@Component({
  selector: 'app-products-page',
  imports: [AsyncPipe, ProductCardComponent, ReactiveFormsModule],
  templateUrl: './products.page.html',
  styleUrl: './products.page.css',
})
export class ProductsPage {
  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  protected readonly categoryControl = new FormControl('all', { nonNullable: true });
  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly sortControl = new FormControl<ProductSortKey>('featured', { nonNullable: true });

  protected readonly feedbackMessage = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly sortOptions: { label: string; value: ProductSortKey }[] = [
    { label: 'Destaques', value: 'featured' },
    { label: 'Nome', value: 'name' },
    { label: 'Menor preco', value: 'price-asc' },
    { label: 'Maior preco', value: 'price-desc' },
  ];

  private readonly productsSource$ = this.productService.list().pipe(
    catchError((error: ApiError) => {
      this.loadError.set(error.message);
      return of([]);
    }),
  );

  protected readonly categories$ = this.productsSource$.pipe(
    map((products) => extractProductCategories(products)),
  );

  protected readonly products$ = combineLatest([
    this.productsSource$,
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    this.categoryControl.valueChanges.pipe(startWith(this.categoryControl.value)),
    this.sortControl.valueChanges.pipe(startWith(this.sortControl.value)),
  ]).pipe(
    map(([products, searchTerm, category, sortKey]) => sortProducts(
      filterProducts(products, { category, searchTerm }),
      sortKey,
    )),
  );

  protected readonly resultCount$ = this.products$.pipe(
    map((products) => products.length),
  );

  constructor() {
    this.route.queryParamMap.pipe(
      map((params) => params.get('q')?.trim() ?? ''),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((query) => {
      if (query !== this.searchControl.value) {
        this.searchControl.setValue(query);
      }
    });
  }

  protected addProductToCart(product: Product): void {
    this.cartService.addItem(product);
    this.feedbackMessage.set(`${product.name} adicionado ao carrinho.`);

    if (typeof window !== 'undefined') {
      window.setTimeout(() => this.feedbackMessage.set(null), 2200);
    }
  }
}
