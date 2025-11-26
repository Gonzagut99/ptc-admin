"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";

export default function ForbiddenError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="relative">
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-100 rounded-full opacity-20 blur-xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-100 rounded-full opacity-20 blur-xl" />

        <div className="relative bg-white p-10 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100">
          {/* Icon container */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-md opacity-50" />
              <div className="relative w-24 h-24 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: to pass lint*/}
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
            Acceso Denegado
          </h1>

          {/* Error code */}
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1 bg-red-50 text-red-600 text-sm font-semibold rounded-full border border-red-100">
              Error 403
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            No tienes los permisos necesarios para acceder a esta página. Si
            crees que esto es un error, contacta con el administrador del
            sistema.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => history.go(-1)}>
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full bg-destructive text-white",
                )}
              >
                Volver al Dashboard
              </Link>
            </div>
            <Alert variant="destructive">
              <AlertTitle>Cambiar de Cuenta</AlertTitle>
              <AlertDescription>
                Si crees que esto es un error, contacta con el administrador del
                sistema.
              </AlertDescription>
            </Alert>
          </div>

          {/* Help text */}
          {/* <p className="text-sm text-gray-500 text-center mt-6">
                        ¿Necesitas ayuda?{' '}
                        <a
                            href="mailto:support@example.com"
                            className="text-red-600 hover:text-red-700 font-medium underline"
                        >
                            Contacta con soporte
                        </a>
                    </p> */}
        </div>
      </div>
    </div>
  );
}
