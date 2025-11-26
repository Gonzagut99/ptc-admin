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
import { cn } from "@/lib/utils";
import {
  getIdDocumentTypeIcon,
  getIdDocumentTypeIconClasses,
  getIdDocumentTypeLabel,
} from "../../../_shared/_utils/id-document-types";
import { useGetWorker, useUpdateWorker } from "../../_hooks/workers-hooks";
import {
  UpdateWorkerFormValues,
  updateWorkerSchema,
} from "../../_schemas/workers-schemas";

interface WorkerEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workerId: string;
}

const ID_DOCUMENT_TYPES = ["DNI", "RUC", "FOREIGNER_ID", "PASSPORT", "OTHER"];

export default function WorkerEditDialog({
  open,
  onOpenChange,
  workerId,
}: WorkerEditDialogProps) {
  const { data: worker, isLoading: isLoadingWorker } = useGetWorker(workerId);
  const { mutate: updateWorker, isPending } = useUpdateWorker();

  const form = useForm<UpdateWorkerFormValues>({
    resolver: zodResolver(updateWorkerSchema),
    defaultValues: {
      name: "",
      idDocumentType: "DNI",
      idNumber: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (worker) {
      form.reset({
        name: worker.name,
        idDocumentType: worker.idDocumentType,
        idNumber: worker.idNumber,
        email: worker.email || "",
        phone: worker.phone || "",
      });
    }
  }, [worker, form]);

  const onSubmit = (values: UpdateWorkerFormValues) => {
    updateWorker(
      {
        params: {
          path: { id: workerId },
        },
        body: {
          name: values.name,
          idDocumentType: values.idDocumentType,
          idNumber: values.idNumber,
          email: values.email || undefined,
          phone: values.phone || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar trabajador</DialogTitle>
          <DialogDescription>
            Modifica la información del trabajador.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          {isLoadingWorker ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 px-6"
                id="worker-edit-form"
              >
                <Fieldset>
                  <FieldsetLegend description="Información del Trabajador" />
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel required>Nombre completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan Pérez García" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="idDocumentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Tipo de documento</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar tipo">
                                  {field.value &&
                                    (() => {
                                      const Icon = getIdDocumentTypeIcon(
                                        field.value,
                                      );
                                      const iconClasses =
                                        getIdDocumentTypeIconClasses(
                                          field.value,
                                        );
                                      const label = getIdDocumentTypeLabel(
                                        field.value,
                                      );
                                      return (
                                        <div className="flex items-center gap-2">
                                          <Icon
                                            className={cn(
                                              iconClasses,
                                              "h-4 w-4",
                                            )}
                                          />
                                          <span>{label}</span>
                                        </div>
                                      );
                                    })()}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ID_DOCUMENT_TYPES.map((type) => {
                                const Icon = getIdDocumentTypeIcon(type);
                                const iconClasses =
                                  getIdDocumentTypeIconClasses(type);
                                const label = getIdDocumentTypeLabel(type);

                                return (
                                  <SelectItem key={type} value={type}>
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        className={cn(iconClasses, "h-4 w-4")}
                                      />
                                      <span>{label}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>N° de documento</FormLabel>
                          <FormControl>
                            <Input placeholder="12345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="trabajador@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <PhoneInput
                              placeholder="987654321"
                              defaultCountry="PE"
                              value={field.value}
                              onChange={field.onChange}
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
          )}
        </DialogScrollArea>
        <DialogFooter className="flex gap-2 sm:flex-row-reverse w-full sm:justify-start">
          <Button
            type="submit"
            form="worker-edit-form"
            disabled={isPending || isLoadingWorker}
          >
            {isPending && <Spinner className="mr-2 h-4 w-4" />}
            <Save className="h-4 w-4 shrink-0" />
            Guardar Cambios
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
