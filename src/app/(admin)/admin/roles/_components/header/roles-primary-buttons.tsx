"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedComponent } from "@/components/ui/protected-component";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { MODULE_ROLES_AND_PERMISSIONS } from "../overlays/roles-dialogs";

export default function RolesPrimaryButtons() {
  const { open } = useDialogStore();
  return (
    <ProtectedComponent
      requiredPermissions={[{ resource: "role", action: "create" }]}
    >
      <Button onClick={() => open(MODULE_ROLES_AND_PERMISSIONS, "create")}>
        <Plus />
        Nuevo rol
      </Button>
    </ProtectedComponent>
  );
}
