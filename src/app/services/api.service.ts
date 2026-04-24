import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  buildUrl(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\/+/, '')}`;
  }
}
