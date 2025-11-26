import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import { paths } from "./api";

// This is the result of the last optimized error management defined in the backend
export type FetchErrorResponse = {
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

export type FetchError = typeof Error & FetchErrorResponse;

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set");
}

export const backendUrl = (
  baseUrl: string,
  version?: string,
  endpoint?: string
) => {
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  if (version && version.startsWith("/")) {
    version = version.slice(1);
  }

  if (endpoint && endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const base = version ? `${baseUrl}/${version}` : baseUrl;
  const complete = endpoint ? `${base}/${endpoint}` : base;
  return complete;
};

/**
 * Custom fetch implementation that includes credentials and handles errors
 */
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
  } catch (e) {
    throw e;
  }
  return response;
};

/**
 * Custom query serializer that handles nested objects properly
 */
function customQuerySerializer(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object" && !Array.isArray(value)) {
        // For requestDto, flatten the object properties
        if (key === "requestDto") {
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            if (nestedValue !== undefined && nestedValue !== null) {
              searchParams.append(nestedKey, String(nestedValue));
            }
          });
        } else {
          // Serialize other nested objects as JSON string
          searchParams.append(key, JSON.stringify(value));
        }
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

/**
 * Client for connecting with the backend
 */
const fetchClient = createFetchClient<paths>({
  baseUrl: backendUrl(BACKEND_URL),
  fetch: enhancedFetch,
  // querySerializer: customQuerySerializer,
});

export const backend = createClient(fetchClient);
