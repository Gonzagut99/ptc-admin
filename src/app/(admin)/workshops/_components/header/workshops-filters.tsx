"use client";

import { Calendar } from "lucide-react";
import { ServerDateRangeFacetedFilter } from "@/components/data-table/filters/ServerDateRangeFacetedFilter";
import { Input } from "@/components/ui/input";

interface WorkshopsFiltersProps {
  searchTerm: string;
  setSearch: (value: string) => void;
  dateRange: { from?: Date; to?: Date };
  setDateRange: (range: { from?: Date; to?: Date }) => void;
}

export default function WorkshopsFilters({
  searchTerm,
  setSearch,
  dateRange,
  setDateRange,
}: WorkshopsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-64">
        <Input
          placeholder="Buscar por nombre de taller"
          className="pr-10"
          value={searchTerm}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ServerDateRangeFacetedFilter
        title="Fecha de creación"
        from={dateRange.from}
        to={dateRange.to}
        onChange={setDateRange}
        closeOnSelect={false}
        numberOfMonths={2}
        className="justify-start sm:justify-center"
        icon={Calendar}
      />
    </div>
  );
}
