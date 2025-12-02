"use client";

import { Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { useDeactivateStaff } from "../../_hooks/staff-hooks";
import { DStaff } from "../../_types/staff.types";
import StaffCreateDialog from "../create/staff-create-dialog";
import StaffDetailDialog from "../detail/staff-detail-dialog";
import StaffEditDialog from "../edit/staff-edit-dialog";

export const MODULE_STAFF = "java-staff";

export default function StaffDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();
  const { mutate: deactivateStaff, isPending: isDeactivating } =
    useDeactivateStaff();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_STAFF) {
    return null;
  }

  const staff = data as DStaff;

  const handleDeactivate = () => {
    if (!staff?.id) return;
    deactivateStaff(
      { params: { path: { id: staff.id } } },
      { onSuccess: () => close() },
    );
  };

  return (
    <>
      {type === "create" && (
        <StaffCreateDialog
          open={isOpenForModule(MODULE_STAFF, "create")}
          onOpenChange={close}
        />
      )}
      {type === "edit" && (
        <StaffEditDialog
          open={isOpenForModule(MODULE_STAFF, "edit")}
          onOpenChange={close}
          staff={staff}
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
          handleConfirm={handleDeactivate}
          isLoading={isDeactivating}
          className="max-w-md"
          title={
            <div className="items-center gap-2 inline-flex flex-wrap">
              <Trash className="h-4 w-4 text-rose-500" />
              Desactivar personal{" "}
              <strong className="uppercase">
                {staff?.user?.userName || staff?.user?.email}
              </strong>
            </div>
          }
          desc={
            <>
              Estás a punto de desactivar el personal{" "}
              <strong>{staff?.user?.userName || staff?.user?.email}</strong>
              . <br />
              El personal será desactivado y no aparecerá en las listas.
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
