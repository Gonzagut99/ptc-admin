"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backendJava } from "@/lib/api-java/backend";
import { buildJavaErrorMessage } from "@/lib/api-java/errors";
import { useZeroBasedPagination } from "@/hooks/use-zero-based-pagination";

export const useJavaUsers = () => {
  const { pageIndex, pageSize, setPagination, resetPagination } =
    useZeroBasedPagination();

  const query = backendJava.useQuery("get", "/users/paginados", {
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

export const useJavaUserById = (id: number) => {
  return backendJava.useQuery("get", "/users/{id}", {
    params: {
      path: { id },
    },
  });
};

export const useCreateJavaUser = () => {
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
