"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useRequestPasswordReset } from "../_hooks/forgot-password-hooks";
import {
  FormForgotPasswordSchema,
  forgotPasswordSchema,
} from "../_schemas/forgot-password.schema";

export default function ForgotPasswordForm() {
  const { mutate: requestPasswordReset, isPending } = useRequestPasswordReset();
  const form = useForm<FormForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: FormForgotPasswordSchema) => {
    requestPasswordReset({
      body: {
        email: values.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 px-2 py-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Mail className="w-4 h-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Ingresa tu email"
                    type="email"
                    {...field}
                  />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Enviando..." : "Enviar enlace de recuperación"}
        </Button>
      </form>
    </Form>
  );
}
