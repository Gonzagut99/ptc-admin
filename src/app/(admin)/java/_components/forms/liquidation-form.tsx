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
import { useAllJavaCustomers } from "../../_hooks/customers-hooks";
import { useAllJavaStaff } from "../../_hooks/staff-hooks";
import { useCreateJavaLiquidation } from "../../_hooks/liquidations-hooks";

interface LiquidationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LiquidationForm({ onSuccess, onCancel }: LiquidationFormProps) {
  const { customers, isLoading: loadingCustomers } = useAllJavaCustomers();
  const { staff, isLoading: loadingStaff } = useAllJavaStaff();
  const createLiquidation = useCreateJavaLiquidation();

  const [formData, setFormData] = useState({
    customer_id: "",
    staff_id: "",
    currency_rate: "3.75",
    payment_deadline: "",
    companion: "1",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createLiquidation.mutate(
      {
        body: {
          customer_id: Number(formData.customer_id),
          staff_id: Number(formData.staff_id),
          currency_rate: parseFloat(formData.currency_rate),
          payment_deadline: new Date(formData.payment_deadline).toISOString(),
          companion: Number(formData.companion),
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          setFormData({
            customer_id: "",
            staff_id: "",
            currency_rate: "3.75",
            payment_deadline: "",
            companion: "1",
          });
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Liquidación</CardTitle>
        <CardDescription>
          Ingrese los datos de la nueva liquidación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_id">Cliente *</Label>
            <Select
              value={formData.customer_id}
              onValueChange={(value) =>
                setFormData({ ...formData, customer_id: value })
              }
            >
              <SelectTrigger id="customer_id">
                <SelectValue placeholder="Seleccione un cliente" />
              </SelectTrigger>
              <SelectContent>
                {loadingCustomers ? (
                  <SelectItem value="loading" disabled>
                    Cargando clientes...
                  </SelectItem>
                ) : customers.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No hay clientes disponibles
                  </SelectItem>
                ) : (
                  customers.map((customer) => (
                    <SelectItem key={customer.id} value={String(customer.id)}>
                      {customer.firstName} {customer.lastName} -{" "}
                      {customer.idDocumentNumber}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff_id">Personal a Cargo *</Label>
            <Select
              value={formData.staff_id}
              onValueChange={(value) =>
                setFormData({ ...formData, staff_id: value })
              }
            >
              <SelectTrigger id="staff_id">
                <SelectValue placeholder="Seleccione personal" />
              </SelectTrigger>
              <SelectContent>
                {loadingStaff ? (
                  <SelectItem value="loading" disabled>
                    Cargando personal...
                  </SelectItem>
                ) : staff.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No hay personal disponible
                  </SelectItem>
                ) : (
                  staff.map((member) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.user?.userName || member.user?.email} -{" "}
                      {member.role}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency_rate">Tipo de Cambio *</Label>
              <Input
                id="currency_rate"
                type="number"
                step="0.01"
                required
                value={formData.currency_rate}
                onChange={(e) =>
                  setFormData({ ...formData, currency_rate: e.target.value })
                }
                placeholder="3.75"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companion">Acompañantes *</Label>
              <Input
                id="companion"
                type="number"
                min="1"
                required
                value={formData.companion}
                onChange={(e) =>
                  setFormData({ ...formData, companion: e.target.value })
                }
                placeholder="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_deadline">Fecha Límite de Pago *</Label>
            <Input
              id="payment_deadline"
              type="datetime-local"
              required
              value={formData.payment_deadline}
              onChange={(e) =>
                setFormData({ ...formData, payment_deadline: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={
                createLiquidation.isPending ||
                loadingCustomers ||
                loadingStaff ||
                !formData.customer_id ||
                !formData.staff_id
              }
            >
              {createLiquidation.isPending ? "Creando..." : "Crear Liquidación"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
