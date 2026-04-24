import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Address, AddressPayload } from '@app/models/address.model';
import { API_ROUTES } from '@app/shared/constants/api-routes';
import { ApiService } from '@app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly http = inject(HttpClient);
  private readonly apiService = inject(ApiService);

  getById(uuid: string): Observable<Address> {
    return this.http.get<Address>(this.apiService.buildUrl(`${API_ROUTES.address}/${uuid}`));
  }

  create(payload: AddressPayload): Observable<Address> {
    return this.http.post<Address>(this.apiService.buildUrl(API_ROUTES.address), payload);
  }

  update(uuid: string, payload: AddressPayload): Observable<Address> {
    return this.http.put<Address>(this.apiService.buildUrl(`${API_ROUTES.address}/${uuid}`), payload);
  }

  remove(uuid: string): Observable<void> {
    return this.http.delete<void>(this.apiService.buildUrl(`${API_ROUTES.address}/${uuid}`));
  }
}
