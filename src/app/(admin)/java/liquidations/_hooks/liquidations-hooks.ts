"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { useZeroBasedPagination } from "@/hooks/use-zero-based-pagination";
import { backendJava } from "@/lib/api-java/backend";
import { buildJavaErrorMessage } from "@/lib/api-java/errors";
import {
  mapJavaPaginatedResponse,
  createJavaServerPaginationConfig,
} from "@/lib/api-java/pagination";
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
        requestDto: {
          page: pageIndex,
          size: pageSize,
        },
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
          requestDto: {
            page: pageIndex,
            size: pageSize,
          },
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
          requestDto: {
            page: pageIndex,
            size: pageSize,
          },
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
