"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function NextjsForbiddenError() {
  const { push } = useRouter();
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">403</h1>
        <span className="font-medium">Acceso restringido</span>
        <p className="text-muted-foreground text-center">
          No tienen los permisos necesarios <br />
          para ver este recurso.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
            Volver
          </Button>
          <Button onClick={() => push("/")}>Ir al inicio</Button>
        </div>
      </div>
    </div>
  );
}
