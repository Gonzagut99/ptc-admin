"use client";

import WorkshopsFilters from "./workshops-filters";
import WorkshopsPrimaryButtons from "./workshops-primary-buttons";

interface WorkshopsHeaderActionsProps {
  searchTerm: string;
  setSearch: (value: string) => void;
  dateRange: { from?: Date; to?: Date };
  setDateRange: (range: { from?: Date; to?: Date }) => void;
}

export default function WorkshopsHeaderActions({
  searchTerm,
  setSearch,
  dateRange,
  setDateRange,
}: WorkshopsHeaderActionsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
      <WorkshopsFilters
        searchTerm={searchTerm}
        setSearch={setSearch}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <WorkshopsPrimaryButtons />
    </div>
  );
}
