"use client";
import { ShieldCheck, UserCircle } from "lucide-react";
import React from "react";
import PageContainer from "@/components/layout/page-container";
import Container from "@/components/ui/container";
import { SidebarNav } from "./_components/common/sidebar-nav";
import { SettingsSessionProvider } from "./_contexts/settings-session-context";

const sidebarNavItems = [
  {
    title: "Perfil",
    href: "/settings/profile",
    icon: <UserCircle size={18} />,
  },
  {
    title: "Seguridad",
    href: "/settings/security",
    icon: <ShieldCheck size={18} />,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsSessionProvider>
      <PageContainer scrollable={false}>
        <Container
          title="Perfil de usuario"
          description="Configura tu información y la seguridad de tu cuenta."
        >
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4">
            <SidebarNav items={sidebarNavItems} showUser={true} />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </Container>
      </PageContainer>
    </SettingsSessionProvider>
  );
}
