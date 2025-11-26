import {
  AlertCircle,
  AlertTriangle,
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession, useSignOut } from "@/app/auth/log-in/_hooks/auth-hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { forceLogout } from "@/lib/auth-client";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session, isLoading } = useSession();
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = () => {
    // Si no hay sesión, usar forceLogout para limpiar cookies
    if (!session) {
      forceLogout();
      return;
    }
    signOut({});
  };

  const handleRetrySignOut = () => {
    // Si no hay sesión, usar forceLogout para limpiar cookies
    if (!session) {
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
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Spinner className="h-4 w-4" />
            <span className="text-sm">Cargando...</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {session ? (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={session?.user.image || ""}
                      alt={session?.user?.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {session?.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user.email}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-destructive/10">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-semibold text-destructive">
                      Sin sesión
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      No hay sesión activa
                    </span>
                  </div>
                </>
              )}
              <ChevronsUpDown className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            onCloseAutoFocus={(e) => {
              // No cerrar automáticamente si hay error o no hay sesión
              if (isError || !session) {
                e.preventDefault();
              }
            }}
          >
            {!session ? (
              <>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-destructive/10">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-start text-sm leading-tight">
                      <span className="truncate font-semibold text-destructive">
                        Sin sesión
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        No hay sesión activa
                      </span>
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
                  <LogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session?.user.image || ""}
                        alt={session?.user?.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session?.user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-start text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {session?.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/profile">
                      <BadgeCheck />
                      Perfil
                    </Link>
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
                      {isPending && <Spinner className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isPending}
                  >
                    {isPending ? <Spinner /> : <LogOut />}
                    Cerrar sesión
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
