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
import { useAddTourService } from "../../../_hooks/liquidations-hooks";
import {
  addTourServiceSchema,
  type AddTourServiceFormValues,
} from "../../../_schemas/liquidations-schemas";

const CURRENCIES = ["PEN", "USD"] as const;
const SERVICE_STATUSES = ["PENDING", "COMPLETED", "CANCELED"] as const;

interface TourServiceFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export function TourServiceForm({
  liquidationId,
  onSuccess,
  onCancel,
  showActions = true,
}: TourServiceFormProps) {
  const addTourMutation = useAddTourService(liquidationId);

  const form = useForm<AddTourServiceFormValues>({
    resolver: zodResolver(addTourServiceSchema),
    defaultValues: {
      tariff_rate: "0",
      is_taxed: true,
      currency: "USD",
      tours: [
        {
          title: "",
          place: "",
          start_date: "",
          end_date: "",
          price: "0",
          currency: "USD",
          status: "PENDING",
        },
      ],
    },
  });

  const handleSubmit = (data: AddTourServiceFormValues) => {
    addTourMutation.mutate(
      {
        params: { path: { liquidationId } },
        body: {
          tariff_rate: Number(data.tariff_rate),
          is_taxed: data.is_taxed,
          currency: data.currency,
          tours: data.tours.map((t) => ({
            ...t,
            start_date: new Date(t.start_date).toISOString(),
            end_date: new Date(t.end_date).toISOString(),
            price: Number(t.price),
          })),
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
        id="tour-form"
      >
        <Fieldset>
          <FieldsetLegend description="Configuración del Servicio y Comisiones" />
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
          <FieldsetLegend description="Datos del Tour" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tours.0.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del tour" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tours.0.place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Lugar</FormLabel>
                    <FormControl>
                      <Input placeholder="Lugar del tour" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tours.0.start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Fecha Inicio</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tours.0.end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Fecha Fin</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="tours.0.price"
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
                name="tours.0.currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tours.0.status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Fieldset>
        {showActions && (
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={addTourMutation.isPending}>
              {addTourMutation.isPending && <Spinner className="mr-2" />}
              <Plus className="mr-2 size-4" />
              Agregar Tour
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

export { TourServiceForm as default };
