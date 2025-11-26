import { cn } from "@/lib/utils";
import { Permission, translateAction } from "@/utils/permissions";

// Componente para un elemento de permiso individual
interface PermissionItemProps {
  permission: Permission;
  isSelected: boolean;
  onToggle: () => void;
  isWildcard?: boolean;
  disabled?: boolean;
}

export const PermissionItem = ({
  permission,
  isSelected,
  onToggle,
  isWildcard = false,
  disabled = false,
}: PermissionItemProps) => {
  const actionName = translateAction(permission.action);
  const displayText = permission.description || actionName;

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 px-3.5 py-2.5 transition-all text-left",
        !disabled && "hover:bg-accent/40",
        disabled && "opacity-50 cursor-not-allowed",
        isWildcard && "bg-primary/5 border-l-2 border-l-primary",
      )}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <span
          className={cn(
            "text-sm truncate transition-colors",
            isWildcard
              ? "font-semibold text-foreground"
              : isSelected
                ? "font-medium text-foreground"
                : "font-normal text-muted-foreground",
          )}
        >
          {displayText}
        </span>
      </div>
      <div
        className={cn(
          "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
          isSelected
            ? "bg-primary border-primary"
            : "bg-background border-border/60",
          isWildcard && isSelected && "ring-2 ring-primary/20",
        )}
      >
        {isSelected && (
          <svg
            className="w-2.5 h-2.5 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            role="img"
            aria-label="Seleccionado"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </button>
  );
};
