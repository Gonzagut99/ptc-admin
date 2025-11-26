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
import { useDeactiveToggleUser } from "../../_hooks/users-hooks";
import { UserDetailResponse } from "../../_types/users.types";
import { MODULE_USERS } from "../overlays/users-dialogs";

interface UsersTableActionsProps {
  row: Row<UserDetailResponse>;
}

export default function UsersTableActions({ row }: UsersTableActionsProps) {
  const { open } = useDialogStore();
  const { mutate: onDeactiveToggleUser, isPending: isDeactiveTogglePending } =
    useDeactiveToggleUser();

  const handleEdit = () => {
    open(MODULE_USERS, "edit", row.original.id);
  };

  const handleView = () => {
    open(MODULE_USERS, "details", row.original.id);
  };

  const handleDelete = () => {
    open(MODULE_USERS, "delete", row.original);
  };

  const handleArchive = () => {
    open(MODULE_USERS, "archive", row.original);
  };

  const handleActivate = () => {
    onDeactiveToggleUser({
      params: { path: { id: row.original.id } },
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
            requiredPermissions={[{ resource: "user", action: "update" }]}
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
          requiredPermissions={[{ resource: "user", action: "deactivate" }]}
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
                disabled={isDeactiveTogglePending}
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
