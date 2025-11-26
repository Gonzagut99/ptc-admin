"use client";
import { ColumnDef } from "@tanstack/react-table";
import { IdCard } from "lucide-react";
import { Fragment } from "react";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { getRoleInfo } from "@/app/(admin)/admin/_shared/_utils/roles";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header-props";
import { ActiveStatusBadge } from "@/components/ui/active-status-badge";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import {
  getResourceIcon,
  translateAction,
  translateResource,
} from "@/utils/permissions";
import { UserDetailResponse } from "../../_types/users.types";
import UsersTableActions from "./users-table-actions";

export const usersColumns = (): ColumnDef<UserDetailResponse>[] => [
  {
    id: "documentType",
    meta: {
      title: "Tipo de documento",
    },
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Documento" />
    ),
    cell: ({ row }) => (
      <div className="font-medium flex items-center gap-2">
        {row.original.idDocumentType !== "DNI" ? (
          <IdCard strokeWidth={1.5} />
        ) : (
          <IdCard strokeWidth={1.5} />
        )}
        {row.original.idNumber}
      </div>
    ),
  },
  {
    id: "name",
    meta: {
      title: "Nombre completo",
    },
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre completo" />
    ),
    cell: ({ row }) => (
      <div className="capitalize flex items-center gap-2">
        <span className="font-semibold">{row.original.name}</span>
        <span>{row.original.lastName}</span>
      </div>
    ),
  },
  {
    id: "email",
    meta: {
      title: "Correo electrónico",
    },
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correo electrónico" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[300px]">{row.original.email}</div>
    ),
  },
  {
    id: "phone",
    meta: {
      title: "Teléfono",
    },
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[300px]">
        {row.original.phone ? formatPhoneNumberIntl(row.original.phone) : "-"}
      </div>
    ),
  },
  {
    id: "post",
    meta: {
      title: "Cargo",
    },
    accessorKey: "post",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cargo" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[300px]">
        {row.original.post ? row.original.post : "-"}
      </div>
    ),
  },
  {
    id: "roles",
    meta: {
      title: "Roles",
    },
    accessorKey: "roles",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
    cell: ({ row }) => {
      const roles = row.original.roles || [];

      if (roles.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <HoverCard>
          <HoverCardTrigger className="cursor-help">
            <div className="flex flex-wrap gap-1.5">
              {roles.map((role, index) => {
                const roleInfo = getRoleInfo(role.name);
                const Icon = roleInfo.icon;
                return (
                  <Badge
                    key={role.id || index}
                    variant="outline"
                    className={roleInfo.badgeClasses}
                  >
                    <Icon className={roleInfo.iconClasses} />
                    <span className="ml-1.5 capitalize font-semibold">
                      {role.name}
                    </span>
                  </Badge>
                );
              })}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-3">Roles asignados</h4>
              </div>
              {roles.map((role, index) => {
                const roleInfo = getRoleInfo(role.name);
                const Icon = roleInfo.icon;
                return (
                  <Fragment key={role.id || index}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className={roleInfo.iconClasses} />
                        <span className="capitalize font-semibold">
                          {role.name}
                        </span>
                        {role.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Por defecto
                          </Badge>
                        )}
                      </div>
                      {role.description && (
                        <p className="text-sm text-muted-foreground pl-6">
                          {role.description}
                        </p>
                      )}
                      {role.permissions && role.permissions.length > 0 && (
                        <div className="pl-6">
                          {(() => {
                            // Filtrar permisos: si hay un permiso *:resource,
                            // no mostrar los permisos específicos de ese recurso
                            const wildcardResources = new Set(
                              role.permissions
                                .filter((p) => p.action === "*")
                                .map((p) => p.resource),
                            );

                            const filteredPermissions = role.permissions.filter(
                              (permission) => {
                                // Si es un permiso wildcard, incluirlo
                                if (permission.action === "*") {
                                  return true;
                                }
                                // Si hay un wildcard para este recurso, excluir este permiso específico
                                if (
                                  wildcardResources.has(permission.resource)
                                ) {
                                  return false;
                                }
                                return true;
                              },
                            );

                            return (
                              <>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Permisos ({role.permissions.length}
                                  ):
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {filteredPermissions
                                    .slice(0, 5)
                                    .map((permission) => {
                                      const ResourceIcon = getResourceIcon(
                                        permission.resource,
                                      );

                                      return (
                                        <Badge
                                          key={permission.id}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          <ResourceIcon className="w-3 h-3 mr-1 shrink-0" />
                                          <span>
                                            {translateAction(permission.action)}
                                          </span>
                                          <span className="mx-1">•</span>
                                          <span>
                                            {translateResource(
                                              permission.resource,
                                            )}
                                          </span>
                                        </Badge>
                                      );
                                    })}
                                  {filteredPermissions.length > 5 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{filteredPermissions.length - 5} más
                                    </Badge>
                                  )}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                    {index < roles.length - 1 && <Separator />}
                  </Fragment>
                );
              })}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    id: "isActive",
    meta: {
      title: "Estado",
    },
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[300px]">
        <ActiveStatusBadge isActive={row.original.isActive} />
      </div>
    ),
  },
  {
    id: "actions",
    size: 20,
    cell: ({ row }) => {
      return <UsersTableActions row={row} />;
    },
  },
];
