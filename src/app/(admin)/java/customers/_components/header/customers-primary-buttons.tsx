"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { MODULE_CUSTOMERS } from "../overlays/customers-dialogs";

export default function CustomersPrimaryButtons() {
  const { open } = useDialogStore();

  return (
    <Button onClick={() => open(MODULE_CUSTOMERS, "create")}>
      <UserPlus className="mr-2 h-4 w-4" />
      Nuevo cliente
    </Button>
  );
}
