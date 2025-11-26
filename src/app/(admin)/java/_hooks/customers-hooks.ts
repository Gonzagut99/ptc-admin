"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backendJava } from "@/lib/api-java/backend";
import { buildJavaErrorMessage } from "@/lib/api-java/errors";
import { useZeroBasedPagination } from "@/hooks/use-zero-based-pagination";

export const useJavaCustomers = () => {
  const { pageIndex, pageSize, setPagination, resetPagination } =
    useZeroBasedPagination();

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

  return {
    query,
    pageIndex,
    pageSize,
    setPagination,
    resetPagination,
  };
};

export const useCreateJavaCustomer = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("post", "/clientes", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/clientes/paginados"],
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

export const useAllJavaCustomers = () => {
  const query = backendJava.useQuery("get", "/clientes");

  return {
    customers: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
