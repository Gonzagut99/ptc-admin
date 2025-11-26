"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthToastErrorMessage } from "@/components/errors/error-for-toast";
import { backend } from "@/lib/api/types/backend";

/**
 * Hook para resetear la contraseña
 * Usa el token recibido por email para establecer una nueva contraseña
 */
export const useResetPassword = () => {
  const router = useRouter();

  return backend.useMutation("post", "/api/auth/reset-password", {
    onSuccess: () => {
      toast.success("Contraseña restablecida correctamente");
      // Redirigir al login después de un breve delay
      setTimeout(() => {
        router.push("/auth/log-in");
      }, 2000);
    },
    onError: (error) => {
      toast.error(<AuthToastErrorMessage error={error} />);
    },
  });
};
