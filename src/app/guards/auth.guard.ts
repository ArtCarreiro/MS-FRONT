import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  return sessionService.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { redirectTo: state.url } });
};
