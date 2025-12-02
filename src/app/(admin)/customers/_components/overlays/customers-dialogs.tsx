"use client";

import { Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { useDeactivateCustomer } from "../../_hooks/customers-hooks";
import { DCustomer } from "../../_types/customers.types";
import CustomerCreateDialog from "../create/customer-create-dialog";
import CustomerDetailDialog from "../detail/customer-detail-dialog";
import CustomerEditDialog from "../edit/customer-edit-dialog";

export const MODULE_CUSTOMERS = "java-customers";

export default function CustomersDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();
  const { mutate: deactivateCustomer, isPending: isDeactivating } =
    useDeactivateCustomer();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_CUSTOMERS) {
    return null;
  }

  const customer = data as DCustomer;

  const handleDeactivate = () => {
    if (!customer?.id) return;
    deactivateCustomer(
      { params: { path: { id: customer.id } } },
      { onSuccess: () => close() },
    );
  };

  return (
    <>
      {type === "create" && (
        <CustomerCreateDialog
          open={isOpenForModule(MODULE_CUSTOMERS, "create")}
          onOpenChange={close}
        />
      )}
      {type === "edit" && (
        <CustomerEditDialog
          open={isOpenForModule(MODULE_CUSTOMERS, "edit")}
          onOpenChange={close}
          customer={customer}
        />
      )}
      {type === "details" && (
        <CustomerDetailDialog
          open={isOpenForModule(MODULE_CUSTOMERS, "details")}
          onOpenChange={close}
          customer={customer}
        />
      )}
      {type === "delete" && (
        <ConfirmDialog
          key="customer-delete"
          open={isOpenForModule(MODULE_CUSTOMERS, "delete")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={handleDeactivate}
          isLoading={isDeactivating}
          className="max-w-md"
          title={
            <div className="items-center gap-2 inline-flex flex-wrap">
              <Trash className="h-4 w-4 text-rose-500" />
              Desactivar cliente{" "}
              <strong className="uppercase">
                {customer?.firstName} {customer?.lastName}
              </strong>
            </div>
          }
          desc={
            <>
              Estás a punto de desactivar el cliente{" "}
              <strong>
                {customer?.firstName} {customer?.lastName}
              </strong>
              . <br />
              El cliente será desactivado y no aparecerá en las listas.
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
