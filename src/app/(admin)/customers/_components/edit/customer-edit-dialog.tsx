"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
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
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateCustomer } from "../../_hooks/customers-hooks";
import {
  UpdateCustomerFormValues,
  updateCustomerSchema,
} from "../../_schemas/customers-schemas";
import {
  DCustomer,
  ID_DOCUMENT_TYPE_LABELS,
  ID_DOCUMENT_TYPES,
} from "../../_types/customers.types";

interface CustomerEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: DCustomer | null;
}

export default function CustomerEditDialog({
  open,
  onOpenChange,
  customer,
}: CustomerEditDialogProps) {
  const { mutate: updateCustomer, isPending } = useUpdateCustomer();

  const form = useForm<UpdateCustomerFormValues>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      birthDate: "",
      idDocumentType: "DNI",
      idDocumentNumber: "",
      address: "",
      nationality: "",
    },
  });

  useEffect(() => {
    if (customer && open) {
      form.reset({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phoneNumber: customer.phoneNumber || "",
        birthDate: customer.birthDate
          ? new Date(customer.birthDate).toISOString().split("T")[0]
          : "",
        idDocumentType: customer.idDocumentType || "DNI",
        idDocumentNumber: customer.idDocumentNumber || "",
        address: customer.address || "",
        nationality: customer.nationality || "",
      });
    }
  }, [customer, open, form]);

  const onSubmit = (values: UpdateCustomerFormValues) => {
    if (!customer?.id) return;

    updateCustomer(
      {
        params: {
          path: { id: customer.id },
        },
        body: {
          firstName: values.firstName || undefined,
          lastName: values.lastName || undefined,
          email: values.email || undefined,
          phoneNumber: values.phoneNumber || undefined,
          birthDate: values.birthDate || undefined,
          idDocumentType: values.idDocumentType || undefined,
          idDocumentNumber: values.idDocumentNumber || undefined,
          address: values.address || undefined,
          nationality: values.nationality || undefined,
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
          <DialogDescription>
            Modifica la información del cliente.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 px-6"
              id="customer-edit-form"
            >
              <Fieldset>
                <FieldsetLegend description="Información Personal" />
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl>
                          <Input placeholder="Pérez García" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Fieldset>

              <Fieldset>
                <FieldsetLegend description="Documento de Identidad" />
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="idDocumentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de documento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ID_DOCUMENT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {ID_DOCUMENT_TYPE_LABELS[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="idDocumentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de documento</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Fieldset>

              <Fieldset>
                <FieldsetLegend description="Datos de Contacto" />
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="cliente@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <PhoneInput
                            defaultCountry="PE"
                            placeholder="+51 999 999 999"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Fieldset>

              <Fieldset>
                <FieldsetLegend description="Información Adicional" />
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de nacimiento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nacionalidad</FormLabel>
                        <FormControl>
                          <Input placeholder="Peruana" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Av. Principal 123, Lima"
                            {...field}
                          />
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
          <Button type="submit" form="customer-edit-form" disabled={isPending}>
            {isPending && <Spinner className="mr-2" />}
            <Save className="mr-2 h-4 w-4" />
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
