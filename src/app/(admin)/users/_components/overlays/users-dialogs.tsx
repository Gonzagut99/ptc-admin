"use client";

import { Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { useDeactivateUser } from "../../_hooks/users-hooks";
import { DUser } from "../../_types/users.types";
import UserCreateDialog from "../create/user-create-dialog";
import UserDetailDialog from "../detail/user-detail-dialog";
import UserEditDialog from "../edit/user-edit-dialog";

export const MODULE_USERS = "java-users";

export default function UsersDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();
  const { mutate: deactivateUser, isPending: isDeactivating } =
    useDeactivateUser();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_USERS) {
    return null;
  }

  const user = data as DUser;

  const handleDeactivate = () => {
    if (!user?.id) return;
    deactivateUser(
      { params: { path: { id: user.id } } },
      { onSuccess: () => close() },
    );
  };

  return (
    <>
      {type === "create" && (
        <UserCreateDialog
          open={isOpenForModule(MODULE_USERS, "create")}
          onOpenChange={close}
        />
      )}
      {type === "edit" && (
        <UserEditDialog
          open={isOpenForModule(MODULE_USERS, "edit")}
          onOpenChange={close}
          user={user}
        />
      )}
      {type === "details" && (
        <UserDetailDialog
          open={isOpenForModule(MODULE_USERS, "details")}
          onOpenChange={close}
          user={user}
        />
      )}
      {type === "delete" && (
        <ConfirmDialog
          key="user-delete"
          open={isOpenForModule(MODULE_USERS, "delete")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={handleDeactivate}
          isLoading={isDeactivating}
          className="max-w-md"
          title={
            <div className="items-center gap-2 inline-flex flex-wrap">
              <Trash className="h-4 w-4 text-rose-500" />
              Desactivar usuario{" "}
              <strong className="uppercase">
                {user?.userName || user?.email}
              </strong>
            </div>
          }
          desc={
            <>
              Estás a punto de desactivar el usuario{" "}
              <strong>{user?.userName || user?.email}</strong>. <br />
              El usuario será desactivado y no podrá acceder al sistema.
            </>
          }
          confirmText="Desactivar"
          destructive
          cancelBtnText="Cancelar"
        />
      )}
    </>
  );
}
