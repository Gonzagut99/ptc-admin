"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
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
import { useCreateCustomer } from "../../_hooks/customers-hooks";
import {
  CreateCustomerFormValues,
  createCustomerSchema,
} from "../../_schemas/customers-schemas";
import {
  ID_DOCUMENT_TYPE_LABELS,
  ID_DOCUMENT_TYPES,
} from "../../_types/customers.types";

interface CustomerCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomerCreateDialog({
  open,
  onOpenChange,
}: CustomerCreateDialogProps) {
  const { mutate: createCustomer, isPending } = useCreateCustomer();

  const form = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      birthDate: "",
      idDocumentType: "DNI",
      idDocumentNumber: "",
      address: "",
      nationality: "Peruana",
    },
  });

  const onSubmit = (values: CreateCustomerFormValues) => {
    createCustomer(
      {
        body: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email || undefined,
          phoneNumber: values.phoneNumber || undefined,
          birthDate: values.birthDate,
          idDocumentType: values.idDocumentType,
          idDocumentNumber: values.idDocumentNumber,
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
          <DialogTitle>Crear nuevo cliente</DialogTitle>
          <DialogDescription>
            Registra un nuevo cliente en el sistema.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 px-6"
              id="customer-create-form"
            >
              <Fieldset>
                <FieldsetLegend description="Información Personal" />
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Nombres</FormLabel>
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
                        <FormLabel required>Apellidos</FormLabel>
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
                        <FormLabel required>Tipo de documento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                        <FormLabel required>Número de documento</FormLabel>
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
                        <FormLabel required>Fecha de nacimiento</FormLabel>
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
          <Button
            type="submit"
            form="customer-create-form"
            disabled={isPending}
          >
            {isPending && <Spinner className="mr-2" />}
            <UserPlus className="mr-2 h-4 w-4" />
            Crear cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
