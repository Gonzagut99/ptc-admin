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
  useDeactivateHotelBooking,
  useGetLiquidation,
} from "../../_hooks/liquidations-hooks";
import { AddHotelDialog } from "../../_components/services/add-hotel-dialog";
import { EditHotelDialog } from "../../_components/services/edit-hotel-dialog";
import type { components } from "@/lib/api-java/api-java";

type DHotelBooking = components["schemas"]["DHotelBooking"];
type DHotelService = components["schemas"]["DHotelService"];

interface HotelsPageProps {
  params: Promise<{ id: string }>;
}

export default function HotelsPage({ params }: HotelsPageProps) {
  const { id } = use(params);
  const liquidationId = Number(id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    booking: DHotelBooking;
    hotelServiceId: number;
  } | null>(null);
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<{
    booking: DHotelBooking;
    hotelServiceId: number;
  } | null>(null);

  const { data: liquidation, isLoading } = useGetLiquidation(liquidationId);
  const { mutate: deactivateBooking, isPending: isDeactivating } =
    useDeactivateHotelBooking(liquidationId);

  const handleDeleteBooking = () => {
    if (!selectedBooking || !selectedBooking.booking.id) return;
    deactivateBooking(
      {
        params: {
          path: {
            liquidationId,
            hotelServiceId: selectedBooking.hotelServiceId,
            hotelBookingId: selectedBooking.booking.id,
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

  const openDeleteDialog = (booking: DHotelBooking, hotelServiceId: number) => {
    setSelectedBooking({ booking, hotelServiceId });
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (booking: DHotelBooking, hotelServiceId: number) => {
    setSelectedBookingForEdit({ booking, hotelServiceId });
    setEditDialogOpen(true);
  };

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
            hotelServices.map((service: DHotelService) => (
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
                      <TableHead>Hotel</TableHead>
                      <TableHead>Habitación</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Precio/Noche</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-[70px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {service.hotelBookings?.map((booking: DHotelBooking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono">#{booking.id}</TableCell>
                        <TableCell>{booking.hotel}</TableCell>
                        <TableCell>{booking.room}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {booking.checkIn
                            ? formatPeruDate(booking.checkIn)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {booking.checkOut
                            ? formatPeruDate(booking.checkOut)
                            : "-"}
                        </TableCell>
                        <TableCell className="font-mono">
                          {booking.priceByNight?.toFixed(2)} {booking.currency}
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
                              <DropdownMenuItem
                                onClick={() =>
                                  service.id && openEditDialog(booking, service.id)
                                }
                              >
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
      <AddHotelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        liquidationId={liquidationId}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        handleConfirm={handleDeleteBooking}
        isLoading={isDeactivating}
        title={`Desactivar reserva en "${selectedBooking?.booking.hotel}"`}
        desc="¿Estás seguro de que deseas desactivar esta reserva de hotel? Esta acción no se puede deshacer."
        confirmText="Desactivar"
        destructive
        cancelBtnText="Cancelar"
      />
      {selectedBookingForEdit && (
        <EditHotelDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          liquidationId={liquidationId}
          hotelServiceId={selectedBookingForEdit.hotelServiceId}
          booking={selectedBookingForEdit.booking}
        />
      )}
    </>
  );
}
