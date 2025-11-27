"use client";

import { Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { DCustomer } from "../../_types/customers.types";
import CustomerCreateDialog from "../create/customer-create-dialog";
import CustomerDetailDialog from "../detail/customer-detail-dialog";

export const MODULE_CUSTOMERS = "java-customers";

export default function CustomersDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_CUSTOMERS) {
    return null;
  }

  return (
    <>
      {type === "create" && (
        <CustomerCreateDialog
          open={isOpenForModule(MODULE_CUSTOMERS, "create")}
          onOpenChange={close}
        />
      )}
      {type === "details" && (
        <CustomerDetailDialog
          open={isOpenForModule(MODULE_CUSTOMERS, "details")}
          onOpenChange={close}
          customer={data as DCustomer}
        />
      )}
      {type === "delete" && (
        <ConfirmDialog
          key="customer-delete"
          open={isOpenForModule(MODULE_CUSTOMERS, "delete")}
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
              Eliminar cliente{" "}
              <strong className="uppercase">
                {(data as DCustomer)?.firstName} {(data as DCustomer)?.lastName}
              </strong>
            </div>
          }
          desc={
            <>
              Estás a punto de eliminar el cliente{" "}
              <strong>
                {(data as DCustomer)?.firstName} {(data as DCustomer)?.lastName}
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
