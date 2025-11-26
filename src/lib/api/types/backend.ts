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

export const backendUrl = (baseUrl: string, version?: string) => {
  return version ? `${baseUrl}/${version}` : baseUrl;
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
 * Client for connecting with the backend
 */
const fetchClient = createFetchClient<paths>({
  baseUrl: backendUrl(BACKEND_URL),
  fetch: enhancedFetch,
});

export const backend = createClient(fetchClient);
