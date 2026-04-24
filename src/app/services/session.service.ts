import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { AuthSession } from '@app/models/auth.model';
import { UserRole } from '@app/models/user-role.model';
import { APP_STORAGE_KEYS } from '@app/shared/constants/local-storage';
import { readStorageItem, removeStorageItem, writeStorageItem } from '@app/shared/utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly sessionSubject = new BehaviorSubject<AuthSession | null>(
    readStorageItem<AuthSession>(APP_STORAGE_KEYS.session),
  );

  readonly session$ = this.sessionSubject.asObservable();
  readonly isAuthenticated$ = this.session$.pipe(
    map((session) => Boolean(session?.accessToken)),
    distinctUntilChanged(),
  );

  get snapshot(): AuthSession | null {
    return this.sessionSubject.value;
  }

  getToken(): string | null {
    return this.sessionSubject.value?.accessToken ?? null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  hasRole(role: UserRole): boolean {
    return this.sessionSubject.value?.user.role === role;
  }

  setSession(session: AuthSession): void {
    this.sessionSubject.next(session);
    writeStorageItem(APP_STORAGE_KEYS.session, session);
  }

  clearSession(): void {
    this.sessionSubject.next(null);
    removeStorageItem(APP_STORAGE_KEYS.session);
  }
}
