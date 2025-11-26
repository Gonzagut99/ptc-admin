"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { ToastErrorMessage } from "@/components/errors/error-for-toast";
import { useFilters } from "@/hooks/use-filters";
import { usePagination } from "@/hooks/use-pagination";
import { backend } from "@/lib/api/types/backend";
import { RoleDetailResponse } from "../_types/roles.types";

export interface RoleFilters {
  isActive?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export const useGetRolesAndPermissions = ({
  includeInactive,
}: {
  includeInactive?: boolean;
}) => {
  const { page, size, setPagination, resetPagination } = usePagination();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [search, setSearch] = useState<string>(searchTerm);
  const { filters, updateFilters, updateFilter, clearFilters } =
    useFilters<RoleFilters>({});

  const debouncedSetSearch = useDebouncedCallback((searchValue: string) => {
    setSearch(searchValue);
    resetPagination();
  }, 500);

  const updateSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    debouncedSetSearch(searchValue);
  };

  const updateRoleFilters = (newFilters: RoleFilters) => {
    updateFilters(newFilters);
    resetPagination();
  };

  const updateRoleFilter = (
    key: keyof RoleFilters,
    value: RoleFilters[keyof RoleFilters],
  ) => {
    updateFilter(key, value);
    resetPagination();
  };

  const clearRoleFilters = () => {
    clearFilters();
    resetPagination();
  };

  const query = backend.useQuery("get", "/api/admin/roles", {
    queryKey: ["roles-paginated", page, size, search, filters], // QueryKey específico para query normal
    params: {
      query: {
        page,
        size,
        ...(search.trim() && { search: search.trim() }),
        ...(filters?.isActive !== undefined && {
          isActive: filters.isActive,
        }),
        ...(includeInactive !== undefined && { includeInactive }),
        ...(filters?.dateFrom && {
          dateFrom: filters.dateFrom.toISOString(),
        }),
        ...(filters?.dateTo && {
          dateTo: filters.dateTo.toISOString(),
        }),
      },
    },
  });

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
    updateFilters: updateRoleFilters,
    updateFilter: updateRoleFilter,
    clearFilters: clearRoleFilters,
  };
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("post", "/api/admin/roles", {
    onSuccess: () => {
      toast.success("Rol creado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/admin/roles") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useGetRole = (id: string) => {
  return backend.useQuery("get", "/api/admin/roles/{id}", {
    params: {
      path: { id },
    },
    query: {
      enabled: !!id,
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("put", "/api/admin/roles/{id}", {
    onSuccess: () => {
      toast.success("Rol actualizado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/admin/roles") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("delete", "/api/admin/roles/{id}", {
    onSuccess: () => {
      toast.success("Rol eliminado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/admin/roles") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useDeactivateToggleRole = () => {
  const queryClient = useQueryClient();
  return backend.useMutation(
    "post",
    "/api/admin/roles/{id}/deactivate-toggle",
    {
      onSuccess: (data: RoleDetailResponse) => {
        toast.success(
          `Rol ${data.isActive ? "activado" : "desactivado"} correctamente`,
        );
        queryClient.invalidateQueries({
          queryKey: ["get"],
          exact: false,
          predicate: (q) =>
            (q.queryKey[1] as string | undefined)?.includes(
              "/api/admin/roles",
            ) ?? false,
        });
      },
      onError: (error) => {
        toast.error(<ToastErrorMessage error={error} />);
      },
    },
  );
};

export const useRolesSearch = () => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const { size } = usePagination();
  const [ids, setIds] = useState<string[] | undefined>(undefined);
  const { filters, updateFilters } = useFilters<RoleFilters>();

  const query = backend.useInfiniteQuery(
    "get",
    "/api/admin/roles",
    {
      params: {
        query: {
          search,
          page: 1, // Este valor será reemplazado automáticamente por pageParam
          size,
          ids,
          ...(filters?.isActive !== undefined && {
            isActive: filters.isActive,
          }),
        },
      },
      queryKey: ["get", "/api/admin/roles", "infinite"], // QueryKey específico para infinite query
    },
    {
      getNextPageParam: (lastPage: any) => {
        // Validación robusta para evitar errores
        if (!lastPage || !lastPage.meta) {
          return undefined;
        }

        const { page, totalPages } = lastPage.meta;
        if (typeof page !== "number" || typeof totalPages !== "number") {
          return undefined;
        }

        // Si hay más páginas disponibles, devolver el siguiente número de página
        if (page < totalPages) {
          return page + 1;
        }
        return undefined; // No hay más páginas
      },
      getPreviousPageParam: (firstPage: any) => {
        // Validación robusta
        if (!firstPage || !firstPage.meta) {
          return undefined;
        }

        const { page } = firstPage.meta;
        if (typeof page !== "number") {
          return undefined;
        }

        // Si no estamos en la primera página, devolver la página anterior
        if (page > 1) {
          return page - 1;
        }
        return undefined; // No hay páginas anteriores
      },
      initialPageParam: 1,
      pageParamName: "page", // Esto le dice a openapi-react-query que use "page" como parámetro de paginación
      enabled: true, // Siempre habilitado
    },
  );

  // Obtener todos los elementos de todas las páginas de forma plana
  const allItems = query.data?.pages.flatMap((page) => page.data) || [];

  const handleSearchByIds = (ids: string[]) => {
    setIds(ids);
    //query.refetch();
  };

  const handleScrollEnd = useCallback(() => {
    if (search && search.trim().length > 0 && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [search, query]);

  const handleSearchChange = useCallback((value: string) => {
    if (value !== "None" && value !== null && value !== undefined) {
      setSearch(value.trim());
      updateFilters({
        isActive: undefined,
      });
    }
  }, []);

  return {
    query,
    allItems,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    handleSearchByIds,
    search,
    setSearch,
    handleScrollEnd,
    handleSearchChange,
    updateFilters,
  };
};
