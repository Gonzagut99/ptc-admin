"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { MODULE_STAFF } from "../overlays/staff-dialogs";

export default function StaffPrimaryButtons() {
  const { open } = useDialogStore();

  return (
    <Button onClick={() => open(MODULE_STAFF, "create")}>
      <UserPlus className="mr-2 h-4 w-4" />
      Nuevo personal
    </Button>
  );
}
