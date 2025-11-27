"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header-props";
import { formatPeruDate } from "@/utils/peru-datetime";
import { DCustomer, ID_DOCUMENT_TYPE_LABELS, IdDocumentType } from "../../_types/customers.types";
import CustomersTableActions from "./customers-table-actions";

export const customersColumns = (): ColumnDef<DCustomer>[] => [
  {
    id: "nombre",
    accessorFn: (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre Completo" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold capitalize flex items-center gap-2">
        <User className="size-4 text-muted-foreground" />
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
      const type = row.getValue("documento") as IdDocumentType;
      return (
        <span className="text-sm">
          {ID_DOCUMENT_TYPE_LABELS[type] || type}
        </span>
      );
    },
  },
  {
    id: "numeroDocumento",
    accessorKey: "idDocumentNumber",
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
    id: "nacionalidad",
    accessorKey: "nationality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nacionalidad" />
    ),
    cell: ({ row }) => {
      const nationality = row.getValue("nacionalidad") as string | undefined;
      return nationality ? (
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />
          <span>{nationality}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: "fechaNacimiento",
    accessorKey: "birthDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Nacimiento" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("fechaNacimiento") as string | undefined;
      return date ? (
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <span>{formatPeruDate(date)}</span>
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
      return <CustomersTableActions row={row} />;
    },
  },
];
