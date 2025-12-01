import { Metadata } from "next";
import PageContainer from "@/components/layout/page-container";
import Container from "@/components/ui/container";
import CustomersPrimaryButtons from "./_components/header/customers-primary-buttons";
import CustomersDialogs from "./_components/overlays/customers-dialogs";
import { CustomersTable } from "./_components/table";

export const metadata: Metadata = {
  title: "Clientes | PTC Admin",
  description: "Gestión de clientes del sistema",
};

export default function CustomersPage() {
  return (
    <>
      <PageContainer scrollable={false}>
        <Container
          title="Clientes"
          description="Gestiona los clientes registrados en el sistema."
          actions={<CustomersPrimaryButtons />}
        >
          <CustomersTable />
        </Container>
        <CustomersDialogs />
      </PageContainer>
    </>
  );
}
