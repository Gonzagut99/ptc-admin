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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateAdditionalService } from "../../_hooks/liquidations-hooks";
import type { components } from "@/lib/api-java/api-java";

type DAdditionalServices = components["schemas"]["DAdditionalServices"];

const CURRENCIES = ["PEN", "USD"] as const;
const SERVICE_STATUSES = ["PENDING", "COMPLETED", "CANCELED"] as const;

const editAdditionalSchema = z.object({
  tariff_rate: z.string().min(1, "La tarifa es requerida"),
  is_taxed: z.boolean(),
  price: z.string().min(1, "El precio es requerido"),
  currency: z.enum(CURRENCIES),
  status: z.enum(SERVICE_STATUSES),
});

type EditAdditionalFormValues = z.infer<typeof editAdditionalSchema>;

interface EditAdditionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
  service: DAdditionalServices;
}

export function EditAdditionalDialog({
  open,
  onOpenChange,
  liquidationId,
  service,
}: EditAdditionalDialogProps) {
  const updateAdditionalMutation = useUpdateAdditionalService(liquidationId);

  const form = useForm<EditAdditionalFormValues>({
    resolver: zodResolver(editAdditionalSchema),
    defaultValues: {
      tariff_rate: "0",
      is_taxed: true,
      price: "0",
      currency: "USD",
      status: "PENDING",
    },
  });

  useEffect(() => {
    if (service && open) {
      form.reset({
        tariff_rate: service.tariffRate?.toString() ?? "0",
        is_taxed: service.taxed ?? true,
        price: service.price?.toString() ?? "0",
        currency: (service.currency as "PEN" | "USD") ?? "USD",
        status: (service.status as "PENDING" | "COMPLETED" | "CANCELED") ?? "PENDING",
      });
    }
  }, [service, open, form]);

  const handleSubmit = (data: EditAdditionalFormValues) => {
    if (!service.id) return;

    updateAdditionalMutation.mutate(
      {
        params: {
          path: {
            liquidationId,
            additionalServiceId: service.id,
          },
        },
        body: {
          tariff_rate: Number(data.tariff_rate),
          is_taxed: data.is_taxed,
          price: Number(data.price),
          currency: data.currency,
          status: data.status,
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
          <DialogTitle>Editar Servicio Adicional</DialogTitle>
          <DialogDescription>
            Modifica los datos del servicio #{service.id}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tariff_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Tarifa (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_taxed"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>Incluye IGV</FormLabel>
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
            <div className="grid grid-cols-3 gap-4">
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
                name="currency"
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
                name="status"
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
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="COMPLETED">Completado</SelectItem>
                        <SelectItem value="CANCELED">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
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
              <Button type="submit" disabled={updateAdditionalMutation.isPending}>
                {updateAdditionalMutation.isPending && <Spinner className="mr-2" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
