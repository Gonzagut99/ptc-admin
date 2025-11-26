import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionTypeMap } from "@/types/resource-actions.types";
import {
  GroupedPermissions,
  getResourceEntries,
  getResourceIcon,
  Permission,
  resourceConfig,
  translateAction,
  translateResource,
} from "@/utils/permissions";
import { useGetPermissions } from "../../_hooks/permissions-hooks";
import { ResourceModuleItem } from "./resource-module-item";
import { ResourcePermissionsPanel } from "./resource-permissions-panel";

type SelectedPermissions = Record<string, boolean>;

interface PermissionsModuleProps {
  selectedPermissionIds?: string[];
  onPermissionChange?: (permissionIds: string[]) => void;
}

export const PermissionsModule = ({
  selectedPermissionIds = [],
  onPermissionChange,
}: PermissionsModuleProps) => {
  const { data: permissions, isLoading, error } = useGetPermissions();

  // Estado para controlar si todos los paneles están expandidos o colapsados
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>(
    {},
  );

  // Estado para búsqueda de permisos
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Convertir array de IDs a objeto de estado para compatibilidad
  const selectedPermissions = useMemo(() => {
    const permissionsMap: SelectedPermissions = {};
    selectedPermissionIds.forEach((id) => {
      permissionsMap[id] = true;
    });
    return permissionsMap;
  }, [selectedPermissionIds]);

  // Agrupar permisos por recurso - memoizado
  // Ordenar según el orden definido en resourceConfig
  const groupedPermissions = useMemo<GroupedPermissions>(() => {
    if (!permissions) return {};

    const grouped = permissions.reduce((acc, perm) => {
      const resourcePerms = acc[perm.resource];
      if (!resourcePerms) {
        acc[perm.resource] = [perm];
      } else {
        resourcePerms.push(perm);
      }
      return acc;
    }, {} as GroupedPermissions);

    // Ordenar los recursos según el orden en resourceConfig
    const resourceOrder = Object.keys(resourceConfig) as Array<
      keyof typeof resourceConfig
    >;
    const sortedEntries = getResourceEntries(grouped).sort(
      ([resourceA], [resourceB]) => {
        const indexA = resourceOrder.indexOf(
          resourceA as keyof typeof resourceConfig,
        );
        const indexB = resourceOrder.indexOf(
          resourceB as keyof typeof resourceConfig,
        );
        // Si no están en resourceConfig, mantener el orden original (al final)
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      },
    );

    // Reconstruir el objeto agrupado en el orden correcto
    const sorted: GroupedPermissions = {};
    sortedEntries.forEach(([resource, perms]) => {
      sorted[resource] = perms;
    });

    return sorted;
  }, [permissions]);

  // Mapa de permisos read - memoizado
  const readPermissionsMap = useMemo(() => {
    const map: Record<string, Permission> = {};
    permissions?.forEach((perm) => {
      if (perm.action === ActionTypeMap.read) {
        map[perm.resource] = perm;
      }
    });
    return map;
  }, [permissions]);

  // Mapa de permisos wildcard - memoizado
  const wildcardPermissionsMap = useMemo(() => {
    const map: Record<string, Permission> = {};
    permissions?.forEach((perm) => {
      if (perm.action === ActionTypeMap["*"]) {
        map[perm.resource] = perm;
      }
    });
    return map;
  }, [permissions]);

  // Funciones memoizadas
  const getReadPermission = useCallback(
    (resource: string): Permission | undefined => {
      return readPermissionsMap[resource];
    },
    [readPermissionsMap],
  );

  const getWildcardPermission = useCallback(
    (resource: string): Permission | undefined => {
      return wildcardPermissionsMap[resource];
    },
    [wildcardPermissionsMap],
  );

  const isReadActive = useCallback(
    (resource: string): boolean => {
      // Verificar si hay CUALQUIER permiso del recurso seleccionado
      const resourcePerms =
        groupedPermissions[resource as keyof typeof groupedPermissions] || [];
      const hasAnyPermission = resourcePerms.some(
        (p: Permission) => selectedPermissions[p.id],
      );

      // También verificar específicamente el permiso read
      const readPerm = getReadPermission(resource);
      const hasReadPermission = readPerm
        ? selectedPermissions[readPerm.id] || false
        : false;

      // El módulo está activo si tiene read O cualquier otro permiso
      return hasReadPermission || hasAnyPermission;
    },
    [getReadPermission, selectedPermissions, groupedPermissions],
  );

  const isWildcardActive = useCallback(
    (resource: string): boolean => {
      const wildcardPerm = getWildcardPermission(resource);
      return wildcardPerm
        ? selectedPermissions[wildcardPerm.id] || false
        : false;
    },
    [getWildcardPermission, selectedPermissions],
  );

  const toggleModule = useCallback(
    (resource: string) => {
      const readPerm = getReadPermission(resource);
      const resourcePerms =
        groupedPermissions[resource as keyof typeof groupedPermissions] || [];

      // Usar isReadActive para verificar si el módulo está activo
      const isCurrentlyActive = isReadActive(resource);

      let newPermissionIds: string[];

      if (isCurrentlyActive) {
        // Desactivar: remover TODOS los permisos del recurso (incluyendo read, wildcard, y específicos)
        newPermissionIds = selectedPermissionIds.filter(
          (id) => !resourcePerms.some((p: Permission) => p.id === id),
        );
      } else {
        // Activar: agregar el permiso read si no está presente
        // Mantener cualquier permiso existente del recurso
        newPermissionIds = [...selectedPermissionIds];
        if (readPerm && !selectedPermissions[readPerm.id]) {
          newPermissionIds.push(readPerm.id);
        }
      }

      onPermissionChange?.(newPermissionIds);
    },
    [
      getReadPermission,
      isReadActive,
      selectedPermissions,
      selectedPermissionIds,
      groupedPermissions,
      onPermissionChange,
    ],
  );

  const togglePermission = useCallback(
    (permId: string, resource: string) => {
      const isCurrentlySelected = selectedPermissions[permId];
      const resourcePerms =
        groupedPermissions[resource as keyof typeof groupedPermissions] || [];
      const wildcardPerm = getWildcardPermission(resource);
      const readPerm = getReadPermission(resource);
      let newPermissionIds: string[];

      // Si es el permiso wildcard
      if (wildcardPerm && permId === wildcardPerm.id) {
        if (isCurrentlySelected) {
          // Desactivar wildcard: mantener solo read si está activo
          newPermissionIds = selectedPermissionIds.filter(
            (id) => id !== wildcardPerm.id,
          );
          // Remover todos los demás permisos del recurso excepto read
          if (readPerm && selectedPermissions[readPerm.id]) {
            // Mantener read
            newPermissionIds = newPermissionIds.filter(
              (id) =>
                id === readPerm.id ||
                !resourcePerms.some((p: Permission) => p.id === id),
            );
          } else {
            // Remover todos los permisos del recurso
            newPermissionIds = newPermissionIds.filter(
              (id) => !resourcePerms.some((p: Permission) => p.id === id),
            );
          }
        } else {
          // Activar wildcard: activar todos los permisos del recurso
          newPermissionIds = [
            ...selectedPermissionIds,
            ...resourcePerms.map((p: Permission) => p.id),
          ];
          // Eliminar duplicados
          newPermissionIds = Array.from(new Set(newPermissionIds));
        }
      } else {
        // Permiso normal (incluyendo read)
        if (isCurrentlySelected) {
          // Remover permiso
          newPermissionIds = selectedPermissionIds.filter(
            (id) => id !== permId,
          );

          // Si se está desactivando read, SIEMPRE desactivar el módulo completo
          if (readPerm && permId === readPerm.id) {
            // SIEMPRE remover TODOS los permisos del recurso cuando se desactiva read
            newPermissionIds = newPermissionIds.filter(
              (id) => !resourcePerms.some((p: Permission) => p.id === id),
            );
          } else {
            // Si se desactiva otro permiso y había wildcard activo, removerlo también
            if (wildcardPerm && selectedPermissions[wildcardPerm.id]) {
              newPermissionIds = newPermissionIds.filter(
                (id) => id !== wildcardPerm.id,
              );
            }
          }
        } else {
          // Agregar permiso
          newPermissionIds = [...selectedPermissionIds, permId];

          // Si se activa cualquier permiso que no sea read, activar automáticamente el read
          if (
            readPerm &&
            permId !== readPerm.id &&
            !selectedPermissions[readPerm.id]
          ) {
            newPermissionIds.push(readPerm.id);
          }

          // Verificar si se han seleccionado todos los permisos específicos
          // Si es así, activar wildcard y deseleccionar los específicos
          if (readPerm && wildcardPerm) {
            // Obtener todos los permisos específicos (read + otros, excluyendo wildcard)
            const allSpecificPerms = resourcePerms.filter(
              (p: Permission) =>
                p.id !== wildcardPerm.id && p.action !== ActionTypeMap["*"],
            );

            // Contar cuántos permisos específicos están seleccionados (incluyendo el que acabamos de agregar)
            const selectedSpecificCount = allSpecificPerms.filter(
              (p: Permission) => newPermissionIds.includes(p.id),
            ).length;

            // Si todos los permisos específicos están seleccionados, activar wildcard
            if (
              selectedSpecificCount === allSpecificPerms.length &&
              !selectedPermissions[wildcardPerm.id]
            ) {
              // Agregar wildcard
              newPermissionIds.push(wildcardPerm.id);
              // Remover todos los permisos específicos excepto read
              // El wildcard incluye todos los permisos, pero mantenemos read explícitamente
              newPermissionIds = newPermissionIds.filter((id) => {
                // Mantener read y wildcard
                if (id === readPerm.id || id === wildcardPerm.id) {
                  return true;
                }
                // Remover todos los demás permisos del recurso
                return !resourcePerms.some((p: Permission) => p.id === id);
              });
              // Asegurar que read esté presente
              if (readPerm && !newPermissionIds.includes(readPerm.id)) {
                newPermissionIds.push(readPerm.id);
              }
            }
          }
        }
      }

      onPermissionChange?.(newPermissionIds);
    },
    [
      selectedPermissions,
      selectedPermissionIds,
      getReadPermission,
      getWildcardPermission,
      groupedPermissions,
      onPermissionChange,
    ],
  );

  // Calcular si todos los paneles están expandidos o contraídos
  // Estos hooks deben estar antes de los returns tempranos
  const activeResources = useMemo(() => {
    if (!groupedPermissions) return [];
    return getResourceEntries(groupedPermissions)
      .filter(([resource]) => isReadActive(resource))
      .map(([resource]) => resource);
  }, [groupedPermissions, isReadActive]);

  const allExpanded = useMemo(() => {
    if (activeResources.length === 0) return false;
    return activeResources.every(
      (resource) => expandedPanels[resource] === true,
    );
  }, [activeResources, expandedPanels]);

  const allCollapsed = useMemo(() => {
    if (activeResources.length === 0) return false;
    return activeResources.every(
      (resource) => expandedPanels[resource] === false,
    );
  }, [activeResources, expandedPanels]);

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center border border-destructive/20 rounded-lg bg-destructive/5">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">
              Error al cargar los permisos
            </p>
            <p className="text-xs text-muted-foreground">
              Por favor, intenta recargar la página
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!permissions || permissions.length === 0) {
    return (
      <div className="p-8 text-center border border-border/60 rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No hay permisos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sección de acciones rápidas y búsqueda */}
      {getResourceEntries(groupedPermissions).some(([resource]) =>
        isReadActive(resource),
      ) && (
        <section className="space-y-3 pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              Acciones rápidas
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Busca permisos en los módulos activos de la columna derecha
            </p>
          </div>
          <div className="flex items-center gap-3">
            <InputGroup className="flex-1">
              <InputGroupAddon align="inline-start">
                <Search className="w-4 h-4" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="Buscar por acción (crear, actualizar, exportar...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            <ButtonGroup orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newState: Record<string, boolean> = {};
                  activeResources.forEach((resource) => {
                    newState[resource] = true;
                  });
                  setExpandedPanels(newState);
                }}
                disabled={allExpanded}
                className="h-9 text-xs"
              >
                <ChevronDown className="w-3.5 h-3.5 mr-1.5" />
                Expandir todo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newState: Record<string, boolean> = {};
                  activeResources.forEach((resource) => {
                    newState[resource] = false;
                  });
                  setExpandedPanels(newState);
                }}
                disabled={allCollapsed}
                className="h-9 text-xs"
              >
                <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
                Contraer todo
              </Button>
            </ButtonGroup>
          </div>
        </section>
      )}

      {/* Grid de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda - Lista de módulos */}
        <div className="space-y-3">
          {getResourceEntries(groupedPermissions).map(([resource, perms]) => (
            <ResourceModuleItem
              key={resource}
              resource={resource}
              permissions={perms}
              isActive={isReadActive(resource)}
              onToggle={toggleModule}
            />
          ))}
        </div>

        {/* Columna derecha - Detalles de permisos */}
        <div className="space-y-3">
          {getResourceEntries(groupedPermissions).map(([resource, perms]) => {
            const readActive = isReadActive(resource);
            if (!readActive) return null;

            const ResourceIcon = getResourceIcon(resource);
            const resourceName = translateResource(resource);
            const wildcardPerm = getWildcardPermission(resource);
            const hasWildcard = !!wildcardPerm;
            const isWildcardActiveForResource = isWildcardActive(resource);
            const readPerm = getReadPermission(resource);

            // Filtrar permisos: excluir read y wildcard
            let otherPerms = perms.filter(
              (p: Permission) =>
                p.action !== ActionTypeMap.read &&
                p.action !== ActionTypeMap["*"],
            );

            // Filtrar por búsqueda si hay query
            let showReadPerm = !!readPerm;
            let showWildcardPerm = !!(hasWildcard && wildcardPerm);

            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase().trim();

              // Filtrar otros permisos
              otherPerms = otherPerms.filter((p: Permission) => {
                const actionName = translateAction(p.action).toLowerCase();
                const description = (p.description || "").toLowerCase();
                return (
                  actionName.includes(query) || description.includes(query)
                );
              });

              // Verificar si read coincide con la búsqueda
              if (readPerm) {
                const readActionName = translateAction(
                  readPerm.action,
                ).toLowerCase();
                const readDescription = (
                  readPerm.description || ""
                ).toLowerCase();
                showReadPerm =
                  readActionName.includes(query) ||
                  readDescription.includes(query);
              }

              // Verificar si wildcard coincide con la búsqueda
              if (wildcardPerm) {
                const wildcardActionName = translateAction(
                  wildcardPerm.action,
                ).toLowerCase();
                const wildcardDescription = (
                  wildcardPerm.description || ""
                ).toLowerCase();
                showWildcardPerm =
                  wildcardActionName.includes(query) ||
                  wildcardDescription.includes(query);
              }
            }

            // Si no hay resultados después del filtro, no mostrar el panel
            if (otherPerms.length === 0 && !showReadPerm && !showWildcardPerm) {
              return null;
            }

            // Calcular total incluyendo read (NO incluir wildcard en el conteo)
            // El wildcard es una opción especial que reemplaza a los demás
            const totalCount = otherPerms.length + (showReadPerm ? 1 : 0);

            // Calcular enabled incluyendo read
            const enabledCount = isWildcardActiveForResource
              ? totalCount
              : otherPerms.filter((p: Permission) => selectedPermissions[p.id])
                  .length +
                (showReadPerm && readPerm && selectedPermissions[readPerm.id]
                  ? 1
                  : 0);

            return (
              <ResourcePermissionsPanel
                key={resource}
                resource={resource}
                resourceName={resourceName}
                ResourceIcon={ResourceIcon}
                readPerm={showReadPerm ? readPerm : undefined}
                wildcardPerm={showWildcardPerm ? wildcardPerm : undefined}
                hasWildcard={showWildcardPerm}
                isWildcardActive={isWildcardActiveForResource}
                otherPerms={otherPerms}
                enabledCount={enabledCount}
                totalCount={totalCount}
                selectedPermissions={selectedPermissions}
                onTogglePermission={togglePermission}
                open={expandedPanels[resource]}
                onOpenChange={(open) => {
                  setExpandedPanels((prev) => ({
                    ...prev,
                    [resource]: open,
                  }));
                }}
              />
            );
          })}
          {getResourceEntries(groupedPermissions).every(
            ([resource]) => !isReadActive(resource),
          ) && (
            <div className="p-8 text-center border border-border/60 rounded-lg bg-muted/20">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    No hay módulos activos
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Activa un módulo en la columna izquierda para configurar sus
                    permisos
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
