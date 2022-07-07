const DEFAULT_OPTIONS = {
  credentials: "include" as RequestCredentials,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const API_ROOT = "http://localhost:8000";

export async function ft(url: string, options?: RequestInit) {
  return fetch(
    API_ROOT + url,
    options
      ? {
          ...DEFAULT_OPTIONS,
          ...options,
        }
      : DEFAULT_OPTIONS
  );
}
