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
import { useCreateUserWithStaff } from "../../_hooks/staff-hooks";
import {
  CreateStaffWithUserFormValues,
  createStaffWithUserSchema,
} from "../../_schemas/staff-schemas";
import {
  CURRENCIES,
  CURRENCY_LABELS,
  STAFF_ROLE_LABELS,
  STAFF_ROLES,
} from "../../_types/staff.types";

interface StaffCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StaffCreateDialog({
  open,
  onOpenChange,
}: StaffCreateDialogProps) {
  const { mutate: createStaff, isPending } = useCreateUserWithStaff();

  const form = useForm<CreateStaffWithUserFormValues>({
    resolver: zodResolver(createStaffWithUserSchema),
    defaultValues: {
      email: "",
      password: "",
      userName: "",
      phoneNumber: "",
      salary: "0",
      currency: "PEN",
      role: "SALES",
      hireDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (values: CreateStaffWithUserFormValues) => {
    createStaff(
      {
        body: {
          email: values.email,
          password: values.password,
          userName: values.userName || undefined,
          phoneNumber: values.phoneNumber,
          salary: Number(values.salary),
          currency: values.currency,
          role: values.role,
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
          <DialogTitle>Crear nuevo personal</DialogTitle>
          <DialogDescription>
            Registra un nuevo miembro del personal con su usuario.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 px-6"
              id="staff-create-form"
            >
              <Fieldset>
                <FieldsetLegend description="Credenciales de Usuario" />
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="personal@ptc.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de usuario</FormLabel>
                        <FormControl>
                          <Input placeholder="nombre_usuario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel required>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
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
                <FieldsetLegend description="Información del Personal" />
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Teléfono</FormLabel>
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
                        <FormLabel required>Rol</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                        <FormLabel required>Salario</FormLabel>
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
                        <FormLabel required>Moneda</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
          <Button type="submit" form="staff-create-form" disabled={isPending}>
            {isPending && <Spinner className="mr-2" />}
            <UserPlus className="mr-2 h-4 w-4" />
            Crear personal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
