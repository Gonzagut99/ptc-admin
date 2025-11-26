import { Metadata } from "next";
import PageContainer from "@/components/layout/page-container";
import WorkshopsDialogs from "./_components/overlays/workshops-dialogs";
import WorkshopsPageClient from "./_components/workshops-page-client";

export const metadata: Metadata = {
  title: "Talleres",
  description: "Gestión de talleres del sistema de Work Wear",
};

export default function WorkshopsPage() {
  return (
    <PageContainer scrollable={false}>
      <WorkshopsPageClient />
      <WorkshopsDialogs />
    </PageContainer>
  );
}
