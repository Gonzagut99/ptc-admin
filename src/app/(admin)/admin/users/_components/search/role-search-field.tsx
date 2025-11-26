"use client";

import { Plus } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import GenericSearch, {
  ComboBoxItemType,
} from "@/components/ui/generic-search";
import { Label } from "@/components/ui/label";
import { useDialogStore } from "@/hooks/use-dialog-store";
import { MODULE_ROLES_AND_PERMISSIONS } from "../../../roles/_components/overlays/roles-dialogs";
import { useRolesSearch } from "../../../roles/_hooks/roles-hooks";
import { RoleDetailResponse } from "../../../roles/_types/roles.types";

interface RoleSearchFieldProps {
  value?: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export default function RoleSearchField({
  value,
  onChange,
  label = "Roles",
  placeholder = "Buscar roles...",
  searchPlaceholder = "Escribir nombre del rol...",
  emptyMessage = "No se encontraron roles",
  multiple = false,
  disabled = false,
}: RoleSearchFieldProps) {
  const {
    allItems: allRoles,
    handleScrollEnd,
    handleSearchChange,
    isLoading: rolesLoading,
    isError: rolesError,
  } = useRolesSearch();

  // Memoizar el estado de la consulta para evitar re-renders
  const queryState = useMemo(
    () => ({
      isLoading: rolesLoading,
      isError: rolesError,
      error: rolesError ? new Error("Error al cargar roles") : null,
    }),
    [rolesLoading, rolesError],
  );

  // Memoizar la función de transformación
  const roleToOption = useCallback(
    (role: RoleDetailResponse): ComboBoxItemType<RoleDetailResponse> => {
      return {
        value: role.id,
        label: role.name,
        entity: role,
      };
    },
    [],
  );

  // Normalizar el valor para manejo consistente - siempre arreglo
  const normalizedValue = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // Obtener roles seleccionados para mostrar
  const selectedRoles = useMemo(() => {
    return allRoles.filter((role) => normalizedValue.includes(role.id));
  }, [allRoles, normalizedValue]);

  // Convertir el valor a la forma que espera GenericSearch
  const selectedOption = useMemo(() => {
    if (!selectedRoles.length) return undefined;

    if (multiple) {
      // En modo múltiple, mostrar todos los roles seleccionados como texto
      const roleNames = selectedRoles.map((role) => role.name).join(", ");
      return {
        value: normalizedValue.join(","),
        label: roleNames,
        entity: selectedRoles[0], // Usar el primer rol como entidad principal
      };
    } else {
      // En modo simple, mostrar solo el primer rol
      const selectedRole = selectedRoles[0];
      return {
        value: selectedRole.id,
        label: selectedRole.name,
        entity: selectedRole,
      };
    }
  }, [selectedRoles, multiple, normalizedValue]);

  // Filtrar roles disponibles
  const availableRoles = useMemo(() => {
    // En modo múltiple, mostrar todos los roles para permitir quitar los ya seleccionados
    // En modo simple, mostrar todos los roles
    return allRoles;
  }, [allRoles]);

  // Handler para limpiar todos los roles
  const handleClearRoles = useCallback(() => {
    onChange([]);
  }, [onChange]);

  // Determinar si mostrar botón de limpiar
  const showClearButton = useMemo(() => {
    return normalizedValue.length > 0;
  }, [normalizedValue]);

  // Handler mejorado para selección de rol con mejor manejo de clear
  const handleRoleSelectImproved = useCallback(
    (option: ComboBoxItemType<RoleDetailResponse> | undefined) => {
      if (!option || !option.value) {
        // Si se hace clear (option es undefined o sin value)
        handleClearRoles();
        return;
      }

      if (multiple) {
        // Modo múltiple: agregar o quitar del arreglo
        const isAlreadySelected = normalizedValue.includes(option.value);
        if (isAlreadySelected) {
          // Si ya está seleccionado, quitarlo
          const newRoles = normalizedValue.filter((id) => id !== option.value);
          onChange(newRoles);
        } else {
          // Si no está seleccionado, agregarlo
          const newRoles = [...normalizedValue, option.value];
          onChange(newRoles);
        }
      } else {
        // Modo simple: reemplazar con arreglo de un elemento
        onChange([option.value]);
      }
    },
    [normalizedValue, onChange, multiple, handleClearRoles],
  );

  const { openChild } = useDialogStore();
  const notFoundAction = useCallback(() => {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => openChild(MODULE_ROLES_AND_PERMISSIONS, "create")}
        type="button"
      >
        <Plus className="size-4" />
        Crear rol
      </Button>
    );
  }, [openChild]);

  return (
    <div className="space-y-2">
      {label && (
        <Label
          required
          htmlFor="role-search-field"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </Label>
      )}

      {/* Buscador de roles */}
      <GenericSearch<RoleDetailResponse>
        queryState={queryState}
        allItems={availableRoles}
        fetchNextPage={handleScrollEnd}
        onSearchChange={handleSearchChange}
        onItemSelect={handleRoleSelectImproved}
        itemToOption={roleToOption}
        label=""
        placeholder={multiple ? placeholder : "Seleccionar rol..."}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        notFoundAction={notFoundAction()}
        noLabel
        value={selectedOption}
        onClear={showClearButton ? handleClearRoles : undefined}
        disabled={disabled}
      />
    </div>
  );
}
