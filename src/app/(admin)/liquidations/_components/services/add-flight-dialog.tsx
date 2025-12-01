"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { FlightServiceForm } from "./forms";

interface AddFlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
}

export function AddFlightDialog({
  open,
  onOpenChange,
  liquidationId,
}: AddFlightDialogProps) {
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
          <DialogTitle>Agregar Vuelo</DialogTitle>
          <DialogDescription>
            Agregue un nuevo servicio de vuelo a la liquidación #{liquidationId}
          </DialogDescription>
        </DialogHeader>
        <FlightServiceForm
          liquidationId={liquidationId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

export { AddFlightDialog as default };
