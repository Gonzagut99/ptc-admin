"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, differenceInDays, isPast } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, Calendar, Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  LiquidationWithDetailsDto,
} from "@/app/(admin)/liquidations/_types/liquidations.types";

interface UpcomingDeadlinesProps {
  liquidations: LiquidationWithDetailsDto[];
  isLoading: boolean;
}

export function UpcomingDeadlines({ liquidations, isLoading }: UpcomingDeadlinesProps) {
  const router = useRouter();

  // Filtrar liquidaciones con deadline próximo o vencido
  const upcomingDeadlines = useMemo(() => {
    if (!liquidations || liquidations.length === 0) return [];

    const now = new Date();

    return liquidations
      .filter((liq) => {
        // Solo liquidaciones activas (no completadas) con fecha de vencimiento
        if (!liq.payment_deadline) return false;
        if (liq.status === "COMPLETED") return false;
        if (liq.payment_status === "COMPLETED") return false;
        return true;
      })
      .map((liq) => {
        const deadline = new Date(liq.payment_deadline!);
        const daysUntil = differenceInDays(deadline, now);
        const isOverdue = isPast(deadline);

        return {
          ...liq,
          deadline,
          daysUntil,
          isOverdue,
          urgency: isOverdue ? "overdue" : daysUntil <= 3 ? "critical" : daysUntil <= 7 ? "warning" : "normal",
        };
      })
      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
      .slice(0, 5); // Mostrar solo las 5 más próximas
  }, [liquidations]);

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case "overdue":
        return "bg-red-100 border-red-300 text-red-800";
      case "critical":
        return "bg-orange-100 border-orange-300 text-orange-800";
      case "warning":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getUrgencyBadge = (urgency: string, daysUntil: number) => {
    switch (urgency) {
      case "overdue":
        return <Badge variant="destructive">Vencido</Badge>;
      case "critical":
        return <Badge className="bg-orange-500">{daysUntil} días</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 text-yellow-900">{daysUntil} días</Badge>;
      default:
        return <Badge variant="secondary">{daysUntil} días</Badge>;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "-";
    return amount.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const overdueCount = upcomingDeadlines.filter((l) => l.isOverdue).length;

  return (
    <Card className={cn(overdueCount > 0 && "border-red-300")}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {overdueCount > 0 && <AlertTriangle className="h-5 w-5 text-red-500" />}
          <div>
            <CardTitle className="flex items-center gap-2">
              Próximos Vencimientos
              {overdueCount > 0 && (
                <Badge variant="destructive">{overdueCount} vencido(s)</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Liquidaciones con fecha límite de pago próxima
            </CardDescription>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/liquidations")}
          className="gap-1"
        >
          Ver todas
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingDeadlines.length > 0 ? (
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-3">
              {upcomingDeadlines.map((liq) => (
                <div
                  key={liq.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors hover:opacity-80",
                    getUrgencyStyles(liq.urgency)
                  )}
                  onClick={() => router.push(`/liquidations?selected=${liq.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">
                        #{String(liq.id).padStart(4, "0")}
                      </span>
                      {getUrgencyBadge(liq.urgency, liq.daysUntil)}
                    </div>
                    <span className="font-mono font-bold">
                      {formatCurrency(liq.total_amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {liq.customer?.firstName} {liq.customer?.lastName}
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {liq.isOverdue ? (
                        <span className="font-medium">
                          Venció {formatDistanceToNow(liq.deadline, { addSuffix: true, locale: es })}
                        </span>
                      ) : (
                        <span>
                          Vence {formatDistanceToNow(liq.deadline, { addSuffix: true, locale: es })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground">
            <Clock className="h-10 w-10 mb-2 opacity-50" />
            <p>No hay vencimientos próximos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
