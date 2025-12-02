"use client";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import LogoSmall from "@/assets/logo-small";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

export default function UnderConstruction() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <LogoSmall className="size-24 hover:animate-bounce" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Página en Desarrollo
        </h1>

        <p className="text-md mb-8">
          Estamos implementando mejoras para optimizar tu experiencia
        </p>

        <div className="rounded-2xl p-8 mb-8 bg-card">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="size-8 text-primary" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">
            Funcionalidad en Desarrollo
          </h2>

          <p className="leading-relaxed">
            Nuestro equipo de desarrollo está trabajando en nuevas
            funcionalidades y optimizaciones del sistema. Esta sección estará
            disponible próximamente con todas las características planificadas.
            Agradecemos tu paciencia.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "p-4 text-md font-medium",
            )}
          >
            <ArrowLeft className="size-4 mr-2" />
            Volver al Inicio
          </Link>
        </div>

        <div className="mt-12 text-sm">
          <p>
            © {new Date().getFullYear()} PTC Perú Titicaca & Connections. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
