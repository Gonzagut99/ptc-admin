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
import LogInForm from "./LogInForm";
export const metadata: Metadata = {
  title: "Ingresar",
  description: "Ingresar al sistema de Work Wear",
};

const CONTACT_EMAIL = "info@workwear.com";
export default function LogInView() {
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
                Hola! bienvenidos
              </CardTitle>
              <CardDescription className="text-center text-[15px] font-normal">
                Bienvenidos a su plataforma. Todo empieza ahora.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogInForm />
            </CardContent>
            <Separator />
            <CardFooter>
              <div className="flex items-center justify-center space-x-1 w-full text-sm text-stone-600">
                <p>¿Necesitas ayuda?</p>
                <Link
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-stone-900 hover:underline font-semibold"
                >
                  Contáctanos
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
