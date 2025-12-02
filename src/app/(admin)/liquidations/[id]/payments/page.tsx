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
  useDeactivatePayment,
  useGetLiquidation,
} from "../../_hooks/liquidations-hooks";
import AddPaymentPageDialog from "../../_components/payments/add-payment-page-dialog";
import { EditPaymentDialog } from "../../_components/payments/edit-payment-dialog";
import { PAYMENT_METHOD_LABELS, PaymentMethod } from "../../_types/liquidations.types";
import type { components } from "@/lib/api-java/api-java";

type DPayment = components["schemas"]["DPayment"];

interface PaymentsPageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentsPage({ params }: PaymentsPageProps) {
  const { id } = use(params);
  const liquidationId = Number(id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<DPayment | null>(null);
  const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState<DPayment | null>(null);

  const { data: liquidation, isLoading } = useGetLiquidation(liquidationId);
  const { mutate: deactivatePayment, isPending: isDeactivating } =
    useDeactivatePayment(liquidationId);

  const handleDeletePayment = () => {
    if (!selectedPayment || !selectedPayment.id) return;
    deactivatePayment(
      {
        params: {
          path: {
            liquidationId,
            paymentId: selectedPayment.id,
          },
        },
      },
      {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedPayment(null);
        },
      },
    );
  };

  const openDeleteDialog = (payment: DPayment) => {
    setSelectedPayment(payment);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (payment: DPayment) => {
    setSelectedPaymentForEdit(payment);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="size-8" />
      </div>
    );
  }

  const payments = liquidation?.payments ?? [];

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
          <CardTitle>Pagos</CardTitle>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="size-4 mr-2" />
            Agregar Pago
          </Button>
        </CardHeader>
        <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay pagos registrados
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-[70px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono">#{payment.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {PAYMENT_METHOD_LABELS[payment.method as PaymentMethod] || payment.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.createdDate ? formatPeruDate(payment.createdDate) : "-"}
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
                        <DropdownMenuItem onClick={() => openEditDialog(payment)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDeleteDialog(payment)}
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
      <AddPaymentPageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        liquidationId={liquidationId}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        handleConfirm={handleDeletePayment}
        isLoading={isDeactivating}
        title={`Desactivar pago #${selectedPayment?.id}`}
        desc={`¿Estás seguro de que deseas desactivar este pago de ${formatCurrency(selectedPayment?.amount)}? Esta acción no se puede deshacer.`}
        confirmText="Desactivar"
        destructive
        cancelBtnText="Cancelar"
      />
      {selectedPaymentForEdit && (
        <EditPaymentDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          liquidationId={liquidationId}
          payment={selectedPaymentForEdit}
        />
      )}
    </>
  );
}
