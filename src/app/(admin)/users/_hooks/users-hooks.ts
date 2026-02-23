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
import { useSessionReady } from "@/contexts/auth-provider";

export const useGetUsers = () => {
  const isSessionReady = useSessionReady();
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

  const query = backendJava.useQuery(
    "get",
    "/users/paginados",
    {
      params: {
        query: {
          requestDto: createPaginationRequestDto(pageIndex, pageSize),
        },
      },
    },
    {
      // Wait for session to be ready before making the request
      enabled: isSessionReady,
    }
  );

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

export const useGetUser = (id: number) => {
  const isSessionReady = useSessionReady();
  return backendJava.useQuery(
    "get",
    "/users/{id}",
    {
      params: {
        path: { id },
      },
    },
    {
      enabled: id > 0 && isSessionReady,
    },
  );
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("post", "/users", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/users/paginados"],
      });
      toast.success("Usuario creado correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(error, "Ocurrió un error al crear el usuario"),
      );
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("put", "/users/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/users/paginados"],
      });
      toast.success("Usuario actualizado correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(error, "Ocurrió un error al actualizar el usuario"),
      );
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("delete", "/users/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/users/paginados"],
      });
      toast.success("Usuario desactivado correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(error, "Ocurrió un error al desactivar el usuario"),
      );
    },
  });
};
