"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import {
  useGetLiquidations,
  useGetLiquidationsByCustomer,
} from "../../_hooks/liquidations-hooks";
import { LiquidationWithDetailsDto } from "../../_types/liquidations.types";
import { liquidationsColumns } from "./liquidations-columns";

interface LiquidationsTableProps {
  customerId?: number;
}

export default function LiquidationsTable({
  customerId,
}: LiquidationsTableProps) {
  // Use different hooks based on whether customerId is provided
  const allLiquidationsHook = useGetLiquidations();
  const customerLiquidationsHook = useGetLiquidationsByCustomer(
    customerId ?? 0,
  );

  // Select the appropriate hook data based on customerId
  const activeHook = customerId ? customerLiquidationsHook : allLiquidationsHook;
  const { query, data, serverPagination } = activeHook;
  const searchTerm = "searchTerm" in activeHook ? (activeHook.searchTerm as string) : "";
  const setSearch = "setSearch" in activeHook ? (activeHook.setSearch as (value: string) => void) : undefined;

  const { isLoading } = query;
  const columns = useMemo(() => liquidationsColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={(data || []) as LiquidationWithDetailsDto[]}
      filterPlaceholder="Buscar liquidación..."
      externalFilterValue={searchTerm}
      onGlobalFilterChange={setSearch}
      isLoading={isLoading}
      loadingRowsCount={5}
      serverPagination={serverPagination}
    />
  );
}
