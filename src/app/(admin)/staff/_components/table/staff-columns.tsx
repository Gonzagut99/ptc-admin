"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Briefcase, Calendar, DollarSign, Mail, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header-props";
import { ActiveStatusBadge } from "@/components/ui/active-status-badge";
import { formatPeruDateHour } from "@/utils/peru-datetime";
import {
  DStaff,
  STAFF_ROLE_LABELS,
  StaffRole,
  CURRENCY_LABELS,
  Currency,
} from "../../_types/staff.types";
import StaffTableActions from "./staff-table-actions";

export const staffColumns = (): ColumnDef<DStaff>[] => [
  {
    id: "usuario",
    accessorFn: (row) => row.user?.userName || row.user?.email || "-",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuario" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold flex items-center gap-2">
        <User className="size-4 text-muted-foreground" />
        {row.getValue("usuario")}
      </div>
    ),
  },
  {
    id: "email",
    accessorFn: (row) => row.user?.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string | undefined;
      return email ? (
        <div className="flex items-center gap-2 truncate max-w-[200px]">
          <Mail className="size-4 text-muted-foreground shrink-0" />
          <span className="truncate">{email}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: "rol",
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("rol") as StaffRole;
      return (
        <div className="flex items-center gap-2">
          <Briefcase className="size-4 text-muted-foreground" />
          <Badge variant="outline">
            {STAFF_ROLE_LABELS[role] || role}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "telefono",
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
    cell: ({ row }) => {
      const phone = row.getValue("telefono") as string | undefined;
      return phone ? (
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-muted-foreground" />
          <span>{phone}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: "salario",
    accessorFn: (row) => {
      if (!row.salary) return "-";
      const currency = CURRENCY_LABELS[row.currency as Currency] || row.currency;
      return `${currency} ${row.salary.toFixed(2)}`;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salario" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {/* <DollarSign className="size-4 text-muted-foreground" /> */}
        <span className="font-mono">{row.getValue("salario")}</span>
      </div>
    ),
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
    id: "fechaContratacion",
    accessorKey: "hireDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contratación" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("fechaContratacion") as string | undefined;
      return date ? (
        <div className="flex items-center gap-2 truncate max-w-[150px]">
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
      return <StaffTableActions row={row} />;
    },
  },
];
