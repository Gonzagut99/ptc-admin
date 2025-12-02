"use client";

import { useMemo } from "react";
import {
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LiquidationWithDetailsDto, DPayment } from "@/app/(admin)/liquidations/_types/liquidations.types";

interface DashboardStatsProps {
  liquidations: LiquidationWithDetailsDto[];
  isLoading: boolean;
}

export function DashboardStats({ liquidations, isLoading }: DashboardStatsProps) {
  const stats = useMemo(() => {
    if (!liquidations || liquidations.length === 0) {
      return {
        totalLiquidations: 0,
        totalIncomePEN: 0,
        totalIncomeUSD: 0,
        pendingLiquidations: 0,
        completedLiquidations: 0,
        totalPayments: 0,
      };
    }

    const totalLiquidations = liquidations.length;
    
    // Calcular ingresos por pagos
    let totalIncomePEN = 0;
    let totalIncomeUSD = 0;
    let totalPayments = 0;

    liquidations.forEach((liq) => {
      if (liq.payments && liq.payments.length > 0) {
        liq.payments.forEach((payment) => {
          const p = payment as DPayment;
          totalPayments++;
          if (p.currency === "USD") {
            totalIncomeUSD += p.amount || 0;
          } else {
            totalIncomePEN += p.amount || 0;
          }
        });
      }
    });

    const pendingLiquidations = liquidations.filter(
      (l) => l.status === "PENDING" || l.status === "IN_QUOTE"
    ).length;

    const completedLiquidations = liquidations.filter(
      (l) => l.status === "COMPLETED"
    ).length;

    return {
      totalLiquidations,
      totalIncomePEN,
      totalIncomeUSD,
      pendingLiquidations,
      completedLiquidations,
      totalPayments,
    };
  }, [liquidations]);

  const formatCurrency = (amount: number, currency: "PEN" | "USD") => {
    return amount.toLocaleString(currency === "USD" ? "en-US" : "es-PE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Liquidaciones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Liquidaciones
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLiquidations}</div>
          <p className="text-xs text-muted-foreground">
            Este mes
          </p>
        </CardContent>
      </Card>

      {/* Ingresos en Soles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ingresos (PEN)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(stats.totalIncomePEN, "PEN")}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalPayments} pagos registrados
          </p>
        </CardContent>
      </Card>

      {/* Ingresos en Dólares */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ingresos (USD)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(stats.totalIncomeUSD, "USD")}
          </div>
          <p className="text-xs text-muted-foreground">
            En dólares americanos
          </p>
        </CardContent>
      </Card>

      {/* Liquidaciones Pendientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pendientes
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pendingLiquidations}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.completedLiquidations} completadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
