"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backendJava } from "@/lib/api-java/backend";
import { buildJavaErrorMessage } from "@/lib/api-java/errors";
import { useZeroBasedPagination } from "@/hooks/use-zero-based-pagination";

export const useJavaLiquidations = () => {
  const { pageIndex, pageSize, setPagination, resetPagination } =
    useZeroBasedPagination();

  const query = backendJava.useQuery("get", "/liquidations/paginated", {
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

export const useJavaLiquidationById = (
  liquidationId: number,
  enabled = true,
) => {
  return backendJava.useQuery(
    "get",
    "/liquidations/{liquidationId}",
    {
      params: {
        path: { liquidationId },
      },
    },
    {
      enabled: enabled && liquidationId > 0,
    },
  );
};

export const useCreateJavaLiquidation = () => {
  const queryClient = useQueryClient();

  return backendJava.useMutation("post", "/liquidations", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/liquidations/paginated"],
      });
      toast.success("Liquidación creada correctamente");
    },
    onError: (error) => {
      toast.error(
        buildJavaErrorMessage(
          error,
          "Ocurrió un error al crear la liquidación",
        ),
      );
    },
  });
};

const invalidateLiquidationQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  liquidationId: number,
) => {
  queryClient.invalidateQueries({
    queryKey: ["get", "/liquidations/{liquidationId}", { liquidationId }],
  });
  queryClient.invalidateQueries({
    queryKey: ["get", "/liquidations/paginated"],
  });
};

export const useAddJavaTourService = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/tour-services",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Servicio de tour agregado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al agregar el servicio de tour",
          ),
        );
      },
    },
  );
};

export const useAddJavaHotelService = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/hotel-services",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Servicio de hotel agregado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al agregar el servicio de hotel",
          ),
        );
      },
    },
  );
};

export const useAddJavaFlightService = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/flight-services",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Servicio de vuelo agregado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al agregar el servicio de vuelo",
          ),
        );
      },
    },
  );
};

export const useAddJavaAdditionalService = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/additional-services",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Servicio adicional agregado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al agregar el servicio adicional",
          ),
        );
      },
    },
  );
};

export const useAddJavaPayment = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/payments",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Pago registrado correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(error, "Ocurrió un error al registrar el pago"),
        );
      },
    },
  );
};

export const useAddJavaIncidency = (liquidationId: number) => {
  const queryClient = useQueryClient();

  return backendJava.useMutation(
    "post",
    "/liquidations/{liquidationId}/incidencies",
    {
      onSuccess: () => {
        invalidateLiquidationQueries(queryClient, liquidationId);
        toast.success("Incidencia reportada correctamente");
      },
      onError: (error) => {
        toast.error(
          buildJavaErrorMessage(
            error,
            "Ocurrió un error al reportar la incidencia",
          ),
        );
      },
    },
  );
};
