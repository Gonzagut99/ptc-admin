"use client";
import { Archive, RotateCcw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProtectedComponent } from "@/components/ui/protected-component";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { cn } from "@/lib/utils";
import { useDeactiveToggleUser, useDeleteUser } from "../../_hooks/users-hooks";
import UsersCreateDialog from "../create/users-create-dialog";
import UserDetailDialog from "../detail/user-detail-dialog";
import UsersEditDialog from "../edit/users-edit-dialog";

export const MODULE_USERS = "users";
export default function UsersDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();
  const { mutate: onDeleteUser, isPending } = useDeleteUser();
  const { mutate: onDeactiveToggleUser, isPending: isDeactiveTogglePending } =
    useDeactiveToggleUser();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_USERS) {
    return null;
  }

  return (
    <>
      {type === "create" && (
        <UsersCreateDialog
          open={isOpenForModule(MODULE_USERS, "create")}
          onOpenChange={close}
        />
      )}
      {type === "edit" && (
        <UsersEditDialog
          open={isOpenForModule(MODULE_USERS, "edit")}
          onOpenChange={close}
          userId={data as string}
        />
      )}
      {type === "details" && (
        <UserDetailDialog
          open={isOpenForModule(MODULE_USERS, "details")}
          onOpenChange={close}
          userId={data as string}
        />
      )}
      {type === "delete" && data && (
        <ConfirmDialog
          key="user-delete"
          open={isOpenForModule(MODULE_USERS, "delete")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={() => {
            if (!data?.id) return;
            onDeleteUser(
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
              Eliminar usuario{" "}
              <strong className=" uppercase ">{data?.name}</strong>
            </div>
          }
          desc={
            <>
              Estás a punto de eliminar el usuario <strong>{data?.name}</strong>
              . <br />
              Esta acción no se puede deshacer.
            </>
          }
          confirmText="Eliminar"
          cancelBtnText="Cancelar"
          destructive
          disabled={!data?.id || isPending || isDeactiveTogglePending}
          middleActions={
            <ProtectedComponent
              requiredPermissions={[{ resource: "user", action: "deactivate" }]}
            >
              <Button
                variant="outline"
                onClick={() => {
                  if (!data?.id) return;
                  onDeactiveToggleUser(
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
                type="button"
                disabled={isDeactiveTogglePending || !data?.id}
                className={cn(
                  "flex items-center gap-2",
                  data?.isActive ? "text-destructive" : "text-green-600",
                )}
              >
                {data?.isActive ? (
                  <Archive className="mr-2 h-4 w-4 shrink-0" />
                ) : (
                  <RotateCcw className="mr-2 h-4 w-4 shrink-0" />
                )}
                {data?.isActive ? "Archivar" : "Activar"}
              </Button>
            </ProtectedComponent>
          }
          isLoading={isPending || isDeactiveTogglePending}
        />
      )}
      {type === "archive" && data && (
        <ConfirmDialog
          key="user-archive"
          open={isOpenForModule(MODULE_USERS, "archive")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={() => {
            if (!data?.id) return;
            onDeactiveToggleUser(
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
              Archivar usuario{" "}
              <strong className=" uppercase ">{data?.name}</strong>
            </div>
          }
          desc={
            <>
              Estás a punto de archivar el usuario <strong>{data?.name}</strong>
              . <br />
            </>
          }
          confirmText="Archivar"
          cancelBtnText="Cancelar"
          destructive
          isLoading={isDeactiveTogglePending}
        />
      )}
    </>
  );
}
