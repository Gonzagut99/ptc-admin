"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  useGetWorkshop,
  useUpdateWorkshop,
} from "../../_hooks/workshops-hooks";

interface WorkshopEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshopId: string;
}

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nombre del taller debe tener al menos 3 caracteres.",
  }),
  idDocumentType: z.enum(["RUC", "DNI"]),
  idNumber: z.string().min(8, {
    message: "Número de documento debe tener al menos 8 caracteres.",
  }),
});

export default function WorkshopEditDialog({
  open,
  onOpenChange,
  workshopId,
}: WorkshopEditDialogProps) {
  const { data: workshop, isLoading } = useGetWorkshop(workshopId);
  const { mutate: updateWorkshop, isPending } = useUpdateWorkshop();
  const [documentType, setDocumentType] = useState<"RUC" | "DNI">("RUC");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      idDocumentType: "RUC",
      idNumber: "",
    },
  });

  useEffect(() => {
    if (workshop) {
      form.reset({
        name: workshop.name,
        idDocumentType: workshop.idDocumentType as "RUC" | "DNI",
        idNumber: workshop.idNumber,
      });
      setDocumentType(workshop.idDocumentType as "RUC" | "DNI");
    }
  }, [workshop, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateWorkshop(
      {
        params: {
          path: { id: workshopId },
        },
        body: {
          name: values.name,
          idDocumentType: values.idDocumentType,
          idNumber: values.idNumber,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
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
          <DialogTitle>Editar taller</DialogTitle>
          <DialogDescription>
            Fecha de actualización: {currentDate}
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          {isLoading ? (
            <div className="space-y-4 px-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 px-6"
                id="workshop-edit-form"
              >
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
                            <Input
                              placeholder="Taller de ejemplo 1"
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
          )}
        </DialogScrollArea>
        <DialogFooter className="flex gap-2 sm:flex-row-reverse w-full sm:justify-start">
          <Button
            type="submit"
            form="workshop-edit-form"
            disabled={isPending || isLoading}
          >
            {isPending && <Spinner className="mr-2 h-4 w-4" />}
            <ClipboardCheck className="h-4 w-4 shrink-0" />
            Actualizar taller
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
