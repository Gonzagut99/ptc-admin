// src/app/(admin)/workshops/_hooks/workshops-hooks.tsx
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { endOfDay } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { ToastErrorMessage } from "@/components/errors/error-for-toast";
import { backend } from "@/lib/api/types/backend";

export const useWorkshopsWithWorkerCount = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const debouncedSetSearch = useDebouncedCallback((searchValue: string) => {
    setSearch(searchValue);
  }, 500);

  const updateSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    debouncedSetSearch(searchValue);
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    // Si el usuario selecciona un rango completo (from y to), respetarlo
    // Si solo selecciona 'from', aplicar 'to' como "hoy" (final del día)
    if (range.from) {
      setDateRange({
        from: range.from,
        to: range.to ? endOfDay(range.to) : endOfDay(new Date()),
      });
    } else {
      setDateRange({});
    }
  };

  const query = backend.useQuery("get", "/api/workshop/with-worker-count", {
    queryKey: [
      "workshops-with-worker-count",
      search,
      dateRange.from?.toISOString(),
      dateRange.to?.toISOString(),
    ],
    params: {
      query: {
        page: 1,
        size: 9,
        ...(search.trim() && { search: search.trim() }),
        ...(dateRange.from && { createdAtFrom: dateRange.from.toISOString() }),
        ...(dateRange.to && { createdAtTo: dateRange.to.toISOString() }),
      },
    },
  });

  return {
    query,
    searchTerm,
    setSearch: updateSearch,
    dateRange,
    setDateRange: handleDateRangeChange,
  };
};

export const useCreateWorkshop = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("post", "/api/workshop", {
    onSuccess: () => {
      toast.success("Taller creado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/workshop") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useGetWorkshop = (id: string) => {
  return backend.useQuery("get", "/api/workshop/{id}", {
    params: {
      path: { id },
    },
    query: {
      enabled: !!id,
    },
  });
};

export const useUpdateWorkshop = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("patch", "/api/workshop/{id}", {
    onSuccess: () => {
      toast.success("Taller actualizado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/workshop") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useDeleteWorkshop = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("delete", "/api/workshop/{id}", {
    onSuccess: () => {
      toast.success("Taller eliminado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/workshop") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};

export const useDeactivateToggleWorkshop = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("patch", "/api/workshop/{id}/deactivate-toggle", {
    onSuccess: () => {
      toast.success("Estado del taller actualizado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/workshop") ??
          false,
      });
    },
    onError: (error) => {
      toast.error(<ToastErrorMessage error={error} />);
    },
  });
};
