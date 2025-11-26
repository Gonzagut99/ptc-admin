"use client";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useGetRolesAndPermissions } from "../../_hooks/roles-hooks";
import { RoleDetailResponse } from "../../_types/roles.types";
import { rolesColumns } from "./roles-columns";
import RolesFilters from "./roles-filters";

export default function RolesTable() {
  const {
    query,
    setPagination,
    searchTerm,
    setSearch,
    filters,
    updateFilters,
  } = useGetRolesAndPermissions({ includeInactive: true });
  const { data, isLoading } = query;
  const columns = useMemo(() => rolesColumns(), []);

  const actions = useMemo(
    () => (
      <RolesFilters filters={filters ?? {}} updateFilters={updateFilters} />
    ),
    [filters, updateFilters],
  );

  return (
    <DataTable
      columns={columns}
      data={(data?.data || []) as RoleDetailResponse[]}
      toolbarActions={actions}
      filterPlaceholder="Buscar rol por nombre, descripción o permisos..."
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
