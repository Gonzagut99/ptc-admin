import {
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  ClipboardList,
  Factory,
  Hammer,
  HandCoins,
  KeyRound,
  Layers3,
  LayoutDashboard,
  LayoutList,
  PencilRuler,
  Repeat,
  Store,
  Users,
} from "lucide-react";
import LogoSmall from "@/assets/logo-small";
import { type SidebarData } from "./types";

export const sidebarData: SidebarData = {
  business: {
    name: "Work Wear",
    logo: LogoSmall,
  },
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Producción y pedidos",
      items: [
        {
          title: "Órdenes y cotizaciones",
          url: "/orders-and-quotations",
          icon: ClipboardList,
        },
        {
          title: "Gestión de producción",
          url: "/production-management",
          icon: Factory,
        },
        {
          title: "Control de medidas",
          url: "/measurement-control",
          icon: PencilRuler,
        },
      ],
    },
    {
      title: "Preparación de prenda",
      items: [
        {
          title: "Plantillas por prenda",
          url: "/garment-templates",
          icon: LayoutList,
        },
        {
          title: "Insumos",
          url: "/supplies",
          icon: Layers3,
        },
        {
          title: "Mano de obra",
          url: "/labor",
          icon: Hammer,
        },
      ],
    },
    {
      title: "Gestión de Talleres y pagos",
      items: [
        {
          title: "Talleres",
          url: "/workshops",
          icon: Building2,
        },
        {
          title: "Pagos a trabajadores",
          url: "/worker-payments",
          icon: HandCoins,
        },
      ],
    },
    {
      title: "Caja",
      items: [
        {
          title: "Cuentas por cobrar",
          url: "/accounts-receivable",
          icon: ArrowDownCircle,
        },
        {
          title: "Cuentas por pagar",
          url: "/accounts-payable",
          icon: ArrowUpCircle,
        },
        {
          title: "Insumos y salidas",
          url: "/supplies-and-outputs",
          icon: Repeat,
        },
      ],
    },
    {
      title: "Cliente",
      items: [
        {
          title: "Clientes",
          url: "/customers",
          icon: Store,
          permission: "customer:*",
        },
      ],
    },
    {
      title: "Configuración general",
      items: [
        {
          title: "Usuarios",
          url: "/admin/users",
          icon: Users,
          permission: "user:*",
        },
        {
          title: "Roles y permisos",
          url: "/admin/roles",
          icon: KeyRound,
          permission: "role:*",
        },
      ],
    },
  ],
};
