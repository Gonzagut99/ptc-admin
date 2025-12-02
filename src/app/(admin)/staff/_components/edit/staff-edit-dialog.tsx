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
import { useUpdateStaff } from "../../_hooks/staff-hooks";
import {
  UpdateStaffFormValues,
  updateStaffSchema,
} from "../../_schemas/staff-schemas";
import {
  CURRENCIES,
  CURRENCY_LABELS,
  DStaff,
  STAFF_ROLE_LABELS,
  STAFF_ROLES,
} from "../../_types/staff.types";

interface StaffEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: DStaff | null;
}

export default function StaffEditDialog({
  open,
  onOpenChange,
  staff,
}: StaffEditDialogProps) {
  const { mutate: updateStaff, isPending } = useUpdateStaff();

  const form = useForm<UpdateStaffFormValues>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      phoneNumber: "",
      salary: "",
      currency: "PEN",
      role: "SALES",
      hireDate: "",
    },
  });

  useEffect(() => {
    if (staff && open) {
      form.reset({
        phoneNumber: staff.phoneNumber || "",
        salary: staff.salary?.toString() || "",
        currency: staff.currency || "PEN",
        role: staff.role || "SALES",
        hireDate: staff.hireDate
          ? new Date(staff.hireDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [staff, open, form]);

  const onSubmit = (values: UpdateStaffFormValues) => {
    if (!staff?.id) return;

    updateStaff(
      {
        params: {
          path: { id: staff.id },
        },
        body: {
          phoneNumber: values.phoneNumber || undefined,
          salary: values.salary ? Number(values.salary) : undefined,
          currency: values.currency || undefined,
          role: values.role || undefined,
          hireDate: values.hireDate
            ? new Date(values.hireDate).toISOString()
            : undefined,
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
          <DialogTitle>Editar personal</DialogTitle>
          <DialogDescription>
            Modifica la información del personal.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 px-6"
              id="staff-edit-form"
            >
              <Fieldset>
                <FieldsetLegend description="Información del Personal" />
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
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
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STAFF_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {STAFF_ROLE_LABELS[role]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Fieldset>

              <Fieldset>
                <FieldsetLegend description="Compensación" />
                <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Salario</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Moneda" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CURRENCIES.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {CURRENCY_LABELS[currency]}
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
                    name="hireDate"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Fecha de contratación</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
          <Button type="submit" form="staff-edit-form" disabled={isPending}>
            {isPending && <Spinner className="mr-2" />}
            <Save className="mr-2 h-4 w-4" />
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
