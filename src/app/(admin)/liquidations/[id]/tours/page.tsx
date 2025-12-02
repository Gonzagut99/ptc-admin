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
  useDeactivateTour,
  useGetLiquidation,
} from "../../_hooks/liquidations-hooks";
import { AddTourDialog } from "../../_components/services/add-tour-dialog";
import type { components } from "@/lib/api-java/api-java";

type DTour = components["schemas"]["DTour"];
type DTourService = components["schemas"]["DTourService"];

interface ToursPageProps {
  params: Promise<{ id: string }>;
}

export default function ToursPage({ params }: ToursPageProps) {
  const { id } = use(params);
  const liquidationId = Number(id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<{
    tour: DTour;
    tourServiceId: number;
  } | null>(null);

  const { data: liquidation, isLoading } = useGetLiquidation(liquidationId);
  const { mutate: deactivateTour, isPending: isDeactivating } =
    useDeactivateTour(liquidationId);

  const handleDeleteTour = () => {
    if (!selectedTour || !selectedTour.tour.id) return;
    deactivateTour(
      {
        params: {
          path: {
            liquidationId,
            tourServiceId: selectedTour.tourServiceId,
            tourId: selectedTour.tour.id,
          },
        },
      },
      {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedTour(null);
        },
      },
    );
  };

  const openDeleteDialog = (tour: DTour, tourServiceId: number) => {
    setSelectedTour({ tour, tourServiceId });
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="size-8" />
      </div>
    );
  }

  const tourServices = liquidation?.tour_services ?? [];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Servicios de Tour</CardTitle>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="size-4 mr-2" />
            Agregar Tour
          </Button>
        </CardHeader>
        <CardContent>
          {tourServices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay servicios de tour registrados
            </div>
          ) : (
            tourServices.map((service: DTourService) => (
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
                      <TableHead>Título</TableHead>
                      <TableHead>Lugar</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-[70px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {service.tours?.map((tour: DTour) => (
                      <TableRow key={tour.id}>
                        <TableCell className="font-mono">#{tour.id}</TableCell>
                        <TableCell>{tour.title}</TableCell>
                        <TableCell>{tour.place}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {tour.startDate
                            ? formatPeruDate(tour.startDate)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {tour.endDate ? formatPeruDate(tour.endDate) : "-"}
                        </TableCell>
                        <TableCell className="font-mono">
                          {tour.price?.toFixed(2)} {tour.currency}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tour.status === "COMPLETED"
                                ? "default"
                                : tour.status === "CANCELED"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {tour.status === "COMPLETED"
                              ? "Completado"
                              : tour.status === "CANCELED"
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
                                  service.id && openDeleteDialog(tour, service.id)
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
      <AddTourDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        liquidationId={liquidationId}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        handleConfirm={handleDeleteTour}
        isLoading={isDeactivating}
        title={`Desactivar tour "${selectedTour?.tour.title}"`}
        desc="¿Estás seguro de que deseas desactivar este tour? Esta acción no se puede deshacer."
        confirmText="Desactivar"
        destructive
        cancelBtnText="Cancelar"
      />
    </>
  );
}
