"use client";
import { Archive, RotateCcw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProtectedComponent } from "@/components/ui/protected-component";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { cn } from "@/lib/utils";
import {
  useDeactivateToggleWorker,
  useDeleteWorker,
} from "../../_hooks/workers-hooks";
import { default as WorkerCreateDialog } from "../create/worker-create-dialog";
import WorkerDetail from "../detail/worker-detail-dialog";
import { default as WorkerEditDialog } from "../edit/worker-edit-dialog";

export const MODULE_WORKERS = "workers";

export default function WorkersDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();
  const { mutate: onDeleteWorker, isPending } = useDeleteWorker();
  const {
    mutate: onDeactivateToggleWorker,
    isPending: isDeactivateTogglePending,
  } = useDeactivateToggleWorker();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_WORKERS) {
    return null;
  }

  return (
    <>
      {type === "create" && (
        <WorkerCreateDialog
          open={isOpenForModule(MODULE_WORKERS, "create")}
          onOpenChange={close}
        />
      )}
      {type === "edit" && (
        <WorkerEditDialog
          open={isOpenForModule(MODULE_WORKERS, "edit")}
          onOpenChange={close}
          workerId={data as string}
        />
      )}
      {type === "details" && (
        <WorkerDetail
          open={isOpenForModule(MODULE_WORKERS, "details")}
          onOpenChange={close}
          workerId={data as string}
        />
      )}
      {type === "delete" && (
        <ConfirmDialog
          key="worker-delete"
          open={isOpenForModule(MODULE_WORKERS, "delete")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={() => {
            onDeleteWorker(
              {
                params: {
                  path: { id: data.id },
                },
              },
              {
                onSuccess: () => {
                  close();
                },
              },
            );
          }}
          className="max-w-md"
          title={
            <div className="items-center gap-2 inline-flex flex-wrap">
              <Trash className="h-4 w-4 text-rose-500" />
              Eliminar trabajador{" "}
              <strong className=" uppercase ">{data?.name}</strong>
            </div>
          }
          desc={
            <>
              Estás a punto de eliminar el trabajador{" "}
              <strong>{data?.name}</strong>. <br />
              Esta acción no se puede deshacer.
            </>
          }
          confirmText="Eliminar"
          destructive
          cancelBtnText="Cancelar"
          isLoading={isPending}
          middleActions={
            <ProtectedComponent
              requiredPermissions={[
                { resource: "worker", action: "deactivate" },
              ]}
            >
              <Button
                variant="outline"
                onClick={() => {
                  onDeactivateToggleWorker(
                    {
                      params: {
                        path: { id: data?.id },
                      },
                    },
                    {
                      onSuccess: () => {
                        close();
                      },
                    },
                  );
                }}
                type="button"
                disabled={isPending}
                className={cn(
                  "flex items-center gap-2 ",
                  data?.isActive ? "text-destructive" : "text-green-600",
                )}
              >
                {data?.isActive ? (
                  <Archive className="h-4 w-4 shrink-0" />
                ) : (
                  <RotateCcw className="h-4 w-4 shrink-0" />
                )}
                {data?.isActive ? "Archivar" : "Activar"}
              </Button>
            </ProtectedComponent>
          }
        />
      )}
      {type === "archive" && (
        <ConfirmDialog
          key="worker-archive"
          open={isOpenForModule(MODULE_WORKERS, "archive")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={() => {
            onDeactivateToggleWorker(
              {
                params: {
                  path: { id: data.id },
                },
              },
              {
                onSuccess: () => {
                  close();
                },
              },
            );
          }}
          className="max-w-md"
          title={
            <div className="items-center gap-2 inline-flex flex-wrap">
              <Archive className="h-4 w-4 text-rose-500" />
              Archivar trabajador{" "}
              <strong className=" uppercase ">{data?.name}</strong>
            </div>
          }
          desc={
            <>
              Estás a punto de archivar el trabajador{" "}
              <strong>{data?.name}</strong>.{" "}
            </>
          }
          confirmText="Archivar"
          destructive
          cancelBtnText="Cancelar"
          isLoading={isDeactivateTogglePending}
        />
      )}
    </>
  );
}
