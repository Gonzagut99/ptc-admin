import {
  Bell,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  UserCog,
} from "lucide-react";
import LogoSmall from "@/assets/logo-small";
import { type SidebarData } from "./types";

export const sidebarData: SidebarData = {
  business: {
    name: "PTC Agency",
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
      title: "Operaciones",
      items: [
        {
          title: "Liquidaciones",
          url: "/liquidations",
          icon: FileText,
        },
        {
          title: "Clientes",
          url: "/customers",
          icon: Users,
        },
        // {
        //   title: "Proveedores",
        //   url: "/suppliers",
        //   icon: Plane,
        // },
      ],
    },
    {
      title: "Administración",
      items: [
        {
          title: "Personal",
          url: "/staff",
          icon: UserCog,
        },
        {
          title: "Usuarios",
          url: "/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Configuración",
      items: [
        {
          title: "Mi perfil",
          url: "/settings/profile",
          icon: Settings,
        },
        {
          title: "Seguridad",
          url: "/settings/security",
          icon: Shield,
        },
        {
          title: "Notificaciones",
          url: "/settings/notifications",
          icon: Bell,
        },
      ],
    },
  ],
};
