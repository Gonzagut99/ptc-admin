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
import { createPaginationRequestDto } from "@/lib/api-java/pagination-utils";

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

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("put", "/clientes/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/clientes/paginados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get", "/clientes"],
      });
      toast.success("Cliente actualizado correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(error, "Ocurrió un error al actualizar el cliente"),
      );
    },
  });
};

export const useDeactivateCustomer = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("delete", "/clientes/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/clientes/paginados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get", "/clientes"],
      });
      toast.success("Cliente desactivado correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(error, "Ocurrió un error al desactivar el cliente"),
      );
    },
  });
};
