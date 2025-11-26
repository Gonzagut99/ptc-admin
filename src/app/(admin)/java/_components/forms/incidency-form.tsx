"use client";

import { useState } from "react";
import { useAddJavaIncidency } from "@/app/(admin)/java/_hooks/liquidations-hooks";
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
import { Textarea } from "@/components/ui/textarea";

interface IncidencyFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const buildDefaultDateTime = () => {
  const now = new Date();
  const datePart = now.toISOString().split("T")[0];
  const timePart = now.toTimeString().slice(0, 5);
  return `${datePart}T${timePart}`;
};

export function IncidencyForm({
  liquidationId,
  onSuccess,
  onCancel,
}: IncidencyFormProps) {
  const addIncidency = useAddJavaIncidency(liquidationId);
  const [formData, setFormData] = useState({
    reason: "",
    amount: "",
    incidencyDate: buildDefaultDateTime(),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      reason: formData.reason,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      incidencyDate: formData.incidencyDate,
    };

    addIncidency.mutate(
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
        <CardTitle>Agregar Incidencia</CardTitle>
        <CardDescription>Liquidación #{liquidationId}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo *</Label>
            <Textarea
              id="reason"
              required
              rows={3}
              value={formData.reason}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, reason: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto (opcional)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, amount: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="incidencyDate">Fecha de Incidencia *</Label>
            <Input
              id="incidencyDate"
              type="datetime-local"
              required
              value={formData.incidencyDate}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  incidencyDate: event.target.value,
                }))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={addIncidency.isPending}>
              {addIncidency.isPending ? "Agregando..." : "Agregar Incidencia"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
