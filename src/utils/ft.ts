const JSON_TYPE = "application/json";

const DEFAULT_OPTIONS = {
  credentials: "include" as RequestCredentials,
  headers: {
    Accept: JSON_TYPE,
    "Content-Type": JSON_TYPE,
  },
};

const API_ROOT = process.env.API_ROOT;

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
