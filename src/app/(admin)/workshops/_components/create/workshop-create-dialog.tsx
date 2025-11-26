"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck } from "lucide-react";
import { useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCreateWorkshop } from "../../_hooks/workshops-hooks";
import {
  WorkshopCreateFormValues,
  workshopCreateSchema,
} from "../../_schemas/workshops.schema";

interface WorkshopCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WorkshopCreateDialog({
  open,
  onOpenChange,
}: WorkshopCreateDialogProps) {
  const { mutate: createWorkshop, isPending } = useCreateWorkshop();
  const [documentType, setDocumentType] = useState<"RUC" | "DNI">("RUC");

  const form = useForm<WorkshopCreateFormValues>({
    resolver: zodResolver(workshopCreateSchema),
    defaultValues: {
      name: "",
      idDocumentType: "RUC",
      idNumber: "",
      firstName: "",
      lastName: "",
      phone: "",
      phone2: "",
      email: "",
    },
  });

  const onSubmit = (values: WorkshopCreateFormValues) => {
    // Solo enviamos los 3 campos que el backend soporta
    createWorkshop(
      {
        body: {
          name: values.name,
          idDocumentType: values.idDocumentType,
          idNumber: values.idNumber,
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

  const currentDate = new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nuevo taller</DialogTitle>
          <DialogDescription>
            Fecha de registro: {currentDate}
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-6"
              id="workshop-create-form"
            >
              {/* Sección Identificación */}
              <Fieldset>
                <FieldsetLegend description="Identificación" />
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="idDocumentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de documento</FormLabel>
                          <FormControl>
                            <ToggleGroup
                              type="single"
                              value={field.value}
                              onValueChange={(value) => {
                                if (value) {
                                  field.onChange(value);
                                  setDocumentType(value as "RUC" | "DNI");
                                  form.setValue("idNumber", "");
                                }
                              }}
                              className="inline-flex w-full justify-start rounded-md p-1 text-xs sm:text-sm"
                            >
                              <ToggleGroupItem
                                value="RUC"
                                className="flex-1 rounded-md bg-transparent px-3 py-2 font-medium text-muted-foreground data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:shadow-sm"
                              >
                                RUC
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="DNI"
                                className="flex-1 rounded-md bg-transparent px-3 py-2 font-medium text-muted-foreground data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:shadow-sm"
                              >
                                DNI
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Número de documento</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                documentType === "RUC"
                                  ? "20123456789"
                                  : "12345678"
                              }
                              maxLength={documentType === "RUC" ? 11 : 8}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Nombre del taller</FormLabel>
                        <FormControl>
                          <Input placeholder="Taller de ejemplo 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Fieldset>

              {/* Sección Contacto */}
              {/* DESCOMENTAR CUANDO SE AGREGUE LA SECCION DE CONTACTO */}
              {/*   
              <Fieldset>
                <FieldsetLegend description="Contacto" />
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombres</FormLabel>
                          <FormControl>
                            <Input placeholder="Mario" {...field} />
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
                            <Input
                              placeholder="Bautista Gutierrez"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono 1</FormLabel>
                          <FormControl>
                            <Input placeholder="987654321" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono 2</FormLabel>
                          <FormControl>
                            <Input placeholder="987654321" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="mariop@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Fieldset>
              */}
            </form>
          </Form>
        </DialogScrollArea>
        <DialogFooter className="flex gap-2 sm:flex-row-reverse w-full sm:justify-start">
          <Button
            type="submit"
            form="workshop-create-form"
            disabled={isPending}
          >
            {isPending && <Spinner className="mr-2 h-4 w-4" />}
            <ClipboardCheck className="h-4 w-4 shrink-0" />
            Registrar taller
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
