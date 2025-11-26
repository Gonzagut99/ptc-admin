"use client";

import { useBreadcrumbOverride } from "@/hooks/use-breadcrumb-override";
import { useGetWorkshop } from "../../_hooks/workshops-hooks";

interface WorkshopBreadcrumbOverrideProps {
  workshopId: string;
}

export default function WorkshopBreadcrumbOverride({
  workshopId,
}: WorkshopBreadcrumbOverrideProps) {
  const { data: workshop } = useGetWorkshop(workshopId);

  useBreadcrumbOverride(
    workshop
      ? {
          pattern: `/workshops/${workshopId}`,
          label: workshop.name,
          type: "replace-segment",
          segmentIndex: 1, // /workshops/[id] -> index 1 is [id]
        }
      : null,
  );

  return null;
}
