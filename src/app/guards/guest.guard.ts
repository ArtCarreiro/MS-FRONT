import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';

export const guestGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  return sessionService.isAuthenticated()
    ? router.createUrlTree(['/profile'])
    : true;
};
