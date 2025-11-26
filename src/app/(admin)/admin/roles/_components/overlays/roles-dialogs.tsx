"use client";
import { Archive, RotateCcw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProtectedComponent } from "@/components/ui/protected-component";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { cn } from "@/lib/utils";
import {
  useDeactivateToggleRole,
  useDeleteRole,
} from "../../_hooks/roles-hooks";
import RoleCreateDialog from "../create/role-create-dialog";
import RoleDetail from "../detail/role-detail-dialog";
import RoleEditDialog from "../edit/role-edit-dialog";

export const MODULE_ROLES_AND_PERMISSIONS = "roles-and-permissions";
export default function RolesDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();
  const { mutate: onDeleteRole, isPending } = useDeleteRole();
  const {
    mutate: onDeactivateToggleRole,
    isPending: isDeactivateTogglePending,
  } = useDeactivateToggleRole();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_ROLES_AND_PERMISSIONS) {
    return null;
  }

  return (
    <>
      {type === "create" && (
        <RoleCreateDialog
          open={isOpenForModule(MODULE_ROLES_AND_PERMISSIONS, "create")}
          onOpenChange={close}
        />
      )}
      {type === "edit" && (
        <RoleEditDialog
          open={isOpenForModule(MODULE_ROLES_AND_PERMISSIONS, "edit")}
          onOpenChange={close}
          roleId={data as string}
        />
      )}
      {type === "details" && (
        <RoleDetail
          open={isOpenForModule(MODULE_ROLES_AND_PERMISSIONS, "details")}
          onOpenChange={close}
          roleId={data as string}
        />
      )}
      {type === "delete" && (
        <ConfirmDialog
          key="rol-delete"
          open={isOpenForModule(MODULE_ROLES_AND_PERMISSIONS, "delete")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={() => {
            onDeleteRole(
              {
                params: {
                  path: { id: data.id },
                },
              },
              {
                onSuccess: () => {
                  close();
                },
              },
            );
          }}
          className="max-w-md"
          title={
            <div className="items-center gap-2 inline-flex flex-wrap">
              <Trash className="h-4 w-4 text-rose-500" />
              Eliminar rol <strong className=" uppercase ">{data?.name}</strong>
            </div>
          }
          desc={
            <>
              Estás a punto de eliminar el rol <strong>{data?.name}</strong>.{" "}
              <br />
              Esta acción no se puede deshacer.
            </>
          }
          confirmText="Eliminar"
          destructive
          cancelBtnText="Cancelar"
          isLoading={isPending}
          middleActions={
            <ProtectedComponent
              requiredPermissions={[{ resource: "role", action: "deactivate" }]}
            >
              <Button
                variant="outline"
                onClick={() => {
                  onDeactivateToggleRole(
                    {
                      params: {
                        path: { id: data?.id },
                      },
                    },
                    {
                      onSuccess: () => {
                        close();
                      },
                    },
                  );
                }}
                type="button"
                disabled={isPending}
                className={cn(
                  "flex items-center gap-2 ",
                  data?.isActive ? "text-destructive" : "text-green-600",
                )}
              >
                {data?.isActive ? (
                  <Archive className="h-4 w-4 shrink-0" />
                ) : (
                  <RotateCcw className="h-4 w-4 shrink-0" />
                )}
                {data?.isActive ? "Archivar" : "Activar"}
              </Button>
            </ProtectedComponent>
          }
        />
      )}
      {type === "archive" && (
        <ConfirmDialog
          key="rol-archive"
          open={isOpenForModule(MODULE_ROLES_AND_PERMISSIONS, "archive")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={() => {
            onDeactivateToggleRole(
              {
                params: {
                  path: { id: data.id },
                },
              },
              {
                onSuccess: () => {
                  close();
                },
              },
            );
          }}
          className="max-w-md"
          title={
            <div className="items-center gap-2 inline-flex flex-wrap">
              <Archive className="h-4 w-4 text-rose-500" />
              Archivar rol <strong className=" uppercase ">{data?.name}</strong>
            </div>
          }
          desc={
            <>
              Estás a punto de archivar el rol <strong>{data?.name}</strong>.{" "}
            </>
          }
          confirmText="Archivar"
          destructive
          cancelBtnText="Cancelar"
          isLoading={isDeactivateTogglePending}
        />
      )}
    </>
  );
}
