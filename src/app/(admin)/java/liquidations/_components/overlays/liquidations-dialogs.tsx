"use client";

import { useDialogStore } from "@/hooks/use-dialog-store";
import { LiquidationWithDetailsDto } from "../../_types/liquidations.types";
import LiquidationCreateDialog from "../create/liquidation-create-dialog";
import LiquidationDetailDialog from "../detail/liquidation-detail-dialog";

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
      {/* TODO: Agregar más diálogos para add-service, add-payment, add-incidency */}
    </>
  );
}
