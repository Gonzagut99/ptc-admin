"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAddJavaFlightService } from "@/app/(admin)/java/_hooks/liquidations-hooks";
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

interface FlightServiceFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FlightBooking {
  origin: string;
  destiny: string;
  departure_date: string;
  arrival_date: string;
  aeroline: string;
  aeroline_booking_code: string;
  costamar_booking_code: string;
  tkt_numbers: string;
  status: string;
  total_price: string;
  currency: string;
}

const createEmptyBooking = (): FlightBooking => ({
  origin: "",
  destiny: "",
  departure_date: "",
  arrival_date: "",
  aeroline: "",
  aeroline_booking_code: "",
  costamar_booking_code: "",
  tkt_numbers: "",
  status: "PENDING",
  total_price: "",
  currency: "PEN",
});

export function FlightServiceForm({
  liquidationId,
  onSuccess,
  onCancel,
}: FlightServiceFormProps) {
  const addFlightService = useAddJavaFlightService(liquidationId);
  const [formData, setFormData] = useState({
    tariff_rate: "0.00",
    is_taxed: "true",
    currency: "PEN",
  });
  const [bookings, setBookings] = useState<FlightBooking[]>([
    createEmptyBooking(),
  ]);

  const addBooking = () =>
    setBookings((prev) => [...prev, createEmptyBooking()]);

  const removeBooking = (index: number) => {
    setBookings((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBooking = (
    index: number,
    field: keyof FlightBooking,
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
      flight_bookings: bookings.map((booking) => ({
        origin: booking.origin,
        destiny: booking.destiny,
        departure_date: booking.departure_date,
        arrival_date: booking.arrival_date,
        aeroline: booking.aeroline,
        aeroline_booking_code: booking.aeroline_booking_code,
        costamar_booking_code: booking.costamar_booking_code,
        tkt_numbers: booking.tkt_numbers,
        status: booking.status,
        total_price: parseFloat(booking.total_price || "0"),
        currency: booking.currency,
      })),
    };

    addFlightService.mutate(
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
        <CardTitle>Agregar Servicio de Vuelo</CardTitle>
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
                Reservas de Vuelo
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
                      <Label>Origen *</Label>
                      <Input
                        required
                        value={booking.origin}
                        onChange={(event) =>
                          updateBooking(index, "origin", event.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Destino *</Label>
                      <Input
                        required
                        value={booking.destiny}
                        onChange={(event) =>
                          updateBooking(index, "destiny", event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Fecha Salida *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={booking.departure_date}
                        onChange={(event) =>
                          updateBooking(
                            index,
                            "departure_date",
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha Llegada *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={booking.arrival_date}
                        onChange={(event) =>
                          updateBooking(
                            index,
                            "arrival_date",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Aerolínea *</Label>
                    <Input
                      required
                      value={booking.aeroline}
                      onChange={(event) =>
                        updateBooking(index, "aeroline", event.target.value)
                      }
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Código Reserva Aerolínea *</Label>
                      <Input
                        required
                        value={booking.aeroline_booking_code}
                        onChange={(event) =>
                          updateBooking(
                            index,
                            "aeroline_booking_code",
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Código Reserva Costamar</Label>
                      <Input
                        value={booking.costamar_booking_code}
                        onChange={(event) =>
                          updateBooking(
                            index,
                            "costamar_booking_code",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Números de Ticket *</Label>
                    <Input
                      required
                      value={booking.tkt_numbers}
                      onChange={(event) =>
                        updateBooking(index, "tkt_numbers", event.target.value)
                      }
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Precio Total *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        required
                        value={booking.total_price}
                        onChange={(event) =>
                          updateBooking(
                            index,
                            "total_price",
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
            <Button type="submit" disabled={addFlightService.isPending}>
              {addFlightService.isPending ? "Agregando..." : "Agregar Servicio"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
