"use client";
import { AlertCircle, AlertTriangle, LogOut, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, useSignOut } from "@/app/auth/log-in/_hooks/auth-hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/api-java/auth-client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Spinner } from "../ui/spinner";

export function UserNav() {
  const { data: user, isLoading } = useSession();
  const router = useRouter();
  const signOutMutation = useSignOut();
  const {
    mutate: signOut,
    isPending,
    isError,
    reset,
  } = signOutMutation as {
    mutate: (variables?: unknown) => void;
    isPending: boolean;
    isError?: boolean;
    reset?: () => void;
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Esperar hasta que el componente esté montado en el cliente
  // para evitar errores de hidratación con localStorage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Datos del usuario adaptados para compatibilidad
  const userName = user?.userName || user?.email || "";
  const userEmail = user?.email || "";
  const userInitials = userName.slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    // Si no hay sesión, limpiar auth data y redirigir
    if (!user) {
      authClient.clearAuthData();
      window.location.href = "/auth/log-in";
      return;
    }
    signOut({});
  };

  const handleRetrySignOut = () => {
    // Si no hay sesión, limpiar auth data y redirigir
    if (!user) {
      authClient.clearAuthData();
      window.location.href = "/auth/log-in";
      return;
    }
    if (reset) {
      reset();
    }
    signOut({});
  };

  // Mostrar skeleton durante SSR y mientras carga
  if (!isMounted || isLoading) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" disabled>
        <Skeleton className="h-8 w-8 rounded-full" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {user ? (
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarFallback className="bg-muted font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarFallback className="bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        sideOffset={10}
        forceMount
        onCloseAutoFocus={(e) => {
          // No cerrar automáticamente si hay error o no hay usuario
          if (isError || !user) {
            e.preventDefault();
          }
        }}
      >
        {!user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex gap-3 items-center justify-start">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarFallback className="bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-destructive truncate">
                    Sin sesión
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    No hay sesión activa
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.reload()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Recargar página
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="size-4 shrink-0" />
              Cerrar Sesión
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex gap-3 items-center justify-start">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarFallback className="bg-muted font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </p>
                  {/* TODO: Agregar roles cuando el backend los soporte en UserInfoDto */}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/settings/profile")}
              >
                Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {isError ? (
              <>
                <div className="px-2 py-1.5">
                  <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-2">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-medium text-destructive">
                        Error al cerrar sesión
                      </p>
                      <p className="text-xs text-muted-foreground">
                        No se pudo cerrar la sesión. Por favor, intenta
                        nuevamente.
                      </p>
                    </div>
                  </div>
                </div>
                <DropdownMenuItem
                  onClick={handleRetrySignOut}
                  disabled={isPending}
                  className="text-destructive focus:text-destructive"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reintentar cierre de sesión
                  {isPending && (
                    <DropdownMenuShortcut>
                      <Spinner />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={handleSignOut} disabled={isPending}>
                Cerrar Sesión
                <DropdownMenuShortcut>
                  {isPending ? (
                    <Spinner />
                  ) : (
                    <LogOut className="size-4 shrink-0" />
                  )}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
