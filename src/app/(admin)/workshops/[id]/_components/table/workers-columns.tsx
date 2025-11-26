"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Mail, Phone, UserCircle } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header-props";
import { ActiveStatusBadge } from "@/components/ui/active-status-badge";
import { cn } from "@/lib/utils";
import { formatPeruDateHour } from "@/utils/peru-datetime";
import {
  getIdDocumentTypeIcon,
  getIdDocumentTypeIconClasses,
  getIdDocumentTypeLabel,
} from "../../../_shared/_utils/id-document-types";
import { WorkerResponse } from "../../_types/workers.types";
import WorkersTableActions from "./workers-table-actions";

export const workersColumns = (): ColumnDef<WorkerResponse>[] => [
  {
    id: "nombre",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold capitalize flex items-center gap-2">
        <UserCircle className="size-4 text-muted-foreground" />
        {row.getValue("nombre")}
      </div>
    ),
  },
  {
    id: "documento",
    accessorKey: "idDocumentType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo Doc." />
    ),
    cell: ({ row }) => {
      const idDocumentType = row.getValue("documento") as string;
      const Icon = getIdDocumentTypeIcon(idDocumentType);
      const iconClasses = getIdDocumentTypeIconClasses(idDocumentType);
      const label = getIdDocumentTypeLabel(idDocumentType);

      return (
        <div className="flex items-center gap-2">
          <Icon className={cn(iconClasses, "size-4")} />
          <span>{label}</span>
        </div>
      );
    },
  },
  {
    id: "numeroDocumento",
    accessorKey: "idNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N° Documento" />
    ),
    cell: ({ row }) => (
      <div className="font-mono">{row.getValue("numeroDocumento")}</div>
    ),
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
    id: "telefono",
    accessorKey: "phone",
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
    id: "createdAt",
    meta: {
      title: "Creación",
    },
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creación" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 truncate max-w-[200px]">
        <Calendar className="size-4 text-muted-foreground shrink-0" />
        <span className="truncate">
          {formatPeruDateHour(row.getValue("createdAt"))}
        </span>
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
      <div className="truncate max-w-[300px]">
        <ActiveStatusBadge isActive={row.original.isActive} />
      </div>
    ),
  },
  {
    id: "actions",
    size: 20,
    cell: ({ row }) => {
      return <WorkersTableActions row={row} />;
    },
  },
];
