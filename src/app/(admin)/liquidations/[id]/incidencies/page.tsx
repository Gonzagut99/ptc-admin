"use client";

import { use, useState } from "react";
import { CheckCircle, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
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
  useDeactivateIncidency,
  useGetLiquidation,
} from "../../_hooks/liquidations-hooks";
import AddIncidencyPageDialog from "../../_components/incidencies/add-incidency-page-dialog";
import { EditIncidencyDialog } from "../../_components/incidencies/edit-incidency-dialog";
import type { components } from "@/lib/api-java/api-java";
import { toast } from "sonner";

type DIncidency = components["schemas"]["DIncidency"];

interface IncidenciesPageProps {
  params: Promise<{ id: string }>;
}

export default function IncidenciesPage({ params }: IncidenciesPageProps) {
  const { id } = use(params);
  const liquidationId = Number(id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedIncidency, setSelectedIncidency] = useState<DIncidency | null>(null);
  const [selectedIncidencyForEdit, setSelectedIncidencyForEdit] = useState<DIncidency | null>(null);

  const { data: liquidation, isLoading } = useGetLiquidation(liquidationId);
  const { mutate: deactivateIncidency, isPending: isDeactivating } =
    useDeactivateIncidency(liquidationId);

  const handleDeleteIncidency = () => {
    if (!selectedIncidency || !selectedIncidency.id) return;
    deactivateIncidency(
      {
        params: {
          path: {
            liquidationId,
            incidencyId: selectedIncidency.id,
          },
        },
      },
      {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedIncidency(null);
        },
      },
    );
  };

  const openDeleteDialog = (incidency: DIncidency) => {
    setSelectedIncidency(incidency);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (incidency: DIncidency) => {
    setSelectedIncidencyForEdit(incidency);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="size-8" />
      </div>
    );
  }

  const incidencies = liquidation?.incidencies ?? [];

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "-";
    return amount.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Incidencias</CardTitle>
          <Button onClick={() => setDialogOpen(true)} size="sm" variant="destructive">
            <Plus className="size-4 mr-2" />
            Reportar Incidencia
          </Button>
        </CardHeader>
        <CardContent>
        {incidencies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay incidencias registradas
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha Incidencia</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead className="w-[70px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidencies.map((incidency) => (
                <TableRow key={incidency.id}>
                  <TableCell className="font-mono">#{incidency.id}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {incidency.reason}
                  </TableCell>
                  <TableCell className="font-mono">
                    {incidency.amount ? formatCurrency(incidency.amount) : "-"}
                  </TableCell>
                  <TableCell>
                    {incidency.incidencyDate ? formatPeruDate(incidency.incidencyDate) : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {incidency.createdDate ? formatPeruDate(incidency.createdDate) : "-"}
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
                        <DropdownMenuItem onClick={() => openEditDialog(incidency)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Resolver incidencia - Próximamente")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Resolver
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDeleteDialog(incidency)}
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
      <AddIncidencyPageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        liquidationId={liquidationId}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        handleConfirm={handleDeleteIncidency}
        isLoading={isDeactivating}
        title={`Desactivar incidencia #${selectedIncidency?.id}`}
        desc={`¿Estás seguro de que deseas desactivar esta incidencia: "${selectedIncidency?.reason?.slice(0, 50)}${(selectedIncidency?.reason?.length ?? 0) > 50 ? "..." : ""}"? Esta acción no se puede deshacer.`}
        confirmText="Desactivar"
        destructive
        cancelBtnText="Cancelar"
      />
      {selectedIncidencyForEdit && (
        <EditIncidencyDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          liquidationId={liquidationId}
          incidency={selectedIncidencyForEdit}
        />
      )}
    </>
  );
}
