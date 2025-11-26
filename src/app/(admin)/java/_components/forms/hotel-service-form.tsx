"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAddJavaHotelService } from "@/app/(admin)/java/_hooks/liquidations-hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface HotelServiceFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface HotelBooking {
  check_in: string;
  check_out: string;
  hotel: string;
  room: string;
  room_description: string;
  price_by_night: string;
  currency: string;
  status: string;
}

const createEmptyBooking = (): HotelBooking => ({
  check_in: "",
  check_out: "",
  hotel: "",
  room: "",
  room_description: "",
  price_by_night: "",
  currency: "PEN",
  status: "PENDING",
});

export function HotelServiceForm({
  liquidationId,
  onSuccess,
  onCancel,
}: HotelServiceFormProps) {
  const addHotelService = useAddJavaHotelService(liquidationId);
  const [formData, setFormData] = useState({
    tariff_rate: "0.00",
    is_taxed: "true",
    currency: "PEN",
  });
  const [bookings, setBookings] = useState<HotelBooking[]>([
    createEmptyBooking(),
  ]);

  const addBooking = () =>
    setBookings((prev) => [...prev, createEmptyBooking()]);

  const removeBooking = (index: number) => {
    setBookings((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBooking = (
    index: number,
    field: keyof HotelBooking,
    value: string,
  ) => {
    setBookings((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      tariff_rate: parseFloat(formData.tariff_rate),
      is_taxed: formData.is_taxed === "true",
      currency: formData.currency,
      hotel_bookings: bookings.map((booking) => ({
        check_in: booking.check_in,
        check_out: booking.check_out,
        hotel: booking.hotel,
        room: booking.room,
        room_description: booking.room_description,
        price_by_night: parseFloat(booking.price_by_night || "0"),
        currency: booking.currency,
        status: booking.status,
      })),
    };

    addHotelService.mutate(
      {
        params: { path: { liquidationId } },
        body: payload,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Servicio de Hotel</CardTitle>
        <CardDescription>Liquidación #{liquidationId}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="tariff_rate">Tarifa *</Label>
              <Input
                id="tariff_rate"
                type="number"
                step="0.01"
                required
                value={formData.tariff_rate}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    tariff_rate: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, currency: value }))
                }
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEN">PEN (S/)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_taxed">¿Incluye IGV?</Label>
              <Select
                value={formData.is_taxed}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, is_taxed: value }))
                }
              >
                <SelectTrigger id="is_taxed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Reservas de Hotel
              </Label>
              <Button type="button" size="sm" onClick={addBooking}>
                <Plus className="mr-1 h-4 w-4" />
                Agregar Reserva
              </Button>
            </div>

            {bookings.map((booking, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Reserva {index + 1}</h4>
                    {bookings.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeBooking(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Check-in *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={booking.check_in}
                        onChange={(event) =>
                          updateBooking(index, "check_in", event.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Check-out *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={booking.check_out}
                        onChange={(event) =>
                          updateBooking(index, "check_out", event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Hotel *</Label>
                      <Input
                        required
                        value={booking.hotel}
                        onChange={(event) =>
                          updateBooking(index, "hotel", event.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Habitación *</Label>
                      <Input
                        required
                        value={booking.room}
                        onChange={(event) =>
                          updateBooking(index, "room", event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción de Habitación</Label>
                    <Textarea
                      value={booking.room_description}
                      onChange={(event) =>
                        updateBooking(
                          index,
                          "room_description",
                          event.target.value,
                        )
                      }
                      rows={2}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Precio por Noche *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        required
                        value={booking.price_by_night}
                        onChange={(event) =>
                          updateBooking(
                            index,
                            "price_by_night",
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Moneda *</Label>
                      <Select
                        value={booking.currency}
                        onValueChange={(value) =>
                          updateBooking(index, "currency", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PEN">PEN</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estado *</Label>
                      <Select
                        value={booking.status}
                        onValueChange={(value) =>
                          updateBooking(index, "status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pendiente</SelectItem>
                          <SelectItem value="COMPLETED">Completado</SelectItem>
                          <SelectItem value="CANCELED">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={addHotelService.isPending}>
              {addHotelService.isPending ? "Agregando..." : "Agregar Servicio"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
