"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { AlertTriangle } from "lucide-react";
import { IncidencyForm } from "./forms";

interface AddIncidencyPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
}

export default function AddIncidencyPageDialog({
  open,
  onOpenChange,
  liquidationId,
}: AddIncidencyPageDialogProps) {
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
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="size-5" />
            Reportar Incidencia
          </DialogTitle>
          <DialogDescription>
            Registre una incidencia para la liquidación #{liquidationId}
          </DialogDescription>
        </DialogHeader>
        <IncidencyForm
          liquidationId={liquidationId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
