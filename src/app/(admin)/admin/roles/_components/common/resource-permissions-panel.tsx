import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { getResourceIcon, Permission } from "@/utils/permissions";
import { PermissionItem } from "./permission-item";

type SelectedPermissions = Record<string, boolean>;

interface ResourcePermissionsPanelProps {
  resource: string;
  resourceName: string;
  ResourceIcon: ReturnType<typeof getResourceIcon>;
  readPerm: Permission | undefined;
  wildcardPerm: Permission | undefined;
  hasWildcard: boolean;
  isWildcardActive: boolean;
  otherPerms: Permission[];
  enabledCount: number;
  totalCount: number;
  selectedPermissions: SelectedPermissions;
  onTogglePermission: (permId: string, resource: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ResourcePermissionsPanel = ({
  resource,
  resourceName,
  ResourceIcon,
  readPerm,
  wildcardPerm,
  hasWildcard,
  isWildcardActive,
  otherPerms,
  enabledCount,
  totalCount,
  selectedPermissions,
  onTogglePermission,
  open,
  onOpenChange,
}: ResourcePermissionsPanelProps) => {
  const isReadSelected = readPerm
    ? selectedPermissions[readPerm.id] || false
    : false;
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={open === undefined ? true : undefined}
      className="border border-border/60 rounded-lg overflow-hidden bg-card group/collapsible"
    >
      {/* Header del recurso - Trigger */}
      <CollapsibleTrigger className="w-full">
        <div className="px-3.5 py-2.5 border-b border-border/60 bg-accent/30 hover:bg-accent/40 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <ResourceIcon className="w-4 h-4 shrink-0" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {resourceName}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {totalCount > 0 && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    isWildcardActive
                      ? "bg-primary/15 text-primary"
                      : enabledCount > 0
                        ? "bg-primary/15 text-primary"
                        : "bg-muted/60 text-muted-foreground",
                  )}
                >
                  {isWildcardActive
                    ? `Todos (${totalCount})`
                    : `${enabledCount}/${totalCount}`}
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
            </div>
          </div>
        </div>
      </CollapsibleTrigger>

      {/* Lista de permisos - Content */}
      <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
        <div className="divide-y divide-border/40">
          {/* Mostrar wildcard si existe */}
          {hasWildcard && wildcardPerm && (
            <PermissionItem
              permission={wildcardPerm}
              isSelected={isWildcardActive}
              onToggle={() => onTogglePermission(wildcardPerm.id, resource)}
              isWildcard={true}
            />
          )}
          {/* Sección de Permisos específicos (incluye read y otros) */}
          {(readPerm || otherPerms.length > 0) && (
            <div className="px-3.5 py-2 bg-muted/20 border-b border-border/50">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Permisos específicos
              </span>
            </div>
          )}
          {/* Mostrar permiso read dentro de Permisos específicos */}
          {readPerm && (
            <PermissionItem
              permission={readPerm}
              isSelected={isWildcardActive || isReadSelected || false}
              onToggle={() => onTogglePermission(readPerm.id, resource)}
              disabled={isWildcardActive}
            />
          )}
          {/* Mostrar otros permisos */}
          {otherPerms.length > 0
            ? otherPerms.map((perm) => (
                <PermissionItem
                  key={perm.id}
                  permission={perm}
                  isSelected={
                    isWildcardActive || selectedPermissions[perm.id] || false
                  }
                  onToggle={() => onTogglePermission(perm.id, resource)}
                  disabled={isWildcardActive}
                />
              ))
            : !readPerm &&
              !hasWildcard && (
                <div className="px-3.5 py-3 text-sm text-center text-muted-foreground">
                  No hay permisos adicionales disponibles
                </div>
              )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
