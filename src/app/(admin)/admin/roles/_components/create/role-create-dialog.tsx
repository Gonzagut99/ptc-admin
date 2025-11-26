"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck, Lock, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollArea,
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
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRole } from "../../_hooks/roles-hooks";
import { FormRolesSchema, rolesSchema } from "../../_schemas/roles.schema";
import { PermissionsModule } from "../common/permissions-module";

interface RoleMutateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RoleCreateDialog({
  open,
  onOpenChange,
}: RoleMutateDialogProps) {
  const { mutate: createRole, isPending } = useCreateRole();
  const form = useForm<FormRolesSchema>({
    resolver: zodResolver(rolesSchema),
    defaultValues: {
      name: "",
      description: "",
      isDefault: false,
      permissionIds: [],
    },
  });

  const onSubmit = (values: FormRolesSchema) => {
    createRole(
      {
        body: {
          name: values.name,
          description: values.description ?? "",
          isDefault: values.isDefault,
          permissionIds: values.permissionIds,
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
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Crear un nuevo rol</DialogTitle>
          <DialogDescription>
            Crea un nuevo rol para tu sistema.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-6"
              id="role-create-form"
            >
              <FormSection title="Detalles del Rol" icon={Shield}>
                <div className="grid grid-cols-1 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Nombre del rol</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="Ingrese el nombre del rol"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción del rol</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={isPending}
                            placeholder="Ingrese la descripción del rol"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title="Permisos por módulo" icon={Lock}>
                <FormField
                  control={form.control}
                  name="permissionIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PermissionsModule
                          selectedPermissionIds={field.value}
                          onPermissionChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            </form>
          </Form>
        </DialogScrollArea>
        <DialogFooter className="flex gap-2 sm:flex-row-reverse w-full sm:justify-start">
          <Button type="submit" form="role-create-form" disabled={isPending}>
            {isPending && <Spinner className="mr-2 h-4 w-4" />}
            <ClipboardCheck className="h-4 w-4 shrink-0" />
            Registrar Rol
          </Button>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
