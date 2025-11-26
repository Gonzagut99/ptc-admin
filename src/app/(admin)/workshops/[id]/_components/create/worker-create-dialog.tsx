"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useParams } from "next/navigation";
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
import { useCreateWorker } from "../../_hooks/workers-hooks";
import {
  CreateWorkerFormValues,
  createWorkerSchema,
} from "../../_schemas/workers-schemas";

interface WorkerCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ID_DOCUMENT_TYPES = ["DNI", "RUC", "FOREIGNER_ID", "PASSPORT", "OTHER"];

export default function WorkerCreateDialog({
  open,
  onOpenChange,
}: WorkerCreateDialogProps) {
  const params = useParams();
  const workshopId = params.id as string;
  const { mutate: createWorker, isPending } = useCreateWorker();

  const form = useForm<CreateWorkerFormValues>({
    resolver: zodResolver(createWorkerSchema),
    defaultValues: {
      name: "",
      idDocumentType: "DNI",
      idNumber: "",
      email: "",
      phone: "",
      workshopId: workshopId,
    },
  });

  const onSubmit = (values: CreateWorkerFormValues) => {
    createWorker(
      {
        body: {
          name: values.name,
          idDocumentType: values.idDocumentType,
          idNumber: values.idNumber,
          workshopId: values.workshopId,
          email: values.email || undefined,
          phone: values.phone || undefined,
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
          <DialogTitle>Crear nuevo trabajador</DialogTitle>
          <DialogDescription>
            Registra un nuevo trabajador para este taller.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 px-6"
              id="worker-create-form"
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
                          defaultValue={field.value}
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
                                      getIdDocumentTypeIconClasses(field.value);
                                    const label = getIdDocumentTypeLabel(
                                      field.value,
                                    );
                                    return (
                                      <div className="flex items-center gap-2">
                                        <Icon
                                          className={cn(iconClasses, "h-4 w-4")}
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
        </DialogScrollArea>
        <DialogFooter className="flex gap-2 sm:flex-row-reverse w-full sm:justify-start">
          <Button type="submit" form="worker-create-form" disabled={isPending}>
            {isPending && <Spinner className="mr-2 h-4 w-4" />}
            <UserPlus className="h-4 w-4 shrink-0" />
            Registrar Trabajador
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
