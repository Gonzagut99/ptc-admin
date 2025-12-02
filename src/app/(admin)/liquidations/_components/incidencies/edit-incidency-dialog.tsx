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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateIncidency } from "../../_hooks/liquidations-hooks";
import type { components } from "@/lib/api-java/api-java";

type DIncidency = components["schemas"]["DIncidency"];

const editIncidencySchema = z.object({
  reason: z.string().min(1, "El motivo es requerido"),
  amount: z.string().optional(),
  incidency_date: z.string().min(1, "La fecha de incidencia es requerida"),
});

type EditIncidencyFormValues = z.infer<typeof editIncidencySchema>;

interface EditIncidencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
  incidency: DIncidency;
}

export function EditIncidencyDialog({
  open,
  onOpenChange,
  liquidationId,
  incidency,
}: EditIncidencyDialogProps) {
  const updateIncidencyMutation = useUpdateIncidency(liquidationId);

  const form = useForm<EditIncidencyFormValues>({
    resolver: zodResolver(editIncidencySchema),
    defaultValues: {
      reason: "",
      amount: "",
      incidency_date: "",
    },
  });

  useEffect(() => {
    if (incidency && open) {
      form.reset({
        reason: incidency.reason ?? "",
        amount: incidency.amount?.toString() ?? "",
        incidency_date: incidency.incidencyDate ? incidency.incidencyDate.slice(0, 16) : "",
      });
    }
  }, [incidency, open, form]);

  const handleSubmit = (data: EditIncidencyFormValues) => {
    if (!incidency.id) return;

    updateIncidencyMutation.mutate(
      {
        params: {
          path: {
            liquidationId,
            incidencyId: incidency.id,
          },
        },
        body: {
          reason: data.reason,
          amount: data.amount ? Number(data.amount) : undefined,
          incidency_date: new Date(data.incidency_date).toISOString(),
          incidency_status: 'PENDING',
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
          <DialogTitle>Editar Incidencia</DialogTitle>
          <DialogDescription>
            Modifica los datos de la incidencia #{incidency.id}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Motivo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el motivo de la incidencia"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto (opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="incidency_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Fecha Incidencia</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateIncidencyMutation.isPending}>
                {updateIncidencyMutation.isPending && <Spinner className="mr-2" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
