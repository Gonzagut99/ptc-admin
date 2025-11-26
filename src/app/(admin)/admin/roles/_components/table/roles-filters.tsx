import { Calendar } from "lucide-react";
import ServerDateRangeFacetedFilter from "@/components/data-table/filters/ServerDateRangeFacetedFilter";
import ServerSingleFacetedFilter from "@/components/data-table/filters/ServerSingleFacetedFilter";
import { cn } from "@/lib/utils";
import {
  getActiveStatusIcon,
  getActiveStatusIconClasses,
  getActiveStatusLabel,
} from "@/utils/active-status";
import { RoleFilters } from "../../_hooks/roles-hooks";

interface RolesFiltersProps {
  filters: RoleFilters;
  updateFilters: (filters: RoleFilters) => void;
}

export default function RolesFilters({
  filters,
  updateFilters,
}: RolesFiltersProps) {
  // Componentes de icono con colores usando las utilidades
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

  // Opciones de estado usando las utilidades
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

  return (
    <div className="max-w-full flex items-center gap-2">
      <div className="shrink-0">
        <ServerSingleFacetedFilter
          title="Estado"
          options={statusOptions}
          value={
            filters.isActive === undefined
              ? undefined
              : filters.isActive
                ? "active"
                : "inactive"
          }
          onChange={(value) => {
            if (value === undefined) {
              updateFilters({ ...filters, isActive: undefined });
            } else {
              updateFilters({
                ...filters,
                isActive: value === "active",
              });
            }
          }}
        />
      </div>
      <div className="shrink-0">
        <ServerDateRangeFacetedFilter
          title="Fecha de creación"
          from={filters.dateFrom}
          to={filters.dateTo}
          onChange={(range) => {
            updateFilters({
              ...filters,
              dateFrom: range.from,
              dateTo: range.to,
            });
          }}
          numberOfMonths={2}
          icon={Calendar}
        />
      </div>
    </div>
  );
}
