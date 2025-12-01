"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { HotelServiceForm } from "./forms";

interface AddHotelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
}

export function AddHotelDialog({
  open,
  onOpenChange,
  liquidationId,
}: AddHotelDialogProps) {
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
          <DialogTitle>Agregar Hotel</DialogTitle>
          <DialogDescription>
            Agregue un nuevo servicio de hotel a la liquidación #{liquidationId}
          </DialogDescription>
        </DialogHeader>
        <HotelServiceForm
          liquidationId={liquidationId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

export { AddHotelDialog as default };
