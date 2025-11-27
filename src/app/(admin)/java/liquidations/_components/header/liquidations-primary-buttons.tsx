"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { MODULE_LIQUIDATIONS } from "../overlays/liquidations-dialogs";

export default function LiquidationsPrimaryButtons() {
  const { open } = useDialogStore();

  return (
    <Button onClick={() => open(MODULE_LIQUIDATIONS, "create")}>
      <Plus className="mr-2 h-4 w-4" />
      Nueva liquidación
    </Button>
  );
}
