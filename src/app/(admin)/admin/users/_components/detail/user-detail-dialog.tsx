"use client";

import {
  Calendar,
  CheckCircle2,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Search,
  Shield,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  GroupedPermissions,
  getResourceEntries,
  Permission,
  resourceConfig,
} from "@/utils/permissions";
import { formatPeruDateHour } from "@/utils/peru-datetime";
import { getRoleIcon, getRoleIconClasses } from "../../../_shared/_utils/roles";
import { useGetUser } from "../../_hooks/users-hooks";

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export default function UserDetailDialog({
  open,
  onOpenChange,
  userId,
}: UserDetailDialogProps) {
  const { data: user, isLoading, error } = useGetUser(userId);
  const [searchTerm, setSearchTerm] = useState("");

  // Combinar todos los permisos de todos los roles
  const allPermissions = useMemo(() => {
    const permissionsMap = new Map<string, Permission>();

    user?.roles?.forEach((role) => {
      role?.permissions?.forEach((permission) => {
        if (!permissionsMap.has(permission.id)) {
          permissionsMap.set(permission.id, permission);
        }
      });
    });

    return Array.from(permissionsMap.values());
  }, [user]);

  // Agrupar permisos por recurso
  const groupedPermissions = useMemo<GroupedPermissions>(() => {
    if (!allPermissions.length) return {};

    return allPermissions.reduce((acc, perm) => {
      const resourcePerms = acc[perm.resource];
      if (!resourcePerms) {
        acc[perm.resource] = [perm];
      } else {
        resourcePerms.push(perm);
      }
      return acc;
    }, {} as GroupedPermissions);
  }, [allPermissions]);

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
        title="Cargando detalles del usuario..."
        description="Espera un momento mientras cargamos la información."
      />
    );
  }

  if (error || !user) {
    return (
      <DialogError
        open={open}
        onOpenChange={onOpenChange}
        title="Error al cargar los detalles del usuario"
        description="Ha ocurrido un error mientras cargamos la información."
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

  return (
    <DialogContentComponent
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de usuario"
      description="Aquí puedes ver la información del usuario."
      className="sm:max-w-4xl"
    >
      <DialogScrollArea className="h-[calc(100dvh-200px)] px-1">
        <div className="space-y-6 px-6">
          {/* Información Personal */}
          <Card>
            <CardHeader className="flex items-center justify-between border-b [.border-b]:pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary/20 bg-primary/5">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      Nombre completo
                    </p>
                    <p className="text-lg font-semibold">
                      {user?.name} {user?.lastName}
                    </p>
                  </div>
                </div>
              </CardTitle>
              <ActiveStatusBadge
                isActive={user?.isActive ?? false}
                className="text-xs"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nombre destacado - diseño especial */}

              {/* Información principal - grid variado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Documento - diseño vertical */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <IdCard className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {user?.idDocumentType}
                    </p>
                  </div>
                  <p className="text-base font-semibold">{user?.idNumber}</p>
                </div>

                {/* Email - diseño con badge */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Correo
                      </p>
                    </div>
                    {user?.emailVerified && (
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/20 bg-primary/5 text-primary"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold break-all">
                    {user?.email}
                  </p>
                </div>

                {/* Teléfono - diseño compacto */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Teléfono
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{user?.phone || "-"}</p>
                </div>

                {/* Cargo - diseño compacto */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Cargo
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{user?.post || "-"}</p>
                </div>
              </div>

              {/* Dirección - diseño ancho completo si existe */}
              {user?.address && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Dirección
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{user?.address}</p>
                </div>
              )}

              <Separator />

              {/* Información de fechas - diseño compacto horizontal */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground mr-1.5">
                    Creación:
                  </span>
                  <span className="font-medium">
                    {formatPeruDateHour(user?.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground mr-1.5">
                    Actualización:
                  </span>
                  <span className="font-medium">
                    {formatPeruDateHour(user?.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roles y Permisos */}
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Roles y Permisos
                  </CardTitle>
                  <CardDescription>
                    Roles asignados y permisos consolidados
                  </CardDescription>
                </div>
                {allPermissions.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {allPermissions.length} permisos
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Roles */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Roles asignados</h4>
                {user?.roles && user.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => {
                      const IconComponent = getRoleIcon(role.name);
                      const iconClasses = getRoleIconClasses(role.name);

                      const RoleIcon =
                        IconComponent === ShieldCheck
                          ? ShieldCheck
                          : IconComponent === User
                            ? User
                            : Shield;

                      return (
                        <div
                          key={role.id}
                          className="flex items-center gap-2 px-3 py-2 border rounded-md bg-background"
                        >
                          <RoleIcon
                            className={cn(iconClasses, "h-4 w-4 shrink-0")}
                          />
                          <span className="text-sm font-medium capitalize">
                            {role.name}
                          </span>
                          {role.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Por defecto
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Sin roles asignados
                  </p>
                )}
              </div>

              {/* Separador */}
              {user?.roles &&
                user.roles.length > 0 &&
                Object.keys(groupedPermissions).length > 0 && <Separator />}

              {/* Permisos */}
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
                          de {allPermissions.length} permisos
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
