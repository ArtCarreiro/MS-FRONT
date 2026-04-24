import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '@app/services/session.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const sessionService = inject(SessionService);
  const token = sessionService.getToken();

  if (!token) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }));
};
