import { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordView from "./_components/ResetPasswordView";

export const metadata: Metadata = {
  title: "Restablecer contraseña",
  description: "Restablece tu contraseña de Work Wear",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordView />
    </Suspense>
  );
}
