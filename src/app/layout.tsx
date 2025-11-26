import "@fontsource-variable/outfit";
import "@fontsource-variable/geist-mono";
import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "../contexts/auth-provider";
import { QueryProvider } from "../contexts/query-provider";

export const metadata: Metadata = {
  title: "Work Wear Industrial",
  description: "Sistema de gestión de Work Wear Industrial",
};

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <QueryProvider>
            <NextTopLoader color="var(--primary)" showSpinner={false} />
            {children}
          </QueryProvider>
        </AuthProvider>
        <Toaster
          closeButton
          expand={false}
          richColors
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
