"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type FieldsetContextValue = {
  disabled?: boolean;
};

const FieldsetContext = React.createContext<FieldsetContextValue>(
  {} as FieldsetContextValue,
);

const useFieldsetContext = () => {
  const context = React.useContext(FieldsetContext);
  return context;
};

interface FieldsetProps extends React.ComponentProps<"fieldset"> {
  disabled?: boolean;
  legend?: string;
}

const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ className, disabled, children, legend, ...props }, ref) => {
    const contextValue = React.useMemo(() => ({ disabled }), [disabled]);

    return (
      <FieldsetContext.Provider value={contextValue}>
        <fieldset
          ref={ref}
          disabled={disabled}
          className={cn(
            "space-y-2 border rounded-md p-4",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          {...props}
        >
          {legend && <FieldsetLegend>{legend}</FieldsetLegend>}
          {children}
        </fieldset>
      </FieldsetContext.Provider>
    );
  },
);
Fieldset.displayName = "Fieldset";

interface FieldsetLegendProps extends React.ComponentProps<"legend"> {
  description?: string;
}

const FieldsetLegend = React.forwardRef<HTMLLegendElement, FieldsetLegendProps>(
  ({ className, children, description, ...props }, ref) => {
    return (
      <legend
        ref={ref}
        className={cn(
          "text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className,
        )}
        {...props}
      >
        {children}
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </legend>
    );
  },
);
FieldsetLegend.displayName = "FieldsetLegend";

type FieldsetDescriptionProps = React.ComponentProps<"p">;

const FieldsetDescription = React.forwardRef<
  HTMLParagraphElement,
  FieldsetDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FieldsetDescription.displayName = "FieldsetDescription";

type FieldsetItemProps = React.ComponentProps<"div">;

const FieldsetItem = React.forwardRef<HTMLDivElement, FieldsetItemProps>(
  ({ className, ...props }, ref) => {
    const { disabled } = useFieldsetContext();

    return (
      <div
        ref={ref}
        className={cn(
          "space-y-2",
          disabled && "pointer-events-none",
          className,
        )}
        {...props}
      />
    );
  },
);
FieldsetItem.displayName = "FieldsetItem";

export {
  Fieldset,
  FieldsetDescription,
  FieldsetItem,
  FieldsetLegend,
  useFieldsetContext,
};
