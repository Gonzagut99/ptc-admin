"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useGetCustomers } from "../../_hooks/customers-hooks";
import { DCustomer } from "../../_types/customers.types";
import { customersColumns } from "./customers-columns";

export default function CustomersTable() {
  const {
    query,
    data,
    serverPagination,
    searchTerm,
    setSearch,
  } = useGetCustomers();
  const { isLoading } = query;
  const columns = useMemo(() => customersColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={(data || []) as DCustomer[]}
      filterPlaceholder="Buscar cliente..."
      externalFilterValue={searchTerm}
      onGlobalFilterChange={setSearch}
      isLoading={isLoading}
      loadingRowsCount={5}
      serverPagination={serverPagination}
    />
  );
}
