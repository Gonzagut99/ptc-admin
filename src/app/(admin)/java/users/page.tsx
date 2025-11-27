import { Metadata } from "next";
import PageContainer from "@/components/layout/page-container";
import Container from "@/components/ui/container";
import UsersPrimaryButtons from "./_components/header/users-primary-buttons";
import UsersDialogs from "./_components/overlays/users-dialogs";
import { UsersTable } from "./_components/table";

export const metadata: Metadata = {
  title: "Usuarios | PTC Admin",
  description: "Gestión de usuarios del sistema",
};

export default function UsersPage() {
  return (
    <>
      <PageContainer scrollable={false}>
        <Container
          title="Usuarios"
          description="Gestiona los usuarios registrados en el sistema."
          actions={<UsersPrimaryButtons />}
        >
          <UsersTable />
        </Container>
        <UsersDialogs />
      </PageContainer>
    </>
  );
}
