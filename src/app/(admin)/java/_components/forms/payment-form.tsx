"use client";

import { useState } from "react";
import { useAddJavaPayment } from "@/app/(admin)/java/_hooks/liquidations-hooks";
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

interface PaymentFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentForm({
  liquidationId,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const addPayment = useAddJavaPayment(liquidationId);
  const [formData, setFormData] = useState({
    payment_method: "DEBIT",
    amount: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addPayment.mutate(
      {
        params: { path: { liquidationId } },
        body: {
          payment_method: formData.payment_method,
          amount: parseFloat(formData.amount || "0"),
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          setFormData({ payment_method: "DEBIT", amount: "" });
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Pago</CardTitle>
        <CardDescription>Liquidación #{liquidationId}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment_method">Método de Pago *</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, payment_method: value }))
              }
            >
              <SelectTrigger id="payment_method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEBIT">Débito</SelectItem>
                <SelectItem value="CREDIT">Crédito</SelectItem>
                <SelectItem value="YAPE">Yape</SelectItem>
                <SelectItem value="OTHER">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, amount: event.target.value }))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={addPayment.isPending}>
              {addPayment.isPending ? "Agregando..." : "Agregar Pago"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
