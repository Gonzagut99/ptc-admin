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
import { useUpdateHotelBooking } from "../../_hooks/liquidations-hooks";
import type { components } from "@/lib/api-java/api-java";

type DHotelBooking = components["schemas"]["DHotelBooking"];

const CURRENCIES = ["PEN", "USD"] as const;
const SERVICE_STATUSES = ["PENDING", "COMPLETED", "CANCELED"] as const;

const editHotelSchema = z.object({
  hotel: z.string().min(1, "El hotel es requerido"),
  room: z.string().min(1, "La habitación es requerida"),
  check_in: z.string().min(1, "La fecha de check-in es requerida"),
  check_out: z.string().min(1, "La fecha de check-out es requerida"),
  price_by_night: z.string().min(1, "El precio por noche es requerido"),
  currency: z.enum(CURRENCIES),
  status: z.enum(SERVICE_STATUSES),
});

type EditHotelFormValues = z.infer<typeof editHotelSchema>;

interface EditHotelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
  hotelServiceId: number;
  booking: DHotelBooking;
}

export function EditHotelDialog({
  open,
  onOpenChange,
  liquidationId,
  hotelServiceId,
  booking,
}: EditHotelDialogProps) {
  const updateHotelMutation = useUpdateHotelBooking(liquidationId);

  const form = useForm<EditHotelFormValues>({
    resolver: zodResolver(editHotelSchema),
    defaultValues: {
      hotel: "",
      room: "",
      check_in: "",
      check_out: "",
      price_by_night: "0",
      currency: "USD",
      status: "PENDING",
    },
  });

  useEffect(() => {
    if (booking && open) {
      form.reset({
        hotel: booking.hotel ?? "",
        room: booking.room ?? "",
        check_in: booking.checkIn ? booking.checkIn.slice(0, 16) : "",
        check_out: booking.checkOut ? booking.checkOut.slice(0, 16) : "",
        price_by_night: booking.priceByNight?.toString() ?? "0",
        currency: (booking.currency as "PEN" | "USD") ?? "USD",
        status: (booking.status as "PENDING" | "COMPLETED" | "CANCELED") ?? "PENDING",
      });
    }
  }, [booking, open, form]);

  const handleSubmit = (data: EditHotelFormValues) => {
    if (!booking.id) return;

    updateHotelMutation.mutate(
      {
        params: {
          path: {
            liquidationId,
            hotelServiceId,
            hotelBookingId: booking.id,
          },
        },
        body: {
          hotel: data.hotel,
          room: data.room,
          check_in: new Date(data.check_in).toISOString(),
          check_out: new Date(data.check_out).toISOString(),
          price_by_night: Number(data.price_by_night),
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Hotel</DialogTitle>
          <DialogDescription>
            Modifica los datos de la reserva #{booking.id}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hotel"
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
                name="room"
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="check_in"
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
                name="check_out"
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
                name="price_by_night"
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
              <Button type="submit" disabled={updateHotelMutation.isPending}>
                {updateHotelMutation.isPending && <Spinner className="mr-2" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
