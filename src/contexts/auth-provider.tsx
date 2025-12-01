"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useSyncExternalStore,
} from "react";
import { useSession } from "@/app/auth/log-in/_hooks/auth-hooks";
import type { UserInfoDto } from "@/lib/api-java/auth-types";

interface AuthContextType {
  session: { user?: UserInfoDto } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isFetched } = useSession();

  // Prevent hydration mismatch by ensuring server and client render the same initially
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const session = user ? { user } : null;

  return (
    <AuthContext.Provider
      value={{
        session: isMounted ? session : null,
        isLoading: isMounted ? (isLoading || !isFetched) : true,
        isAuthenticated: isMounted ? !!user : false,
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
