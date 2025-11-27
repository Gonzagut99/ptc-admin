"use client";

import {
  Briefcase,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogScrollArea,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { formatPeruDateHour } from "@/utils/peru-datetime";
import {
  Currency,
  CURRENCY_LABELS,
  DStaff,
  STAFF_ROLE_LABELS,
  StaffRole,
} from "../../_types/staff.types";

interface StaffDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: DStaff;
}

export default function StaffDetailDialog({
  open,
  onOpenChange,
  staff,
}: StaffDetailDialogProps) {
  if (!staff) return null;

  const formatSalary = () => {
    if (!staff.salary) return "-";
    const currencyLabel =
      CURRENCY_LABELS[staff.currency as Currency] || staff.currency;
    return `${currencyLabel} ${staff.salary.toFixed(2)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle del Personal</DialogTitle>
          <DialogDescription>
            Información completa del miembro del personal.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <div className="space-y-4 px-6">
            {/* Usuario */}
            <div className="flex items-start gap-3">
              <User className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nombre de Usuario
                </p>
                <p className="text-base font-semibold">
                  {staff.user?.userName || "-"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{staff.user?.email || "-"}</p>
              </div>
            </div>

            {/* Rol */}
            <div className="flex items-start gap-3">
              <Briefcase className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rol</p>
                <Badge variant="outline">
                  {STAFF_ROLE_LABELS[staff.role as StaffRole] || staff.role}
                </Badge>
              </div>
            </div>

            {/* Teléfono */}
            {staff.phoneNumber && (
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                  <p className="text-base">{staff.phoneNumber}</p>
                </div>
              </div>
            )}

            {/* Salario */}
            <div className="flex items-start gap-3">
              <DollarSign className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Salario
                </p>
                <p className="text-base font-mono">{formatSalary()}</p>
              </div>
            </div>

            {/* Fecha de contratación */}
            {staff.hireDate && (
              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fecha de Contratación
                  </p>
                  <p className="text-base">
                    {formatPeruDateHour(staff.hireDate)}
                  </p>
                </div>
              </div>
            )}

            {/* Estado */}
            <div className="flex items-start gap-3">
              <div className="size-5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Estado
                </p>
                <Badge variant={staff.isActive ? "default" : "secondary"}>
                  {staff.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>

            {/* Fechas del sistema */}
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {staff.createdDate && (
                  <div>
                    <p className="text-muted-foreground">Fecha de creación</p>
                    <p>{formatPeruDateHour(staff.createdDate)}</p>
                  </div>
                )}
                {staff.updatedDate && (
                  <div>
                    <p className="text-muted-foreground">
                      Última actualización
                    </p>
                    <p>{formatPeruDateHour(staff.updatedDate)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogScrollArea>
      </DialogContent>
    </Dialog>
  );
}
