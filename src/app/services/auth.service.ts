import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiError } from '@app/models/api-error.model';
import { LoginRequest, RegisterRequest } from '@app/models/auth.model';
import { User } from '@app/models/user.model';
import { SessionService } from '@app/services/session.service';
import { UserService } from '@app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly sessionService = inject(SessionService);
  private readonly userService = inject(UserService);

  register(payload: RegisterRequest): Observable<User> {
    return this.userService.create(payload);
  }

  login(_credentials: LoginRequest): Observable<never> {
    return throwError(() => ({
      status: 501,
      message: 'A MS-API atual ainda nao expoe um endpoint de login/JWT. O frontend ja esta preparado com guard e interceptor para ativar esse fluxo assim que o contrato for liberado.',
    } satisfies ApiError));
  }

  logout(): void {
    this.sessionService.clearSession();
  }
}
