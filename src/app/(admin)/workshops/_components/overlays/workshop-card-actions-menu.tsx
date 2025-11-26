"use client";

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
import { useDeactivateToggleWorkshop } from "../../_hooks/workshops-hooks";
import { MODULE_WORKSHOPS } from "./workshops-dialogs";

interface WorkshopCardActionsMenuProps {
  workshop: {
    id: string;
    name: string;
    isActive: boolean;
  };
}

export default function WorkshopCardActionsMenu({
  workshop,
}: WorkshopCardActionsMenuProps) {
  const { open } = useDialogStore();
  const {
    mutate: onDeactivateToggleWorkshop,
    isPending: isDeactivateTogglePending,
  } = useDeactivateToggleWorkshop();

  const handleViewDetails = () => {
    open(MODULE_WORKSHOPS, "details", workshop.id);
  };

  const handleEdit = () => {
    open(MODULE_WORKSHOPS, "edit", workshop.id);
  };

  const handleArchive = () => {
    open(MODULE_WORKSHOPS, "archive", workshop);
  };

  const handleDelete = () => {
    open(MODULE_WORKSHOPS, "delete", workshop);
  };

  const handleActivate = () => {
    onDeactivateToggleWorkshop({
      params: {
        path: { id: workshop.id },
      },
    });
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
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye />
            Ver detalles
          </DropdownMenuItem>
          <ProtectedComponent
            requiredPermissions={[{ resource: "workshop", action: "update" }]}
          >
            <DropdownMenuItem
              onClick={handleEdit}
              disabled={!workshop.isActive}
            >
              <Edit />
              Editar
            </DropdownMenuItem>
          </ProtectedComponent>
        </DropdownMenuGroup>
        <ProtectedComponent
          requiredPermissions={[{ resource: "workshop", action: "deactivate" }]}
        >
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {workshop.isActive ? (
              <DropdownMenuItem variant="destructive" onClick={handleArchive}>
                <Archive />
                Archivar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleActivate}
                disabled={isDeactivateTogglePending}
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
