"use client";

import { Calendar, CheckCircle2, Hash, Search, Shield, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ActiveStatusBadge } from "@/components/ui/active-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogContentComponent,
  DialogError,
  DialogLoading,
  DialogScrollArea,
} from "@/components/ui/dialog-responsive";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  GroupedPermissions,
  getResourceEntries,
  Permission,
  resourceConfig,
} from "@/utils/permissions";
import { formatPeruDateHour } from "@/utils/peru-datetime";
import { getRoleInfo } from "../../../_shared/_utils/roles";
import { useGetRole } from "../../_hooks/roles-hooks";

interface RoleDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string;
}

export default function RoleDetail({
  open,
  onOpenChange,
  roleId,
}: RoleDetailProps) {
  const { data: role, isLoading, error } = useGetRole(roleId || "");
  const [searchTerm, setSearchTerm] = useState("");

  // Agrupar permisos por recurso
  const groupedPermissions = useMemo<GroupedPermissions>(() => {
    if (!role?.permissions) return {};

    return role.permissions.reduce((acc, perm) => {
      const resourcePerms = acc[perm.resource];
      if (!resourcePerms) {
        acc[perm.resource] = [perm];
      } else {
        resourcePerms.push(perm);
      }
      return acc;
    }, {} as GroupedPermissions);
  }, [role]);

  // Filtrar permisos por término de búsqueda
  const filteredGroupedPermissions = useMemo<GroupedPermissions>(() => {
    if (!searchTerm.trim()) return groupedPermissions;

    const filtered: GroupedPermissions = {};

    getResourceEntries(groupedPermissions).forEach(
      ([resource, permissions]) => {
        const filteredPermissions = permissions.filter(
          (permission) =>
            permission.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            permission.action
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            permission.resource
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );

        if (filteredPermissions.length > 0) {
          filtered[resource] = filteredPermissions;
        }
      },
    );

    return filtered;
  }, [groupedPermissions, searchTerm]);

  if (isLoading) {
    return (
      <DialogLoading
        open={open}
        onOpenChange={onOpenChange}
        title="Cargando información del rol..."
        description="Espera un momento mientras cargamos la información del rol."
      />
    );
  }

  if (error || !role) {
    return (
      <DialogError
        open={open}
        onOpenChange={onOpenChange}
        title="Error al cargar la información del rol"
        description="No se pudo cargar la información del rol."
      >
        <span className="text-destructive">
          Error:{" "}
          {typeof error?.error?.message === "string"
            ? error.error.message
            : "Error desconocido"}
        </span>
      </DialogError>
    );
  }

  const roleInfo = getRoleInfo(role.name);
  const RoleIcon = roleInfo.icon;

  return (
    <DialogContentComponent
      open={open}
      onOpenChange={onOpenChange}
      title={`Detalle de rol ${role.name}`}
      description={"Aquí puedes ver la información del rol."}
      className="sm:max-w-4xl"
    >
      <DialogScrollArea className="h-[calc(100dvh-200px)] px-1">
        <div className="space-y-6 px-6">
          {/* Información General */}
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <RoleIcon className="h-5 w-5" />
                    Información General
                  </CardTitle>
                  <CardDescription>
                    Detalles del rol {role.name}
                  </CardDescription>
                </div>
                <ActiveStatusBadge
                  isActive={role.isActive ?? false}
                  className="text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Descripción del rol */}
              {role.description && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Descripción
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Información principal - grid variado */}

              {/* Total de permisos */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                  <Hash className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Total de permisos
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {role.permissions?.length || 0}
                  </p>
                </div>
              </div>

              {/* Tipo de rol */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Tipo de rol
                  </p>
                  <div className="flex items-center gap-2">
                    {role.isDefault ? (
                      <p className="text-sm text-foreground leading-relaxed">
                        Por defecto
                      </p>
                    ) : (
                      <p className="text-sm text-foreground leading-relaxed">
                        Personalizado
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Información de fechas - diseño compacto horizontal */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground mr-1.5">
                    Creación:
                  </span>
                  <span className="font-medium">
                    {formatPeruDateHour(role.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground mr-1.5">
                    Actualización:
                  </span>
                  <span className="font-medium">
                    {formatPeruDateHour(role.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permisos */}
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Permisos
                  </CardTitle>
                  <CardDescription>Permisos asignados al rol</CardDescription>
                </div>
                {role.permissions && role.permissions.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {role.permissions.length} permisos
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.keys(groupedPermissions).length === 0 ? (
                <div>
                  <h4 className="text-sm font-semibold mb-3">Permisos</h4>
                  <p className="text-sm text-muted-foreground">
                    Sin permisos asignados
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold">
                      Permisos por recurso
                    </h4>
                    {/* Input de búsqueda compacto */}
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar permisos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-8 h-8 text-sm"
                      />
                      {searchTerm && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchTerm("")}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {searchTerm && (
                    <div className="mb-4 text-xs text-muted-foreground">
                      {Object.keys(filteredGroupedPermissions).length > 0 ? (
                        <>
                          Mostrando{" "}
                          {
                            Object.values(filteredGroupedPermissions).flat()
                              .length
                          }{" "}
                          de {role.permissions?.length || 0} permisos
                        </>
                      ) : (
                        <>
                          No se encontraron resultados para &quot;{searchTerm}
                          &quot;
                        </>
                      )}
                    </div>
                  )}

                  {/* Permisos agrupados */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getResourceEntries(filteredGroupedPermissions).map(
                      ([resource, permissions]) => {
                        const config = resourceConfig[resource];
                        const IconComponent = config?.icon || Shield;

                        // Agrupar permisos por acción
                        const permissionsByAction = permissions.reduce(
                          (acc, perm) => {
                            const action = String(perm.action);
                            if (!acc[action]) {
                              acc[action] = [];
                            }
                            acc[action].push(perm);
                            return acc;
                          },
                          {} as Record<string, Permission[]>,
                        );

                        return (
                          <div
                            key={resource}
                            className="border rounded-md p-4 space-y-3"
                          >
                            {/* Header del recurso */}
                            <div className="flex items-center gap-3 pb-2 border-b">
                              <div className="p-2 rounded-md bg-muted">
                                <IconComponent className="h-4 w-4 text-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">
                                  {config?.name || resource}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {permissions.length}{" "}
                                  {permissions.length === 1
                                    ? "permiso"
                                    : "permisos"}
                                </p>
                              </div>
                            </div>

                            {/* Permisos agrupados por acción */}
                            <div className="space-y-2">
                              {Object.entries(permissionsByAction).map(
                                ([action, actionPermissions]) => (
                                  <div key={action} className="space-y-1.5">
                                    <div className="pl-2 space-y-1">
                                      {actionPermissions.map(
                                        (permission: Permission) => (
                                          <div
                                            key={permission.id}
                                            className="flex items-center gap-2 text-sm text-muted-foreground"
                                          >
                                            <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                                            <span className="leading-relaxed">
                                              {permission.description}
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogScrollArea>
    </DialogContentComponent>
  );
}
