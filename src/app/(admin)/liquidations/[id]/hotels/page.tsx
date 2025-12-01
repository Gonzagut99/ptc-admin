"use client";

import { use, useState } from "react";
import { Plus, Pencil, XCircle, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useGetLiquidation } from "../../_hooks/liquidations-hooks";
import { AddHotelDialog } from "../../_components/services/add-hotel-dialog";
import { formatPeruDate } from "@/utils/peru-datetime";
import { toast } from "sonner";

interface HotelsPageProps {
  params: Promise<{ id: string }>;
}

export default function HotelsPage({ params }: HotelsPageProps) {
  const { id } = use(params);
  const liquidationId = Number(id);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: liquidation, isLoading } = useGetLiquidation(liquidationId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="size-8" />
      </div>
    );
  }

  const hotelServices = liquidation?.hotel_services ?? [];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Servicios de Hotel</CardTitle>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="size-4 mr-2" />
            Agregar Hotel
          </Button>
        </CardHeader>
      <CardContent>
        {hotelServices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay servicios de hotel registrados
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tarifa</TableHead>
                <TableHead>Moneda</TableHead>
                <TableHead>IGV</TableHead>
                <TableHead>Reservas</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="w-[70px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotelServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-mono">#{service.id}</TableCell>
                  <TableCell className="font-mono">{service.tariffRate?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.currency}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.taxed ? "default" : "secondary"}>
                      {service.taxed ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {service.hotelBookings?.length ?? 0} reserva(s)
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {service.createdDate ? formatPeruDate(service.createdDate) : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast.info("Editar servicio - Próximamente")}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Cancelar servicio - Próximamente")}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => toast.info("Eliminar servicio - Próximamente")}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      </Card>
      <AddHotelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        liquidationId={liquidationId}
      />
    </>
  );
}
