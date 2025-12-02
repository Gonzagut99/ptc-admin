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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateUser } from "../../_hooks/users-hooks";
import {
  UpdateUserFormValues,
  updateUserSchema,
} from "../../_schemas/users-schemas";
import { DUser } from "../../_types/users.types";

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: DUser | null;
}

export default function UserEditDialog({
  open,
  onOpenChange,
  user,
}: UserEditDialogProps) {
  const { mutate: updateUser, isPending } = useUpdateUser();

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: "",
      userName: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        email: user.email || "",
        userName: user.userName || "",
        password: "",
      });
    }
  }, [user, open, form]);

  const onSubmit = (values: UpdateUserFormValues) => {
    if (!user?.id) return;

    updateUser(
      {
        params: {
          path: { id: user.id },
        },
        body: {
          email: values.email || undefined,
          userName: values.userName || undefined,
          password: values.password || undefined,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            Modifica la información del usuario.
          </DialogDescription>
        </DialogHeader>
        <DialogScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 px-6"
              id="user-edit-form"
            >
              <Fieldset>
                <FieldsetLegend description="Credenciales" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="usuario@ejemplo.com"
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
                      <FormItem>
                        <FormLabel>Nueva contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Dejar vacío para mantener la contraseña actual.
                        </FormDescription>
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
          <Button type="submit" form="user-edit-form" disabled={isPending}>
            {isPending && <Spinner className="mr-2" />}
            <Save className="mr-2 h-4 w-4" />
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
