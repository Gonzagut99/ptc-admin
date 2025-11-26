"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Shield } from "lucide-react";
import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useGetRole, useUpdateRole } from "../../_hooks/roles-hooks";
import { FormRolesSchema, rolesSchema } from "../../_schemas/roles.schema";
import { PermissionsModule } from "../common/permissions-module";

interface RoleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string | null;
}

export default function RoleEditDialog({
  open,
  onOpenChange,
  roleId,
}: RoleEditDialogProps) {
  const { mutate: updateRole, isPending } = useUpdateRole();
  const { data: roleData, isLoading } = useGetRole(roleId || "");

  const form = useForm<FormRolesSchema>({
    resolver: zodResolver(rolesSchema),
    defaultValues: {
      name: "",
      description: "",
      isDefault: false,
      permissionIds: [],
    },
  });

  // Actualizar el formulario cuando lleguen los datos del rol
  React.useEffect(() => {
    if (roleData && open) {
      form.reset({
        name: roleData.name,
        description: roleData.description || "",
        isDefault: roleData.isDefault || false,
        permissionIds: roleData.permissions?.map((p) => p.id) || [],
      });
    }
  }, [roleData, open, form]);

  const onSubmit = (values: FormRolesSchema) => {
    if (!roleId) return;

    updateRole(
      {
        params: { path: { id: roleId } },
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
          <DialogTitle>Editar rol</DialogTitle>
          <DialogDescription>
            Modifica la información del rol seleccionado.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 px-6"
                id="role-edit-form"
              >
                <FormSection title="Detalles del Rol" icon={Shield}>
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 items-start">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Nombre del rol</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="Nombre del rol"
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
                              placeholder="Descripción del rol"
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
          )}
        </DialogScrollArea>
        <DialogFooter className="flex gap-2 sm:flex-row-reverse w-full sm:justify-start">
          <Button
            type="submit"
            form="role-edit-form"
            disabled={isPending || isLoading}
          >
            {isPending ? "Actualizando..." : "Actualizar rol"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending || isLoading}>
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
