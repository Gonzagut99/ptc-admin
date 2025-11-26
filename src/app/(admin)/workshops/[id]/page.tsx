import { Metadata } from "next";
import PageContainer from "@/components/layout/page-container";
import Container from "@/components/ui/container";
import WorkshopBreadcrumbOverride from "../_components/header/workshop-breadcrumb-override";
import WorkersPrimaryButtons from "./_components/header/workers-primary-buttons";
import WorkersDialogs from "./_components/overlays/workers-dialogs";
import { WorkersTable } from "./_components/table";

export const metadata: Metadata = {
  title: "Trabajadores del Taller | Work Wear",
  description: "Gestión de trabajadores del taller",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkshopDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <WorkshopBreadcrumbOverride workshopId={id} />
      <PageContainer scrollable={false}>
        <Container
          title="Trabajadores"
          description="Gestiona los trabajadores asociados a este taller."
          actions={<WorkersPrimaryButtons />}
        >
          <WorkersTable workshopId={id} />
        </Container>
        <WorkersDialogs />
      </PageContainer>
    </>
  );
}
