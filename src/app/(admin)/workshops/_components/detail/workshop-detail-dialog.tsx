"use client";

import {
  BadgeDollarSign,
  Building2,
  Calendar,
  Factory,
  IdCard,
  Info,
  Users,
} from "lucide-react";
import { ActiveStatusBadge } from "@/components/ui/active-status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogContentComponent,
  DialogError,
  DialogLoading,
  DialogScrollArea,
} from "@/components/ui/dialog-responsive";
import { Separator } from "@/components/ui/separator";
import { formatPeruDateHour } from "@/utils/peru-datetime";
import { useGetWorkshop } from "../../_hooks/workshops-hooks";

interface WorkshopDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshopId: string;
}

export default function WorkshopDetailDialog({
  open,
  onOpenChange,
  workshopId,
}: WorkshopDetailDialogProps) {
  const { data: workshop, isLoading, error } = useGetWorkshop(workshopId);

  const workerCount = (workshop as { workerCount?: number } | undefined)
    ?.workerCount;

  if (isLoading) {
    return (
      <DialogLoading
        open={open}
        onOpenChange={onOpenChange}
        title="Cargando detalles del taller..."
        description="Espera un momento mientras cargamos la información."
      />
    );
  }

  if (error || !workshop) {
    return (
      <DialogError
        open={open}
        onOpenChange={onOpenChange}
        title="Error al cargar los detalles del taller"
        description="Ha ocurrido un error al recuperar la información."
      >
        <span className="text-destructive">
          Error:{" "}
          {typeof error?.error?.message === "string"
            ? error.error.message
            : "Error desconocido"}
        </span>
      </DialogError>
    );
  }

  return (
    <DialogContentComponent
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de taller"
      description="Aquí puedes ver la información del taller."
      className="sm:max-w-3xl"
    >
      <DialogScrollArea className="h-[calc(100dvh-200px)] px-1">
        <div className="space-y-6 px-6">
          <Card>
            <CardHeader className="flex items-center justify-between border-b [.border-b]:pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary/20 bg-primary/5">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Nombre del taller
                    </p>
                    <p className="text-lg font-semibold">{workshop.name}</p>
                  </div>
                </div>
              </CardTitle>
              <ActiveStatusBadge
                isActive={workshop.isActive ?? false}
                className="text-xs"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <IdCard className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Tipo de documento
                    </p>
                  </div>
                  <Badge variant="outline" className="text-sm py-1 px-2">
                    {workshop.idDocumentType}
                  </Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Número de documento
                    </p>
                  </div>
                  <p className="text-base font-semibold font-mono">
                    {workshop.idNumber}
                  </p>
                </div>
              </div>

              {typeof workerCount === "number" && (
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Trabajadores asociados
                      </p>
                      <p className="text-sm font-semibold">{workerCount}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Gestión
                  </Badge>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Fecha de creación
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPeruDateHour(workshop.createdAt)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Última actualización
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPeruDateHour(workshop.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Factory className="h-5 w-5" />
                    Información adicional
                  </CardTitle>
                  <CardDescription>
                    Datos complementarios del taller
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  Registro
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg flex items-center gap-3">
                  <BadgeDollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Razón social
                    </p>
                    <p className="text-sm font-medium">
                      {workshop.name || "Sin información"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogScrollArea>
    </DialogContentComponent>
  );
}
