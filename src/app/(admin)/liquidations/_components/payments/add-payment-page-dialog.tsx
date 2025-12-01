"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { CreditCard } from "lucide-react";
import { PaymentForm } from "./forms";

interface AddPaymentPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
}

export default function AddPaymentPageDialog({
  open,
  onOpenChange,
  liquidationId,
}: AddPaymentPageDialogProps) {
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
