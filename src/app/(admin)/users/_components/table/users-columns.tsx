"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Mail, User } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header-props";
import { ActiveStatusBadge } from "@/components/ui/active-status-badge";
import { formatPeruDateHour } from "@/utils/peru-datetime";
import { DUser } from "../../_types/users.types";
import UsersTableActions from "./users-table-actions";

export const usersColumns = (): ColumnDef<DUser>[] => [
  {
    id: "usuario",
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuario" />
    ),
    cell: ({ row }) => {
      const userName = row.getValue("usuario") as string | undefined;
      return (
        <div className="font-semibold flex items-center gap-2">
          <User className="size-4 text-muted-foreground" />
          {userName || "-"}
        </div>
      );
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string | undefined;
      return email ? (
        <div className="flex items-center gap-2 truncate max-w-[250px]">
          <Mail className="size-4 text-muted-foreground shrink-0" />
          <span className="truncate">{email}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: "estado",
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      <ActiveStatusBadge isActive={row.original.isActive ?? true} />
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creación" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string | undefined;
      return date ? (
        <div className="flex items-center gap-2 truncate max-w-[180px]">
          <Calendar className="size-4 text-muted-foreground shrink-0" />
          <span className="truncate">{formatPeruDateHour(date)}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: "actions",
    size: 20,
    cell: ({ row }) => {
      return <UsersTableActions row={row} />;
    },
  },
];
