"use client";

import { use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, MapPin, Hotel, Plane, Package, CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useGetLiquidation } from "../_hooks/liquidations-hooks";
import {
  LIQUIDATION_STATUS_COLORS,
  LIQUIDATION_STATUS_LABELS,
  LiquidationStatus,
} from "../_types/liquidations.types";

interface LiquidationLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function LiquidationLayout({
  children,
  params,
}: LiquidationLayoutProps) {
  const { id } = use(params);
  const liquidationId = Number(id);
  const pathname = usePathname();

  const { data: liquidation, isLoading, isError } = useGetLiquidation(liquidationId);

  // Determinar pestaña activa basándose en pathname
  const getActiveTab = () => {
    if (pathname.includes("/tours")) return "tours";
    if (pathname.includes("/hotels")) return "hotels";
    if (pathname.includes("/flights")) return "flights";
    if (pathname.includes("/additionals")) return "additionals";
    if (pathname.includes("/payments")) return "payments";
    if (pathname.includes("/incidencies")) return "incidencies";
    return "tours";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError || !liquidation) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">No se pudo cargar la liquidación</p>
        <Button asChild variant="outline">
          <Link href="/liquidations">
            <ArrowLeft className="size-4 mr-2" />
            Volver a liquidaciones
          </Link>
        </Button>
      </div>
    );
  }

  const tabs = [
    { value: "tours", label: "Tours", icon: MapPin, href: `/liquidations/${id}/tours`, count: liquidation.tour_services?.length ?? 0 },
    { value: "hotels", label: "Hoteles", icon: Hotel, href: `/liquidations/${id}/hotels`, count: liquidation.hotel_services?.length ?? 0 },
    { value: "flights", label: "Vuelos", icon: Plane, href: `/liquidations/${id}/flights`, count: liquidation.flight_services?.length ?? 0 },
    { value: "additionals", label: "Adicionales", icon: Package, href: `/liquidations/${id}/additionals`, count: liquidation.additional_services?.length ?? 0 },
    { value: "payments", label: "Pagos", icon: CreditCard, href: `/liquidations/${id}/payments`, count: liquidation.payments?.length ?? 0 },
    { value: "incidencies", label: "Incidencias", icon: AlertTriangle, href: `/liquidations/${id}/incidencies`, count: liquidation.incidencies?.length ?? 0 },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/liquidations">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Liquidación #{liquidation.id}</h1>
              <Badge
                className={cn(
                  LIQUIDATION_STATUS_COLORS[liquidation.status as LiquidationStatus] || "bg-gray-100"
                )}
              >
                {LIQUIDATION_STATUS_LABELS[liquidation.status as LiquidationStatus] || liquidation.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Cliente: {liquidation.customer?.firstName} {liquidation.customer?.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <Tabs value={getActiveTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link href={tab.href} className="gap-1.5">
                <tab.icon className="size-4" />
                <span className="hidden md:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      {children}
    </div>
  );
}
