"use client";

import { useState } from "react";
import { APP_NAME, ORG_NAME } from "@biocall/shared";

const REMOTE_LOGO = "https://bos.manuelsolis.com/images/logo.png";
const FALLBACK_LOGO = "/LOGOTIPO_MANUEL_SOLIS_02.png";

/**
 * Header fijo con degradado nova-horizon. Muestra el logotipo de la oficina
 * y el titulo del producto. Si el logo remoto falla, cae al icono local.
 */
export function AppHeader() {
  const [logoSrc, setLogoSrc] = useState(REMOTE_LOGO);

  return (
    <header className="app-header">
      <div className="max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            onError={() => setLogoSrc(FALLBACK_LOGO)}
            alt=""
            className="h-9 w-auto object-contain"
          />
          <div className="leading-tight">
            <p className="font-heading text-base font-bold text-nova-snow">
              {APP_NAME}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-nova-snow/70">
              {ORG_NAME}
            </p>
          </div>
        </div>

        <p className="hidden text-sm text-nova-snow/80 md:block">
          Captura de datos del cliente
        </p>
      </div>
    </header>
  );
}
