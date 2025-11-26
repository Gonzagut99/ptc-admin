import { RefreshCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type PopoverInputErrorProps = {
  label: string;
  message?: string;
  detail?: string;
  resetErrorBoundary?: () => void;
  className?: string;
};

export const InputErrorPopover = ({
  detail,
  message,
  resetErrorBoundary,
  label,
  className,
}: PopoverInputErrorProps) => {
  return (
    <div className={cn("flex flex-col space-y-2 sm:col-span-1", className)}>
      {/* <div className="space-y-2"></div> */}
      <Label className="text-xs font-medium ">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
          >
            <span>{message ? message : "Hubo un error"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-red-700">
              Error al cargar datos
            </div>
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {detail ? detail : "No se proporcionó información adicional."}
            </div>
            {resetErrorBoundary && (
              <Button
                onClick={() => resetErrorBoundary()}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
