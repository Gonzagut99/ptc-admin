"use client";

import { AlertCircle, KeyRound, Shield, MonitorSmartphone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useChangePassword } from "@/app/auth/log-in/_hooks/auth-hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useSettingsSession } from "../../_contexts/settings-session-context";

// Schema de validación para el formulario de cambio de contraseña
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string().min(1, "La confirmación es requerida"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function SecurityContent() {
  const [updatePasswordExpanded, setUpdatePasswordExpanded] = useState(false);
  const { session, isLoading } = useSettingsSession();
  const changePasswordMutation = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      form.reset();
      setUpdatePasswordExpanded(false);
    } catch {
      // Error is handled in the mutation
    }
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
      {/* Contraseña */}
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
                    Mantén tu contraseña segura y actualizada
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setUpdatePasswordExpanded(true)}
              >
                Actualizar Contraseña
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Cambiar contraseña</CardTitle>
            <CardDescription>
              Ingresa tu contraseña actual y la nueva contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña actual</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Ingresa tu contraseña actual" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Mínimo 8 caracteres" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nueva contraseña</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Repite la nueva contraseña" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-2">
                  <Button 
                    type="submit" 
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar cambios"
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setUpdatePasswordExpanded(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Estado de la cuenta */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Estado de la cuenta</CardTitle>
          <CardDescription>Información sobre el estado de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Estado actual</div>
              <div className="text-sm text-muted-foreground">
                Tu cuenta está {session.isActive ? "activa" : "inactiva"}
              </div>
            </div>
            <Badge variant={session.isActive ? "default" : "destructive"}>
              {session.isActive ? "Activa" : "Inactiva"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Información de sesión */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Sesión activa</CardTitle>
          <CardDescription>Información sobre tu sesión actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MonitorSmartphone className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{session.userName || session.email}</div>
              <div className="text-sm text-muted-foreground">
                {session.email}
              </div>
            </div>
            <Badge variant="outline">Sesión actual</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
