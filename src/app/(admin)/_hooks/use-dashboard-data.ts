"use client";

import { backendJava } from "@/lib/api-java/backend";
import { mapJavaPaginatedResponse } from "@/lib/api-java/pagination";
import { useSessionReady } from "@/contexts/auth-provider";

/**
 * Hook para obtener datos para el dashboard
 * Obtiene todas las liquidaciones para calcular estadísticas
 * 
 * NOTA: En producción, esto debería ser un endpoint específico de estadísticas
 * que calcule los datos en el backend para mejor rendimiento.
 */
export const useDashboardData = () => {
  const isSessionReady = useSessionReady();
  
  // Obtener liquidaciones con un tamaño grande para el dashboard
  // Usamos size=500 para asegurar traer suficientes datos
  const liquidationsQuery = backendJava.useQuery(
    "get",
    "/liquidations/paginated",
    {
      params: {
        query: {
          requestDto: {
            page: 1,    // Primera página (1-indexed)
            size: 500,  // Traer hasta 500 registros para el dashboard
          },
        },
      },
    },
    {
      // Wait for session to be ready before making the request
      enabled: isSessionReady,
    }
  );

  const paginatedData = mapJavaPaginatedResponse(liquidationsQuery.data);

  // Debug: ver cuántos registros se obtuvieron
  if (paginatedData.data.length > 0) {
    console.log(`Dashboard: ${paginatedData.data.length} liquidaciones cargadas de ${paginatedData.meta.total} totales`);
  }

  return {
    liquidations: paginatedData.data,
    totalCount: paginatedData.meta.total,
    isLoading: liquidationsQuery.isLoading,
    error: liquidationsQuery.error,
    refetch: liquidationsQuery.refetch,
  };
};
