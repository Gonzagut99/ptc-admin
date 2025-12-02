"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard } from "lucide-react";
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
import { useUpdatePaymentStatus } from "../../_hooks/liquidations-hooks";
import {
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
  PaymentStatus,
  LiquidationWithDetailsDto,
} from "../../_types/liquidations.types";

const formSchema = z.object({
  targetStatus: z.enum(PAYMENT_STATUSES, {
    message: "El estado es requerido",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface UpdatePaymentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidation: LiquidationWithDetailsDto;
}

// Define valid transitions for each state
const VALID_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  PENDING: ["ON_COURSE"],
  ON_COURSE: ["PENDING", "COMPLETED"],
  COMPLETED: ["ON_COURSE"],
};

export default function UpdatePaymentStatusDialog({
  open,
  onOpenChange,
  liquidation,
}: UpdatePaymentStatusDialogProps) {
  const updateStatusMutation = useUpdatePaymentStatus(liquidation.id ?? 0);

  const currentStatus = liquidation.payment_status as PaymentStatus;
  const availableTransitions = VALID_TRANSITIONS[currentStatus] ?? [];

  // Calculate totals
  const totalPEN = liquidation.total_amount ?? 0;
  const totalUSD = liquidation.total_amount_usd ?? 0;
  const totalPaid = liquidation.payments?.reduce(
    (sum, payment) => sum + (payment.amount ?? 0),
    0,
  ) ?? 0;
  const remainingPEN = Math.max(0, totalPEN - totalPaid);

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
            <CreditCard className="size-5" />
            Cambiar Estado de Pago
          </DialogTitle>
          <DialogDescription>
            Liquidación #{liquidation.id} - Estado de pago actual:{" "}
            <strong>{PAYMENT_STATUS_LABELS[currentStatus]}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Payment summary */}
        <div className="rounded-lg border p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total PEN:</span>
            <span className="font-mono font-semibold">
              S/ {totalPEN.toFixed(2)}
            </span>
          </div>
          {totalUSD > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total USD:</span>
              <span className="font-mono font-semibold">
                $ {totalUSD.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2">
            <span className="text-muted-foreground">Total Pagado:</span>
            <span className="font-mono font-semibold text-green-600">
              S/ {totalPaid.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pendiente:</span>
            <span
              className={`font-mono font-semibold ${remainingPEN > 0 ? "text-amber-600" : "text-green-600"}`}
            >
              S/ {remainingPEN.toFixed(2)}
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="targetStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nuevo Estado de Pago</FormLabel>
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
                          {PAYMENT_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {form.watch("targetStatus") === "COMPLETED" && (
                      <span className="text-amber-600">
                        Nota: Para marcar como completado, el total pagado debe
                        coincidir con el total de la liquidación.
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
              <Button type="submit" disabled={updateStatusMutation.isPending}>
                {updateStatusMutation.isPending
                  ? "Actualizando..."
                  : "Actualizar Estado"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
