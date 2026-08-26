import {
  customFetch,
  setBaseUrl,
  type CustomFetchOptions,
} from "@workspace/api-client-react";

function resolveApiOrigin(): string {
  const configuredOrigin = import.meta.env.VITE_API_ORIGIN?.trim();
  const url = new URL(configuredOrigin || window.location.origin);

  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("VITE_API_ORIGIN must contain an origin without a path");
  }

  return url.origin;
}

export const apiOrigin = resolveApiOrigin();

setBaseUrl(apiOrigin);

export function apiFetch<T>(
  path: `/api/${string}`,
  options: CustomFetchOptions = {},
): Promise<T> {
  return customFetch<T>(path, options);
}