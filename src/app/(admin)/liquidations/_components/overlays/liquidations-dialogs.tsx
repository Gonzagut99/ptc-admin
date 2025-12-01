"use client";

import { useDialogStore } from "@/hooks/use-dialog-store";
import { LiquidationWithDetailsDto } from "../../_types/liquidations.types";
import LiquidationCreateDialog from "../create/liquidation-create-dialog";
import LiquidationDetailDialog from "../detail/liquidation-detail-dialog";
import AddServiceDialog from "../services/add-service-dialog";
import AddPaymentDialog from "../payments/add-payment-dialog";
import AddIncidencyDialog from "../incidencies/add-incidency-dialog";

export const MODULE_LIQUIDATIONS = "java-liquidations";

export default function LiquidationsDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_LIQUIDATIONS) {
    return null;
  }

  const liquidation = data as LiquidationWithDetailsDto;

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
    </>
  );
}
