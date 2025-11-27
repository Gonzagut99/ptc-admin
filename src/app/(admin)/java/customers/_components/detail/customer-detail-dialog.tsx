"use client";

import { Calendar, Mail, MapPin, Phone, User, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogScrollArea,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { formatPeruDate } from "@/utils/peru-datetime";
import {
  DCustomer,
  ID_DOCUMENT_TYPE_LABELS,
  IdDocumentType,
} from "../../_types/customers.types";

interface CustomerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: DCustomer;
}

export default function CustomerDetailDialog({
  open,
  onOpenChange,
  customer,
}: CustomerDetailDialogProps) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle del Cliente</DialogTitle>
          <DialogDescription>
            Información completa del cliente.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <div className="space-y-4 px-6">
            {/* Nombre completo */}
            <div className="flex items-start gap-3">
              <User className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nombre Completo
                </p>
                <p className="text-base font-semibold">
                  {customer.firstName} {customer.lastName}
                </p>
              </div>
            </div>

            {/* Documento */}
            <div className="flex items-start gap-3">
              <CreditCard className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Documento de Identidad
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {ID_DOCUMENT_TYPE_LABELS[
                      customer.idDocumentType as IdDocumentType
                    ] || customer.idDocumentType}
                  </Badge>
                  <span className="font-mono">{customer.idDocumentNumber}</span>
                </div>
              </div>
            </div>

            {/* Email */}
            {customer.email && (
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-base">{customer.email}</p>
                </div>
              </div>
            )}

            {/* Teléfono */}
            {customer.phoneNumber && (
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                  <p className="text-base">{customer.phoneNumber}</p>
                </div>
              </div>
            )}

            {/* Fecha de nacimiento */}
            {customer.birthDate && (
              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fecha de Nacimiento
                  </p>
                  <p className="text-base">
                    {formatPeruDate(customer.birthDate)}
                  </p>
                </div>
              </div>
            )}

            {/* Nacionalidad */}
            {customer.nationality && (
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nacionalidad
                  </p>
                  <p className="text-base">{customer.nationality}</p>
                </div>
              </div>
            )}

            {/* Dirección */}
            {customer.address && (
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Dirección
                  </p>
                  <p className="text-base">{customer.address}</p>
                </div>
              </div>
            )}

            {/* Fechas del sistema */}
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {customer.createdDate && (
                  <div>
                    <p className="text-muted-foreground">Fecha de creación</p>
                    <p>{formatPeruDate(customer.createdDate)}</p>
                  </div>
                )}
                {customer.updatedDate && (
                  <div>
                    <p className="text-muted-foreground">
                      Última actualización
                    </p>
                    <p>{formatPeruDate(customer.updatedDate)}</p>
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
