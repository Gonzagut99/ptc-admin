"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar, DollarSign, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header-props";
import { cn } from "@/lib/utils";
import { formatPeruDate, formatPeruDateHour } from "@/utils/peru-datetime";
import {
  LiquidationWithDetailsDto,
  LIQUIDATION_STATUS_COLORS,
  LIQUIDATION_STATUS_LABELS,
  LiquidationStatus,
  PAYMENT_STATUS_LABELS,
  PaymentStatus,
} from "../../_types/liquidations.types";
import LiquidationsTableActions from "./liquidations-table-actions";

export const liquidationsColumns = (): ColumnDef<LiquidationWithDetailsDto>[] => [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm">#{row.getValue("id")}</span>
    ),
  },
  {
    id: "cliente",
    accessorFn: (row) =>
      row.customer
        ? `${row.customer.firstName ?? ""} ${row.customer.lastName ?? ""}`.trim()
        : "-",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="size-4 text-muted-foreground" />
        <span className="font-medium">{row.getValue("cliente")}</span>
      </div>
    ),
  },
  {
    id: "personal",
    accessorFn: (row) =>
      row.staff_on_charge?.user?.userName ||
      row.staff_on_charge?.user?.email ||
      "-",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personal" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 truncate max-w-[150px]">
        <Users className="size-4 text-muted-foreground shrink-0" />
        <span className="truncate">{row.getValue("personal")}</span>
      </div>
    ),
  },
  {
    id: "estado",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("estado") as LiquidationStatus;
      return (
        <Badge
          className={cn(
            "capitalize",
            LIQUIDATION_STATUS_COLORS[status] || "bg-gray-100 text-gray-800",
          )}
        >
          {LIQUIDATION_STATUS_LABELS[status] || status}
        </Badge>
      );
    },
  },
  {
    id: "estadoPago",
    accessorKey: "payment_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pago" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("estadoPago") as PaymentStatus;
      return (
        <Badge variant="outline">
          {PAYMENT_STATUS_LABELS[status] || status}
        </Badge>
      );
    },
  },
  {
    id: "montoTotal",
    accessorKey: "total_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto Total" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("montoTotal") as number | undefined;
      return (
        <div className="flex items-center gap-2">
          <DollarSign className="size-4 text-muted-foreground" />
          <span className="font-mono">
            {amount ? `S/ ${amount.toFixed(2)}` : "-"}
          </span>
        </div>
      );
    },
  },
  {
    id: "acompanantes",
    accessorKey: "companion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acomp." />
    ),
    cell: ({ row }) => {
      const companion = row.getValue("acompanantes") as number | undefined;
      return <span className="text-center">{companion ?? 0}</span>;
    },
  },
  {
    id: "fechaLimite",
    accessorKey: "payment_deadline",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Límite" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("fechaLimite") as string | undefined;
      return date ? (
        <div className="flex items-center gap-2 truncate max-w-[120px]">
          <Calendar className="size-4 text-muted-foreground shrink-0" />
          <span className="truncate">{formatPeruDate(date)}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: "creacion",
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creación" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("creacion") as string | undefined;
      return date ? (
        <span className="text-sm truncate max-w-[130px] block">
          {formatPeruDateHour(date)}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: "actions",
    size: 20,
    cell: ({ row }) => {
      return <LiquidationsTableActions row={row} />;
    },
  },
];
