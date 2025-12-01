"use client";

import { Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { DUser } from "../../_types/users.types";
import UserCreateDialog from "../create/user-create-dialog";
import UserDetailDialog from "../detail/user-detail-dialog";

export const MODULE_USERS = "java-users";

export default function UsersDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_USERS) {
    return null;
  }

  return (
    <>
      {type === "create" && (
        <UserCreateDialog
          open={isOpenForModule(MODULE_USERS, "create")}
          onOpenChange={close}
        />
      )}
      {type === "details" && (
        <UserDetailDialog
          open={isOpenForModule(MODULE_USERS, "details")}
          onOpenChange={close}
          user={data as DUser}
        />
      )}
      {type === "delete" && (
        <ConfirmDialog
          key="user-delete"
          open={isOpenForModule(MODULE_USERS, "delete")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={() => {
            // TODO: Implementar eliminación cuando el backend lo soporte
            close();
          }}
          className="max-w-md"
          title={
            <div className="items-center gap-2 inline-flex flex-wrap">
              <Trash className="h-4 w-4 text-rose-500" />
              Eliminar usuario{" "}
              <strong className="uppercase">
                {(data as DUser)?.userName || (data as DUser)?.email}
              </strong>
            </div>
          }
          desc={
            <>
              Estás a punto de eliminar el usuario{" "}
              <strong>
                {(data as DUser)?.userName || (data as DUser)?.email}
              </strong>
              . <br />
              Esta acción no se puede deshacer.
            </>
          }
          confirmText="Eliminar"
          destructive
          cancelBtnText="Cancelar"
        />
      )}
    </>
  );
}
