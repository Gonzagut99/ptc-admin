"use client";

import { createContext, ReactNode, useContext } from "react";
import { useSession } from "@/app/auth/log-in/_hooks/auth-hooks";
import { SessionResponse } from "../_types/auth.types";

type SettingsSessionContextType = {
  session: SessionResponse | undefined;
  isLoading: boolean;
};

const SettingsSessionContext = createContext<
  SettingsSessionContextType | undefined
>(undefined);

export function SettingsSessionProvider({ children }: { children: ReactNode }) {
  // Una sola consulta de sesión para todos los componentes de settings
  const { data: session, isLoading } = useSession();

  return (
    <SettingsSessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SettingsSessionContext.Provider>
  );
}

export function useSettingsSession() {
  const context = useContext(SettingsSessionContext);
  if (context === undefined) {
    throw new Error(
      "useSettingsSession must be used within a SettingsSessionProvider",
    );
  }
  return context;
}
