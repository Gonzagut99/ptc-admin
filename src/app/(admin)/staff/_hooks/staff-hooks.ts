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

export const useGetStaff = () => {
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
    "/staff/paginados",
    {
      params: {
        query: {
          requestDto: createPaginationRequestDto(pageIndex, pageSize),
        },
      },
    },
    {
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

export const useGetStaffById = (id: number) => {
  const isSessionReady = useSessionReady();
  return backendJava.useQuery(
    "get",
    "/staff/{id}",
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

export const useGetStaffByRole = (role: string) => {
  const isSessionReady = useSessionReady();
  return backendJava.useQuery(
    "get",
    "/staff/by-role/{role}",
    {
      params: {
        path: { role },
      },
    },
    {
      enabled: !!role && isSessionReady,
    },
  );
};

export const useAllStaff = () => {
  const isSessionReady = useSessionReady();
  const query = backendJava.useQuery(
    "get",
    "/staff/paginados",
    {
      params: {
        query: {
          requestDto: createPaginationRequestDto(0, 1000),
        },
      },
    },
    {
      enabled: isSessionReady,
    }
  );

  return {
    staff: query.data?.content ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("post", "/staff", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/staff/paginados"],
      });
      toast.success("Staff creado correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(error, "Ocurrió un error al crear el staff"),
      );
    },
  });
};

export const useCreateUserWithStaff = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("post", "/staff/with-user", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/staff/paginados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get", "/users/paginados"],
      });
      toast.success("Usuario y staff creados correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(
          error,
          "Ocurrió un error al crear el usuario con staff",
        ),
      );
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("put", "/staff/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/staff/paginados"],
      });
      toast.success("Personal actualizado correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(error, "Ocurrió un error al actualizar el personal"),
      );
    },
  });
};

export const useDeactivateStaff = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("delete", "/staff/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/staff/paginados"],
      });
      toast.success("Personal desactivado correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(error, "Ocurrió un error al desactivar el personal"),
      );
    },
  });
};
