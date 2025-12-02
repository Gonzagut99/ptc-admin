"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LiquidationWithDetailsDto } from "@/app/(admin)/liquidations/_types/liquidations.types";

interface PaymentStatusChartProps {
  liquidations: LiquidationWithDetailsDto[];
  isLoading: boolean;
}

// Colores para estados de pago
const PAYMENT_STATUS_COLORS: Record<string, string> = {
  COMPLETED: "hsl(140, 70%, 45%)",   // Verde
  ON_COURSE: "hsl(45, 100%, 50%)",   // Amarillo
  PENDING: "hsl(0, 70%, 55%)",       // Rojo
};

// Colores para cotizaciones vs liquidaciones activas
const QUOTE_STATUS_COLORS: Record<string, string> = {
  IN_QUOTE: "hsl(210, 100%, 55%)",   // Azul
  ACTIVE: "hsl(280, 70%, 55%)",      // Púrpura
};

const paymentStatusChartConfig: ChartConfig = {
  COMPLETED: { label: "Pagado", color: PAYMENT_STATUS_COLORS.COMPLETED },
  ON_COURSE: { label: "En curso", color: PAYMENT_STATUS_COLORS.ON_COURSE },
  PENDING: { label: "Pendiente", color: PAYMENT_STATUS_COLORS.PENDING },
};

const quoteStatusChartConfig: ChartConfig = {
  IN_QUOTE: { label: "En cotización", color: QUOTE_STATUS_COLORS.IN_QUOTE },
  ACTIVE: { label: "Activas", color: QUOTE_STATUS_COLORS.ACTIVE },
};

export function PaymentStatusChart({ liquidations, isLoading }: PaymentStatusChartProps) {
  // Datos para gráfico de estado de pago (excluyendo cotizaciones)
  const paymentStatusData = useMemo(() => {
    if (!liquidations || liquidations.length === 0) return [];

    const statusCount: Record<string, number> = {
      COMPLETED: 0,
      ON_COURSE: 0,
      PENDING: 0,
    };

    liquidations.forEach((liq) => {
      // Excluir cotizaciones del gráfico de pagos
      if (liq.status === "IN_QUOTE") return;
      
      const paymentStatus = liq.payment_status || "PENDING";
      if (statusCount[paymentStatus] !== undefined) {
        statusCount[paymentStatus]++;
      }
    });

    return Object.entries(statusCount)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: paymentStatusChartConfig[status]?.label || status,
        value: count,
        status,
        fill: PAYMENT_STATUS_COLORS[status] || "hsl(0, 0%, 50%)",
      }));
  }, [liquidations]);

  // Datos para cotizaciones vs liquidaciones activas
  const quoteVsActiveData = useMemo(() => {
    if (!liquidations || liquidations.length === 0) return [];

    let inQuote = 0;
    let active = 0;

    liquidations.forEach((liq) => {
      if (liq.status === "IN_QUOTE") {
        inQuote++;
      } else {
        active++;
      }
    });

    const data = [];
    if (inQuote > 0) {
      data.push({
        name: "En cotización",
        value: inQuote,
        status: "IN_QUOTE",
        fill: QUOTE_STATUS_COLORS.IN_QUOTE,
      });
    }
    if (active > 0) {
      data.push({
        name: "Liquidaciones activas",
        value: active,
        status: "ACTIVE",
        fill: QUOTE_STATUS_COLORS.ACTIVE,
      });
    }

    return data;
  }, [liquidations]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Gráfico de Estado de Pago */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Pagos</CardTitle>
          <CardDescription>
            Distribución de liquidaciones por estado de pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentStatusData.length > 0 ? (
            <ChartContainer config={paymentStatusChartConfig} className="h-[220px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={paymentStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name, value }) => `${value}`}
                  labelLine={false}
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground">
              No hay datos de pagos
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Cotizaciones vs Activas */}
      <Card>
        <CardHeader>
          <CardTitle>Cotizaciones vs Activas</CardTitle>
          <CardDescription>
            Liquidaciones en cotización vs liquidaciones activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quoteVsActiveData.length > 0 ? (
            <ChartContainer config={quoteStatusChartConfig} className="h-[220px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={quoteVsActiveData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name, value }) => `${value}`}
                  labelLine={false}
                >
                  {quoteVsActiveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground">
              No hay datos disponibles
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
