import backendConfig from '../../config/backend.json';

export interface BackendConfig {
  baseUrl: string;
}

export function getBackendUrl(): string {
  return backendConfig.baseUrl.replace(/\/$/, '');
}

export function getApiUrl(endpoint: string): string {
  const base = getBackendUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return base + cleanEndpoint;
}
