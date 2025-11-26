"use client";

import Container from "@/components/ui/container";
import { useWorkshopsWithWorkerCount } from "../_hooks/workshops-hooks";
import WorkshopsCards from "./cards/workshops-cards";
import WorkshopsHeaderActions from "./header/workshops-header-actions";

export default function WorkshopsPageClient() {
  const { query, searchTerm, setSearch, dateRange, setDateRange } =
    useWorkshopsWithWorkerCount();

  return (
    <Container
      title="Talleres"
      description="Gestiona talleres del sistema de Work Wear"
      actions={
        <WorkshopsHeaderActions
          searchTerm={searchTerm}
          setSearch={setSearch}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      }
    >
      <WorkshopsCards query={query} />
    </Container>
  );
}
