"use client";

import { AlertCircle, Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useSettingsSession } from "../../_contexts/settings-session-context";

export function ProfileContent() {
  // const [emailAddressExpanded, setEmailAddressExpanded] = useState(false);
  const { session, isLoading } = useSettingsSession();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-6 w-6" />
          <p className="text-sm text-muted-foreground font-medium">
            Cargando información del perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              No se pudo cargar la sesión
            </p>
            <p className="text-xs text-muted-foreground">
              Por favor, intenta recargar la página o inicia sesión nuevamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Información del usuario */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
          <CardDescription>
            Tu información de perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-1 space-y-5 min-w-0">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="mt-0.5 shrink-0">
                    <div className="bg-primary/10 p-1.5 rounded-md">
                      <User className="size-3.5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                      Nombre de usuario
                    </div>
                    <div className="text-sm font-medium">
                      {session.userName || "Sin nombre"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                <Badge 
                  variant={session.isActive ? "default" : "destructive"} 
                  className="font-normal text-xs"
                >
                  {session.isActive ? "Activo" : "Inactivo"}
                </Badge>
                {session.id && (
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {session.id}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Correo electrónico */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Correo electrónico</CardTitle>
          <CardDescription>
            Tu dirección de correo electrónico actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="mt-0.5 shrink-0">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <Mail className="size-3.5 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                Correo electrónico
              </div>
              <div className="text-sm font-medium">
                {session.email || "Sin email"}
              </div>
            </div>
            {/* TODO: Implementar cambio de email cuando el backend lo soporte */}
            <Button
              variant="outline"
              type="button"
              disabled
              title="Funcionalidad no disponible aún"
            >
              Cambiar email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
