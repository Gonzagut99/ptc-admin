import { Calendar, Shield } from "lucide-react";
import ServerDateRangeFacetedFilter from "@/components/data-table/filters/ServerDateRangeFacetedFilter";
import ServerMultiFacetedFilterInfinite from "@/components/data-table/filters/ServerMultiFacetedFilterInfinite";
import ServerSingleFacetedFilter from "@/components/data-table/filters/ServerSingleFacetedFilter";
import { cn } from "@/lib/utils";
import {
  getActiveStatusIcon,
  getActiveStatusIconClasses,
  getActiveStatusLabel,
} from "@/utils/active-status";
import { getRoleIcon, getRoleIconClasses } from "../../../_shared/_utils/roles";
import { useRolesSearch } from "../../../roles/_hooks/roles-hooks";
import { UserFilters } from "../../_hooks/users-hooks";

interface UsersFiltersProps {
  filters: UserFilters;
  updateFilters: (filters: UserFilters) => void;
}
export default function UsersFilters({
  filters,
  updateFilters,
}: UsersFiltersProps) {
  const {
    allItems: roles,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    handleSearchChange,
  } = useRolesSearch();

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
        <ServerMultiFacetedFilterInfinite
          title="Roles"
          options={roles.map((role) => {
            // Crear componente de icono con colores usando las utilidades
            const RoleIcon = ({ className }: { className?: string }) => {
              const Icon = getRoleIcon(role.name);
              const iconClasses = getRoleIconClasses(role.name);
              return <Icon className={cn(iconClasses, className)} />;
            };

            return {
              label: role.name,
              value: role.id,
              icon: RoleIcon,
            };
          })}
          values={filters.roles}
          onChange={(values) => {
            updateFilters({ ...filters, roles: values });
          }}
          onSearch={handleSearchChange}
          onLoadMore={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          hasNextPage={hasNextPage}
          isLoadingMore={isFetchingNextPage}
          isSearching={isLoading}
          searchPlaceholder="Buscar roles..."
          icon={Shield}
        />
      </div>
      <div className="shrink-0">
        <ServerDateRangeFacetedFilter
          title="Fecha de creación"
          from={filters.createdAtFrom}
          to={filters.createdAtTo}
          onChange={(range) => {
            updateFilters({
              ...filters,
              createdAtFrom: range.from,
              createdAtTo: range.to,
            });
          }}
          numberOfMonths={2}
          icon={Calendar}
        />
      </div>
    </div>
  );
}
