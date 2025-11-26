import { Metadata } from "next";
import Link from "next/link";
import Logo from "@/assets/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "Recupera tu contraseña de Work Wear",
};

export default function ForgotPasswordView() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-[40%_60%] p-0 bg-card">
      <div className="grid grid-rows-[auto_1fr_auto] h-full p-6">
        <div className="relative z-20 flex text-lg font-medium items-start w-full pt-6 px-6 pb-0">
          <Logo height={45} width={332} />
        </div>
        <div className="w-full max-w-md flex items-center justify-center mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center font-bold text-[38px]">
                ¿Olvidaste tu contraseña?
              </CardTitle>
              <CardDescription className="text-center text-[15px] font-normal">
                No te preocupes, te enviaremos un enlace para restablecerla.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm />
            </CardContent>
            <Separator />
            <CardFooter>
              <div className="flex items-center space-x-2 w-full justify-center text-sm">
                <p>¿Recordaste tu contraseña?</p>
                <Link
                  href="/auth/log-in"
                  className="text-stone-900 hover:underline font-semibold"
                >
                  Iniciar sesión
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="text-start text-sm font-normal px-6 pb-5">
          <p className="text-[16px] text-[#62748E]">
            © {new Date().getFullYear()} Work Wear Industrial E.I.R.L. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
      <div className="relative hidden h-full w-full flex-col lg:flex overflow-hidden">
        <img
          src="/assets/log-in-bg-work-wear.webp"
          alt="auth-bg"
          className="h-full w-full object-cover brightness-85"
        />
      </div>
    </div>
  );
}
