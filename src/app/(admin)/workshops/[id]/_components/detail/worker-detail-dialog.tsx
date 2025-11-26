"use client";

import {
  Calendar,
  FileText,
  Mail,
  Phone,
  Shield,
  UserCircle,
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
import { useGetWorker } from "../../_hooks/workers-hooks";

interface WorkerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workerId: string;
}

const ID_DOCUMENT_TYPE_LABELS: Record<string, string> = {
  DNI: "DNI",
  RUC: "RUC",
  FOREIGNER_ID: "Carnet de Extranjería",
  PASSPORT: "Pasaporte",
  OTHER: "Otro",
};

export default function WorkerDetailDialog({
  open,
  onOpenChange,
  workerId,
}: WorkerDetailDialogProps) {
  const { data: worker, isLoading, error } = useGetWorker(workerId);

  if (isLoading) {
    return (
      <DialogLoading
        open={open}
        onOpenChange={onOpenChange}
        title="Cargando detalles del trabajador..."
        description="Espera un momento mientras recuperamos la información."
      />
    );
  }

  if (error || !worker) {
    return (
      <DialogError
        open={open}
        onOpenChange={onOpenChange}
        title="Error al cargar los detalles del trabajador"
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
      title="Detalle de trabajador"
      description="Consulta la información registrada del trabajador."
      className="sm:max-w-3xl"
    >
      <DialogScrollArea className="h-[calc(100dvh-200px)] px-1">
        <div className="space-y-6 px-6">
          <Card>
            <CardHeader className="flex items-center justify-between border-b [.border-b]:pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary/20 bg-primary/5">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                      Nombre completo
                    </p>
                    <p className="text-lg font-semibold capitalize">
                      {worker.name}
                    </p>
                  </div>
                </div>
              </CardTitle>
              <ActiveStatusBadge
                isActive={worker.isActive ?? false}
                className="text-xs"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Documento
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {ID_DOCUMENT_TYPE_LABELS[worker.idDocumentType] ??
                      worker.idDocumentType}
                  </p>
                  <p className="text-base font-mono">{worker.idNumber}</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Taller asignado
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {(worker as { workshop?: { name?: string } })?.workshop
                      ?.name ?? "Sin asignar"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Email
                    </p>
                  </div>
                  <p className="text-sm font-semibold break-all">
                    {worker.email || "No registrado"}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Teléfono
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {worker.phone || "No registrado"}
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
                    <Calendar className="h-5 w-5" />
                    Información temporal
                  </CardTitle>
                  <CardDescription>
                    Fechas claves dentro del sistema
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  Registro
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Fecha de creación
                  </p>
                  <p className="text-sm font-medium">
                    {formatPeruDateHour(worker.createdAt)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Última actualización
                  </p>
                  <p className="text-sm font-medium">
                    {formatPeruDateHour(worker.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogScrollArea>
    </DialogContentComponent>
  );
}
