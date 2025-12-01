"use client";

import { Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { DStaff } from "../../_types/staff.types";
import StaffCreateDialog from "../create/staff-create-dialog";
import StaffDetailDialog from "../detail/staff-detail-dialog";

export const MODULE_STAFF = "java-staff";

export default function StaffDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_STAFF) {
    return null;
  }

  const staff = data as DStaff;

  return (
    <>
      {type === "create" && (
        <StaffCreateDialog
          open={isOpenForModule(MODULE_STAFF, "create")}
          onOpenChange={close}
        />
      )}
      {type === "details" && (
        <StaffDetailDialog
          open={isOpenForModule(MODULE_STAFF, "details")}
          onOpenChange={close}
          staff={staff}
        />
      )}
      {type === "delete" && (
        <ConfirmDialog
          key="staff-delete"
          open={isOpenForModule(MODULE_STAFF, "delete")}
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
              Eliminar personal{" "}
              <strong className="uppercase">
                {staff?.user?.userName || staff?.user?.email}
              </strong>
            </div>
          }
          desc={
            <>
              Estás a punto de eliminar el personal{" "}
              <strong>{staff?.user?.userName || staff?.user?.email}</strong>
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
