"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSession } from "@/app/auth/log-in/_hooks/auth-hooks";
import type { UserInfoDto } from "@/lib/api-java/auth-types";

type SettingsSessionContextType = {
  session: UserInfoDto | undefined;
  isLoading: boolean;
};

const SettingsSessionContext = createContext<
  SettingsSessionContextType | undefined
>(undefined);

export function SettingsSessionProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Una sola consulta de sesión para todos los componentes de settings
  const { data: session, isLoading: isQueryLoading } = useSession();

  // Esperar hasta que el componente esté montado en el cliente
  // para evitar errores de hidratación con localStorage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Considerar como "cargando" si no está montado o si la query está cargando
  const isLoading = !isMounted || isQueryLoading;

  return (
    <SettingsSessionContext.Provider value={{ session: isMounted ? session : undefined, isLoading }}>
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
