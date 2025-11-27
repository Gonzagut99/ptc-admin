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

export interface CustomerFilters {
  idDocumentType?: "PASSPORT" | "DNI" | "DRIVER_LICENSE" | "RUC" | "CE";
}

export const useGetCustomers = () => {
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

  const query = backendJava.useQuery("get", "/clientes/paginados", {
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

export const useGetCustomer = (id: number) => {
  // Nota: Si tu backend Java tiene un endpoint para obtener un cliente por ID,
  // deberías usarlo aquí. Por ahora, usamos los datos de la lista.
  return backendJava.useQuery(
    "get",
    "/clientes",
    {},
    {
      enabled: id > 0,
      select: (data) => data?.find((customer) => customer.id === id),
    },
  );
};

export const useAllCustomers = () => {
  const query = backendJava.useQuery("get", "/clientes");

  return {
    customers: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("post", "/clientes", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/clientes/paginados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get", "/clientes"],
      });
      toast.success("Cliente creado correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(error, "Ocurrió un error al crear el cliente"),
      );
    },
  });
};
