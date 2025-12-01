"use client";

import ServerSingleFacetedFilter from "@/components/data-table/filters/ServerSingleFacetedFilter";
import {
  ID_DOCUMENT_TYPE_LABELS,
  ID_DOCUMENT_TYPES,
  IdDocumentType,
} from "../../_types/customers.types";
import { CustomerFilters } from "../../_hooks/customers-hooks";

interface CustomersFiltersProps {
  filters: CustomerFilters | undefined;
  updateFilters: (filters: CustomerFilters) => void;
}

const ID_DOCUMENT_TYPE_OPTIONS = ID_DOCUMENT_TYPES.map((type) => ({
  label: ID_DOCUMENT_TYPE_LABELS[type],
  value: type,
}));

export default function CustomersFilters({
  filters,
  updateFilters,
}: CustomersFiltersProps) {
  const currentFilter = filters ?? {};

  return (
    <div className="max-w-full flex items-center gap-2">
      <div className="shrink-0">
        <ServerSingleFacetedFilter
          title="Tipo de documento"
          options={ID_DOCUMENT_TYPE_OPTIONS}
          value={currentFilter.idDocumentType}
          onChange={(value) => {
            updateFilters({
              ...currentFilter,
              idDocumentType: value as IdDocumentType | undefined,
            });
          }}
        />
      </div>
    </div>
  );
}
