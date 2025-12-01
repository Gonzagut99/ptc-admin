"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useGetStaff } from "../../_hooks/staff-hooks";
import { DStaff } from "../../_types/staff.types";
import { staffColumns } from "./staff-columns";

export default function StaffTable() {
  const { query, data, serverPagination, searchTerm, setSearch } =
    useGetStaff();
  const { isLoading } = query;
  const columns = useMemo(() => staffColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={(data || []) as DStaff[]}
      filterPlaceholder="Buscar personal..."
      externalFilterValue={searchTerm}
      onGlobalFilterChange={setSearch}
      isLoading={isLoading}
      loadingRowsCount={5}
      serverPagination={serverPagination}
    />
  );
}
