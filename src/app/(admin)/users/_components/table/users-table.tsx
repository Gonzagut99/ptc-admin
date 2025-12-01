"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useGetUsers } from "../../_hooks/users-hooks";
import { DUser } from "../../_types/users.types";
import { usersColumns } from "./users-columns";

export default function UsersTable() {
  const { query, data, serverPagination, searchTerm, setSearch } =
    useGetUsers();
  const { isLoading } = query;
  const columns = useMemo(() => usersColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={(data || []) as DUser[]}
      filterPlaceholder="Buscar usuario..."
      externalFilterValue={searchTerm}
      onGlobalFilterChange={setSearch}
      isLoading={isLoading}
      loadingRowsCount={5}
      serverPagination={serverPagination}
    />
  );
}
