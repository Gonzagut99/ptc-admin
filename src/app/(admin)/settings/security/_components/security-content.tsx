"use client";

import { AlertCircle, KeyRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { formatPeruTime } from "@/utils/peru-datetime";
import { useSettingsSession } from "../../_contexts/settings-session-context";
import SessionDeviceInfo from "./session-device-info";
import UpdatePasswordForm from "./update-password-form";

export function SecurityContent() {
  const [updatePasswordExpanded, setUpdatePasswordExpanded] = useState(false);
  const { session, isLoading } = useSettingsSession();

  const updatePassword = () => {
    setUpdatePasswordExpanded(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-6 w-6" />
          <p className="text-sm text-muted-foreground font-medium">
            Cargando información de seguridad...
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
      {!updatePasswordExpanded ? (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Contraseña</CardTitle>
            <CardDescription>
              Cambia tu contraseña para mantener tu cuenta segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <KeyRound className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Contraseña de la cuenta</div>
                  <div className="text-sm text-muted-foreground">
                    Última actualización hace más de 90 días
                  </div>
                </div>
              </div>
              <Button variant="outline" type="button" onClick={updatePassword}>
                Actualizar Contraseña
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <UpdatePasswordForm onClose={() => setUpdatePasswordExpanded(false)} />
      )}

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Sesión activa</CardTitle>
          <CardDescription>Información sobre tu sesión actual</CardDescription>
        </CardHeader>
        <CardContent>
          <SessionDeviceInfo
            userAgent={session.session.userAgent}
            ipAddress={session.session.ipAddress}
            updatedAt={session.session.updatedAt}
            formatTime={formatPeruTime}
          />
        </CardContent>
      </Card>
    </div>
  );
}
