"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Spinner } from "@/components/ui/spinner";
import { useUpdateProfile } from "../../_hooks/use-profile";
import { User } from "../../_types/auth.types";
import { FormProfileSchema, profileSchema } from "../_schemas/profile.schema";

interface ProfileModifyProps {
  onClose: () => void;
  user: User;
}

export default function ProfileModify({ onClose, user }: ProfileModifyProps) {
  const { updateProfileAsync, isLoading } = useUpdateProfile();
  const form = useForm<FormProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
    },
  });

  const onSubmit = async (values: FormProfileSchema) => {
    try {
      await updateProfileAsync(values as User);
      onClose();
    } catch (_error) {
      toast.error("Error al actualizar el perfil");
    }
  };

  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <CardTitle>Actualizar perfil</CardTitle>
        <CardDescription>Actualiza tus datos personales.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="profile-modify-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese su nombre"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese su apellido"
                      disabled={isLoading}
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
                      defaultCountry="PE"
                      placeholder="Ingrese su teléfono"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese su dirección"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-row flex-wraps justify-between gap-2">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" form="profile-modify-form" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          <Save className="h-4 w-4 shrink-0" />
          Guardar cambios
        </Button>
      </CardFooter>
    </Card>
  );
}
