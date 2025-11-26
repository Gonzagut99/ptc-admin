"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAddJavaTourService } from "@/app/(admin)/java/_hooks/liquidations-hooks";
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

interface TourServiceFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Tour {
  start_date: string;
  end_date: string;
  title: string;
  price: string;
  place: string;
  currency: string;
  status: string;
}

const createEmptyTour = (): Tour => ({
  start_date: "",
  end_date: "",
  title: "",
  price: "",
  place: "",
  currency: "PEN",
  status: "PENDING",
});

export function TourServiceForm({
  liquidationId,
  onSuccess,
  onCancel,
}: TourServiceFormProps) {
  const addTourService = useAddJavaTourService(liquidationId);
  const [formData, setFormData] = useState({
    tariff_rate: "0.00",
    is_taxed: "true",
    currency: "PEN",
  });
  const [tours, setTours] = useState<Tour[]>([createEmptyTour()]);

  const addTour = () => setTours((prev) => [...prev, createEmptyTour()]);

  const removeTour = (index: number) => {
    setTours((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTour = (index: number, field: keyof Tour, value: string) => {
    setTours((prev) => {
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
      tours: tours.map((tour) => ({
        start_date: tour.start_date,
        end_date: tour.end_date,
        title: tour.title,
        price: parseFloat(tour.price || "0"),
        place: tour.place,
        currency: tour.currency,
        status: tour.status,
      })),
    };

    addTourService.mutate(
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
        <CardTitle>Agregar Servicio de Tour</CardTitle>
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
              <Label className="text-base font-semibold">Tours</Label>
              <Button type="button" size="sm" onClick={addTour}>
                <Plus className="mr-1 h-4 w-4" />
                Agregar Tour
              </Button>
            </div>

            {tours.map((tour, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Tour {index + 1}</h4>
                    {tours.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeTour(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Fecha Inicio *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={tour.start_date}
                        onChange={(event) =>
                          updateTour(index, "start_date", event.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha Fin *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={tour.end_date}
                        onChange={(event) =>
                          updateTour(index, "end_date", event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Título *</Label>
                    <Input
                      required
                      value={tour.title}
                      onChange={(event) =>
                        updateTour(index, "title", event.target.value)
                      }
                      placeholder="Tour a Machu Picchu"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Lugar *</Label>
                      <Input
                        required
                        value={tour.place}
                        onChange={(event) =>
                          updateTour(index, "place", event.target.value)
                        }
                        placeholder="Cusco"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Precio *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        required
                        value={tour.price}
                        onChange={(event) =>
                          updateTour(index, "price", event.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Moneda *</Label>
                      <Select
                        value={tour.currency}
                        onValueChange={(value) =>
                          updateTour(index, "currency", value)
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
                  </div>

                  <div className="space-y-2">
                    <Label>Estado *</Label>
                    <Select
                      value={tour.status}
                      onValueChange={(value) =>
                        updateTour(index, "status", value)
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
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={addTourService.isPending}>
              {addTourService.isPending ? "Agregando..." : "Agregar Servicio"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
