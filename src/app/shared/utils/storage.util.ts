export function readStorageItem<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function writeStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(key);
}
