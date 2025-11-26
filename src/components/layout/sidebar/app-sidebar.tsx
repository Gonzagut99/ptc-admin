"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BusinessName } from "./business-name";
import { sidebarData } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <BusinessName businessData={sidebarData.business} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => {
          // NavGroup maneja internamente el filtrado y retorna null si no hay items visibles
          return <NavGroup key={props.title} {...props} />;
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
