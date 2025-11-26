"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ComboBoxItemType<V> = {
  value: string;
  label: string;
  entity?: V;
};

/**
 * GenericSearch - Componente genérico para búsqueda y selección
 *
 * Soporta tanto datos estáticos como búsqueda remota:
 *
 * @example
 * // Búsqueda estática (solo datos locales)
 * <GenericSearch
 *   allItems={staticData}
 *   itemToOption={(item) => ({ value: item.id, label: item.name })}
 *   onItemSelect={handleSelect}
 *   placeholder="Seleccionar..."
 * />
 *
 * @example
 * // Búsqueda remota (datos del servidor)
 * <GenericSearch
 *   queryState={queryState}
 *   allItems={remoteData}
 *   fetchNextPage={fetchMore}
 *   onSearchChange={handleSearch}
 *   onItemSelect={handleSelect}
 *   itemToOption={(item) => ({ value: item.id, label: item.name })}
 *   placeholder="Buscar..."
 * />
 */

interface GenericSearchProps<T> {
  // Propiedades para la búsqueda
  queryState?: any; // Estado de la consulta (opcional para datos estáticos)
  allItems: T[]; // Datos disponibles
  fetchNextPage?: () => void; // Función para cargar más datos (opcional)

  // Manejadores
  onSearchChange?: (value: string) => void; // Opcional para datos estáticos
  onItemSelect: (value: Option<T>) => void;

  // Renderizado
  itemToOption: (item: T) => ComboBoxItemType<T>; // Función para convertir items a opciones

  // Props de apariencia
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;

  // Acción cuando no se encuentra resultados
  notFoundAction?: React.ReactNode;

  // Configuración adicional
  debounceMs?: number;
  regexInput?: RegExp;
  className?: string;

  // Valor controlado desde fuera
  value?: Option<T>;
  disabled?: boolean;

  // Acciones auxiliares
  onClear?: () => void;
  noLabel?: boolean;
}

export default function GenericSearch<T>({
  queryState,
  allItems,
  fetchNextPage,
  onSearchChange,
  onItemSelect,
  itemToOption,
  label = "Buscar",
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados",
  notFoundAction,
  debounceMs = 400,
  regexInput,
  className,
  value,
  disabled,
  onClear,
  noLabel,
}: GenericSearchProps<T>) {
  const [selectedItem, setSelectedItem] = useState<Option<T> | undefined>(
    value,
  );

  // Sincronizar con el prop value cuando cambie externamente
  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

  // Convertir items a opciones para el AutoComplete
  const options: ComboBoxItemType<T>[] = useMemo(() => {
    return allItems.map((item) => itemToOption(item)) || [];
  }, [allItems, itemToOption]);

  const handleItemSelect = useCallback(
    (selectedValue: Option<T>) => {
      setSelectedItem(selectedValue);
      if (!selectedValue || !selectedValue.value) {
        // Si se hace clear, llamar onClear si existe
        onClear?.();
      }
      // Siempre llamar onItemSelect para que el formulario se actualice
      onItemSelect(selectedValue);
    },
    [onItemSelect, onClear],
  );

  const handleSearchChange = useCallback(
    (searchValue: string) => {
      if (
        onSearchChange &&
        searchValue !== "None" &&
        searchValue !== null &&
        searchValue !== undefined
      ) {
        onSearchChange(searchValue.trim());
      }
    },
    [onSearchChange],
  );

  const handleScrollEnd = useCallback(() => {
    if (fetchNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage]);

  return (
    <div className="space-y-2">
      {!noLabel && (
        <Label htmlFor="generic-search" className="text-sm font-medium">
          {label}
        </Label>
      )}

      <AutoComplete<T>
        disabled={disabled}
        {...(queryState && { queryState })}
        options={options}
        value={selectedItem}
        onValueChange={handleItemSelect}
        {...(onSearchChange && { onSearchChange: handleSearchChange })}
        {...(fetchNextPage && { onScrollEnd: handleScrollEnd })}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        {...(notFoundAction && { notFoundAction })}
        {...(debounceMs && { debounceMs })}
        {...(regexInput && { regexInput })}
        className={cn("w-full", className)}
        clearable={Boolean(onClear)}
        variant="outline"
      />
    </div>
  );
}
