"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useGetLiquidations } from "../../_hooks/liquidations-hooks";
import { LiquidationWithDetailsDto } from "../../_types/liquidations.types";
import { liquidationsColumns } from "./liquidations-columns";

export default function LiquidationsTable() {
  const { query, data, serverPagination, searchTerm, setSearch } =
    useGetLiquidations();
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
