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
import { useDeactivateToggleRole } from "../../_hooks/roles-hooks";
import { RoleDetailResponse } from "../../_types/roles.types";
import { MODULE_ROLES_AND_PERMISSIONS } from "../overlays/roles-dialogs";

interface RolesTableActionsProps {
  row: Row<RoleDetailResponse>;
}

export default function RolesTableActions({ row }: RolesTableActionsProps) {
  const { open } = useDialogStore();
  const {
    mutate: onDeactivateToggleRole,
    isPending: isDeactivateTogglePending,
  } = useDeactivateToggleRole();

  const handleEdit = () => {
    open(MODULE_ROLES_AND_PERMISSIONS, "edit", row.original.id);
  };

  const handleView = () => {
    open(MODULE_ROLES_AND_PERMISSIONS, "details", row.original.id);
  };

  const handleDelete = () => {
    open(MODULE_ROLES_AND_PERMISSIONS, "delete", row.original);
  };

  const handleArchive = () => {
    open(MODULE_ROLES_AND_PERMISSIONS, "archive", row.original);
  };

  const handleActivate = () => {
    onDeactivateToggleRole({
      params: {
        path: { id: row.original.id },
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
          <DropdownMenuItem onClick={handleView}>
            <Eye />
            Ver detalles
          </DropdownMenuItem>
          <ProtectedComponent
            requiredPermissions={[{ resource: "role", action: "update" }]}
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
          requiredPermissions={[{ resource: "role", action: "deactivate" }]}
        >
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {row.original.isActive ? (
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
