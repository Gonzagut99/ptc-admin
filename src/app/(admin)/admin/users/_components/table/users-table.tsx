"use client";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useGetUsers } from "../../_hooks/users-hooks";
import { UserDetailResponse } from "../../_types/users.types";
import { usersColumns } from "./users-columns";
import UsersFilters from "./users-filters";

export default function UsersTable() {
  const {
    query,
    setPagination,
    searchTerm,
    setSearch,
    filters,
    updateFilters,
  } = useGetUsers({ includeInactive: true });

  const { data, isLoading } = query;

  const columns = useMemo(() => usersColumns(), []);

  const actions = useMemo(
    () => (
      <UsersFilters filters={filters ?? {}} updateFilters={updateFilters} />
    ),
    [filters, updateFilters],
  );

  return (
    <DataTable
      columns={columns}
      data={(data?.data || []) as UserDetailResponse[]}
      toolbarActions={actions}
      filterPlaceholder="Buscar usuario por documento, nombre, correo electrónico, teléfono y cargo..."
      externalFilterValue={searchTerm}
      onGlobalFilterChange={setSearch}
      isLoading={isLoading}
      loadingRowsCount={2}
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
