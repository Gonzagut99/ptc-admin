"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

function Label({
  className,
  required,
  requiredTooltip = "Este campo es obligatorio",
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
  requiredTooltip?: string;
}) {
  if (required) {
    return (
      <LabelPrimitive.Root
        data-slot="label"
        className={cn(
          "flex items-center gap-1 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span>{props.children}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-destructive font-bold cursor-help leading-none">
              *
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{requiredTooltip}</p>
          </TooltipContent>
        </Tooltip>
      </LabelPrimitive.Root>
    );
  }

  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
