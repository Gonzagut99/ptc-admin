"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useSyncExternalStore,
  useEffect,
  useState,
} from "react";
import type { UserInfoDto } from "@/lib/api-java/auth-types";
import { 
  validateAndRefreshSession, 
  isAccessTokenExpired,
  getRefreshToken,
  getStoredUser,
} from "@/lib/api-java/auth-client";
import { backendJava, markSessionValidated, resetSessionValidation } from "@/lib/api-java/backend";

interface AuthContextType {
  session: { user?: UserInfoDto } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSessionReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isValidatingSession, setIsValidatingSession] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);

  // Validate and refresh session BEFORE enabling the query
  useEffect(() => {
    console.log("🚀 [AuthProvider] useEffect started");
    
    const validateSession = async () => {
      const hasRefreshToken = !!getRefreshToken();
      console.log("🔍 [AuthProvider] hasRefreshToken:", hasRefreshToken);
      
      // If no refresh token, skip validation
      if (!hasRefreshToken) {
        console.log("[AuthProvider] No refresh token, skipping validation");
        setIsValidatingSession(false);
        setSessionReady(true);
        markSessionValidated(); // Signal that validation is complete
        console.log("✅ [AuthProvider] markSessionValidated called (no refresh token)");
        return;
      }

      const tokenExpired = isAccessTokenExpired(120);
      console.log("🔍 [AuthProvider] tokenExpired:", tokenExpired);

      // If token is expired or about to expire, refresh first
      if (tokenExpired) {
        console.log("[AuthProvider] Token expired or expiring, attempting to refresh...");
        const isValid = await validateAndRefreshSession();
        
        if (isValid) {
          console.log("[AuthProvider] Session refreshed successfully");
        } else {
          console.log("[AuthProvider] Session validation failed, user needs to re-login");
        }
      } else {
        console.log("[AuthProvider] Token is still valid");
      }
      
      setIsValidatingSession(false);
      setSessionReady(true);
      markSessionValidated(); // Signal that validation is complete
      console.log("✅ [AuthProvider] markSessionValidated called (after validation)");
    };

    validateSession();
  }, []);

  // Only enable session query after validation is complete
  const { data: user, isLoading, isFetched } = backendJava.useQuery(
    "get",
    "/auth/me",
    {},
    {
      queryKey: ["auth", "session"],
      // Only enable after session validation is complete and token is valid
      enabled: sessionReady && !isAccessTokenExpired(30),
      retry: (failureCount, error) => {
        // Don't retry on 401 errors
        if ((error as { status?: number })?.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
      retryOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      initialData: () => getStoredUser() as UserInfoDto | undefined,
    },
  );

  // Prevent hydration mismatch by ensuring server and client render the same initially
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const session = user ? { user } : null;
  const isActuallyLoading = isValidatingSession || (!sessionReady) || (sessionReady && isLoading && !isFetched);

  return (
    <AuthContext.Provider
      value={{
        session: isMounted ? session : null,
        isLoading: isMounted ? isActuallyLoading : true,
        isAuthenticated: isMounted ? !!user : false,
        isSessionReady: isMounted ? sessionReady : false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook to wait for session to be ready before making authenticated requests
 */
export function useSessionReady() {
  const { isSessionReady } = useAuth();
  return isSessionReady;
}
