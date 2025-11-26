"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { MODULE_WORKSHOPS } from "../overlays/workshops-dialogs";

export default function WorkshopsPrimaryButtons() {
  const { open } = useDialogStore();

  const handleNewWorkshop = () => {
    open(MODULE_WORKSHOPS, "create");
  };

  return (
    <Button onClick={handleNewWorkshop}>
      <Plus className="mr-2 h-4 w-4" />
      Nuevo taller
    </Button>
  );
}
