"use client";

import { Calendar, Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogScrollArea,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { formatPeruDateHour } from "@/utils/peru-datetime";
import { DUser } from "../../_types/users.types";

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: DUser;
}

export default function UserDetailDialog({
  open,
  onOpenChange,
  user,
}: UserDetailDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle del Usuario</DialogTitle>
          <DialogDescription>
            Información completa del usuario.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <div className="space-y-4 px-6">
            {/* Nombre de usuario */}
            <div className="flex items-start gap-3">
              <User className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nombre de Usuario
                </p>
                <p className="text-base font-semibold">
                  {user.userName || "-"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{user.email}</p>
              </div>
            </div>

            {/* Estado */}
            <div className="flex items-start gap-3">
              <div className="size-5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Estado
                </p>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>

            {/* Fechas del sistema */}
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {user.createdDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="size-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Fecha de creación</p>
                      <p>{formatPeruDateHour(user.createdDate)}</p>
                    </div>
                  </div>
                )}
                {user.updatedDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="size-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">
                        Última actualización
                      </p>
                      <p>{formatPeruDateHour(user.updatedDate)}</p>
                    </div>
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
