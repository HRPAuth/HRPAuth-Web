declare global {
  interface Window {
    BACKEND_URL: string;
  }
}

export {};

// Allow importing CSS files in TypeScript
declare module '*.css';
