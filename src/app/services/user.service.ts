import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CreateUserRequest, UpdateUserRequest, User } from '@app/models/user.model';
import { API_ROUTES } from '@app/shared/constants/api-routes';
import { ApiService } from '@app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiService = inject(ApiService);

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.apiService.buildUrl(API_ROUTES.users)).pipe(
      map((users) => users ?? []),
    );
  }

  getById(uuid: string): Observable<User> {
    return this.http.get<User>(this.apiService.buildUrl(`${API_ROUTES.users}/${uuid}`));
  }

  create(payload: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiService.buildUrl(API_ROUTES.users), payload);
  }

  update(uuid: string, payload: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(this.apiService.buildUrl(`${API_ROUTES.users}/${uuid}`), payload);
  }

  updatePassword(uuid: string, password: string): Observable<void> {
    return this.http.put<void>(
      this.apiService.buildUrl(`${API_ROUTES.users}/${uuid}/password`),
      password,
      {
        headers: new HttpHeaders({
          'Content-Type': 'text/plain',
        }),
      },
    );
  }

  remove(uuid: string): Observable<void> {
    return this.http.delete<void>(this.apiService.buildUrl(`${API_ROUTES.users}/${uuid}`));
  }
}
