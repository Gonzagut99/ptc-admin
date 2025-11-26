"use client";
import { ChevronDown, ChevronRight, Settings, Shield } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  actionColors,
  actionConfig,
  getResourceIcon,
  type Permission,
  translateAction,
  translateResource,
} from "@/utils/permissions";
import { useGetRole } from "../../../roles/_hooks/roles-hooks";
import { RoleDetailResponse } from "../../../roles/_types/roles.types";

interface RolePermissionsCollapsibleProps {
  selectedRoleIds: string[];
  isLoading?: boolean;
}

// Componente interno para obtener un solo rol
function SingleRoleLoader({
  roleId,
  onRoleLoaded,
  onLoadingChange,
}: {
  roleId: string;
  onRoleLoaded: (roleId: string, role: RoleDetailResponse | null) => void;
  onLoadingChange: (roleId: string, isLoading: boolean) => void;
}) {
  const { data: role, isLoading } = useGetRole(roleId);
  const lastLoadingRef = useRef<boolean | null>(null);
  const lastRoleRef = useRef<RoleDetailResponse | null>(null);

  useEffect(() => {
    if (lastLoadingRef.current !== isLoading) {
      lastLoadingRef.current = isLoading;
      onLoadingChange(roleId, isLoading);
    }
  }, [isLoading, roleId, onLoadingChange]);

  useEffect(() => {
    if (role && role !== lastRoleRef.current) {
      lastRoleRef.current = role;
      onRoleLoaded(roleId, role);
    }
  }, [role, roleId, onRoleLoaded]);

  return null;
}

export function RolePermissionsCollapsible({
  selectedRoleIds,
  isLoading = false,
}: RolePermissionsCollapsibleProps) {
  const [showPermissions, setShowPermissions] = useState(false);
  const [loadedRoles, setLoadedRoles] = useState<
    Map<string, RoleDetailResponse>
  >(new Map());
  const [loadingRoles, setLoadingRoles] = useState<Set<string>>(new Set());

  // Callback estable para actualizar roles cargados
  const handleRoleLoaded = useCallback(
    (roleId: string, role: RoleDetailResponse | null) => {
      if (role) {
        setLoadedRoles((prev) => {
          // Solo actualizar si el rol cambió
          if (prev.get(roleId)?.id === role.id) {
            return prev;
          }
          const next = new Map(prev);
          next.set(roleId, role);
          return next;
        });
      }
    },
    [],
  );

  // Callback estable para actualizar estado de carga
  const handleLoadingChange = useCallback(
    (roleId: string, isLoading: boolean) => {
      setLoadingRoles((prev) => {
        const next = new Set(prev);
        if (isLoading) {
          next.add(roleId);
        } else {
          next.delete(roleId);
        }
        return next;
      });
    },
    [],
  );

  // Verificar si alguna query está cargando
  const isLoadingRoles = loadingRoles.size > 0;

  // Obtener los roles seleccionados con sus permisos
  const selectedRoles = useMemo(() => {
    return selectedRoleIds
      .map((roleId) => loadedRoles.get(roleId))
      .filter((role) => role !== undefined) as RoleDetailResponse[];
  }, [selectedRoleIds, loadedRoles]);

  // Agrupar permisos por recurso y detectar wildcards
  const groupedPermissions = useMemo(() => {
    const permissionsMap = new Map<string, Permission>();
    const resourceGroups = new Map<
      string,
      { permissions: Permission[]; hasWildcard: boolean }
    >();

    // Primero, recopilar todos los permisos únicos
    selectedRoles.forEach((role) => {
      role.permissions?.forEach((permission) => {
        const key = `${permission.resource}:${permission.action}`;
        if (!permissionsMap.has(key)) {
          permissionsMap.set(key, permission);
        }
      });
    });

    // Agrupar por recurso
    permissionsMap.forEach((permission) => {
      const resource = String(permission.resource);
      if (resource === "*") return; // Ignorar wildcard global

      if (!resourceGroups.has(resource)) {
        resourceGroups.set(resource, {
          permissions: [],
          hasWildcard: false,
        });
      }

      const group = resourceGroups.get(resource);
      if (!group) return;
      const action = String(permission.action);

      if (action === "*") {
        group.hasWildcard = true;
      } else {
        // Solo agregar si no hay wildcard
        if (!group.hasWildcard) {
          group.permissions.push(permission);
        }
      }
    });

    // Si hay wildcard, limpiar las acciones individuales y mantener solo el wildcard
    resourceGroups.forEach((group, resource) => {
      if (group.hasWildcard) {
        // Buscar el permiso wildcard para este recurso específico
        const wildcardPermission = Array.from(permissionsMap.values()).find(
          (p) => String(p.resource) === resource && String(p.action) === "*",
        );
        if (wildcardPermission) {
          group.permissions = [wildcardPermission];
        } else {
          group.permissions = [];
        }
      }
    });

    return resourceGroups;
  }, [selectedRoles]);

  if (selectedRoleIds.length === 0) {
    return null;
  }

  return (
    <>
      {/* Cargar cada rol individualmente */}
      {selectedRoleIds.map((roleId) => (
        <SingleRoleLoader
          key={roleId}
          roleId={roleId}
          onRoleLoaded={handleRoleLoaded}
          onLoadingChange={handleLoadingChange}
        />
      ))}
      <Collapsible open={showPermissions} onOpenChange={setShowPermissions}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="justify-between transition-all duration-200 hover:bg-muted/50 bg-transparent h-9 w-full rounded-md border border-input"
            type="button"
            disabled={isLoading}
          >
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Permisos de los roles seleccionados
            </span>
            {showPermissions ? (
              <ChevronDown className="w-4 h-4 opacity-50" />
            ) : (
              <ChevronRight className="w-4 h-4 opacity-50" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          {isLoading || isLoadingRoles ? (
            <div className="flex items-center justify-center py-4">
              <Spinner className="mr-2 h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                Cargando permisos de los roles...
              </span>
            </div>
          ) : selectedRoles.length > 0 ? (
            <div className="bg-muted/30 rounded-lg p-4 border space-y-4">
              {/* Información de roles */}
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">
                  Roles seleccionados ({selectedRoles.length})
                </span>
                <Badge variant="secondary" className="text-xs">
                  {Array.from(groupedPermissions.values()).reduce(
                    (acc, group) =>
                      acc + (group.hasWildcard ? 1 : group.permissions.length),
                    0,
                  )}{" "}
                  permisos únicos
                </Badge>
              </div>

              {/* Lista de roles */}
              <div className="space-y-2">
                {selectedRoles.map((role) => (
                  <div
                    key={role.id}
                    className="p-2 rounded-md bg-background border text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{role.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {role.permissions?.length || 0} permisos
                      </Badge>
                    </div>
                    {role.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {role.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Permisos agrupados por recurso */}
              {groupedPermissions.size > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">
                      Permisos asignados por recurso
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {groupedPermissions.size} recursos
                    </Badge>
                  </div>

                  <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Array.from(groupedPermissions.entries())
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([resource, group]) => {
                        const ResourceIcon = getResourceIcon(resource);
                        const resourceName = translateResource(resource);
                        // Cuando hay wildcard, contar todas las acciones posibles (sin contar el wildcard)
                        const totalActions = group.hasWildcard
                          ? Object.keys(actionConfig).filter(
                              (key) => key !== "*",
                            ).length
                          : group.permissions.length;

                        return (
                          <div
                            key={resource}
                            className="rounded-md border p-3 bg-background"
                          >
                            {/* Header del recurso */}
                            <div className="flex items-center gap-3 mb-2">
                              <ResourceIcon className="w-4 h-4 text-muted-foreground" />
                              <div className="flex-1">
                                <span className="text-sm font-medium">
                                  {resourceName}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {totalActions}{" "}
                                {totalActions === 1 ? "permiso" : "permisos"}
                              </span>
                            </div>

                            {/* Acciones del recurso */}
                            {group.hasWildcard ? (
                              <div className="mt-2 pt-2 border-t">
                                <Badge
                                  className="bg-primary/10 text-primary border-primary/20"
                                  variant="outline"
                                >
                                  Todas las acciones
                                </Badge>
                              </div>
                            ) : (
                              <div className="mt-2 pt-2 border-t flex flex-wrap gap-2">
                                {group.permissions
                                  .sort((a, b) =>
                                    String(a.action).localeCompare(
                                      String(b.action),
                                    ),
                                  )
                                  .map((permission) => {
                                    const action = String(permission.action);
                                    return (
                                      <Badge
                                        key={permission.id}
                                        className={cn(
                                          "border",
                                          actionColors[action] ||
                                            actionColors["*"],
                                        )}
                                        variant="outline"
                                      >
                                        {translateAction(action)}
                                      </Badge>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
