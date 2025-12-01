"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { TourServiceForm } from "./forms";

interface AddTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
}

export function AddTourDialog({
  open,
  onOpenChange,
  liquidationId,
}: AddTourDialogProps) {
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
          <DialogTitle>Agregar Tour</DialogTitle>
          <DialogDescription>
            Agregue un nuevo servicio de tour a la liquidación #{liquidationId}
          </DialogDescription>
        </DialogHeader>
        <TourServiceForm
          liquidationId={liquidationId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

export { AddTourDialog as default };
