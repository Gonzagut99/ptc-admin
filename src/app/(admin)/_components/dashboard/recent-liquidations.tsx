"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  LiquidationWithDetailsDto,
  LIQUIDATION_STATUS_COLORS,
  LIQUIDATION_STATUS_LABELS,
  LiquidationStatus,
} from "@/app/(admin)/liquidations/_types/liquidations.types";

interface RecentLiquidationsProps {
  liquidations: LiquidationWithDetailsDto[];
  isLoading: boolean;
}

export function RecentLiquidations({ liquidations, isLoading }: RecentLiquidationsProps) {
  const router = useRouter();

  // Obtener las últimas 5 liquidaciones ordenadas por fecha
  const recentLiquidations = useMemo(() => {
    if (!liquidations || liquidations.length === 0) return [];

    return [...liquidations]
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [liquidations]);

  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined || amount === null) return "-";
    return amount.toLocaleString(currency === "USD" ? "en-US" : "es-PE", {
      style: "currency",
      currency: currency || "PEN",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Liquidaciones Recientes</CardTitle>
          <CardDescription>
            Últimas liquidaciones registradas en el sistema
          </CardDescription>
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
        {recentLiquidations.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total PEN</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLiquidations.map((liq) => (
                <TableRow
                  key={liq.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/liquidations?selected=${liq.id}`)}
                >
                  <TableCell className="font-mono">
                    #{String(liq.id).padStart(4, "0")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {liq.customer?.firstName} {liq.customer?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {liq.customer?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(liq.total_amount, "PEN")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-xs",
                        LIQUIDATION_STATUS_COLORS[liq.status as LiquidationStatus] ||
                          "bg-gray-100"
                      )}
                    >
                      {LIQUIDATION_STATUS_LABELS[liq.status as LiquidationStatus] ||
                        liq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {liq.created_at
                      ? formatDistanceToNow(new Date(liq.created_at), {
                          addSuffix: true,
                          locale: es,
                        })
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No hay liquidaciones registradas
          </div>
        )}
      </CardContent>
    </Card>
  );
}
