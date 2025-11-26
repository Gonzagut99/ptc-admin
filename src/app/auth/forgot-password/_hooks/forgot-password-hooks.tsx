"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

/**
 * Hook para solicitar el reset de contraseña
 * Envía un email con el link para resetear la contraseña
 */
export const useRequestPasswordReset = () => {
  const router = useRouter();

  return backend.useMutation("post", "/api/auth/request-password-reset", {
    onSuccess: () => {
      toast.success(
        "Si el email existe, recibirás un enlace para restablecer tu contraseña.",
      );
      // Redirigir al login después de un breve delay
      setTimeout(() => {
        router.push("/auth/log-in");
      }, 2000);
    },
    onError: () => {
      // No mostrar el error específico por seguridad (no revelar si el email existe)
      toast.error(
        "Si el email existe, recibirás un enlace para restablecer tu contraseña.",
      );
    },
  });
};
