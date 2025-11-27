"use client";

import {
  Calendar,
  CreditCard,
  DollarSign,
  Plane,
  Hotel,
  MapPin,
  Package,
  AlertTriangle,
  User,
  Users,
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatPeruDate, formatPeruDateHour } from "@/utils/peru-datetime";
import {
  LIQUIDATION_STATUS_COLORS,
  LIQUIDATION_STATUS_LABELS,
  LiquidationStatus,
  LiquidationWithDetailsDto,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  PaymentMethod,
  PaymentStatus,
} from "../../_types/liquidations.types";

interface LiquidationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidation: LiquidationWithDetailsDto;
}

export default function LiquidationDetailDialog({
  open,
  onOpenChange,
  liquidation,
}: LiquidationDetailDialogProps) {
  if (!liquidation) return null;

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "-";
    return `S/ ${amount.toFixed(2)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Liquidación #{liquidation.id}
            <Badge
              className={cn(
                LIQUIDATION_STATUS_COLORS[
                  liquidation.status as LiquidationStatus
                ] || "bg-gray-100",
              )}
            >
              {LIQUIDATION_STATUS_LABELS[
                liquidation.status as LiquidationStatus
              ] || liquidation.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detalle completo de la liquidación.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea className="max-h-[60vh]">
          <div className="space-y-6 px-6">
            {/* Información Principal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cliente
                  </p>
                  <p className="font-semibold">
                    {liquidation.customer?.firstName}{" "}
                    {liquidation.customer?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {liquidation.customer?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Personal a Cargo
                  </p>
                  <p className="font-semibold">
                    {liquidation.staff_on_charge?.user?.userName ||
                      liquidation.staff_on_charge?.user?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {liquidation.staff_on_charge?.role}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Montos */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <DollarSign className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Monto Total
                  </p>
                  <p className="font-mono text-lg font-bold">
                    {formatCurrency(liquidation.total_amount)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Estado de Pago
                </p>
                <Badge variant="outline">
                  {PAYMENT_STATUS_LABELS[
                    liquidation.payment_status as PaymentStatus
                  ] || liquidation.payment_status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tipo de Cambio
                </p>
                <p className="font-mono">{liquidation.currency_rate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fecha Límite de Pago
                  </p>
                  <p>
                    {liquidation.payment_deadline
                      ? formatPeruDate(liquidation.payment_deadline)
                      : "-"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Acompañantes
                </p>
                <p>{liquidation.companion ?? 0}</p>
              </div>
            </div>

            <Separator />

            {/* Servicios */}
            <div className="space-y-4">
              <h4 className="font-semibold">Servicios</h4>

              {/* Vuelos */}
              {liquidation.flight_services &&
                liquidation.flight_services.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Plane className="size-4 text-blue-500" />
                    <span>
                      {liquidation.flight_services.length} servicio(s) de vuelo
                    </span>
                  </div>
                )}

              {/* Hoteles */}
              {liquidation.hotel_services &&
                liquidation.hotel_services.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Hotel className="size-4 text-orange-500" />
                    <span>
                      {liquidation.hotel_services.length} servicio(s) de hotel
                    </span>
                  </div>
                )}

              {/* Tours */}
              {liquidation.tour_services &&
                liquidation.tour_services.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-green-500" />
                    <span>
                      {liquidation.tour_services.length} servicio(s) de tour
                    </span>
                  </div>
                )}

              {/* Adicionales */}
              {liquidation.additional_services &&
                liquidation.additional_services.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-purple-500" />
                    <span>
                      {liquidation.additional_services.length} servicio(s)
                      adicional(es)
                    </span>
                  </div>
                )}
            </div>

            {/* Pagos */}
            {liquidation.payments && liquidation.payments.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CreditCard className="size-4" />
                    Pagos ({liquidation.payments.length})
                  </h4>
                  <div className="space-y-2">
                    {liquidation.payments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-muted rounded-md"
                      >
                        <span>
                          {PAYMENT_METHOD_LABELS[
                            payment.method as PaymentMethod
                          ] || payment.method}
                        </span>
                        <span className="font-mono">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Incidencias */}
            {liquidation.incidencies && liquidation.incidencies.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="size-4" />
                    Incidencias ({liquidation.incidencies.length})
                  </h4>
                  <div className="space-y-2">
                    {liquidation.incidencies.map((incidency, index) => (
                      <div
                        key={index}
                        className="p-2 bg-amber-50 border border-amber-200 rounded-md"
                      >
                        <p className="text-sm">{incidency.reason}</p>
                        {incidency.amount && (
                          <p className="text-sm font-mono">
                            Monto: {formatCurrency(incidency.amount)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Fechas del sistema */}
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {liquidation.created_at && (
                  <div>
                    <p className="text-muted-foreground">Fecha de creación</p>
                    <p>{formatPeruDateHour(liquidation.created_at)}</p>
                  </div>
                )}
                {liquidation.updated_at && (
                  <div>
                    <p className="text-muted-foreground">
                      Última actualización
                    </p>
                    <p>{formatPeruDateHour(liquidation.updated_at)}</p>
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
