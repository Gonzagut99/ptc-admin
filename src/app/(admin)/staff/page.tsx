import { Metadata } from "next";
import PageContainer from "@/components/layout/page-container";
import Container from "@/components/ui/container";
import StaffPrimaryButtons from "./_components/header/staff-primary-buttons";
import StaffDialogs from "./_components/overlays/staff-dialogs";
import { StaffTable } from "./_components/table";

export const metadata: Metadata = {
  title: "Personal | PTC Admin",
  description: "Gestión del personal del sistema",
};

export default function StaffPage() {
  return (
    <>
      <PageContainer scrollable={false}>
        <Container
          title="Personal"
          description="Gestiona el personal registrado en el sistema."
          actions={<StaffPrimaryButtons />}
        >
          <StaffTable />
        </Container>
        <StaffDialogs />
      </PageContainer>
    </>
  );
}
