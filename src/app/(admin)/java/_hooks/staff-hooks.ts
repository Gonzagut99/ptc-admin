"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backendJava } from "@/lib/api-java/backend";
import { buildJavaErrorMessage } from "@/lib/api-java/errors";
import { useZeroBasedPagination } from "@/hooks/use-zero-based-pagination";

export const useJavaStaff = () => {
  const { pageIndex, pageSize, setPagination, resetPagination } =
    useZeroBasedPagination();

  const query = backendJava.useQuery("get", "/staff/paginados", {
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

export const useAllJavaStaff = () => {
  const query = backendJava.useQuery("get", "/staff/paginados", {
    params: {
      query: {
        requestDto: { page: 0, size: 1000 },
      },
    },
  });

  return {
    staff: query.data?.content ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useJavaStaffById = (id: number) => {
  return backendJava.useQuery("get", "/staff/{id}", {
    params: {
      path: { id },
    },
  });
};

export const useJavaStaffByRole = (role: string) => {
  return backendJava.useQuery("get", "/staff/by-role/{role}", {
    params: {
      path: { role },
    },
  });
};

export const useCreateJavaStaff = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("post", "/staff", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/staff/paginados"],
      });
      toast.success("Miembro del personal creado correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(error, "Ocurrió un error al crear el staff"),
      );
    },
  });
};

export const useCreateJavaUserWithStaff = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("post", "/staff/with-user", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/staff/paginados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get", "/users/paginados"],
      });
      toast.success("Usuario y perfil de staff creados correctamente");
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
