"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Save } from "lucide-react";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateEmail } from "../../_hooks/use-profile";
import { emailSchema, FormEmailSchema } from "../_schemas/email.schema";

export default function EmailModify({
  onClose,
  email,
}: {
  onClose: () => void;
  email: string;
}) {
  const { updateEmailAsync, isLoading } = useUpdateEmail();
  const form = useForm<FormEmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: email ?? "",
    },
  });

  const onSubmit = async (values: FormEmailSchema) => {
    try {
      await updateEmailAsync(values);
      onClose();
    } catch (_error) {
      toast.error("Error al actualizar el correo electrónico");
    }
  };

  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <CardTitle>Cambiar correo electrónico</CardTitle>
        <CardDescription>
          Si desea cambiar su correo electrónico, ingrese el nuevo correo
          electrónico.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            id="email-modify-form"
          >
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Mail className="size-4 shrink-0" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="Ingrese el nuevo correo electrónico"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-row flex-wraps justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => onClose()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" form="email-modify-form" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          <Save className="h-4 w-4 shrink-0" />
          Guardar cambios
        </Button>
      </CardFooter>
    </Card>
  );
}
