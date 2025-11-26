import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "./api-java";

export type JavaFetchErrorResponse = {
  statusCode: number;
  message: string;
  error: unknown;
  id?: string;
  category?: string;
  severity?: string;
  timestamp?: string;
  path?: string;
  method?: string;
};

export type JavaFetchError = typeof Error & JavaFetchErrorResponse;

const JAVA_BACKEND_URL =
  process.env.NEXT_PUBLIC_JAVA_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

if (!JAVA_BACKEND_URL) {
  throw new Error(
    "NEXT_PUBLIC_JAVA_API_URL (o NEXT_PUBLIC_API_URL) environment variable is not set",
  );
}

export const backendUrl = (
  baseUrl: string,
  version?: string,
  endpoint?: string,
) => {
  let normalizedBase = baseUrl;
  let normalizedVersion = version;
  let normalizedEndpoint = endpoint;

  if (normalizedBase.endsWith("/")) {
    normalizedBase = normalizedBase.slice(0, -1);
  }
  if (normalizedVersion && normalizedVersion.startsWith("/")) {
    normalizedVersion = normalizedVersion.slice(1);
  }
  if (normalizedEndpoint && normalizedEndpoint.startsWith("/")) {
    normalizedEndpoint = normalizedEndpoint.slice(1);
  }

  const base = normalizedVersion
    ? `${normalizedBase}/${normalizedVersion}`
    : normalizedBase;
  const complete = normalizedEndpoint ? `${base}/${normalizedEndpoint}` : base;
  return complete;
};

export const enhancedFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
) => {
  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      credentials: "include",
    });
  } catch (error) {
    throw error;
  }

  return response;
};

function customQuerySerializer(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof value === "object" && !Array.isArray(value)) {
      if (key === "requestDto") {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (nestedValue !== undefined && nestedValue !== null) {
            searchParams.append(nestedKey, String(nestedValue));
          }
        });
      } else {
        searchParams.append(key, JSON.stringify(value));
      }
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

const fetchClient = createFetchClient<paths>({
  baseUrl: backendUrl(JAVA_BACKEND_URL),
  fetch: enhancedFetch,
  querySerializer: customQuerySerializer,
});

export const backendJava = createClient(fetchClient);
