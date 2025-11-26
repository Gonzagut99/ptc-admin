import ServerSingleFacetedFilter from "@/components/data-table/filters/ServerSingleFacetedFilter";
import { cn } from "@/lib/utils";
import {
  getActiveStatusIcon,
  getActiveStatusIconClasses,
  getActiveStatusLabel,
} from "@/utils/active-status";
import {
  getIdDocumentTypeIcon,
  getIdDocumentTypeIconClasses,
  getIdDocumentTypeLabel,
} from "../../../_shared/_utils/id-document-types";
import { WorkerFilters } from "../../_hooks/workers-hooks";

interface WorkersFiltersProps {
  filters: WorkerFilters | undefined;
  updateFilters: (filters: WorkerFilters) => void;
}

const ID_DOCUMENT_TYPES = ["DNI", "RUC", "FOREIGNER_ID", "PASSPORT", "OTHER"];

const ID_DOCUMENT_TYPE_OPTIONS = ID_DOCUMENT_TYPES.map((type) => ({
  label: getIdDocumentTypeLabel(type),
  value: type,
  icon: ({ className }: { className?: string }) => {
    const Icon = getIdDocumentTypeIcon(type);
    const iconClasses = getIdDocumentTypeIconClasses(type);
    return <Icon className={cn(iconClasses, "h-4 w-4", className)} />;
  },
}));

export default function WorkersFilters({
  filters,
  updateFilters,
}: WorkersFiltersProps) {
  const ActiveIcon = ({ className }: { className?: string }) => {
    const Icon = getActiveStatusIcon(true);
    const iconClasses = getActiveStatusIconClasses(true);
    return <Icon className={cn(iconClasses, className)} />;
  };

  const InactiveIcon = ({ className }: { className?: string }) => {
    const Icon = getActiveStatusIcon(false);
    const iconClasses = getActiveStatusIconClasses(false);
    return <Icon className={cn(iconClasses, className)} />;
  };

  const statusOptions = [
    {
      label: getActiveStatusLabel(true),
      value: "active",
      icon: ActiveIcon,
    },
    {
      label: getActiveStatusLabel(false),
      value: "inactive",
      icon: InactiveIcon,
    },
  ];

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
              idDocumentType: value as
                | "DNI"
                | "RUC"
                | "FOREIGNER_ID"
                | "PASSPORT"
                | "OTHER"
                | undefined,
            });
          }}
        />
      </div>
      <div className="shrink-0">
        <ServerSingleFacetedFilter
          title="Estado"
          options={statusOptions}
          value={
            currentFilter.isActive === undefined
              ? undefined
              : currentFilter.isActive
                ? "active"
                : "inactive"
          }
          onChange={(value) => {
            if (value === undefined) {
              updateFilters({ ...currentFilter, isActive: undefined });
            } else {
              updateFilters({
                ...currentFilter,
                isActive: value === "active",
              });
            }
          }}
        />
      </div>
    </div>
  );
}
