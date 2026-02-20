declare global {
  interface Window {
    BACKEND_URL?: string;
  }
}

export {};

// Allow importing CSS files in TypeScript
declare module '*.css';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  uid: string;
}

export interface LoginError {
  success: false;
  message: string;
}

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}
