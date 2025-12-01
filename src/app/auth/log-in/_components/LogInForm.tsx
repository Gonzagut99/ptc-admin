"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2 } from "lucide-react";
import Link from "next/link";
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
import { PasswordInput } from "@/components/ui/password-input";
import { useLogIn } from "../_hooks/auth-hooks";
import { type FormLogInSchema, logInSchema } from "../_schemas/logIn.schema";

export default function LogInForm() {
  const { mutate: logIn, isPending } = useLogIn();
  const form = useForm<FormLogInSchema>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: "",
      password: "",
      //remember: true,
    },
  });

  const onSubmit = (values: FormLogInSchema) => {
    // Solo enviamos email y password al backend
    logIn({
      body: {
        email: values.email,
        password: values.password,
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
                    disabled={isPending}
                    {...field} 
                  />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="gap-1 flex flex-col">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Ingresa tu contraseña"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Link
            href="/auth/forgot-password"
            className="text-sm text-stone-900 hover:text-stone-700 hover:underline font-medium transition-colors whitespace-nowrap shrink-0 self-start text-end w-full"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        {/* <div className="flex items-center justify-between w-full gap-4">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0 mb-0 flex-1">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer font-normal text-sm mb-0 leading-none">
                  Recordar detalles del inicio de sesión
                </FormLabel>
              </FormItem>
            )}
          />
        </div> */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>
    </Form>
  );
}
