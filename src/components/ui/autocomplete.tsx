import {
  // InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
  UseSuspenseInfiniteQueryResult,
} from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export type Option<T> = {
  value: string;
  label: string;
  entity?: T;
  component?: React.ReactNode;
};

type AutoCompleteProps<T> = {
  // Props básicas (compatibilidad con versión anterior)
  options?: Option<T>[];
  emptyMessage?: string;
  value?: Option<T>;
  onValueChange?: (value: Option<T>) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onPreventSelection?: (value: Option<T>) => boolean;

  // Props para búsqueda remota (nuevas)
  queryState?:
    | UseQueryResult<T[], any>
    | UseInfiniteQueryResult<any, any>
    | UseSuspenseInfiniteQueryResult<any, any>;
  onSearchChange?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  debounceMs?: number;
  regexInput?: RegExp;
  total?: number;
  notFoundAction?: React.ReactNode;

  // Props de scroll infinito
  onScrollEnd?: () => void;

  // Props de UI mejoradas
  className?: string;
  commandContentClassName?: string;
  commandInputClassName?: string;
  variant?: "default" | "outline";
  clearable?: boolean;
};

export function AutoComplete<T = unknown>({
  // Props básicas
  options = [],
  placeholder = "Buscar...",
  emptyMessage = "No se encontraron resultados",
  value,
  onValueChange,
  disabled = false,
  isLoading: externalLoading = false,
  onPreventSelection,

  // Props de búsqueda remota
  queryState,
  onSearchChange,
  searchPlaceholder,
  debounceMs = 300,
  regexInput,
  total,
  notFoundAction,

  // Props de scroll
  onScrollEnd,

  // Props de UI
  className,
  commandContentClassName,
  commandInputClassName,
  variant = "default",
  clearable = false,
}: AutoCompleteProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { error: fieldError } = useFormField();

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option<T> | undefined>(value);
  const [inputValue, setInputValue] = useState<string>(value?.label || "");

  // Determinar si usamos búsqueda remota o local
  const isRemoteSearch = Boolean(
    queryState && onSearchChange && typeof onSearchChange === "function",
  );

  // Estados de la query remota
  const remoteLoading = queryState?.isLoading;
  const isError = queryState?.isError;
  const error = queryState?.error;
  const refetch = queryState?.refetch;

  // Determinar estado de loading
  const isLoading = isRemoteSearch ? remoteLoading : externalLoading;

  // Determinar opciones a usar
  const currentOptions = useMemo(() => {
    if (isRemoteSearch) {
      // Para búsqueda remota, usar las opciones que vienen del servidor
      // Si hay datos remotos, usarlos; si no, usar las opciones locales como fallback
      return options.length > 0 ? options : [];
    } else {
      // Para búsqueda local, usar siempre las opciones estáticas
      return options;
    }
  }, [isRemoteSearch, options]);

  // Mensajes memoizados
  const messages = useMemo(
    () => ({
      loading: "Cargando...",
      error: "Error al cargar los datos",
      empty: emptyMessage,
      noResults: "Sin resultados",
    }),
    [emptyMessage],
  );

  // Callback con debounce para búsqueda remota
  const debouncedSearch = useDebouncedCallback((term: string) => {
    if (!isRemoteSearch) return;

    if (regexInput) {
      if (regexInput.test(term) || term === "") {
        onSearchChange?.(term);
      }
    } else {
      onSearchChange?.(term);
    }
  }, debounceMs);

  // Función para limpiar completamente
  const clearAll = useCallback(() => {
    setSelected(undefined);
    setInputValue("");
    onValueChange?.(undefined as any);

    if (isRemoteSearch) {
      onSearchChange?.("");
    }
  }, [onValueChange, isRemoteSearch, onSearchChange]);

  const handleClear = useCallback(() => {
    clearAll();
  }, [clearAll]);

  // Sincronizar con el prop value cuando cambie externamente
  useEffect(() => {
    setSelected(value);
    setInputValue(value?.label || "");
    if (!value) {
      // Si se limpia externamente, también limpiar búsqueda remota
      if (isRemoteSearch) {
        onSearchChange?.("");
      }
    }
  }, [value, isRemoteSearch, onSearchChange]);

  // Manejo de cambios en el input
  const handleInputChange = useCallback(
    (newValue: string) => {
      setInputValue(newValue);

      // Si estamos buscando y hay algo seleccionado, deseleccionar
      if (selected && newValue !== selected.label) {
        setSelected(undefined);
        // No llamar onValueChange con undefined, solo limpiar internamente
      }

      if (isRemoteSearch) {
        // Para búsqueda remota, usar debounce
        debouncedSearch(newValue);
      }
      // Para búsqueda local, no hacer nada - el filtrado se hace automáticamente
    },

    [isRemoteSearch, debouncedSearch, selected],
  );

  const handleSelectOption = useCallback(
    (selectedOption: Option<T>) => {
      onValueChange?.(selectedOption);
      if (onPreventSelection && onPreventSelection(selectedOption)) {
        return; // Si la selección está bloqueada, no hacer nada mas
      }
      setInputValue(selectedOption.label);
      setSelected(selectedOption);
      //onValueChange?.(selectedOption);
      setOpen(false);
    },
    [onPreventSelection, onValueChange],
  );

  const handleFocus = useCallback(() => {
    setOpen(true);
    // Al hacer focus, si hay algo seleccionado, limpiar para buscar
    if (selected) {
      setInputValue("");
      if (isRemoteSearch) {
        // Para búsqueda remota, limpiar la búsqueda
        debouncedSearch("");
      }
      // Para búsqueda local, no hacer nada - las opciones se muestran automáticamente
    }
  }, [selected, isRemoteSearch, debouncedSearch]);

  const handleBlur = useCallback(() => {
    // Delay para permitir clicks en opciones
    setTimeout(() => {
      setOpen(false);

      // Si hay algo seleccionado, mantener el label; si no, limpiar
      if (selected) {
        setInputValue(selected.label);
      } else {
        setInputValue("");
      }

      // Limpiar búsqueda al cerrar solo si no hay nada seleccionado (solo para búsqueda remota)
      if (isRemoteSearch && !selected) {
        debouncedSearch("");
      }
      // Para búsqueda local, no hacer nada - no hay búsqueda que limpiar
    }, 200);
  }, [selected, isRemoteSearch, debouncedSearch]);

  // Calcular opciones adicionales disponibles
  const moreOptions = useMemo(() => {
    return total ? Math.max(0, total - currentOptions.length) : 0;
  }, [total, currentOptions.length]);

  // Renderizar el trigger/input
  const renderTrigger = () => {
    if (selected && selected.value && !isOpen) {
      // Mostrar información del item seleccionado
      return (
        <div className="relative">
          <div
            className={cn(
              "flex items-center justify-between w-full px-3 py-1.5 text-sm bg-input cursor-pointer hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              clearable && selected && selected.value, // Espacio para el botón clear
              disabled && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => !disabled && setOpen(true)}
          >
            <div className="flex-1 min-w-0 overflow-hidden">
              {selected.component ? (
                <div className="truncate w-full">{selected.component}</div>
              ) : (
                <span
                  className="block truncate w-full"
                  title={selected.label}
                  style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selected.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {clearable && selected && selected.value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </div>
        </div>
      );
    }

    // Input normal para búsqueda usando CommandInput
    return (
      <CommandInput
        ref={inputRef}
        value={inputValue}
        onValueChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={searchPlaceholder || placeholder}
        disabled={disabled}
        className={cn("h-10", commandInputClassName)}
        autocompleteMode
      />
    );
  };

  const variantClass = {
    outline: "border border-input rounded-md shadow-xs h-fit",
    default: "",
  };

  return (
    <div
      className={cn(
        "relative",
        className,
        variantClass[variant],
        fieldError &&
          "border-destructive ring-destructive focus-visible:ring-destructive/40 focus-visible:border-destructive",
      )}
    >
      <Command
        shouldFilter={true}
        filter={(value, search) => {
          // Buscar en el label en lugar del value
          const item = currentOptions.find((option) => option.value === value);
          if (item) {
            return item.label.toLowerCase().includes(search.toLowerCase())
              ? 1
              : 0;
          }
          return 0;
        }}
      >
        {renderTrigger()}

        {isOpen && (
          <div
            className={cn(
              "absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95 duration-200",
              commandContentClassName,
            )}
          >
            <CommandList
              className="max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent bg-popover "
              onScroll={(e) => {
                const el = e.currentTarget;
                const atBottom =
                  el.scrollTop + el.clientHeight >= el.scrollHeight - 4; // tolerancia

                if (atBottom) {
                  onScrollEnd?.();
                }
              }}
            >
              {/* Estado de carga */}
              {isLoading && (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-5 w-5 animate-spin mr-3 text-primary" />
                  <span className="text-sm text-muted-foreground font-medium">
                    {messages.loading}
                  </span>
                </div>
              )}

              {/* Estado de error */}
              {isError && error && (
                <div className="flex flex-col items-center justify-center p-6 space-y-3">
                  <div className="rounded-full bg-destructive/10 p-3">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                      {messages.error}
                    </p>
                    {refetch && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        className="mt-3"
                      >
                        Reintentar
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Lista de opciones */}
              {!isLoading && !isError && currentOptions.length > 0 && (
                <CommandGroup>
                  {currentOptions.map((option) => {
                    const isSelected = selected?.value === option.value;
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => handleSelectOption(option)}
                        className={cn(
                          "flex w-full items-center gap-3 cursor-pointer p-2 rounded-md transition-colors duration-150",
                          !isSelected
                            ? "hover:bg-accent hover:text-accent-foreground"
                            : "bg-accent text-accent-foreground",
                          isSelected && "pl-8",
                        )}
                      >
                        {option.component ? option.component : option.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 text-emerald-600 shrink-0 transition-opacity duration-150",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {/* Sin resultados */}
              {!isLoading && !isError && currentOptions.length === 0 && (
                <CommandEmpty>
                  <div className="p-6 text-center">
                    <div className="rounded-full bg-muted/50 p-3 w-fit mx-auto mb-3">
                      <Search className="h-6 w-6 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mb-3">
                      {messages.noResults}
                    </p>
                    {notFoundAction}
                  </div>
                </CommandEmpty>
              )}

              {/* Indicador de opciones adicionales */}
              {moreOptions > 0 && (
                <div className="px-4 py-3 text-xs text-muted-foreground border-t border-border bg-muted/30 font-medium">
                  +{moreOptions} opciones adicionales disponibles
                </div>
              )}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
