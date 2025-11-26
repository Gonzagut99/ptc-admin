import { Metadata } from "next";
import PageContainer from "@/components/layout/page-container";
import Container from "@/components/ui/container";
import { ProtectedComponent } from "@/components/ui/protected-component";
import UnauthorizedPage from "@/components/ui/unauthorized";
import RolesDialogs from "../roles/_components/overlays/roles-dialogs";
import { UsersBreadcrumbOverride } from "./_components/header/users-breadcrumb-override";
import UsersPrimaryButtons from "./_components/header/users-primary-buttons";
import UsersDialogs from "./_components/overlays/users-dialogs";
import UsersTable from "./_components/table/users-table";

export const metadata: Metadata = {
  title: "Usuarios | Work Wear",
  description: "Gestión de usuarios del sistema de Work Wear",
};

export default function UsersPage() {
  return (
    <ProtectedComponent
      requiredPermissions={[{ resource: "user", action: "read" }]}
      fallback={<UnauthorizedPage />}
    >
      <UsersBreadcrumbOverride />
      <PageContainer scrollable={false}>
        <Container
          title="Lista de usuarios"
          description="Administra los usuarios del sistema, asigna roles y gestiona sus permisos de acceso."
          actions={<UsersPrimaryButtons />}
        >
          <UsersTable />
        </Container>
        <UsersDialogs />
        <RolesDialogs />
      </PageContainer>
    </ProtectedComponent>
  );
}
