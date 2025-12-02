"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { useZeroBasedPagination } from "@/hooks/use-zero-based-pagination";
import { getAccessToken } from "@/lib/api-java/auth-client";
import { backendJava } from "@/lib/api-java/backend";
import { buildJavaErrorMessage } from "@/lib/api-java/errors";
import {
  mapJavaPaginatedResponse,
  createJavaServerPaginationConfig,
} from "@/lib/api-java/pagination";
import { createPaginationRequestDto } from "@/lib/api-java/pagination-utils";
import { LiquidationStatus } from "../_types/liquidations.types";

export const useGetLiquidations = () => {
  const { pageIndex, pageSize, setPagination, resetPagination } =
    useZeroBasedPagination();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const debouncedSetSearch = useDebouncedCallback((searchValue: string) => {
    setSearch(searchValue);
    resetPagination();
  }, 500);

  const updateSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    debouncedSetSearch(searchValue);
  };

  const query = backendJava.useQuery("get", "/liquidations/paginated", {
    params: {
      query: {
        requestDto: createPaginationRequestDto(pageIndex, pageSize),
      },
    },
  });

  // Mapear la respuesta paginada de Java
  const paginatedData = mapJavaPaginatedResponse(query.data);

  // Crear configuración de paginación para el servidor
  const serverPagination = createJavaServerPaginationConfig(
    paginatedData.meta,
    (newPageIndex, newPageSize) => {
      setPagination({ newPageIndex, newPageSize });
    },
  );

  return {
    query,
    data: paginatedData.data,
    meta: paginatedData.meta,
    serverPagination,
    pageIndex,
    pageSize,
    setPagination,
    searchTerm,
    search,
    setSearch: updateSearch,
    resetPagination,
  };
};

export const useGetLiquidation = (liquidationId: number) => {
  return backendJava.useQuery(
    "get",
    "/liquidations/{liquidationId}",
    {
      params: {
        path: { liquidationId },
      },
    },
    {
      enabled: liquidationId > 0,
    },
  );
};

export const useGetLiquidationsByStatus = (status: LiquidationStatus) => {
  const { pageIndex, pageSize, setPagination, resetPagination } =
    useZeroBasedPagination();

  const query = backendJava.useQuery(
    "get",
    "/liquidations/status/{status}",
    {
      params: {
        path: { status },
        query: {
          requestDto: createPaginationRequestDto(pageIndex, pageSize),
        },
      },
    },
    {
      enabled: !!status,
    },
  );

  const paginatedData = mapJavaPaginatedResponse(query.data);

  const serverPagination = createJavaServerPaginationConfig(
    paginatedData.meta,
    (newPageIndex, newPageSize) => {
      setPagination({ newPageIndex, newPageSize });
    },
  );

  return {
    query,
    data: paginatedData.data,
    meta: paginatedData.meta,
    serverPagination,
    pageIndex,
    pageSize,
    setPagination,
    resetPagination,
  };
};

export const useGetLiquidationsByCustomer = (customerId: number) => {
  const { pageIndex, pageSize, setPagination, resetPagination } =
    useZeroBasedPagination();

  const query = backendJava.useQuery(
    "get",
    "/liquidations/customer/{customerId}",
    {
      params: {
        path: { customerId },
        query: {
          requestDto: createPaginationRequestDto(pageIndex, pageSize),
        },
      },
    },
    {
      enabled: customerId > 0,
    },
  );

  const paginatedData = mapJavaPaginatedResponse(query.data);

  const serverPagination = createJavaServerPaginationConfig(
    paginatedData.meta,
    (newPageIndex, newPageSize) => {
      setPagination({ newPageIndex, newPageSize });
    },
  );

  return {
    query,
    data: paginatedData.data,
    meta: paginatedData.meta,
    serverPagination,
    pageIndex,
    pageSize,
    setPagination,
    resetPagination,
  };
};

const invalidateLiquidationQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  liquidationId: number,
) => {
  queryClient.invalidateQueries({
    queryKey: ["get", "/liquidations/{liquidationId}", { liquidationId }],
  });
  queryClient.invalidateQueries({
    queryKey: ["get", "/liquidations/paginated"],
  });
};

export const useCreateLiquidation = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("post", "/liquidations", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/liquidations/paginated"],
      });
      toast.success("Liquidación creada correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(
          error,
          "Ocurrió un error al crear la liquidación",
        ),
      );
    },
  });
};

export const useAddTourService = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/tour-services",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Servicio de tour agregado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al agregar el servicio de tour",
          ),
        );
      },
    },
  );
};

export const useAddHotelService = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/hotel-services",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Servicio de hotel agregado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al agregar el servicio de hotel",
          ),
        );
      },
    },
  );
};

export const useAddFlightService = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/flight-services",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Servicio de vuelo agregado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al agregar el servicio de vuelo",
          ),
        );
      },
    },
  );
};

export const useAddAdditionalService = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/additional-services",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Servicio adicional agregado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al agregar el servicio adicional",
          ),
        );
      },
    },
  );
};

export const useAddPayment = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/payments",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Pago registrado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(error, "Ocurrió un error al registrar el pago"),
        );
      },
    },
  );
};

export const useAddIncidency = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/incidencies",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Incidencia reportada correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al reportar la incidencia",
          ),
        );
      },
    },
  );
};

// ==================== DEACTIVATE HOOKS ====================

export const useDeactivateLiquidation = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "delete",
    "/liquidations/{liquidationId}",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/paginated"],
        });
        toast.success("Liquidación desactivada correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al desactivar la liquidación",
          ),
        );
      },
    },
  );
};

export const useDeactivateTour = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "delete",
    "/liquidations/{liquidationId}/tour-services/{tourServiceId}/tours/{tourId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Tour desactivado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al desactivar el tour",
          ),
        );
      },
    },
  );
};

export const useDeactivateHotelBooking = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "delete",
    "/liquidations/{liquidationId}/hotel-services/{hotelServiceId}/bookings/{hotelBookingId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Reserva de hotel desactivada correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al desactivar la reserva de hotel",
          ),
        );
      },
    },
  );
};

export const useDeactivateFlightBooking = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "delete",
    "/liquidations/{liquidationId}/flight-services/{flightServiceId}/bookings/{flightBookingId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Reserva de vuelo desactivada correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al desactivar la reserva de vuelo",
          ),
        );
      },
    },
  );
};

export const useDeactivateAdditionalService = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "delete",
    "/liquidations/{liquidationId}/additional-services/{additionalServiceId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Servicio adicional desactivado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al desactivar el servicio adicional",
          ),
        );
      },
    },
  );
};

export const useDeactivatePayment = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "delete",
    "/liquidations/{liquidationId}/payments/{paymentId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Pago desactivado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al desactivar el pago",
          ),
        );
      },
    },
  );
};

export const useDeactivateIncidency = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "delete",
    "/liquidations/{liquidationId}/incidencies/{incidencyId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Incidencia desactivada correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al desactivar la incidencia",
          ),
        );
      },
    },
  );
};

// ==================== UPDATE HOOKS ====================

export const useUpdateTour = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "put",
    "/liquidations/{liquidationId}/tour-services/{tourServiceId}/tours/{tourId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Tour actualizado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al actualizar el tour",
          ),
        );
      },
    },
  );
};

export const useUpdateHotelBooking = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "put",
    "/liquidations/{liquidationId}/hotel-services/{hotelServiceId}/bookings/{hotelBookingId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Reserva de hotel actualizada correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al actualizar la reserva de hotel",
          ),
        );
      },
    },
  );
};

export const useUpdateFlightBooking = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "put",
    "/liquidations/{liquidationId}/flight-services/{flightServiceId}/bookings/{flightBookingId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Reserva de vuelo actualizada correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al actualizar la reserva de vuelo",
          ),
        );
      },
    },
  );
};

export const useUpdateAdditionalService = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "put",
    "/liquidations/{liquidationId}/additional-services/{additionalServiceId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Servicio adicional actualizado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al actualizar el servicio adicional",
          ),
        );
      },
    },
  );
};

export const useUpdatePayment = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "put",
    "/liquidations/{liquidationId}/payments/{paymentId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Pago actualizado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al actualizar el pago",
          ),
        );
      },
    },
  );
};

export const useUpdateIncidency = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "put",
    "/liquidations/{liquidationId}/incidencies/{incidencyId}",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Incidencia actualizada correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al actualizar la incidencia",
          ),
        );
      },
    },
  );
};

// ==================== STATUS TRANSITION HOOKS ====================

export const useUpdateLiquidationStatus = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "put",
    "/liquidations/{liquidationId}/status",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Estado de liquidación actualizado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al actualizar el estado de la liquidación",
          ),
        );
      },
    },
  );
};

export const useUpdatePaymentStatus = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "put",
    "/liquidations/{liquidationId}/payment-status",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Estado de pago actualizado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al actualizar el estado de pago",
          ),
        );
      },
    },
  );
};

// Función para descargar el PDF de cotización
export const downloadQuotePdf = async (liquidationId: number) => {
  const JAVA_BACKEND_URL =
    process.env.NEXT_PUBLIC_JAVA_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!JAVA_BACKEND_URL) {
    toast.error("URL del backend no configurada");
    return;
  }

  try {
    // Obtener el token de acceso usando la función del auth-client
    const token = getAccessToken();

    if (!token) {
      toast.error("No hay sesión activa. Por favor, inicie sesión nuevamente.");
      return;
    }

    const response = await fetch(
      `${JAVA_BACKEND_URL}/liquidations/${liquidationId}/quote-pdf`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      if (response.status === 400) {
        toast.error("La liquidación debe estar en estado 'En cotización' para descargar el PDF");
        return;
      }
      if (response.status === 404) {
        toast.error("Liquidación no encontrada");
        return;
      }
      throw new Error("Error al descargar el PDF");
    }

    // Obtener el blob del PDF
    const blob = await response.blob();

    // Crear URL temporal y descargar
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cotizacion_${String(liquidationId).padStart(6, "0")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("PDF descargado correctamente");
  } catch (error) {
    console.error("Error downloading PDF:", error);
    toast.error("Error al descargar el PDF de cotización");
  }
};
