import { Metadata } from "next";
import PageContainer from "@/components/layout/page-container";
import Container from "@/components/ui/container";
import LiquidationsPrimaryButtons from "./_components/header/liquidations-primary-buttons";
import LiquidationsDialogs from "./_components/overlays/liquidations-dialogs";
import { LiquidationsTable } from "./_components/table";

export const metadata: Metadata = {
  title: "Liquidaciones | PTC Admin",
  description: "Gestión de liquidaciones del sistema",
};

export default function LiquidationsPage() {
  return (
    <>
      <PageContainer scrollable={false}>
        <Container
          title="Liquidaciones"
          description="Gestiona las liquidaciones registradas en el sistema."
          actions={<LiquidationsPrimaryButtons />}
        >
          <LiquidationsTable />
        </Container>
        <LiquidationsDialogs />
      </PageContainer>
    </>
  );
}
