import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { User } from "../_types/auth.types";

/**
 * Hook para actualizar el perfil del usuario
 * TODO: Implementar cuando el backend tenga endpoint de actualización de perfil
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (_data: User) => {
      // TODO: Implementar cuando el backend tenga el endpoint
      throw new Error("Actualización de perfil no implementada aún en el backend");
    },
    onSuccess: () => {
      // Invalidar queries relacionadas con la sesión
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });

      toast.success("Perfil actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar el perfil", {
        description: error.message || "Ha ocurrido un error inesperado",
      });
    },
  });

  return {
    updateProfile: mutation.mutate,
    updateProfileAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

/**
 * Hook para actualizar el email del usuario
 * TODO: Implementar cuando el backend tenga endpoint de cambio de email
 */
export const useUpdateEmail = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (_data: { newEmail: string }) => {
      // TODO: Implementar cuando el backend tenga el endpoint
      throw new Error("Cambio de email no implementado aún en el backend");
    },
    onSuccess: () => {
      // Invalidar queries relacionadas con la sesión
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });

      toast.success("Email actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar el email", {
        description: error.message || "Ha ocurrido un error inesperado",
      });
    },
  });

  return {
    updateEmail: mutation.mutate,
    updateEmailAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

/**
 * Hook para actualizar la contraseña del usuario
 * TODO: Implementar cuando el backend tenga endpoint de cambio de contraseña
 */
export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (_data: {
      newPassword: string;
      currentPassword: string;
      revokeOtherSessions: boolean;
    }) => {
      // TODO: Implementar cuando el backend tenga el endpoint
      throw new Error("Cambio de contraseña no implementado aún en el backend");
    },
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar la contraseña", {
        description: error.message || "Ha ocurrido un error inesperado",
      });
    },
  });

  return {
    updatePassword: mutation.mutate,
    updatePasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
