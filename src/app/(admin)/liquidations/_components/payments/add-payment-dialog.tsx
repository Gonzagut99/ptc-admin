"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { CreditCard } from "lucide-react";
import { LiquidationWithDetailsDto } from "../../_types/liquidations.types";
import { PaymentForm } from "./forms";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidation: LiquidationWithDetailsDto;
}

export default function AddPaymentDialog({
  open,
  onOpenChange,
  liquidation,
}: AddPaymentDialogProps) {
  const liquidationId = liquidation?.id ?? 0;

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Agregar Pago
          </DialogTitle>
          <DialogDescription>
            Registre un nuevo pago para la liquidación #{liquidationId}
          </DialogDescription>
        </DialogHeader>
        <PaymentForm
          liquidationId={liquidationId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
