"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { FieldError, fieldInputClass } from "@/components/ui/FieldError";
import { SectionErrorBanner } from "@/components/ui/SectionErrorBanner";
import { getFieldError } from "@/lib/formErrors";

const PREFIX = "documents";

interface DocumentsData {
  tienePasaporte: string;
  pasaportePendiente: string;
  numeroPasaporte: string;
  paisEmision: string;
  fechaEmision: string;
  fechaExpiracion: string;
  tieneANumber: string;
  aNumberValue: string;
  aNumberOrigen: string;
  tieneSSN: string;
  ssnValue: string;
  tieneEAD: string;
  eadValue: string;
}

interface DocumentsSectionProps {
  data: DocumentsData;
  errors?: Record<string, string>;
  onChange: (fields: Partial<DocumentsData>) => void;
}

export function DocumentsSection({ data, errors, onChange }: DocumentsSectionProps) {
  const err = (field: keyof DocumentsData) => getFieldError(errors, `${PREFIX}.${field}`);
  const handleChange = (field: keyof DocumentsData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionErrorBanner errors={errors} prefix={PREFIX} />
      {/* 1. Pasaporte */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="tienePasaporte" className="label-caps">
              ¿Cuenta con Pasaporte?
            </label>
            <select
              id="tienePasaporte"
              className="input-glass"
              value={data.tienePasaporte}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({
                    tienePasaporte: val,
                    pasaportePendiente: "no",
                    numeroPasaporte: "",
                    paisEmision: "",
                    fechaEmision: "",
                    fechaExpiracion: "",
                  });
                } else {
                  onChange({ tienePasaporte: val });
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          {data.tienePasaporte === "si" && (
            <div className="flex items-center gap-2 pt-8">
              <input
                id="pasaportePendiente"
                type="checkbox"
                className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                checked={data.pasaportePendiente === "si"}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    onChange({
                      pasaportePendiente: "si",
                      numeroPasaporte: "PENDIENTE",
                      paisEmision: "PENDIENTE",
                      fechaEmision: "",
                      fechaExpiracion: "",
                    });
                  } else {
                    onChange({
                      pasaportePendiente: "no",
                      numeroPasaporte: "",
                      paisEmision: "",
                      fechaEmision: "",
                      fechaExpiracion: "",
                    });
                  }
                }}
              />
              <label htmlFor="pasaportePendiente" className="text-sm font-medium text-brand-700">
                Pasaporte pendiente / en trámite
              </label>
            </div>
          )}
        </div>

        {data.tienePasaporte === "si" && data.pasaportePendiente !== "si" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              <label htmlFor="numeroPasaporte" className="label-caps">
                Número de Pasaporte
              </label>
              <input
                id="numeroPasaporte"
                type="text"
                className={fieldInputClass(!!err("numeroPasaporte"))}
                aria-invalid={!!err("numeroPasaporte")}
                placeholder="Ej. G27123695"
                value={data.numeroPasaporte}
                onChange={(e) => handleChange("numeroPasaporte", e.target.value)}
              />
              <FieldError message={err("numeroPasaporte")} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="paisEmision" className="label-caps">
                País de emisión
              </label>
              <input
                id="paisEmision"
                type="text"
                className="input-glass"
                placeholder="Ej. México"
                value={data.paisEmision}
                onChange={(e) => handleChange("paisEmision", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="fechaEmision" className="label-caps">
                Fecha de emisión
              </label>
              <input
                id="fechaEmision"
                type="date"
                className="input-glass"
                value={data.fechaEmision}
                onChange={(e) => handleChange("fechaEmision", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="fechaExpiracion" className="label-caps">
                Fecha de expiración
              </label>
              <input
                id="fechaExpiracion"
                type="date"
                className="input-glass"
                value={data.fechaExpiracion}
                onChange={(e) => handleChange("fechaExpiracion", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Alien Registration Number (A-Number) */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <label htmlFor="tieneANumber" className="label-caps">
                ¿Cuenta con Alien Registration Number (A-Number)?
              </label>
              <Tooltip content="Número único de 9 dígitos asignado por Inmigración (USCIS/ICE) que inicia con la letra A. Aparece en permisos de trabajo, notificaciones u órdenes de corte.">
                <span className="inline-flex items-center text-brand-500 hover:text-brand-700 cursor-help">
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </Tooltip>
            </div>
            <select
              id="tieneANumber"
              className="input-glass"
              value={data.tieneANumber}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({ tieneANumber: val, aNumberValue: "", aNumberOrigen: "" });
                } else {
                  onChange({ tieneANumber: val });
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
              <option value="no_sabe">No sabe</option>
            </select>
          </div>
        </div>

        {data.tieneANumber === "si" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              <label htmlFor="aNumberValue" className="label-caps">
                A-Number (9 dígitos)
              </label>
              <input
                id="aNumberValue"
                type="text"
                className={fieldInputClass(!!err("aNumberValue"))}
                aria-invalid={!!err("aNumberValue")}
                placeholder="Ej. 123-456-789"
                value={data.aNumberValue}
                onChange={(e) => handleChange("aNumberValue", e.target.value)}
              />
              <FieldError message={err("aNumberValue")} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="aNumberOrigen" className="label-caps">
                ¿Dónde lo obtuvo? (EAD, Notificación USCIS, Orden de corte, etc.)
              </label>
              <input
                id="aNumberOrigen"
                type="text"
                className="input-glass"
                placeholder="Ej. Notificación de USCIS"
                value={data.aNumberOrigen}
                onChange={(e) => handleChange("aNumberOrigen", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. SSN (Social Security Number) */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <label htmlFor="tieneSSN" className="label-caps">
                ¿Cuenta con Seguro Social (SSN)?
              </label>
              <Tooltip content="Número de 9 dígitos emitido por la Administración del Seguro Social de EE. UU. (Social Security Administration).">
                <span className="inline-flex items-center text-brand-500 hover:text-brand-700 cursor-help">
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </Tooltip>
            </div>
            <select
              id="tieneSSN"
              className="input-glass"
              value={data.tieneSSN}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({ tieneSSN: val, ssnValue: "" });
                } else {
                  onChange({ tieneSSN: val });
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          {data.tieneSSN === "si" && (
            <div className="flex flex-col gap-2 animate-fade-in">
              <label htmlFor="ssnValue" className="label-caps">
                Número de Seguro Social
              </label>
              <input
                id="ssnValue"
                type="text"
                className={fieldInputClass(!!err("ssnValue"))}
                aria-invalid={!!err("ssnValue")}
                placeholder="Ej. 000-00-0000"
                value={data.ssnValue}
                onChange={(e) => handleChange("ssnValue", e.target.value)}
              />
              <FieldError message={err("ssnValue")} />
            </div>
          )}
        </div>
      </div>

      {/* 4. EAD (Employment Authorization Document) */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <label htmlFor="tieneEAD" className="label-caps">
                ¿Cuenta con Permiso de Trabajo (EAD)?
              </label>
              <Tooltip content="Documento de Autorización de Empleo (Employment Authorization Document), comúnmente conocido como tarjeta de permiso de trabajo de USCIS.">
                <span className="inline-flex items-center text-brand-500 hover:text-brand-700 cursor-help">
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </Tooltip>
            </div>
            <select
              id="tieneEAD"
              className="input-glass"
              value={data.tieneEAD}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({ tieneEAD: val, eadValue: "" });
                } else {
                  onChange({ tieneEAD: val });
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          {data.tieneEAD === "si" && (
            <div className="flex flex-col gap-2 animate-fade-in">
              <label htmlFor="eadValue" className="label-caps">
                Número de EAD
              </label>
              <input
                id="eadValue"
                type="text"
                className={fieldInputClass(!!err("eadValue"))}
                aria-invalid={!!err("eadValue")}
                placeholder="Ej. SRC1234567890"
                value={data.eadValue}
                onChange={(e) => handleChange("eadValue", e.target.value)}
              />
              <FieldError message={err("eadValue")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
