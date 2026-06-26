import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SkipLink } from "@/components/layout/SkipLink";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "Bio Call | Manuel Solis",
  description: "Captura de datos del cliente para la Bio Call - Oficina Manuel Solis.",
  icons: {
    icon: "/LOGOTIPO_MANUEL_SOLIS_02.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#143457",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <SkipLink />
          <AppHeader />
          {children}
          <AppFooter />
        </Providers>
      </body>
    </html>
  );
}
