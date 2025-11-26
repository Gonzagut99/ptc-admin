"use client";

import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type FormSectionVariant = "default" | "minimal" | "bordered" | "collapsible";

type IconProp = LucideIcon | React.ComponentType<{ className?: string }>;

interface FormSectionProps extends React.ComponentProps<"section"> {
  /**
   * Título de la sección
   */
  title: string;
  /**
   * Icono opcional para mostrar junto al título
   * Debe ser un componente de icono de Lucide
   */
  icon?: IconProp;
  /**
   * Descripción opcional que aparece debajo del título
   */
  description?: string;
  /**
   * Variante visual de la sección
   * @default "default"
   */
  variant?: FormSectionVariant;
  /**
   * Espaciado entre elementos del contenido
   * @default "4"
   */
  contentSpacing?: "2" | "4" | "6" | "8";
  /**
   * Si es true, oculta el encabezado (solo muestra el contenido)
   */
  hideHeader?: boolean;
  /**
   * Estado inicial de colapso (solo para variant="collapsible")
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Estado controlado de colapso (solo para variant="collapsible")
   */
  collapsed?: boolean;
  /**
   * Callback cuando cambia el estado de colapso (solo para variant="collapsible")
   */
  onCollapsedChange?: (collapsed: boolean) => void;
}

const FormSection = React.forwardRef<HTMLElement, FormSectionProps>(
  (
    {
      title,
      icon: Icon,
      description,
      variant = "default",
      contentSpacing = "4",
      hideHeader = false,
      defaultCollapsed = false,
      collapsed: controlledCollapsed,
      onCollapsedChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isCollapsible = variant === "collapsible";

    // Estado interno para collapsible no controlado
    const [internalCollapsed, setInternalCollapsed] =
      React.useState(defaultCollapsed);

    // Determinar si está colapsado (controlado o no controlado)
    const isCollapsed =
      controlledCollapsed !== undefined
        ? controlledCollapsed
        : internalCollapsed;

    // Handler para toggle
    const handleToggle = React.useCallback(() => {
      if (!isCollapsible) return;

      const newCollapsed = !isCollapsed;

      if (controlledCollapsed === undefined) {
        setInternalCollapsed(newCollapsed);
      }

      onCollapsedChange?.(newCollapsed);
    }, [isCollapsible, isCollapsed, controlledCollapsed, onCollapsedChange]);

    const spacingMap = {
      "2": "space-y-2",
      "4": "space-y-4",
      "6": "space-y-6",
      "8": "space-y-8",
    };

    const variantStyles = {
      default: "space-y-4",
      minimal: "space-y-4",
      bordered: "space-y-4 border rounded-md p-4",
      collapsible: "space-y-4",
    };

    const headerVariantStyles = {
      default: "border-b border-border pb-2",
      minimal: "pb-2",
      bordered: "border-b border-border pb-2 mb-4",
      collapsible: "border-b border-border pb-2",
    };

    const iconSize =
      variant === "bordered" || variant === "collapsible"
        ? "w-5 h-5"
        : "w-4 h-4";
    const iconClasses = cn(iconSize, "text-muted-foreground shrink-0");

    const ChevronIcon = isCollapsed ? ChevronDown : ChevronUp;

    const headerContent = (
      <div className={cn(headerVariantStyles[variant])}>
        <div
          className={cn(
            "flex items-center gap-2",
            isCollapsible &&
              "cursor-pointer hover:text-foreground/80 transition-colors",
          )}
          onClick={isCollapsible ? handleToggle : undefined}
          {...(isCollapsible
            ? {
                role: "button",
                "aria-expanded": !isCollapsed,
                tabIndex: 0,
              }
            : {})}
          onKeyDown={
            isCollapsible
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggle();
                  }
                }
              : undefined
          }
        >
          {Icon && <Icon className={iconClasses} />}
          <h3 className="text-sm font-medium text-foreground flex-1">
            {title}
          </h3>
          {isCollapsible && (
            <ChevronIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
        </div>
        {description && !isCollapsed && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </div>
    );

    return (
      <section
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {!hideHeader && headerContent}
        {(!isCollapsible || !isCollapsed) && (
          <div
            className={cn(
              spacingMap[contentSpacing],
              isCollapsible &&
                "animate-in fade-in-0 slide-in-from-top-2 duration-200",
            )}
          >
            {children}
          </div>
        )}
      </section>
    );
  },
);
FormSection.displayName = "FormSection";

export { FormSection, type FormSectionProps, type FormSectionVariant };
