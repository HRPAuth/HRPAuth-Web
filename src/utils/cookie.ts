import type { CookieOptions } from '../global';

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  const { expires, maxAge, domain, path = '/', secure, httpOnly, sameSite = 'lax' } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  cookieString += `; path=${path}`;

  if (secure) {
    cookieString += '; secure';
  }

  if (httpOnly) {
    cookieString += '; httponly';
  }

  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
}

export function getCookie(name: string): string | null {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
}

export function deleteCookie(name: string, options: Pick<CookieOptions, 'domain' | 'path'> = {}): void {
  const { domain, path = '/' } = options;

  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  cookieString += `; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
}

export function setAuthCookies(email: string, token: string): void {
  const farFuture = new Date();
  farFuture.setFullYear(farFuture.getFullYear() + 10);

  setCookie('user_email', email, {
    expires: farFuture,
    path: '/',
    sameSite: 'lax',
    secure: window.location.protocol === 'https'
  });

  setCookie('auth_token', token, {
    expires: farFuture,
    path: '/',
    sameSite: 'lax',
    secure: window.location.protocol === 'https'
  });
}

export function clearAuthCookies(): void {
  deleteCookie('user_email');
  deleteCookie('auth_token');
}

export function getAuthToken(): string | null {
  return getCookie('auth_token');
}

export function getUserEmail(): string | null {
  return getCookie('user_email');
}