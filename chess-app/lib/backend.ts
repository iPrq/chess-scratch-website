const DEFAULT_BACKEND_URL = "https://iprq-checkmateapp.hf.space";

export const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/+$/, "");

export function backendUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_BASE_URL}${normalizedPath}`;
}