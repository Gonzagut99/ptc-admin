"use client";
import { AlertCircle, AlertTriangle, LogOut, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getRoleInfo } from "@/app/(admin)/admin/_shared/_utils/roles";
import { useGetUser } from "@/app/(admin)/admin/users/_hooks/users-hooks";
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
import { forceLogout } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Spinner } from "../ui/spinner";
import { UserAvatarProfile } from "../ui/user-avatar-profile";

export function UserNav() {
  const { data, isLoading } = useSession();
  const router = useRouter();
  const signOutMutation = useSignOut();
  const {
    mutate: signOut,
    isPending,
    isError,
    reset,
  } = signOutMutation as {
    mutate: (variables?: any) => void;
    isPending: boolean;
    isError?: boolean;
    reset?: () => void;
  };
  const user = data?.user;
  const { data: userData, isLoading: isLoadingUser } = useGetUser(
    user?.id || "",
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = () => {
    // Si no hay sesión, usar forceLogout para limpiar cookies
    if (!user) {
      forceLogout();
      return;
    }
    signOut({});
  };

  const handleRetrySignOut = () => {
    // Si no hay sesión, usar forceLogout para limpiar cookies
    if (!user) {
      forceLogout();
      return;
    }
    if (reset) {
      reset();
    }
    signOut({});
  };

  if (isLoading) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <UserAvatarProfile user={null} />
      </Button>
    );
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {user ? (
            <UserAvatarProfile user={user} />
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
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback className="bg-muted font-bold">
                    {user?.name?.slice(0, 2).toUpperCase() || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.name || ""}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || ""}
                  </p>
                  {isLoadingUser ? (
                    <div className="flex items-center gap-1 mt-2">
                      <Spinner />
                    </div>
                  ) : userData?.roles && userData.roles.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1 mt-2">
                      {userData.roles.map((role) => {
                        const roleInfo = getRoleInfo(role.name);
                        const Icon = roleInfo.icon;
                        return (
                          <div
                            key={role.id}
                            className="flex items-center gap-1 h-5 bg-primary/10 rounded px-2 py-1"
                          >
                            <Icon
                              className={cn(
                                "h-3 w-3 mr-1 text-secondary-foreground",
                              )}
                            />
                            <span className="capitalize text-sm text-secondary-foreground">
                              {role.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
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
