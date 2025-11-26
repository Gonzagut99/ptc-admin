import { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { FacetedFilter } from "./faceted-filters";

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>;
  toolbarActions?: React.ReactNode | ((table: Table<TData>) => React.ReactNode);
  filterPlaceholder?: string;
  facetedFilters?: FacetedFilter<TValue>[];
  externalFilterValue?: string;
  onGlobalFilterChange?: (value: string) => void;
}

export function DataTableToolbar<TData, TValue>({
  table,
  toolbarActions,
  filterPlaceholder = "Buscar...",
  facetedFilters = [],
  externalFilterValue,
  onGlobalFilterChange,
}: DataTableToolbarProps<TData, TValue>) {
  const currentFilterValue =
    externalFilterValue ?? table.getState().globalFilter ?? "";
  const isFiltered =
    table.getState().columnFilters.length > 0 || currentFilterValue !== "";

  const handleFilterChange = (value: string) => {
    if (onGlobalFilterChange) {
      onGlobalFilterChange(value);
    } else {
      table.setGlobalFilter(value);
    }
  };

  const handleClearFilters = () => {
    table.resetColumnFilters();
    if (onGlobalFilterChange) {
      onGlobalFilterChange("");
    } else {
      table.setGlobalFilter("");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex flex-1 min-w-[300px] flex-row items-start gap-y-2 sm:items-center sm:space-x-2">
        <InputGroup className="h-8 w-full">
          <InputGroupAddon align="inline-start">
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={filterPlaceholder}
            value={currentFilterValue}
            onChange={(event) => handleFilterChange(event.target.value)}
          />
        </InputGroup>
        <div className="flex flex-wrap items-center gap-2">
          {facetedFilters.map((filter) => {
            const column = table.getColumn(filter.column);
            return (
              column && (
                <DataTableFacetedFilter
                  key={filter.column}
                  column={column}
                  title={filter.title}
                  options={filter.options}
                />
              )
            );
          })}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="h-8 px-2 lg:px-3 flex items-center gap-2"
          >
            <span className="sm:flex hidden">Limpiar</span>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2 overflow-x-auto">
        {typeof toolbarActions === "function"
          ? toolbarActions(table)
          : toolbarActions}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
