"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useUpdatePayment } from "../../_hooks/liquidations-hooks";
import { PAYMENT_METHOD_LABELS } from "../../_types/liquidations.types";
import type { components } from "@/lib/api-java/api-java";

type DPayment = components["schemas"]["DPayment"];

const PAYMENT_METHODS = ["DEBIT", "CREDIT", "YAPE", "OTHER"] as const;

const editPaymentSchema = z.object({
  amount: z.string().min(1, "El monto es requerido"),
  method: z.enum(PAYMENT_METHODS),
});

type EditPaymentFormValues = z.infer<typeof editPaymentSchema>;

interface EditPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
  payment: DPayment;
}

export function EditPaymentDialog({
  open,
  onOpenChange,
  liquidationId,
  payment,
}: EditPaymentDialogProps) {
  const updatePaymentMutation = useUpdatePayment(liquidationId);

  const form = useForm<EditPaymentFormValues>({
    resolver: zodResolver(editPaymentSchema),
    defaultValues: {
      amount: "0",
      method: "DEBIT",
    },
  });

  useEffect(() => {
    if (payment && open) {
      form.reset({
        amount: payment.amount?.toString() ?? "0",
        method: (payment.method as "DEBIT" | "CREDIT" | "YAPE" | "OTHER") ?? "DEBIT",
      });
    }
  }, [payment, open, form]);

  const handleSubmit = (data: EditPaymentFormValues) => {
    if (!payment.id) return;

    updatePaymentMutation.mutate(
      {
        params: {
          path: {
            liquidationId,
            paymentId: payment.id,
          },
        },
        body: {
          amount: Number(data.amount),
          payment_method: data.method,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pago</DialogTitle>
          <DialogDescription>
            Modifica los datos del pago #{payment.id}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Monto</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Método de Pago</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {PAYMENT_METHOD_LABELS[method]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updatePaymentMutation.isPending}>
                {updatePaymentMutation.isPending && <Spinner className="mr-2" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
