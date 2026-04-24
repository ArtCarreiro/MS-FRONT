import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Customer, CustomerPayload } from '@app/models/customer.model';
import { API_ROUTES } from '@app/shared/constants/api-routes';
import { ApiService } from '@app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly apiService = inject(ApiService);

  list(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiService.buildUrl(API_ROUTES.customers)).pipe(
      map((customers) => customers ?? []),
    );
  }

  getById(uuid: string): Observable<Customer> {
    return this.http.get<Customer>(this.apiService.buildUrl(`${API_ROUTES.customers}/${uuid}`));
  }

  create(payload: CustomerPayload): Observable<Customer> {
    return this.http.post<Customer>(this.apiService.buildUrl(API_ROUTES.customers), payload);
  }

  update(uuid: string, payload: CustomerPayload): Observable<Customer> {
    return this.http.put<Customer>(this.apiService.buildUrl(`${API_ROUTES.customers}/${uuid}`), payload);
  }

  remove(uuid: string): Observable<void> {
    return this.http.delete<void>(this.apiService.buildUrl(`${API_ROUTES.customers}/${uuid}`));
  }
}
