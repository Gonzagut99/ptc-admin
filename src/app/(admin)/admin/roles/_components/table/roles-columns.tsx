"use client";

import { ColumnDef } from "@tanstack/react-table";
import { KeyRound } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header-props";
import { ActiveStatusBadge } from "@/components/ui/active-status-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPeruDateHour } from "@/utils/peru-datetime";
import { getRoleInfo } from "../../../_shared/_utils/roles";
import { RoleDetailResponse } from "../../_types/roles.types";
import RolesTableActions from "./roles-table-actions";

export const rolesColumns = (): ColumnDef<RoleDetailResponse>[] => [
  {
    id: "nombre",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      const roleInfo = getRoleInfo(row.original.name);
      const Icon = roleInfo.icon;

      return (
        <div className="font-semibold capitalize flex items-center gap-2">
          <Icon className={cn("size-4 shrink-0")} />
          {row.getValue("nombre")}
        </div>
      );
    },
  },
  {
    id: "descripcion",
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("descripcion") as
        | string
        | null
        | undefined;
      const hasDescription =
        description &&
        typeof description === "string" &&
        description.trim().length > 0;

      return (
        <div className="truncate max-w-[300px]">
          {hasDescription ? (
            description
          ) : (
            <span className="text-muted-foreground">Sin descripción</span>
          )}
        </div>
      );
    },
  },
  {
    id: "countPermissions",
    meta: {
      title: "Asignados",
    },
    accessorKey: "countPermissions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asignados" />
    ),
    cell: ({ row }) => {
      const permissions = row.original.permissions || [];

      // Filtrar permisos: si hay un permiso *:resource,
      // no contar los permisos específicos de ese recurso
      const wildcardResources = new Set(
        permissions.filter((p) => p.action === "*").map((p) => p.resource),
      );

      const filteredPermissions = permissions.filter((permission) => {
        // Si es un permiso wildcard, incluirlo
        if (permission.action === "*") {
          return true;
        }
        // Si hay un wildcard para este recurso, excluir este permiso específico
        if (wildcardResources.has(permission.resource)) {
          return false;
        }
        return true;
      });

      const count = filteredPermissions.length;

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono tracking-tight border-dashed"
          >
            <KeyRound className="size-3.5 opacity-60" />
            <span className="tabular-nums">
              {count} {count > 1 ? "permisos" : "permiso"}
            </span>
          </Badge>
        </div>
      );
    },
  },
  {
    id: "createdAt",
    meta: {
      title: "Fecha de creación",
    },
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[300px]">
        {formatPeruDateHour(row.getValue("createdAt"))}
      </div>
    ),
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
      return <RolesTableActions row={row} />;
    },
  },
];
