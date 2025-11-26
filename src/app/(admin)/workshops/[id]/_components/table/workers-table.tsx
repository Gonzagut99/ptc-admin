"use client";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useGetWorkers, WorkerFilters } from "../../_hooks/workers-hooks";
import { WorkerResponse } from "../../_types/workers.types";
import { workersColumns } from "./workers-columns";
import WorkersFilters from "./workers-filters";

interface WorkersTableProps {
  workshopId: string;
}

export default function WorkersTable({ workshopId }: WorkersTableProps) {
  const {
    query,
    setPagination,
    searchTerm,
    setSearch,
    filters,
    updateFilters,
  } = useGetWorkers({
    workshopId,
    includeInactive: true,
  });
  const { data, isLoading } = query;
  const columns = useMemo(() => workersColumns(), []);

  const actions = useMemo(
    () => (
      <WorkersFilters
        filters={filters as WorkerFilters | undefined}
        updateFilters={updateFilters as (filters: WorkerFilters) => void}
      />
    ),
    [filters, updateFilters],
  );

  return (
    <DataTable
      columns={columns}
      data={(data?.data || []) as WorkerResponse[]}
      toolbarActions={actions}
      filterPlaceholder="Buscar trabajador"
      externalFilterValue={searchTerm}
      onGlobalFilterChange={setSearch}
      isLoading={isLoading}
      loadingRowsCount={5}
      serverPagination={
        data?.meta
          ? {
              pageIndex: data.meta.page - 1,
              pageSize: data.meta.pageSize ?? 10,
              onPaginationChange: (pageIndex, pageSize) => {
                setPagination({
                  newPage: pageIndex + 1,
                  newSize: pageSize,
                });
              },
              pageCount: data.meta.totalPages ?? 0,
              total: data.meta.total ?? 0,
            }
          : undefined
      }
      strikethroughCondition={(row) => !row.isActive}
    />
  );
}
