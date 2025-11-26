"use client";

import type { FormEvent } from "react";
import { useState } from "react";
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
import { useAddJavaAdditionalService } from "../../_hooks/liquidations-hooks";

interface AdditionalServiceFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AdditionalServiceForm({
  liquidationId,
  onSuccess,
  onCancel,
}: AdditionalServiceFormProps) {
  const addAdditionalService = useAddJavaAdditionalService(liquidationId);
  const [formData, setFormData] = useState({
    tariff_rate: "0.00",
    is_taxed: "true",
    currency: "PEN",
    price: "",
    status: "PENDING",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addAdditionalService.mutate(
      {
        params: { path: { liquidationId } },
        body: {
          tariff_rate: parseFloat(formData.tariff_rate),
          taxed: formData.is_taxed === "true",
          currency: formData.currency,
          price: parseFloat(formData.price),
          status: formData.status,
        },
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
        <CardTitle>Agregar Servicio Adicional</CardTitle>
        <CardDescription>Liquidación #{liquidationId}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tariff_rate">Tarifa *</Label>
              <Input
                id="tariff_rate"
                type="number"
                step="0.01"
                required
                value={formData.tariff_rate}
                onChange={(e) =>
                  setFormData({ ...formData, tariff_rate: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
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
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="COMPLETED">Completado</SelectItem>
                  <SelectItem value="CANCELED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_taxed">¿Incluye IGV?</Label>
              <Select
                value={formData.is_taxed}
                onValueChange={(value) =>
                  setFormData({ ...formData, is_taxed: value })
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

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={addAdditionalService.isPending}>
              {addAdditionalService.isPending
                ? "Agregando..."
                : "Agregar Servicio"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
