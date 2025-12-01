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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import { Plus } from "lucide-react";
import { useAddAdditionalService } from "../../../_hooks/liquidations-hooks";
import {
  addAdditionalServiceSchema,
  type AddAdditionalServiceFormValues,
} from "../../../_schemas/liquidations-schemas";

const CURRENCIES = ["PEN", "USD"] as const;
const SERVICE_STATUSES = ["PENDING", "COMPLETED", "CANCELED"] as const;

interface AdditionalServiceFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export function AdditionalServiceForm({
  liquidationId,
  onSuccess,
  onCancel,
  showActions = true,
}: AdditionalServiceFormProps) {
  const addAdditionalMutation = useAddAdditionalService(liquidationId);

  const form = useForm<AddAdditionalServiceFormValues>({
    resolver: zodResolver(addAdditionalServiceSchema),
    defaultValues: {
      tariff_rate: "0",
      is_taxed: true,
      currency: "USD",
      price: "0",
      status: "PENDING",
    },
  });

  const handleSubmit = (data: AddAdditionalServiceFormValues) => {
    addAdditionalMutation.mutate(
      {
        params: { path: { liquidationId } },
        body: {
          tariff_rate: Number(data.tariff_rate),
          is_taxed: data.is_taxed,
          currency: data.currency,
          price: Number(data.price),
          status: data.status,
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
        id="additional-form"
      >
        <Fieldset>
          <FieldsetLegend description="Configuración del Servicio Adicional y Comisiones" />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="tariff_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tarifa</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Moneda</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_taxed"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <FormLabel>Aplica IGV</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Fieldset>
        <Fieldset>
          <FieldsetLegend description="Detalles" />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Precio</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Fieldset>
        {showActions && (
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={addAdditionalMutation.isPending}>
              {addAdditionalMutation.isPending && <Spinner className="mr-2" />}
              <Plus className="mr-2 size-4" />
              Agregar Servicio
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

export { AdditionalServiceForm as default };
