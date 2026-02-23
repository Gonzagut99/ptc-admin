"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { FetchError } from "../lib/api/types/backend";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // No reintentar en errores de validación (4xx)
              if (error && typeof error === "object" && "statusCode" in error) {
                const fetchError = error as unknown as FetchError;
                if (
                  fetchError.statusCode >= 400 &&
                  fetchError.statusCode < 500
                ) {
                  return false;
                }
              }
              return failureCount < 3;
            },
            refetchOnWindowFocus:
              process.env.NEXT_PUBLIC_ENVIRONMENT === "production",
            staleTime: 5 * 60 * 1000, // 5 minutos
          },
          mutations: {
            retry: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (error) {
              const fetchError = error as unknown as FetchError;
              
              // Skip 401 handling for auth session queries - these are handled by AuthProvider
              const isAuthQuery = query.queryKey?.[0] === "auth" && query.queryKey?.[1] === "session";
              
              if (fetchError.statusCode === 401 && !isAuthQuery) {
                // Only show toast and redirect for non-auth queries with 401
                // The enhancedFetch in backend.ts handles token refresh automatically
                console.log("[QueryProvider] 401 error on non-auth query, letting enhancedFetch handle it");
              }
              if (fetchError.statusCode === 500) {
                toast.error("Internal Server Error!");
                router.push("/500");
              }
              if (fetchError.statusCode === 403) {
                // router.navigate("/forbidden", { replace: true });
              }
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
