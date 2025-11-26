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
import { useCreateJavaUserWithStaff } from "../../_hooks/staff-hooks";

interface StaffFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StaffForm({ onSuccess, onCancel }: StaffFormProps) {
  const createUserWithStaff = useCreateJavaUserWithStaff();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
    phoneNumber: "",
    salary: "",
    currency: "PEN",
    role: "SALES",
    hireDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createUserWithStaff.mutate(
      {
        body: {
          email: formData.email,
          password: formData.password,
          userName: formData.userName || undefined,
          phoneNumber: formData.phoneNumber,
          salary: parseFloat(formData.salary),
          currency: formData.currency,
          role: formData.role,
          hireDate: formData.hireDate
            ? new Date(formData.hireDate).toISOString()
            : undefined,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          setFormData({
            email: "",
            password: "",
            userName: "",
            phoneNumber: "",
            salary: "",
            currency: "PEN",
            role: "SALES",
            hireDate: new Date().toISOString().split("T")[0],
          });
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Personal</CardTitle>
        <CardDescription>
          Ingrese los datos del nuevo miembro del personal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="personal@ptc.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Nombre de Usuario</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                placeholder="nombre_usuario"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Teléfono *</Label>
              <Input
                id="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="+51 999 999 999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALES">Ventas</SelectItem>
                  <SelectItem value="COUNTER">Counter</SelectItem>
                  <SelectItem value="ACCOUNTING">Contabilidad</SelectItem>
                  <SelectItem value="OPERATIONS">Operaciones</SelectItem>
                  <SelectItem value="SUPPORT">Soporte</SelectItem>
                  <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="salary">Salario *</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                required
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

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
          </div>

          <div className="space-y-2">
            <Label htmlFor="hireDate">Fecha de Contratación</Label>
            <Input
              id="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={(e) =>
                setFormData({ ...formData, hireDate: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={createUserWithStaff.isPending}>
              {createUserWithStaff.isPending ? "Creando..." : "Crear Personal"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
