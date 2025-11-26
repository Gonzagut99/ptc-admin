"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { ToastErrorMessage } from "@/components/errors/error-for-toast";
import { useFilters } from "@/hooks/use-filters";
import { usePagination } from "@/hooks/use-pagination";
import { backend } from "@/lib/api/types/backend";
import { UserDetailResponse } from "../_types/users.types";

export interface UserFilters {
  isActive?: boolean;
  roles?: string[];
  createdAtFrom?: Date;
  createdAtTo?: Date;
}
export const useGetUsers = ({
  includeInactive,
}: {
  includeInactive?: boolean;
}) => {
  const { page, size, setPagination, resetPagination } = usePagination();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [search, setSearch] = useState<string>(searchTerm);
  const { filters, updateFilters, updateFilter, clearFilters } =
    useFilters<UserFilters>();

  const debouncedSetSearch = useDebouncedCallback((searchValue: string) => {
    setSearch(searchValue);
    resetPagination();
  }, 500);

  const query = backend.useQuery("get", "/api/user", {
    params: {
      query: {
        page,
        size,
        ...(search.trim() && { search: search.trim() }),
        ...(filters?.isActive !== undefined && {
          isActive: filters.isActive,
        }),
        ...(includeInactive !== undefined && { includeInactive }),
        ...(filters?.roles &&
          filters.roles.length > 0 && { roles: filters.roles }),
        ...(filters?.createdAtFrom && {
          createdAtFrom: filters.createdAtFrom.toISOString(),
        }),
        ...(filters?.createdAtTo && {
          createdAtTo: filters.createdAtTo.toISOString(),
        }),
      },
    },
  });

  const updateSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    debouncedSetSearch(searchValue);
  };

  const updateFiltersFn = (newFilters: UserFilters) => {
    updateFilters(newFilters);
    resetPagination();
  };

  const updateFilterFn = (
    key: keyof UserFilters,
    value: UserFilters[keyof UserFilters],
  ) => {
    updateFilter(key, value);
    resetPagination();
  };

  const clearFiltersFn = () => {
    clearFilters();
    resetPagination();
  };

  return {
    query,
    page,
    size,
    setPagination,
    searchTerm, // Para mostrar en el input
    search, // Para enviar al endpoint
    setSearch: updateSearch,
    resetPagination,
    // Nuevos métodos para filtros
    filters,
    updateFilters: updateFiltersFn,
    updateFilter: updateFilterFn,
    clearFilters: clearFiltersFn,
  };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("post", "/api/user", {
    onSuccess: () => {
      toast.success("Usuario creado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/user") ?? false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useGetUser = (id: string) => {
  return backend.useQuery("get", "/api/user/{id}", {
    params: {
      path: { id },
    },
    query: {
      enabled: !!id,
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("patch", "/api/user/{id}", {
    onSuccess: () => {
      toast.success("Usuario actualizado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/user") ?? false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("delete", "/api/user/{id}", {
    onSuccess: () => {
      toast.success("Usuario eliminado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/user") ?? false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useDeactiveToggleUser = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("patch", "/api/user/{id}/deactive-toggle", {
    onSuccess: (data: UserDetailResponse) => {
      toast.success(
        `Usuario ${data.isActive ? "activado" : "desactivado"} correctamente`,
      );
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/user") ?? false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};
