"use client";

import { Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { useDeactivateLiquidation } from "../../_hooks/liquidations-hooks";
import { LiquidationWithDetailsDto } from "../../_types/liquidations.types";
import LiquidationCreateDialog from "../create/liquidation-create-dialog";
import LiquidationDetailDialog from "../detail/liquidation-detail-dialog";
import AddIncidencyDialog from "../incidencies/add-incidency-dialog";
import AddPaymentDialog from "../payments/add-payment-dialog";
import AddServiceDialog from "../services/add-service-dialog";
import UpdateLiquidationStatusDialog from "./update-liquidation-status-dialog";
import UpdatePaymentStatusDialog from "./update-payment-status-dialog";

export const MODULE_LIQUIDATIONS = "java-liquidations";

export default function LiquidationsDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();
  const { mutate: deactivateLiquidation, isPending: isDeactivating } =
    useDeactivateLiquidation();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_LIQUIDATIONS) {
    return null;
  }

  const liquidation = data as LiquidationWithDetailsDto;

  const handleDeactivate = () => {
    if (!liquidation?.id) return;
    deactivateLiquidation(
      { params: { path: { liquidationId: liquidation.id } } },
      { onSuccess: () => close() },
    );
  };

  return (
    <>
      {type === "create" && (
        <LiquidationCreateDialog
          open={isOpenForModule(MODULE_LIQUIDATIONS, "create")}
          onOpenChange={close}
        />
      )}
      {type === "details" && (
        <LiquidationDetailDialog
          open={isOpenForModule(MODULE_LIQUIDATIONS, "details")}
          onOpenChange={close}
          liquidation={liquidation}
        />
      )}
      {type === "add-service" && liquidation && (
        <AddServiceDialog
          open={isOpenForModule(MODULE_LIQUIDATIONS, "add-service")}
          onOpenChange={close}
          liquidation={liquidation}
        />
      )}
      {type === "add-payment" && liquidation && (
        <AddPaymentDialog
          open={isOpenForModule(MODULE_LIQUIDATIONS, "add-payment")}
          onOpenChange={close}
          liquidation={liquidation}
        />
      )}
      {type === "add-incidency" && liquidation && (
        <AddIncidencyDialog
          open={isOpenForModule(MODULE_LIQUIDATIONS, "add-incidency")}
          onOpenChange={close}
          liquidation={liquidation}
        />
      )}
      {type === "update-status" && liquidation && (
        <UpdateLiquidationStatusDialog
          open={isOpenForModule(MODULE_LIQUIDATIONS, "update-status")}
          onOpenChange={close}
          liquidation={liquidation}
        />
      )}
      {type === "update-payment-status" && liquidation && (
        <UpdatePaymentStatusDialog
          open={isOpenForModule(MODULE_LIQUIDATIONS, "update-payment-status")}
          onOpenChange={close}
          liquidation={liquidation}
        />
      )}
      {type === "delete" && (
        <ConfirmDialog
          key="liquidation-delete"
          open={isOpenForModule(MODULE_LIQUIDATIONS, "delete")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={handleDeactivate}
          isLoading={isDeactivating}
          className="max-w-md"
          title={
            <div className="items-center gap-2 inline-flex flex-wrap">
              <Trash className="h-4 w-4 text-rose-500" />
              Desactivar liquidación{" "}
              <strong className="uppercase">#{liquidation?.id}</strong>
            </div>
          }
          desc={
            <>
              Estás a punto de desactivar la liquidación{" "}
              <strong>#{liquidation?.id}</strong>
              . <br />
              La liquidación será desactivada y no aparecerá en las listas.
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
