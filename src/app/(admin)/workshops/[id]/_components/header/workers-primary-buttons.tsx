"use client";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedComponent } from "@/components/ui/protected-component";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { MODULE_WORKERS } from "../overlays/workers-dialogs";

export default function WorkersPrimaryButtons() {
  const { open } = useDialogStore();
  return (
    <ProtectedComponent
      requiredPermissions={[{ resource: "worker", action: "create" }]}
    >
      <Button onClick={() => open(MODULE_WORKERS, "create")}>
        <UserPlus />
        Nuevo trabajador
      </Button>
    </ProtectedComponent>
  );
}
