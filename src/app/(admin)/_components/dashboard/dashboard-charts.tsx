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
import {
  LiquidationWithDetailsDto,
  LIQUIDATION_STATUS_LABELS,
  LiquidationStatus,
  DPayment,
  PAYMENT_METHOD_LABELS,
  PaymentMethod,
} from "@/app/(admin)/liquidations/_types/liquidations.types";

interface DashboardChartsProps {
  liquidations: LiquidationWithDetailsDto[];
  isLoading: boolean;
}

// Colores para estados de liquidación
const STATUS_COLORS: Record<string, string> = {
  IN_QUOTE: "hsl(210, 100%, 50%)",    // Azul
  PENDING: "hsl(45, 100%, 50%)",      // Amarillo
  ON_COURSE: "hsl(280, 70%, 50%)",    // Púrpura
  COMPLETED: "hsl(140, 70%, 45%)",    // Verde
};

// Colores para métodos de pago
const PAYMENT_METHOD_COLORS: Record<string, string> = {
  DEBIT: "hsl(210, 80%, 55%)",
  CREDIT: "hsl(280, 70%, 55%)",
  YAPE: "hsl(320, 80%, 55%)",
  OTHER: "hsl(0, 0%, 50%)",
};

const statusChartConfig: ChartConfig = {
  IN_QUOTE: { label: "En cotización", color: STATUS_COLORS.IN_QUOTE },
  PENDING: { label: "Pendiente", color: STATUS_COLORS.PENDING },
  ON_COURSE: { label: "En curso", color: STATUS_COLORS.ON_COURSE },
  COMPLETED: { label: "Completado", color: STATUS_COLORS.COMPLETED },
};

const paymentChartConfig: ChartConfig = {
  DEBIT: { label: "Débito", color: PAYMENT_METHOD_COLORS.DEBIT },
  CREDIT: { label: "Crédito", color: PAYMENT_METHOD_COLORS.CREDIT },
  YAPE: { label: "Yape", color: PAYMENT_METHOD_COLORS.YAPE },
  OTHER: { label: "Otro", color: PAYMENT_METHOD_COLORS.OTHER },
};

export function DashboardCharts({ liquidations, isLoading }: DashboardChartsProps) {
  // Datos para gráfico de estados
  const statusData = useMemo(() => {
    if (!liquidations || liquidations.length === 0) return [];

    const statusCount: Record<string, number> = {};
    
    liquidations.forEach((liq) => {
      const status = liq.status || "PENDING";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      name: LIQUIDATION_STATUS_LABELS[status as LiquidationStatus] || status,
      value: count,
      status,
      fill: STATUS_COLORS[status] || "hsl(0, 0%, 50%)",
    }));
  }, [liquidations]);

  // Datos para gráfico de métodos de pago
  const paymentMethodData = useMemo(() => {
    if (!liquidations || liquidations.length === 0) return [];

    const methodCount: Record<string, number> = {};
    
    liquidations.forEach((liq) => {
      if (liq.payments && liq.payments.length > 0) {
        liq.payments.forEach((payment) => {
          const p = payment as DPayment;
          const method = p.method || "OTHER";
          methodCount[method] = (methodCount[method] || 0) + 1;
        });
      }
    });

    return Object.entries(methodCount).map(([method, count]) => ({
      name: PAYMENT_METHOD_LABELS[method as PaymentMethod] || method,
      value: count,
      method,
      fill: PAYMENT_METHOD_COLORS[method] || "hsl(0, 0%, 50%)",
    }));
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
      {/* Gráfico de Estados */}
      <Card>
        <CardHeader>
          <CardTitle>Liquidaciones por Estado</CardTitle>
          <CardDescription>
            Distribución de liquidaciones según su estado actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statusData.length > 0 ? (
            <ChartContainer config={statusChartConfig} className="h-[250px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No hay datos disponibles
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Métodos de Pago */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
          <CardDescription>
            Distribución de pagos por método utilizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethodData.length > 0 ? (
            <ChartContainer config={paymentChartConfig} className="h-[250px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={paymentMethodData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No hay pagos registrados
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
