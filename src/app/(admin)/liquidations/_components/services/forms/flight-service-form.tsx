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
import { useAddFlightService } from "../../../_hooks/liquidations-hooks";
import {
  addFlightServiceSchema,
  type AddFlightServiceFormValues,
} from "../../../_schemas/liquidations-schemas";

const CURRENCIES = ["PEN", "USD"] as const;
const SERVICE_STATUSES = ["PENDING", "COMPLETED", "CANCELED"] as const;

interface FlightServiceFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export function FlightServiceForm({
  liquidationId,
  onSuccess,
  onCancel,
  showActions = true,
}: FlightServiceFormProps) {
  const addFlightMutation = useAddFlightService(liquidationId);

  const form = useForm<AddFlightServiceFormValues>({
    resolver: zodResolver(addFlightServiceSchema),
    defaultValues: {
      tariff_rate: "0",
      is_taxed: true,
      currency: "USD",
      flight_bookings: [
        {
          origin: "",
          destiny: "",
          departure_date: "",
          arrival_date: "",
          aeroline: "",
          aeroline_booking_code: "",
          costamar_booking_code: "",
          tkt_numbers: "",
          total_price: "0",
          currency: "USD",
          status: "PENDING",
        },
      ],
    },
  });

  const handleSubmit = (data: AddFlightServiceFormValues) => {
    addFlightMutation.mutate(
      {
        params: { path: { liquidationId } },
        body: {
          tariff_rate: Number(data.tariff_rate),
          is_taxed: data.is_taxed,
          currency: data.currency,
          flight_bookings: data.flight_bookings.map((b) => ({
            ...b,
            departure_date: new Date(b.departure_date).toISOString(),
            arrival_date: new Date(b.arrival_date).toISOString(),
            total_price: Number(b.total_price),
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
        id="flight-form"
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
          <FieldsetLegend description="Datos del Vuelo" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="flight_bookings.0.origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Origen</FormLabel>
                    <FormControl>
                      <Input placeholder="Ciudad de origen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flight_bookings.0.destiny"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Destino</FormLabel>
                    <FormControl>
                      <Input placeholder="Ciudad de destino" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="flight_bookings.0.departure_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Fecha Salida</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flight_bookings.0.arrival_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Fecha Llegada</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="flight_bookings.0.aeroline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Aerolínea</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de aerolínea" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flight_bookings.0.aeroline_booking_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Código Reserva</FormLabel>
                    <FormControl>
                      <Input placeholder="Código de reserva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="flight_bookings.0.costamar_booking_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Costamar</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Código Costamar (opcional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flight_bookings.0.tkt_numbers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>N° Tickets</FormLabel>
                    <FormControl>
                      <Input placeholder="Números de ticket" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="flight_bookings.0.total_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Precio Total</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flight_bookings.0.currency"
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
                name="flight_bookings.0.status"
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
            <Button type="submit" disabled={addFlightMutation.isPending}>
              {addFlightMutation.isPending && <Spinner className="mr-2" />}
              <Plus className="mr-2 size-4" />
              Agregar Vuelo
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

export { FlightServiceForm as default };
