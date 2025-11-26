"use client";

import { Row } from "@tanstack/react-table";
import {
  Archive,
  Edit,
  Eye,
  MoreVertical,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProtectedComponent } from "@/components/ui/protected-component";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { useDeactivateToggleWorker } from "../../_hooks/workers-hooks";
import { WorkerResponse } from "../../_types/workers.types";
import { MODULE_WORKERS } from "../overlays/workers-dialogs";

interface WorkersTableActionsProps {
  row: Row<WorkerResponse>;
}

export default function WorkersTableActions({ row }: WorkersTableActionsProps) {
  const { open } = useDialogStore();
  const { mutate: onDeactivateToggleWorker, isPending } =
    useDeactivateToggleWorker();

  const handleEdit = () => {
    open(MODULE_WORKERS, "edit", row.original.id);
  };

  const handleView = () => {
    open(MODULE_WORKERS, "details", row.original.id);
  };

  const handleDelete = () => {
    open(MODULE_WORKERS, "delete", row.original);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <span className="sr-only">Abrir menú</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleView}>
            <Eye />
            Ver detalles
          </DropdownMenuItem>
          <ProtectedComponent
            requiredPermissions={[{ resource: "worker", action: "update" }]}
          >
            <DropdownMenuItem
              onClick={handleEdit}
              disabled={!row.original.isActive}
            >
              <Edit />
              Editar
            </DropdownMenuItem>
          </ProtectedComponent>
        </DropdownMenuGroup>
        <ProtectedComponent
          requiredPermissions={[{ resource: "worker", action: "deactivate" }]}
        >
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {row.original.isActive ? (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  open(MODULE_WORKERS, "archive", row.original);
                }}
              >
                <Archive />
                Archivar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => {
                  onDeactivateToggleWorker({
                    params: {
                      path: { id: row.original.id },
                    },
                  });
                }}
                disabled={isPending}
              >
                <RotateCcw />
                Activar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <Trash2 />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </ProtectedComponent>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
