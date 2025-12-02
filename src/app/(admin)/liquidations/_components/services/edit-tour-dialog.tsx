"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateTour } from "../../_hooks/liquidations-hooks";
import type { components } from "@/lib/api-java/api-java";

type DTour = components["schemas"]["DTour"];

const CURRENCIES = ["PEN", "USD"] as const;
const SERVICE_STATUSES = ["PENDING", "COMPLETED", "CANCELED"] as const;

const editTourSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  place: z.string().min(1, "El lugar es requerido"),
  start_date: z.string().min(1, "La fecha de inicio es requerida"),
  end_date: z.string().min(1, "La fecha de fin es requerida"),
  price: z.string().min(1, "El precio es requerido"),
  currency: z.enum(CURRENCIES),
  status: z.enum(SERVICE_STATUSES),
});

type EditTourFormValues = z.infer<typeof editTourSchema>;

interface EditTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidationId: number;
  tourServiceId: number;
  tour: DTour;
}

export function EditTourDialog({
  open,
  onOpenChange,
  liquidationId,
  tourServiceId,
  tour,
}: EditTourDialogProps) {
  const updateTourMutation = useUpdateTour(liquidationId);

  const form = useForm<EditTourFormValues>({
    resolver: zodResolver(editTourSchema),
    defaultValues: {
      title: "",
      place: "",
      start_date: "",
      end_date: "",
      price: "0",
      currency: "USD",
      status: "PENDING",
    },
  });

  useEffect(() => {
    if (tour && open) {
      form.reset({
        title: tour.title ?? "",
        place: tour.place ?? "",
        start_date: tour.startDate ? tour.startDate.slice(0, 16) : "",
        end_date: tour.endDate ? tour.endDate.slice(0, 16) : "",
        price: tour.price?.toString() ?? "0",
        currency: (tour.currency as "PEN" | "USD") ?? "USD",
        status: (tour.status as "PENDING" | "COMPLETED" | "CANCELED") ?? "PENDING",
      });
    }
  }, [tour, open, form]);

  const handleSubmit = (data: EditTourFormValues) => {
    if (!tour.id) return;

    updateTourMutation.mutate(
      {
        params: {
          path: {
            liquidationId,
            tourServiceId,
            tourId: tour.id,
          },
        },
        body: {
          title: data.title,
          place: data.place,
          start_date: new Date(data.start_date).toISOString(),
          end_date: new Date(data.end_date).toISOString(),
          price: Number(data.price),
          currency: data.currency,
          status: data.status,
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Tour</DialogTitle>
          <DialogDescription>
            Modifica los datos del tour #{tour.id}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del tour" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Lugar</FormLabel>
                    <FormControl>
                      <Input placeholder="Lugar del tour" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Fecha Inicio</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Fecha Fin</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="COMPLETED">Completado</SelectItem>
                        <SelectItem value="CANCELED">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateTourMutation.isPending}>
                {updateTourMutation.isPending && <Spinner className="mr-2" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
