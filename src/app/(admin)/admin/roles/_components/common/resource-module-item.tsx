import { cn } from "@/lib/utils";
import { ActionTypeMap } from "@/types/resource-actions.types";
import {
  getResourceIcon,
  Permission,
  translateResource,
} from "@/utils/permissions";

interface ResourceModuleItemProps {
  resource: string;
  permissions: Permission[];
  isActive: boolean;
  onToggle: (resource: string) => void;
}

export const ResourceModuleItem = ({
  resource,
  permissions,
  isActive,
  onToggle,
}: ResourceModuleItemProps) => {
  const ResourceIcon = getResourceIcon(resource);
  const resourceName = translateResource(resource);

  // Contar permisos totales (incluyendo read, excluyendo wildcard)
  const totalPerms = permissions.filter(
    (p) => p.action !== ActionTypeMap["*"],
  ).length;

  return (
    <button
      type="button"
      onClick={() => onToggle(resource)}
      className={cn(
        "w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-lg border transition-all",
        "hover:bg-accent/40",
        isActive
          ? "border-primary/40 bg-primary/5"
          : "border-border/60 bg-card hover:border-primary/20",
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={cn(
            "p-1.5 rounded-md transition-all shrink-0",
            isActive
              ? "bg-primary/10 text-primary"
              : "bg-muted/50 text-muted-foreground",
          )}
        >
          <ResourceIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col flex-1 min-w-0 text-left">
          <span
            className={cn(
              "text-sm truncate transition-colors",
              isActive
                ? "font-semibold text-foreground"
                : "font-medium text-muted-foreground",
            )}
          >
            {resourceName}
          </span>
          <span
            className={cn(
              "text-xs transition-colors",
              isActive ? "text-muted-foreground" : "text-muted-foreground/70",
            )}
          >
            {totalPerms > 0
              ? `${totalPerms} permiso${
                  totalPerms !== 1 ? "s" : ""
                } disponible${totalPerms !== 1 ? "s" : ""}`
              : "Sin permisos adicionales"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        <div
          className={cn(
            "w-9 h-5 rounded-full relative transition-all shrink-0",
            isActive
              ? "bg-primary/20 ring-1 ring-primary/30"
              : "bg-muted/70 ring-1 ring-border/50",
          )}
        >
          <div
            className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-all",
              isActive
                ? "translate-x-4 bg-primary"
                : "translate-x-0 bg-muted-foreground/40",
            )}
          />
        </div>
      </div>
    </button>
  );
};
