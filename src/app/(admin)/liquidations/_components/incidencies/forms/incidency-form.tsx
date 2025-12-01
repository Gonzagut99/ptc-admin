"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle } from "lucide-react";
import { useAddIncidency } from "../../../_hooks/liquidations-hooks";
import {
  addIncidencySchema,
  AddIncidencyFormValues,
} from "../../../_schemas/liquidations-schemas";

interface IncidencyFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export function IncidencyForm({
  liquidationId,
  onSuccess,
  onCancel,
  showActions = true,
}: IncidencyFormProps) {
  const addIncidencyMutation = useAddIncidency(liquidationId);

  const form = useForm<AddIncidencyFormValues>({
    resolver: zodResolver(addIncidencySchema),
    defaultValues: {
      reason: "",
      amount: "",
      incidencyDate: "",
    },
  });

  const handleSubmit = (data: AddIncidencyFormValues) => {
    addIncidencyMutation.mutate(
      {
        params: { path: { liquidationId } },
        body: {
          reason: data.reason,
          amount: data.amount ? Number(data.amount) : undefined,
          incidencyDate: new Date(data.incidencyDate).toISOString(),
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 px-4"
        id="incidency-form"
      >
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Motivo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describa el motivo de la incidencia"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto (PEN) - Opcional</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="incidencyDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Fecha de Incidencia</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {showActions && (
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              variant="destructive"
              disabled={addIncidencyMutation.isPending}
            >
              {addIncidencyMutation.isPending && <Spinner className="mr-2" />}
              <AlertTriangle className="mr-2 size-4" />
              Reportar Incidencia
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

export { IncidencyForm as default };
