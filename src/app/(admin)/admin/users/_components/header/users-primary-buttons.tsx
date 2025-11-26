"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedComponent } from "@/components/ui/protected-component";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { MODULE_USERS } from "../overlays/users-dialogs";

export default function UsersPrimaryButtons() {
  const { open } = useDialogStore();
  return (
    <div>
      <ProtectedComponent
        requiredPermissions={[{ resource: "user", action: "create" }]}
      >
        <Button onClick={() => open(MODULE_USERS, "create")}>
          <Plus />
          Nuevo usuario
        </Button>
      </ProtectedComponent>
    </div>
  );
}
