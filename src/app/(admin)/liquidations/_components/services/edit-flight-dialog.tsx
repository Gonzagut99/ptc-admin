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
import { useUpdateFlightBooking } from "../../_hooks/liquidations-hooks";
import type { components } from "@/lib/api-java/api-java";

type DFlightBooking = components["schemas"]["DFlightBooking"];

const CURRENCIES = ["PEN", "USD"] as const;
const SERVICE_STATUSES = ["PENDING", "COMPLETED", "CANCELED"] as const;

const editFlightSchema = z.object({
  origin: z.string().min(1, "El origen es requerido"),
  destiny: z.string().min(1, "El destino es requerido"),
  departure_date: z.string().min(1, "La fecha de salida es requerida"),
  arrival_date: z.string().min(1, "La fecha de llegada es requerida"),
  aeroline: z.string().min(1, "La aerolínea es requerida"),
  aeroline_booking_code: z.string().optional(),
  costamar_booking_code: z.string().optional(),
  tkt_numbers: z.string().optional(),
  total_price: z.string().min(1, "El precio es requerido"),
  currency: z.enum(CURRENCIES),
  status: z.enum(SERVICE_STATUSES),
});

type EditFlightFormValues = z.infer<typeof editFlightSchema>;

interface EditFlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
  flightServiceId: number;
  booking: DFlightBooking;
}

export function EditFlightDialog({
  open,
  onOpenChange,
  liquidationId,
  flightServiceId,
  booking,
}: EditFlightDialogProps) {
  const updateFlightMutation = useUpdateFlightBooking(liquidationId);

  const form = useForm<EditFlightFormValues>({
    resolver: zodResolver(editFlightSchema),
    defaultValues: {
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
  });

  useEffect(() => {
    if (booking && open) {
      form.reset({
        origin: booking.origin ?? "",
        destiny: booking.destiny ?? "",
        departure_date: booking.departureDate ? booking.departureDate.slice(0, 16) : "",
        arrival_date: booking.arrivalDate ? booking.arrivalDate.slice(0, 16) : "",
        aeroline: booking.aeroline ?? "",
        aeroline_booking_code: booking.aerolineBookingCode ?? "",
        costamar_booking_code: booking.costamarBookingCode ?? "",
        tkt_numbers: booking.tktNumbers ?? "",
        total_price: booking.totalPrice?.toString() ?? "0",
        currency: (booking.currency as "PEN" | "USD") ?? "USD",
        status: (booking.status as "PENDING" | "COMPLETED" | "CANCELED") ?? "PENDING",
      });
    }
  }, [booking, open, form]);

  const handleSubmit = (data: EditFlightFormValues) => {
    if (!booking.id) return;

    updateFlightMutation.mutate(
      {
        params: {
          path: {
            liquidationId,
            flightServiceId,
            flightBookingId: booking.id,
          },
        },
        body: {
          origin: data.origin,
          destiny: data.destiny,
          departure_date: new Date(data.departure_date).toISOString(),
          arrival_date: new Date(data.arrival_date).toISOString(),
          aeroline: data.aeroline,
          aeroline_booking_code: data.aeroline_booking_code || '',
          costamar_booking_code: data.costamar_booking_code || undefined,
          tkt_numbers: data.tkt_numbers || '',
          total_price: Number(data.total_price),
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Vuelo</DialogTitle>
          <DialogDescription>
            Modifica los datos del vuelo #{booking.id}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
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
                name="destiny"
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
                name="departure_date"
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
                name="arrival_date"
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
            <FormField
              control={form.control}
              name="aeroline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Aerolínea</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la aerolínea" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="aeroline_booking_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Aerolínea</FormLabel>
                    <FormControl>
                      <Input placeholder="Código de reserva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costamar_booking_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Costamar</FormLabel>
                    <FormControl>
                      <Input placeholder="Código interno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tkt_numbers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº Tickets</FormLabel>
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
                name="total_price"
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
              <Button type="submit" disabled={updateFlightMutation.isPending}>
                {updateFlightMutation.isPending && <Spinner className="mr-2" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
