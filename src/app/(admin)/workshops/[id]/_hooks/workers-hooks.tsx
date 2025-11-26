"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { ToastErrorMessage } from "@/components/errors/error-for-toast";
import { useFilters } from "@/hooks/use-filters";
import { usePagination } from "@/hooks/use-pagination";
import { backend } from "@/lib/api/types/backend";
import { WorkerResponse } from "../_types/workers.types";

export interface WorkerFilters {
  workshopId?: string;
  isActive?: boolean;
  idDocumentType?: "DNI" | "RUC" | "FOREIGNER_ID" | "PASSPORT" | "OTHER";
}

export const useGetWorkers = ({
  workshopId,
  includeInactive,
}: {
  workshopId?: string;
  includeInactive?: boolean;
}) => {
  const { page, size, setPagination, resetPagination } = usePagination();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const { filters, updateFilters, updateFilter, clearFilters } =
    useFilters<WorkerFilters>({});

  const debouncedSetSearch = useDebouncedCallback((searchValue: string) => {
    setSearch(searchValue);
    resetPagination();
  }, 500);

  const updateSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    debouncedSetSearch(searchValue);
  };

  const updateWorkerFilters = (newFilters: WorkerFilters) => {
    updateFilters(newFilters);
    resetPagination();
  };

  const updateWorkerFilter = (
    key: keyof WorkerFilters,
    value: WorkerFilters[keyof WorkerFilters],
  ) => {
    updateFilter(key, value);
    resetPagination();
  };

  const clearWorkerFilters = () => {
    clearFilters();
    resetPagination();
  };

  const query = backend.useQuery("get", "/api/worker", {
    queryKey: [
      "workers-paginated",
      page,
      size,
      search,
      workshopId,
      filters?.isActive,
      filters?.idDocumentType,
    ],
    params: {
      query: {
        page,
        size,
        ...(search.trim() && { search: search.trim() }),
        ...(workshopId && { workshopId }),
        ...(filters?.isActive !== undefined && {
          isActive: filters.isActive,
        }),
        ...(filters?.idDocumentType && {
          idDocumentType: filters.idDocumentType,
        }),
        ...(includeInactive !== undefined && { includeInactive }),
      },
    },
  });

  return {
    query,
    page,
    size,
    setPagination,
    searchTerm,
    search,
    setSearch: updateSearch,
    resetPagination,
    filters,
    updateFilters: updateWorkerFilters,
    updateFilter: updateWorkerFilter,
    clearFilters: clearWorkerFilters,
  };
};

export const useCreateWorker = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("post", "/api/worker", {
    onSuccess: () => {
      toast.success("Trabajador creado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/worker") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useGetWorker = (id: string) => {
  return backend.useQuery("get", "/api/worker/{id}", {
    params: {
      path: { id },
    },
    query: {
      enabled: !!id,
    },
  });
};

export const useUpdateWorker = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("patch", "/api/worker/{id}", {
    onSuccess: () => {
      toast.success("Trabajador actualizado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/worker") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useDeleteWorker = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("delete", "/api/worker/{id}", {
    onSuccess: () => {
      toast.success("Trabajador eliminado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/worker") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useDeactivateToggleWorker = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("patch", "/api/worker/{id}/deactivate-toggle", {
    onSuccess: (data: WorkerResponse) => {
      toast.success(
        `Trabajador ${data.isActive ? "activado" : "desactivado"} correctamente`,
      );
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/worker") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useWorkersSearch = () => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const { size } = usePagination();
  const [ids, setIds] = useState<string[] | undefined>(undefined);
  const { filters, updateFilters } = useFilters<WorkerFilters>();

  const query = backend.useInfiniteQuery(
    "get",
    "/api/worker",
    {
      params: {
        query: {
          search,
          page: 1,
          size,
          ids,
          ...(filters?.workshopId && { workshopId: filters.workshopId }),
          ...(filters?.isActive !== undefined && {
            isActive: filters.isActive,
          }),
          ...(filters?.idDocumentType && {
            idDocumentType: filters.idDocumentType,
          }),
        },
      },
      queryKey: ["get", "/api/worker", "infinite"],
    },
    {
      getNextPageParam: (lastPage: any) => {
        if (!lastPage || !lastPage.meta) {
          return undefined;
        }

        const { page, totalPages } = lastPage.meta;
        if (typeof page !== "number" || typeof totalPages !== "number") {
          return undefined;
        }

        if (page < totalPages) {
          return page + 1;
        }
        return undefined;
      },
      getPreviousPageParam: (firstPage: any) => {
        if (!firstPage || !firstPage.meta) {
          return undefined;
        }

        const { page } = firstPage.meta;
        if (typeof page !== "number") {
          return undefined;
        }

        if (page > 1) {
          return page - 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      pageParamName: "page",
      enabled: true,
    },
  );

  const allItems = query.data?.pages.flatMap((page) => page.data) || [];

  const handleSearchByIds = (ids: string[]) => {
    setIds(ids);
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
