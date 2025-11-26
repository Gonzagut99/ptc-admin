// src/app/(admin)/workshops/_components/cards/workshops-cards.tsx
"use client";

import { UseQueryResult } from "@tanstack/react-query";
import { Building2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatPeruDateHour } from "@/utils/peru-datetime";
import { WorkshopWithWorkerCountResponse } from "../../_types/workshops.types";
import WorkshopCardActionsMenu from "../overlays/workshop-card-actions-menu";

interface WorkshopsCardsProps {
  query: UseQueryResult<any, any>;
}

export default function WorkshopsCards({ query }: WorkshopsCardsProps) {
  const router = useRouter();

  const { data, isLoading, isError } = query;
  const workshops = (data?.data ?? []) as WorkshopWithWorkerCountResponse[];

  return (
    <div className="space-y-6">
      {isError && (
        <p className="text-sm text-destructive">
          Error al cargar los talleres.
        </p>
      )}

      {!isLoading && !isError && workshops.length === 0 && (
        <Empty className="border border-dashed border-muted-foreground/20 bg-muted/10">
          <EmptyHeader>
            <EmptyTitle>No hay talleres registrados</EmptyTitle>
            <EmptyDescription>
              Crea el primer taller usando el botón{" "}
              <strong>"Nuevo taller"</strong>.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent></EmptyContent>
        </Empty>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(isLoading && workshops.length === 0
          ? Array.from({ length: 3 })
          : workshops
        ).map((item, index) => {
          const workshop: WorkshopWithWorkerCountResponse =
            isLoading && workshops.length === 0
              ? {
                  id: String(index),
                  name: "Taller",
                  workerCount: 0,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  deletedAt: undefined,
                  idNumber: "",
                  idDocumentType: "RUC",
                  isActive: true,
                }
              : (item as WorkshopWithWorkerCountResponse);

          return (
            <Card key={workshop.id} className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{workshop.name}</CardTitle>
                  </div>
                  <CardAction>
                    <WorkshopCardActionsMenu workshop={workshop} />
                  </CardAction>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-4 flex flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 py-6">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {workshop.workerCount} trabajadores
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <div className="font-medium">Fecha de creación:</div>
                    <div className="mt-1 text-sm text-foreground">
                      {formatPeruDateHour(workshop.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Última actualización:</div>
                    <div className="mt-1 text-sm text-foreground">
                      {formatPeruDateHour(workshop.updatedAt)}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  className="w-full"
                  disabled={!workshop.isActive} // si taller esta desactivado no se puede interactuar
                  onClick={() => router.push(`/workshops/${workshop.id}`)}
                >
                  Ver Trabajadores
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
