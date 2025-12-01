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
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import { Plus } from "lucide-react";
import { useAddHotelService } from "../../../_hooks/liquidations-hooks";
import {
  addHotelServiceSchema,
  type AddHotelServiceFormValues,
} from "../../../_schemas/liquidations-schemas";

const CURRENCIES = ["PEN", "USD"] as const;
const SERVICE_STATUSES = ["PENDING", "COMPLETED", "CANCELED"] as const;

interface HotelServiceFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export function HotelServiceForm({
  liquidationId,
  onSuccess,
  onCancel,
  showActions = true,
}: HotelServiceFormProps) {
  const addHotelMutation = useAddHotelService(liquidationId);

  const form = useForm<AddHotelServiceFormValues>({
    resolver: zodResolver(addHotelServiceSchema),
    defaultValues: {
      tariff_rate: "0",
      is_taxed: true,
      currency: "USD",
      hotel_bookings: [
        {
          hotel: "",
          room: "",
          room_description: "",
          check_in: "",
          check_out: "",
          price_by_night: "0",
          currency: "USD",
          status: "PENDING",
        },
      ],
    },
  });

  const handleSubmit = (data: AddHotelServiceFormValues) => {
    addHotelMutation.mutate(
      {
        params: { path: { liquidationId } },
        body: {
          tariff_rate: Number(data.tariff_rate),
          is_taxed: data.is_taxed,
          currency: data.currency,
          hotel_bookings: data.hotel_bookings.map((b) => ({
            ...b,
            check_in: new Date(b.check_in).toISOString(),
            check_out: new Date(b.check_out).toISOString(),
            price_by_night: Number(b.price_by_night),
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
        id="hotel-form"
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
          <FieldsetLegend description="Datos de la Reserva" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hotel_bookings.0.hotel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Hotel</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del hotel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hotel_bookings.0.room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Habitación</FormLabel>
                    <FormControl>
                      <Input placeholder="Tipo de habitación" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="hotel_bookings.0.room_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la habitación"
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
                name="hotel_bookings.0.check_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Check-in</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hotel_bookings.0.check_out"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Check-out</FormLabel>
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
                name="hotel_bookings.0.price_by_night"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Precio/Noche</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hotel_bookings.0.currency"
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
                name="hotel_bookings.0.status"
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
            <Button type="submit" disabled={addHotelMutation.isPending}>
              {addHotelMutation.isPending && <Spinner className="mr-2" />}
              <Plus className="mr-2 size-4" />
              Agregar Hotel
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

export { HotelServiceForm as default };
