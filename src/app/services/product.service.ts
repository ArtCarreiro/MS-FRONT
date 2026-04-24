import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from '@app/models/product.model';
import { API_ROUTES } from '@app/shared/constants/api-routes';
import { ApiService } from '@app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiService = inject(ApiService);
  private productsCache$?: Observable<Product[]>;

  list(): Observable<Product[]> {
    if (!this.productsCache$) {
      this.productsCache$ = this.http.get<Product[]>(this.apiService.buildUrl(API_ROUTES.products)).pipe(
        map((products) => products ?? []),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
    }

    return this.productsCache$;
  }

  refresh(): Observable<Product[]> {
    this.productsCache$ = undefined;
    return this.list();
  }

  getById(uuid: string): Observable<Product> {
    return this.http.get<Product>(this.apiService.buildUrl(`${API_ROUTES.products}/${uuid}`));
  }

  create(payload: CreateProductRequest): Observable<Product> {
    this.productsCache$ = undefined;
    return this.http.post<Product>(this.apiService.buildUrl(API_ROUTES.products), payload);
  }

  update(uuid: string, payload: UpdateProductRequest): Observable<Product> {
    this.productsCache$ = undefined;
    return this.http.put<Product>(this.apiService.buildUrl(`${API_ROUTES.products}/${uuid}`), payload);
  }

  remove(uuid: string): Observable<void> {
    this.productsCache$ = undefined;
    return this.http.delete<void>(this.apiService.buildUrl(`${API_ROUTES.products}/${uuid}`));
  }
}
