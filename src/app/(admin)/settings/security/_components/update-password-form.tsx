"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordField } from "@/app/(admin)/admin/_shared/_components/common/password-field";
import { useChangePassword } from "@/app/auth/log-in/_hooks/auth-hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  FormSecuritySchema,
  securitySchema,
} from "../_schemas/security.schema";

export default function UpdatePasswordForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const { mutate, isPending } = useChangePassword();
  const form = useForm<FormSecuritySchema>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: false,
    },
  });

  const handlerGeneratePassword = useCallback(
    (password: string) => {
      form.setValue("newPassword", password);
    },
    [form],
  );

  const onSubmit = (values: FormSecuritySchema) => {
    mutate(
      { body: values },
      {
        onSuccess: () => {
          toast.success("Contraseña actualizada correctamente");
          form.reset();
          onClose();
        },
      },
    );
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Actualizar contraseña</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            id="update-password-form"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña actual</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese su contraseña actual"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <PasswordField
                  field={field}
                  isPending={isPending}
                  onGeneratePassword={handlerGeneratePassword}
                  placeholder="Ingrese su nueva contraseña"
                  showIsRequired={false}
                />
              )}
            />
            <FormField
              control={form.control}
              name="revokeOtherSessions"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Label className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                      <Checkbox
                        id="toggle-2"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                      />
                      <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">
                          Cerrar sesión en todos los dispositivos
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Esta acción es recomendada para cerrar sesión en todos
                          los dispositivos que puedan haber usado tu contraseña
                          anterior.
                        </p>
                      </div>
                    </Label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
        >
          Cancelar
        </Button>

        <Button type="submit" form="update-password-form" disabled={isPending}>
          {isPending && <Spinner className="mr-2 h-4 w-4" />}
          <Save className="h-4 w-4 shrink-0" />
          Actualizar contraseña
        </Button>
      </CardFooter>
    </Card>
  );
}
