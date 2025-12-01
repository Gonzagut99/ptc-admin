"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { AdditionalServiceForm } from "./forms";

interface AddAdditionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
}

export function AddAdditionalDialog({
  open,
  onOpenChange,
  liquidationId,
}: AddAdditionalDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Agregar Servicio Adicional</DialogTitle>
          <DialogDescription>
            Agregue un nuevo servicio adicional a la liquidación #{liquidationId}
          </DialogDescription>
        </DialogHeader>
        <AdditionalServiceForm
          liquidationId={liquidationId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

export { AddAdditionalDialog as default };
