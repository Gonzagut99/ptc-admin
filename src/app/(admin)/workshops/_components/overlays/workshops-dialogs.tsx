"use client";

import { Archive, RotateCcw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { cn } from "@/lib/utils";
import {
  useDeactivateToggleWorkshop,
  useDeleteWorkshop,
} from "../../_hooks/workshops-hooks";
import WorkshopCreateDialog from "../create/workshop-create-dialog";
import WorkshopDetailDialog from "../detail/workshop-detail-dialog";
import WorkshopEditDialog from "../edit/workshop-edit-dialog";

export const MODULE_WORKSHOPS = "workshops";

export default function WorkshopsDialogs() {
  const { isOpenForModule, close, data, type, module } = useDialogStore();
  const { mutate: onDeleteWorkshop, isPending } = useDeleteWorkshop();
  const {
    mutate: onDeactivateToggleWorkshop,
    isPending: isDeactivateTogglePending,
  } = useDeactivateToggleWorkshop();

  // Solo renderizar si estamos en el módulo correcto
  if (module !== MODULE_WORKSHOPS) {
    return null;
  }

  return (
    <>
      {type === "create" && (
        <WorkshopCreateDialog
          open={isOpenForModule(MODULE_WORKSHOPS, "create")}
          onOpenChange={close}
        />
      )}
      {type === "edit" && (
        <WorkshopEditDialog
          open={isOpenForModule(MODULE_WORKSHOPS, "edit")}
          onOpenChange={close}
          workshopId={data as string}
        />
      )}
      {type === "details" && (
        <WorkshopDetailDialog
          open={isOpenForModule(MODULE_WORKSHOPS, "details")}
          onOpenChange={close}
          workshopId={data as string}
        />
      )}
      {type === "delete" && data && (
        <ConfirmDialog
          key="workshop-delete"
          open={isOpenForModule(MODULE_WORKSHOPS, "delete")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={() => {
            if (!data?.id) return;
            onDeleteWorkshop(
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
              Eliminar taller{" "}
              <strong className="uppercase">{data?.name}</strong>
            </div>
          }
          desc={
            <>
              Estás a punto de eliminar el taller <strong>{data?.name}</strong>.{" "}
              <br />
              Esta acción no se puede deshacer.
            </>
          }
          confirmText="Eliminar"
          cancelBtnText="Cancelar"
          destructive
          disabled={!data?.id || isPending || isDeactivateTogglePending}
          middleActions={
            <Button
              variant="outline"
              onClick={() => {
                if (!data?.id) return;
                onDeactivateToggleWorkshop(
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
              type="button"
              disabled={isDeactivateTogglePending || !data?.id}
              className={cn(
                "flex items-center gap-2",
                data?.isActive ? "text-destructive" : "text-green-600",
              )}
            >
              {data?.isActive ? (
                <Archive className="mr-2 h-4 w-4 shrink-0" />
              ) : (
                <RotateCcw className="mr-2 h-4 w-4 shrink-0" />
              )}
              {data?.isActive ? "Archivar" : "Activar"}
            </Button>
          }
          isLoading={isPending || isDeactivateTogglePending}
        />
      )}
      {type === "archive" && data && (
        <ConfirmDialog
          key="workshop-archive"
          open={isOpenForModule(MODULE_WORKSHOPS, "archive")}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          handleConfirm={() => {
            if (!data?.id) return;
            onDeactivateToggleWorkshop(
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
              {data?.isActive ? "Archivar" : "Activar"} taller{" "}
              <strong className="uppercase">{data?.name}</strong>
            </div>
          }
          desc={
            <>
              Estás a punto de {data?.isActive ? "archivar" : "activar"} el
              taller <strong>{data?.name}</strong>.
            </>
          }
          confirmText={data?.isActive ? "Archivar" : "Activar"}
          cancelBtnText="Cancelar"
          destructive={data?.isActive}
          isLoading={isDeactivateTogglePending}
        />
      )}
    </>
  );
}
