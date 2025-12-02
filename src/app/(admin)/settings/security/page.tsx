import { Metadata } from "next";
import { SecurityBreadcrumbOverride } from "./_components/header/security-breadcrumb-override";
import { SecurityContent } from "./_components/security-content";

export const metadata: Metadata = {
  title: "Seguridad | PTC Perú Titicaca & Connections",
  description:
    "Gestiona la seguridad de tu cuenta, contraseña y sesiones activas",
};

export default function SecurityPage() {
  return (
    <>
      <SecurityBreadcrumbOverride />
      <SecurityContent />
    </>
  );
}
