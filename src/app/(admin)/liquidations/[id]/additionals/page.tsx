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
  useDeactivateAdditionalService,
  useGetLiquidation,
} from "../../_hooks/liquidations-hooks";
import { AddAdditionalDialog } from "../../_components/services/add-additional-dialog";
import type { components } from "@/lib/api-java/api-java";

type DAdditionalServices = components["schemas"]["DAdditionalServices"];

interface AdditionalsPageProps {
  params: Promise<{ id: string }>;
}

export default function AdditionalsPage({ params }: AdditionalsPageProps) {
  const { id } = use(params);
  const liquidationId = Number(id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<DAdditionalServices | null>(null);

  const { data: liquidation, isLoading } = useGetLiquidation(liquidationId);
  const { mutate: deactivateService, isPending: isDeactivating } =
    useDeactivateAdditionalService(liquidationId);

  const handleDeleteService = () => {
    if (!selectedService || !selectedService.id) return;
    deactivateService(
      {
        params: {
          path: {
            liquidationId,
            additionalServiceId: selectedService.id,
          },
        },
      },
      {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedService(null);
        },
      },
    );
  };

  const openDeleteDialog = (service: DAdditionalServices) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="size-8" />
      </div>
    );
  }

  const additionalServices = liquidation?.additional_services ?? [];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Servicios Adicionales</CardTitle>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="size-4 mr-2" />
            Agregar Adicional
          </Button>
        </CardHeader>
        <CardContent>
          {additionalServices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay servicios adicionales registrados
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tarifa</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead>IGV</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="w-[70px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {additionalServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-mono">#{service.id}</TableCell>
                    <TableCell className="font-mono">{service.tariffRate?.toFixed(2)}</TableCell>
                    <TableCell className="font-mono">{service.price?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.currency}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.taxed ? "default" : "secondary"}>
                        {service.taxed ? "Sí" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          service.status === "COMPLETED"
                            ? "default"
                            : service.status === "CANCELED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {service.status === "COMPLETED"
                          ? "Completado"
                          : service.status === "CANCELED"
                            ? "Cancelado"
                            : "Pendiente"}
                      </Badge>
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
                          <DropdownMenuItem disabled>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog(service)}
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
          )}
        </CardContent>
      </Card>
      <AddAdditionalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        liquidationId={liquidationId}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        handleConfirm={handleDeleteService}
        isLoading={isDeactivating}
        title={`Desactivar servicio adicional #${selectedService?.id}`}
        desc="¿Estás seguro de que deseas desactivar este servicio adicional? Esta acción no se puede deshacer."
        confirmText="Desactivar"
        destructive
        cancelBtnText="Cancelar"
      />
    </>
  );
}
