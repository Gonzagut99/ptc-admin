"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollArea,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAllCustomers } from "../../../customers/_hooks/customers-hooks";
import { useAllStaff } from "../../../staff/_hooks/staff-hooks";
import { useCreateLiquidation } from "../../_hooks/liquidations-hooks";
import {
  CreateLiquidationFormValues,
  createLiquidationSchema,
} from "../../_schemas/liquidations-schemas";

interface LiquidationCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LiquidationCreateDialog({
  open,
  onOpenChange,
}: LiquidationCreateDialogProps) {
  const { mutate: createLiquidation, isPending } = useCreateLiquidation();
  const { customers, isLoading: loadingCustomers } = useAllCustomers();
  const { staff, isLoading: loadingStaff } = useAllStaff();

  const form = useForm<CreateLiquidationFormValues>({
    resolver: zodResolver(createLiquidationSchema),
    defaultValues: {
      customer_id: "",
      staff_id: "",
      currency_rate: "3.75",
      payment_deadline: "",
      companion: "1",
    },
  });

  const onSubmit = (values: CreateLiquidationFormValues) => {
    createLiquidation(
      {
        body: {
          customer_id: Number(values.customer_id),
          staff_id: Number(values.staff_id),
          currency_rate: Number(values.currency_rate),
          payment_deadline: new Date(values.payment_deadline).toISOString(),
          companion: Number(values.companion),
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear nueva liquidación</DialogTitle>
          <DialogDescription>
            Registra una nueva liquidación en el sistema.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 px-6"
              id="liquidation-create-form"
            >
              <Fieldset>
                <FieldsetLegend description="Información Principal" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customer_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Cliente</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccione un cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingCustomers ? (
                              <SelectItem value="loading" disabled>
                                Cargando clientes...
                              </SelectItem>
                            ) : customers.length === 0 ? (
                              <SelectItem value="empty" disabled>
                                No hay clientes disponibles
                              </SelectItem>
                            ) : (
                              customers.map((customer) => (
                                <SelectItem
                                  key={customer.id}
                                  value={String(customer.id)}
                                >
                                  {customer.firstName} {customer.lastName} -{" "}
                                  {customer.idDocumentNumber}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="staff_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Personal a Cargo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccione personal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingStaff ? (
                              <SelectItem value="loading" disabled>
                                Cargando personal...
                              </SelectItem>
                            ) : staff.length === 0 ? (
                              <SelectItem value="empty" disabled>
                                No hay personal disponible
                              </SelectItem>
                            ) : (
                              staff.map((member) => (
                                <SelectItem
                                  key={member.id}
                                  value={String(member.id)}
                                >
                                  {member.user?.userName || member.user?.email}{" "}
                                  - {member.role}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Fieldset>

              <Fieldset>
                <FieldsetLegend description="Detalles" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currency_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Tipo de Cambio</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="3.75"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Acompañantes</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payment_deadline"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel required>Fecha Límite de Pago</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Fieldset>
            </form>
          </Form>
        </DialogScrollArea>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="liquidation-create-form"
            disabled={isPending}
          >
            {isPending && <Spinner className="mr-2" />}
            <Plus className="mr-2 h-4 w-4" />
            Crear liquidación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
