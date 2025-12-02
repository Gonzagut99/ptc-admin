"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateLiquidationStatus } from "../../_hooks/liquidations-hooks";
import {
  LIQUIDATION_STATUSES,
  LIQUIDATION_STATUS_LABELS,
  LiquidationStatus,
  LiquidationWithDetailsDto,
} from "../../_types/liquidations.types";

const formSchema = z.object({
  targetStatus: z.enum(LIQUIDATION_STATUSES, {
    message: "El estado es requerido",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface UpdateLiquidationStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidation: LiquidationWithDetailsDto;
}

// Define valid transitions for each state
const VALID_TRANSITIONS: Record<LiquidationStatus, LiquidationStatus[]> = {
  IN_QUOTE: ["PENDING", "ON_COURSE"],
  PENDING: ["IN_QUOTE", "ON_COURSE"],
  ON_COURSE: ["PENDING", "COMPLETED"],
  COMPLETED: [], // No transitions from COMPLETED
};

export default function UpdateLiquidationStatusDialog({
  open,
  onOpenChange,
  liquidation,
}: UpdateLiquidationStatusDialogProps) {
  const updateStatusMutation = useUpdateLiquidationStatus(liquidation.id ?? 0);

  const currentStatus = liquidation.status as LiquidationStatus;
  const availableTransitions = VALID_TRANSITIONS[currentStatus] ?? [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetStatus: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    if (!liquidation.id) return;

    updateStatusMutation.mutate(
      {
        params: { path: { liquidationId: liquidation.id } },
        body: { target_status: data.targetStatus },
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="size-5" />
            Cambiar Estado de Liquidación
          </DialogTitle>
          <DialogDescription>
            Liquidación #{liquidation.id} - Estado actual:{" "}
            <strong>{LIQUIDATION_STATUS_LABELS[currentStatus]}</strong>
          </DialogDescription>
        </DialogHeader>

        {availableTransitions.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <p>Esta liquidación está completada.</p>
            <p className="text-sm">
              No se puede cambiar el estado de una liquidación completada.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="targetStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nuevo Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTransitions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {LIQUIDATION_STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {currentStatus === "ON_COURSE" && (
                        <span className="text-amber-600">
                          Nota: Para completar la liquidación, el estado de pago
                          debe estar en &quot;Completado&quot;.
                        </span>
                      )}
                      {currentStatus === "IN_QUOTE" && (
                        <span>
                          Asegúrate de tener servicios registrados antes de
                          cambiar el estado.
                        </span>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending
                    ? "Actualizando..."
                    : "Actualizar Estado"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
