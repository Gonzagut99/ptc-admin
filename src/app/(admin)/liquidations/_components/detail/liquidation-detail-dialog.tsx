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
  Plus,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogScrollArea,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { formatPeruDate, formatPeruDateHour } from "@/utils/peru-datetime";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { MODULE_LIQUIDATIONS } from "../overlays/liquidations-dialogs";
import {
  LIQUIDATION_STATUS_COLORS,
  LIQUIDATION_STATUS_LABELS,
  LiquidationStatus,
  LiquidationWithDetailsDto,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  PaymentMethod,
  PaymentStatus,
  DPayment,
  Currency,
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
  const { open: openDialog } = useDialogStore();

  if (!liquidation) return null;

  const formatCurrency = (amount?: number, currency?: Currency) => {
    if (amount === undefined || amount === null) return "-";
    if (currency === "USD") {
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    }
    // Por defecto PEN
    return amount.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
    });
  };

  const handleAddService = () => {
    openDialog(MODULE_LIQUIDATIONS, "add-service", liquidation);
  };

  const handleAddPayment = () => {
    openDialog(MODULE_LIQUIDATIONS, "add-payment", liquidation);
  };

  const handleAddIncidency = () => {
    openDialog(MODULE_LIQUIDATIONS, "add-incidency", liquidation);
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

        {/* Botones de Acciones */}
        <div className="flex flex-wrap gap-2 px-6 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddService}
            className="gap-1"
          >
            <Plus className="size-4" />
            Agregar Servicio
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddPayment}
            className="gap-1"
          >
            <CreditCard className="size-4" />
            Agregar Pago
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddIncidency}
            className="gap-1"
          >
            <AlertTriangle className="size-4" />
            Agregar Incidencia
          </Button>
        </div>

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

            {/* Totales por Moneda */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <DollarSign className="size-5" />
                Totales
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total en Soles (PEN)
                  </p>
                  <p className="font-mono text-lg font-bold text-emerald-600">
                    {formatCurrency(liquidation.total_amount, "PEN")}
                  </p>
                  {liquidation.total_commission_pen !== undefined && liquidation.total_commission_pen !== null && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Comisión: {formatCurrency(liquidation.total_commission_pen, "PEN")}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total en Dólares (USD)
                  </p>
                  <p className="font-mono text-lg font-bold text-blue-600">
                    {formatCurrency(liquidation.total_amount_usd, "USD")}
                  </p>
                  {liquidation.total_commission_usd !== undefined && liquidation.total_commission_usd !== null && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Comisión: {formatCurrency(liquidation.total_commission_usd, "USD")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
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
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Acompañantes
                </p>
                <p>{liquidation.companion ?? 0}</p>
              </div>
            </div>

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
                  <Accordion type="single" collapsible className="w-full">
                    {liquidation.payments.map((payment, index) => {
                      // Usamos el tipo extendido DPayment
                      const paymentData = payment as DPayment;
                      const isImage = paymentData.evidenceUrl?.match(/\.(jpg|jpeg|png|webp|gif)$/i);
                      const isPdf = paymentData.evidenceUrl?.match(/\.pdf$/i);
                      const validationStatusIcon = {
                        VALID: <CheckCircle className="size-4 text-green-500" />,
                        PENDING: <Clock className="size-4 text-yellow-500" />,
                        INVALID: <XCircle className="size-4 text-red-500" />,
                      };
                      const validationStatusLabel = {
                        VALID: "Válido",
                        PENDING: "Pendiente",
                        INVALID: "Inválido",
                      };
                      
                      return (
                        <AccordionItem key={paymentData.id || index} value={`payment-${index}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-3">
                                <CreditCard className="size-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {PAYMENT_METHOD_LABELS[paymentData.method as PaymentMethod] || paymentData.method}
                                </span>
                                {paymentData.evidenceUrl && (
                                  <Badge variant="outline" className="text-xs gap-1">
                                    {isImage ? <ImageIcon className="size-3" /> : <FileText className="size-3" />}
                                    Evidencia
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-semibold">
                                  {formatCurrency(paymentData.amount, paymentData.currency)}
                                </span>
                                {paymentData.validationStatus && (
                                  <div className="flex items-center gap-1" title={validationStatusLabel[paymentData.validationStatus as keyof typeof validationStatusLabel]}>
                                    {validationStatusIcon[paymentData.validationStatus as keyof typeof validationStatusIcon]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-2">
                              {/* Detalles del pago */}
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Método</p>
                                  <p className="font-medium">
                                    {PAYMENT_METHOD_LABELS[paymentData.method as PaymentMethod] || paymentData.method}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Monto</p>
                                  <p className="font-mono font-medium">
                                    {formatCurrency(paymentData.amount, paymentData.currency)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Estado de Validación</p>
                                  <div className="flex items-center gap-1">
                                    {paymentData.validationStatus && validationStatusIcon[paymentData.validationStatus as keyof typeof validationStatusIcon]}
                                    <span>{paymentData.validationStatus ? validationStatusLabel[paymentData.validationStatus as keyof typeof validationStatusLabel] : "-"}</span>
                                  </div>
                                </div>
                                {paymentData.createdDate && (
                                  <div>
                                    <p className="text-muted-foreground">Fecha de Registro</p>
                                    <p>{formatPeruDateHour(paymentData.createdDate)}</p>
                                  </div>
                                )}
                              </div>

                              {/* Evidencia del pago */}
                              {paymentData.evidenceUrl && (
                                <div className="mt-4 space-y-2">
                                  <p className="text-sm font-medium text-muted-foreground">
                                    Evidencia de Pago
                                  </p>
                                  <div className="border rounded-lg overflow-hidden bg-muted/30">
                                    {isImage ? (
                                      <div className="relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={paymentData.evidenceUrl}
                                          alt="Evidencia de pago"
                                          className="w-full max-h-64 object-contain bg-white"
                                          onError={(e) => {
                                            // Si la imagen no carga, mostrar placeholder
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = "none";
                                            const fallback = target.nextElementSibling as HTMLElement;
                                            if (fallback) fallback.style.display = "flex";
                                          }}
                                        />
                                        {/* Fallback cuando la imagen no carga (CORS o URL privada) */}
                                        <div 
                                          className="hidden flex-col items-center justify-center p-6 bg-muted/50 min-h-32"
                                        >
                                          <ImageIcon className="size-10 text-muted-foreground mb-2" />
                                          <p className="text-sm text-muted-foreground text-center mb-2">
                                            Vista previa no disponible
                                          </p>
                                          <a
                                            href={paymentData.evidenceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Button size="sm" variant="outline" className="gap-1">
                                              <ExternalLink className="size-3" />
                                              Abrir imagen
                                            </Button>
                                          </a>
                                        </div>
                                        <a
                                          href={paymentData.evidenceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="absolute top-2 right-2"
                                        >
                                          <Button size="sm" variant="secondary" className="gap-1">
                                            <ExternalLink className="size-3" />
                                            Abrir
                                          </Button>
                                        </a>
                                      </div>
                                    ) : isPdf ? (
                                      <div className="p-4 flex flex-col items-center gap-3">
                                        <div className="flex items-center gap-2 text-red-600">
                                          <FileText className="size-8" />
                                          <span className="font-medium">Documento PDF</span>
                                        </div>
                                        <a
                                          href={paymentData.evidenceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <Button size="sm" variant="outline" className="gap-1">
                                            <ExternalLink className="size-3" />
                                            Ver PDF
                                          </Button>
                                        </a>
                                      </div>
                                    ) : (
                                      <div className="p-4 flex flex-col items-center gap-3">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                          <FileText className="size-8" />
                                          <span className="font-medium">Archivo adjunto</span>
                                        </div>
                                        <a
                                          href={paymentData.evidenceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <Button size="sm" variant="outline" className="gap-1">
                                            <ExternalLink className="size-3" />
                                            Abrir archivo
                                          </Button>
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {!paymentData.evidenceUrl && (
                                <div className="mt-2 p-3 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
                                  No se adjuntó evidencia de pago
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
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
