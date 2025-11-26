"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Logo from "@/assets/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordView() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  // Si hay un error o no hay token, mostrar mensaje de error
  if (error === "INVALID_TOKEN" || !token) {
    return (
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-[40%_60%] p-0 bg-card">
        <div className="grid grid-rows-[auto_1fr_auto] h-full p-6">
          <div className="relative z-20 flex text-lg font-medium items-start w-full pt-6 px-6 pb-0">
            <Logo height={45} width={332} />
          </div>
          <div className="w-full max-w-md flex items-center justify-center mx-auto">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center font-bold text-[38px]">
                  Enlace inválido o expirado
                </CardTitle>
                <CardDescription className="text-center text-[15px] font-normal">
                  El enlace de recuperación no es válido o ha expirado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    El token de recuperación no es válido o ha expirado. Por
                    favor, solicita un nuevo enlace de recuperación.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <Separator />
              <CardFooter>
                <div className="flex items-center space-x-2 w-full justify-center text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="text-stone-900 hover:underline font-semibold"
                  >
                    Solicitar nuevo enlace
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="text-start text-sm font-normal px-6 pb-5">
            <p className="text-[16px] text-[#62748E]">
              © {new Date().getFullYear()} Work Wear Industrial E.I.R.L. Todos
              los derechos reservados.
            </p>
          </div>
        </div>
        <div className="relative hidden h-full w-full flex-col lg:flex overflow-hidden">
          <img
            src="/assets/log-in-bg-work-wear.webp"
            alt="auth-bg"
            className="h-full w-full object-cover brightness-85"
          />
        </div>
      </div>
    );
  }

  // Si hay token válido, mostrar el formulario
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-[40%_60%] p-0 bg-card">
      <div className="grid grid-rows-[auto_1fr_auto] h-full p-6">
        <div className="relative z-20 flex text-lg font-medium items-start w-full pt-6 px-6 pb-0">
          <Logo height={45} width={332} />
        </div>
        <div className="w-full max-w-md flex items-center justify-center mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center font-bold text-[38px]">
                Restablecer contraseña
              </CardTitle>
              <CardDescription className="text-center text-[15px] font-normal">
                Ingresa tu nueva contraseña para completar el proceso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResetPasswordForm token={token} />
            </CardContent>
            <Separator />
            <CardFooter>
              <div className="flex items-center space-x-2 w-full justify-center text-sm">
                <p>¿Recordaste tu contraseña?</p>
                <Link
                  href="/auth/log-in"
                  className="text-stone-900 hover:underline font-semibold"
                >
                  Iniciar sesión
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="text-start text-sm font-normal px-6 pb-5">
          <p className="text-[16px] text-[#62748E]">
            © {new Date().getFullYear()} Work Wear Industrial E.I.R.L. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
      <div className="relative hidden h-full w-full flex-col lg:flex overflow-hidden">
        <img
          src="/assets/log-in-bg-work-wear.webp"
          alt="auth-bg"
          className="h-full w-full object-cover brightness-85"
        />
      </div>
    </div>
  );
}
