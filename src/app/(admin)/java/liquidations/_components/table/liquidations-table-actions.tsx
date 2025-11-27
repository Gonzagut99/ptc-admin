"use client";

import { Row } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Plus, CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { LiquidationWithDetailsDto } from "../../_types/liquidations.types";
import { MODULE_LIQUIDATIONS } from "../overlays/liquidations-dialogs";

interface LiquidationsTableActionsProps {
  row: Row<LiquidationWithDetailsDto>;
}

export default function LiquidationsTableActions({
  row,
}: LiquidationsTableActionsProps) {
  const { open } = useDialogStore();
  const liquidation = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => open(MODULE_LIQUIDATIONS, "details", liquidation)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver detalles
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => open(MODULE_LIQUIDATIONS, "add-service", liquidation)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar servicio
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => open(MODULE_LIQUIDATIONS, "add-payment", liquidation)}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Registrar pago
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => open(MODULE_LIQUIDATIONS, "add-incidency", liquidation)}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Reportar incidencia
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
