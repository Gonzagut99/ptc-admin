import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { User } from "../_types/auth.types";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: User) => {
      return await authClient.updateUser(data);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas con la sesión
      queryClient.invalidateQueries({ queryKey: ["session"] });

      // Invalidar queries de auth en general
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/auth") ?? false,
      });

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

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { newEmail: string }) => {
      return await authClient.changeEmail(data);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas con la sesión
      queryClient.invalidateQueries({ queryKey: ["session"] });

      // Invalidar queries de auth en general
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/auth") ?? false,
      });

      toast.success("Perfil actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar el perfil", {
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

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      newPassword: string;
      currentPassword: string;
      revokeOtherSessions: boolean;
    }) => {
      const response = await authClient.changePassword(data);
      if (data.revokeOtherSessions) {
        await authClient.revokeOtherSessions();
      }
      return response;
    },
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({
        queryKey: ["get"],
        exact: false,
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/api/auth") ?? false,
      });
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
