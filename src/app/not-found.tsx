"use client";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="relative h-screen overflow-hidden bg-background">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main 404 Typography */}
          <div className="mb-8 space-y-4">
            <h1 className="font-sans text-[clamp(4rem,10vw,12rem)] font-black leading-none tracking-tighter text-primary">
              404
            </h1>
            <div className="relative">
              <h2 className="text-balance font-sans text-[clamp(2rem,4vw,5rem)] font-bold leading-tight tracking-tight">
                PÁGINA NO
                <br />
                ENCONTRADA
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="mx-auto mb-12 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            La página que buscas no existe o ha sido movida. Por favor, verifica
            la URL o utiliza la navegación para acceder al contenido disponible.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="group min-w-[200px] text-base">
              <Link href="/">
                <Home className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                Volver al Inicio
              </Link>
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="lg"
              className="group min-w-[200px] text-base bg-transparent cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Página Anterior
            </Button>
          </div>

          {/* Fun Message */}
          <div className="mt-16">
            <p className="font-mono text-sm text-muted-foreground">
              Error Code:{" "}
              <span className="font-bold text-foreground">NOT_FOUND</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
