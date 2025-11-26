import { Metadata } from "next";
import PageContainer from "@/components/layout/page-container";
import Container from "@/components/ui/container";
import { RolesBreadcrumbOverride } from "./_components/header/roles-breadcrumb-override";
import RolesPrimaryButtons from "./_components/header/roles-primary-buttons";
import RolesDialogs from "./_components/overlays/roles-dialogs";
import RolesTable from "./_components/table/roles-table";

export const metadata: Metadata = {
  title: "Roles y permisos | Work Wear",
  description: "Gestión de roles y permisos del sistema de Work Wear",
};

export default function PageRolesAndPermissions() {
  return (
    <>
      <RolesBreadcrumbOverride />
      <PageContainer scrollable={false}>
        <Container
          title="Roles y permisos"
          description="Gestiona roles y permisos que determinan las acciones que un usuario puede realizar en la plataforma."
          actions={<RolesPrimaryButtons />}
        >
          <RolesTable />
        </Container>
        <RolesDialogs />
      </PageContainer>
    </>
  );
}
