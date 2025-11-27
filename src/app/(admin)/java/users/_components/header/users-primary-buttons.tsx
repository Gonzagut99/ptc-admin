"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { MODULE_USERS } from "../overlays/users-dialogs";

export default function UsersPrimaryButtons() {
  const { open } = useDialogStore();

  return (
    <Button onClick={() => open(MODULE_USERS, "create")}>
      <UserPlus className="mr-2 h-4 w-4" />
      Nuevo usuario
    </Button>
  );
}
