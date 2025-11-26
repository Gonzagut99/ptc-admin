import { Metadata } from "next";
import { ProfileBreadcrumbOverride } from "./_components/header/profile-breadcrumb-override";
import { ProfileContent } from "./_components/profile-content";

export const metadata: Metadata = {
  title: "Perfil | Work Wear",
  description: "Gestiona tu información personal y datos de contacto",
};

export default function ProfilePage() {
  return (
    <>
      <ProfileBreadcrumbOverride />
      <ProfileContent />
    </>
  );
}
