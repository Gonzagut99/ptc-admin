"use client";

import { use, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPeruDate } from "@/utils/peru-datetime";
import {
  useDeactivateFlightBooking,
  useGetLiquidation,
} from "../../_hooks/liquidations-hooks";
import { AddFlightDialog } from "../../_components/services/add-flight-dialog";
import type { components } from "@/lib/api-java/api-java";

type DFlightBooking = components["schemas"]["DFlightBooking"];
type DFlightService = components["schemas"]["DFlightService"];

interface FlightsPageProps {
  params: Promise<{ id: string }>;
}

export default function FlightsPage({ params }: FlightsPageProps) {
  const { id } = use(params);
  const liquidationId = Number(id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    booking: DFlightBooking;
    flightServiceId: number;
  } | null>(null);

  const { data: liquidation, isLoading } = useGetLiquidation(liquidationId);
  const { mutate: deactivateBooking, isPending: isDeactivating } =
    useDeactivateFlightBooking(liquidationId);

  const handleDeleteBooking = () => {
    if (!selectedBooking || !selectedBooking.booking.id) return;
    deactivateBooking(
      {
        params: {
          path: {
            liquidationId,
            flightServiceId: selectedBooking.flightServiceId,
            flightBookingId: selectedBooking.booking.id,
          },
        },
      },
      {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedBooking(null);
        },
      },
    );
  };

  const openDeleteDialog = (booking: DFlightBooking, flightServiceId: number) => {
    setSelectedBooking({ booking, flightServiceId });
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="size-8" />
      </div>
    );
  }

  const flightServices = liquidation?.flight_services ?? [];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Servicios de Vuelo</CardTitle>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="size-4 mr-2" />
            Agregar Vuelo
          </Button>
        </CardHeader>
        <CardContent>
          {flightServices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay servicios de vuelo registrados
            </div>
          ) : (
            flightServices.map((service: DFlightService) => (
              <div key={service.id} className="mb-6 last:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Servicio #{service.id}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Tarifa: {service.tariffRate?.toFixed(2)} {service.currency}
                  </span>
                  <Badge variant={service.taxed ? "default" : "secondary"}>
                    {service.taxed ? "Con IGV" : "Sin IGV"}
                  </Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Aerolínea</TableHead>
                      <TableHead>Ruta</TableHead>
                      <TableHead>Salida</TableHead>
                      <TableHead>Llegada</TableHead>
                      <TableHead>Precio Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-[70px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {service.flightBookings?.map((booking: DFlightBooking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono">#{booking.id}</TableCell>
                        <TableCell>{booking.aeroline}</TableCell>
                        <TableCell>
                          {booking?.origin??'-'} → {booking.destiny ?? "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {booking.departureDate
                            ? formatPeruDate(booking.departureDate)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {booking.arrivalDate
                            ? formatPeruDate(booking.arrivalDate)
                            : "-"}
                        </TableCell>
                        <TableCell className="font-mono">
                          {booking.totalPrice?.toFixed(2)} {booking.currency}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "COMPLETED"
                                ? "default"
                                : booking.status === "CANCELED"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {booking.status === "COMPLETED"
                              ? "Completado"
                              : booking.status === "CANCELED"
                                ? "Cancelado"
                                : "Pendiente"}
                          </Badge>
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
                              <DropdownMenuItem disabled>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  service.id && openDeleteDialog(booking, service.id)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Desactivar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <AddFlightDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        liquidationId={liquidationId}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        handleConfirm={handleDeleteBooking}
        isLoading={isDeactivating}
        title={`Desactivar vuelo "${selectedBooking?.booking.origin} → ${selectedBooking?.booking.destiny ?? "-"}"`}
        desc="¿Estás seguro de que deseas desactivar esta reserva de vuelo? Esta acción no se puede deshacer."
        confirmText="Desactivar"
        destructive
        cancelBtnText="Cancelar"
      />
    </>
  );
}
