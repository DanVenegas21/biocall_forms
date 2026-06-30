"use client";

import React from "react";

import { Plus, Trash2 } from "lucide-react";

export interface HijoData {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  lugarResidencia: string;
}

export interface MatrimonioPrevioData {
  nombresExConyuge: string;
  apellidoPaternoExConyuge: string;
  apellidoMaternoExConyuge: string;
  fechaLugarMatrimonio: string;
  fechaLugarNacimiento: string;
  fechaLugarDivorcio: string;
}

interface FamilyData {
  tieneConyuge: string;
  nombresConyuge: string;
  apellidoPaternoConyuge: string;
  apellidoMaternoConyuge: string;
  fechaLugarMatrimonioConyuge: string;
  fechaLugarNacimientoConyuge: string;
  nombresPadre: string;
  apellidoPaternoPadre: string;
  apellidoMaternoPadre: string;
  nombresMadre: string;
  apellidoPaternoMadre: string;
  apellidoMaternoMadre: string;
  casado: string;
  previamenteCasado: string;
  matrimoniosPrevios: MatrimonioPrevioData[];
  tieneHijos: string;
  hijos: HijoData[];
}

interface FamilySectionProps {
  data: FamilyData;
  onChange: (fields: Partial<FamilyData>) => void;
}

export function FamilySection({ data, onChange }: FamilySectionProps) {
  const handleChange = (field: keyof FamilyData, value: string) => {
    onChange({ [field]: value });
  };

  const addMatrimonioPrevio = () => {
    const current = data.matrimoniosPrevios || [];
    onChange({
      matrimoniosPrevios: [
        ...current,
        {
          nombresExConyuge: "",
          apellidoPaternoExConyuge: "",
          apellidoMaternoExConyuge: "",
          fechaLugarMatrimonio: "",
          fechaLugarNacimiento: "",
          fechaLugarDivorcio: "",
        },
      ],
    });
  };

  const removeMatrimonioPrevio = (index: number) => {
    const current = data.matrimoniosPrevios || [];
    onChange({
      matrimoniosPrevios: current.filter((_, i) => i !== index),
    });
  };

  const handleMatrimonioPrevioChange = (index: number, field: keyof MatrimonioPrevioData, value: string) => {
    const current = data.matrimoniosPrevios || [];
    const updated = current.map((mat, i) => {
      if (i === index) return { ...mat, [field]: value };
      return mat;
    });
    onChange({ matrimoniosPrevios: updated });
  };

  const addHijo = () => {
    const currentHijos = data.hijos || [];
    onChange({
      hijos: [
        ...currentHijos,
        { nombres: "", apellidoPaterno: "", apellidoMaterno: "", fechaNacimiento: "", lugarNacimiento: "", lugarResidencia: "" },
      ],
    });
  };

  const removeHijo = (index: number) => {
    const currentHijos = data.hijos || [];
    onChange({
      hijos: currentHijos.filter((_, i) => i !== index),
    });
  };

  const handleHijoChange = (index: number, field: keyof HijoData, value: string) => {
    const currentHijos = data.hijos || [];
    const newHijos = currentHijos.map((hijo, i) => {
      if (i === index) {
        return { ...hijo, [field]: value };
      }
      return hijo;
    });
    onChange({ hijos: newHijos });
  };

  return (
    <div className="space-y-6">
      {/* 1. Padres del Cliente */}
      <div className="space-y-4">
        <div className="border-b border-brand-100/50 pb-2">
          <h3 className="panel-section-title text-base font-semibold">
            1. Información de los Padres del Cliente
          </h3>
          <p className="text-xs text-brand-500/80 italic pt-0.5">
            Ingrese los datos completos de los padres biológicos o legales del cliente (solicitante principal).
          </p>
        </div>
        <div className="space-y-4">
          {/* Padre */}
          <div className="p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 space-y-3">
            <h4 className="label-caps text-brand-600 font-bold border-b border-brand-100/30 pb-1">
              Datos del Padre
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="nombresPadre" className="label-caps">
                  Nombre(s) del Padre
                </label>
                <input
                  id="nombresPadre"
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Juan Carlos"
                  value={data.nombresPadre || ""}
                  onChange={(e) => handleChange("nombresPadre", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="apellidoPaternoPadre" className="label-caps">
                  Apellido Paterno
                </label>
                <input
                  id="apellidoPaternoPadre"
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Pérez"
                  value={data.apellidoPaternoPadre || ""}
                  onChange={(e) => handleChange("apellidoPaternoPadre", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="apellidoMaternoPadre" className="label-caps">
                  Apellido Materno
                </label>
                <input
                  id="apellidoMaternoPadre"
                  type="text"
                  className="input-glass"
                  placeholder="Ej. García"
                  value={data.apellidoMaternoPadre || ""}
                  onChange={(e) => handleChange("apellidoMaternoPadre", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Madre */}
          <div className="p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 space-y-3">
            <h4 className="label-caps text-brand-600 font-bold border-b border-brand-100/30 pb-1">
              Datos de la Madre
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="nombresMadre" className="label-caps">
                  Nombre(s) de la Madre
                </label>
                <input
                  id="nombresMadre"
                  type="text"
                  className="input-glass"
                  placeholder="Ej. María"
                  value={data.nombresMadre || ""}
                  onChange={(e) => handleChange("nombresMadre", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="apellidoPaternoMadre" className="label-caps">
                  Apellido Paterno
                </label>
                <input
                  id="apellidoPaternoMadre"
                  type="text"
                  className="input-glass"
                  placeholder="Ej. López"
                  value={data.apellidoPaternoMadre || ""}
                  onChange={(e) => handleChange("apellidoPaternoMadre", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="apellidoMaternoMadre" className="label-caps">
                  Apellido Materno
                </label>
                <input
                  id="apellidoMaternoMadre"
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Martínez"
                  value={data.apellidoMaternoMadre || ""}
                  onChange={(e) => handleChange("apellidoMaternoMadre", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cónyuge y Estado Civil */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <h3 className="panel-section-title text-base font-semibold border-b border-brand-100/50 pb-2">
          2. Relación y Matrimonio
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="tieneConyuge" className="label-caps">
              ¿Tiene cónyuge?
            </label>
            <select
              id="tieneConyuge"
              className="input-glass"
              value={data.tieneConyuge}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({
                    tieneConyuge: val,
                    nombresConyuge: "",
                    apellidoPaternoConyuge: "",
                    apellidoMaternoConyuge: "",
                    fechaLugarMatrimonioConyuge: "",
                    fechaLugarNacimientoConyuge: "",
                  });
                } else {
                  onChange({ tieneConyuge: val });
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="casado" className="label-caps">
              ¿Está casado actualmente?
            </label>
            <select
              id="casado"
              className="input-glass"
              value={data.casado || ""}
              onChange={(e) => handleChange("casado", e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
            <p className="text-[11px] text-brand-500/80 italic">
              Nota: Si está separado(a) pero no divorciado(a) legalmente, seleccione "Sí".
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="previamenteCasado" className="label-caps">
              ¿Estuvo previamente casado?
            </label>
            <select
              id="previamenteCasado"
              className="input-glass"
              value={data.previamenteCasado || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({ previamenteCasado: val, matrimoniosPrevios: [] });
                } else {
                  onChange({ previamenteCasado: val });
                  if ((data.matrimoniosPrevios || []).length === 0) {
                    onChange({
                      previamenteCasado: val,
                      matrimoniosPrevios: [
                        { nombresExConyuge: "", apellidoPaternoExConyuge: "", apellidoMaternoExConyuge: "", fechaLugarMatrimonio: "", fechaLugarNacimiento: "", fechaLugarDivorcio: "" }
                      ]
                    });
                  }
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
            <p className="text-[11px] text-brand-500/80 italic">
              Nota: Incluye matrimonios finalizados por divorcio, anulación o fallecimiento.
            </p>
          </div>
        </div>

        {data.tieneConyuge === "si" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in">
            <h4 className="label-caps md:col-span-3 border-b border-brand-100/30 pb-1 mb-2">
              Datos del Cónyuge
            </h4>

            <div className="flex flex-col gap-2">
              <label htmlFor="nombresConyuge" className="label-caps">
                Nombre(s) del cónyuge
              </label>
              <input
                id="nombresConyuge"
                type="text"
                className="input-glass"
                placeholder="Ej. Ana"
                value={data.nombresConyuge}
                onChange={(e) => handleChange("nombresConyuge", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="apellidoPaternoConyuge" className="label-caps">
                Apellido Paterno
              </label>
              <input
                id="apellidoPaternoConyuge"
                type="text"
                className="input-glass"
                placeholder="Ej. López"
                value={data.apellidoPaternoConyuge}
                onChange={(e) => handleChange("apellidoPaternoConyuge", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="apellidoMaternoConyuge" className="label-caps">
                Apellido Materno
              </label>
              <input
                id="apellidoMaternoConyuge"
                type="text"
                className="input-glass"
                placeholder="Ej. Martínez"
                value={data.apellidoMaternoConyuge}
                onChange={(e) => handleChange("apellidoMaternoConyuge", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="fechaLugarMatrimonioConyuge" className="label-caps">
                Fecha y lugar de matrimonio
              </label>
              <input
                id="fechaLugarMatrimonioConyuge"
                type="text"
                className="input-glass"
                placeholder="Ej. 15 marzo 2020, Ciudad de México"
                value={data.fechaLugarMatrimonioConyuge || ""}
                onChange={(e) => handleChange("fechaLugarMatrimonioConyuge", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="fechaLugarNacimientoConyuge" className="label-caps">
                Fecha y lugar de nacimiento del cónyuge
              </label>
              <input
                id="fechaLugarNacimientoConyuge"
                type="text"
                className="input-glass"
                placeholder="Ej. 10 junio 1990, Guadalajara"
                value={data.fechaLugarNacimientoConyuge || ""}
                onChange={(e) => handleChange("fechaLugarNacimientoConyuge", e.target.value)}
              />
            </div>
          </div>
        )}

        {data.previamenteCasado === "si" && (
          <div className="space-y-4 pt-4 border-t border-brand-100/30">
            <div className="flex items-center justify-between border-b border-brand-100/30 pb-2">
              <h4 className="label-caps font-semibold text-brand-700">
                Matrimonios Previos
              </h4>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 rounded-full px-2.5 py-1 transition-colors hover:bg-brand-100/80 active:scale-[0.98]"
                onClick={addMatrimonioPrevio}
              >
                <Plus className="h-3 w-3" /> Agregar Matrimonio Previo
              </button>
            </div>

            {(data.matrimoniosPrevios || []).map((mat, idx) => (
              <div
                key={idx}
                className="relative grid grid-cols-1 gap-4 md:grid-cols-3 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in"
              >
                <button
                  type="button"
                  className="absolute top-3 right-3 text-brand-400 hover:text-red-500 transition-colors p-1"
                  aria-label={`Eliminar matrimonio previo ${idx + 1}`}
                  onClick={() => removeMatrimonioPrevio(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <h5 className="label-caps md:col-span-3 text-brand-600 font-bold border-b border-brand-100/30 pb-1 mb-1">
                  Matrimonio Previo #{idx + 1}
                </h5>

                <div className="flex flex-col gap-2">
                  <label htmlFor={`mat-${idx}-nombres`} className="label-caps">
                    Nombre(s) del ex-cónyuge
                  </label>
                  <input
                    id={`mat-${idx}-nombres`}
                    type="text"
                    className="input-glass"
                    placeholder="Ej. Pedro"
                    value={mat.nombresExConyuge}
                    onChange={(e) => handleMatrimonioPrevioChange(idx, "nombresExConyuge", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor={`mat-${idx}-paterno`} className="label-caps">
                    Apellido Paterno
                  </label>
                  <input
                    id={`mat-${idx}-paterno`}
                    type="text"
                    className="input-glass"
                    placeholder="Ej. Hernández"
                    value={mat.apellidoPaternoExConyuge}
                    onChange={(e) => handleMatrimonioPrevioChange(idx, "apellidoPaternoExConyuge", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor={`mat-${idx}-materno`} className="label-caps">
                    Apellido Materno
                  </label>
                  <input
                    id={`mat-${idx}-materno`}
                    type="text"
                    className="input-glass"
                    placeholder="Ej. Ramírez"
                    value={mat.apellidoMaternoExConyuge}
                    onChange={(e) => handleMatrimonioPrevioChange(idx, "apellidoMaternoExConyuge", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor={`mat-${idx}-nacimiento`} className="label-caps">
                    Fecha y lugar de nacimiento del ex-cónyuge
                  </label>
                  <input
                    id={`mat-${idx}-nacimiento`}
                    type="text"
                    className="input-glass"
                    placeholder="Ej. 8 agosto 1993, Monterrey"
                    value={mat.fechaLugarNacimiento}
                    onChange={(e) => handleMatrimonioPrevioChange(idx, "fechaLugarNacimiento", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor={`mat-${idx}-boda`} className="label-caps">
                    Fecha y lugar de matrimonio
                  </label>
                  <input
                    id={`mat-${idx}-boda`}
                    type="text"
                    className="input-glass"
                    placeholder="Ej. junio 2018, Ciudad de México"
                    value={mat.fechaLugarMatrimonio}
                    onChange={(e) => handleMatrimonioPrevioChange(idx, "fechaLugarMatrimonio", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor={`mat-${idx}-divorcio`} className="label-caps">
                    Fecha y lugar de divorcio / disolución / defunción
                  </label>
                  <input
                    id={`mat-${idx}-divorcio`}
                    type="text"
                    className="input-glass"
                    placeholder="Ej. mayo 2023, Guadalajara (o fecha de defunción)"
                    value={mat.fechaLugarDivorcio}
                    onChange={(e) => handleMatrimonioPrevioChange(idx, "fechaLugarDivorcio", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Hijos */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-100/50 pb-2">
          <h3 className="panel-section-title text-base font-semibold">
            3. Información de los Hijos
          </h3>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 rounded-full px-3 py-1.5 transition-colors hover:bg-brand-100/80 active:scale-[0.98]"
            onClick={addHijo}
          >
            <Plus className="h-3 w-3" /> Agregar Hijo
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="tieneHijos" className="label-caps">
              ¿Tiene hijos?
            </label>
            <select
              id="tieneHijos"
              className="input-glass max-w-md"
              value={data.tieneHijos}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({ tieneHijos: val, hijos: [] });
                } else {
                  onChange({ tieneHijos: val });
                  if ((data.hijos || []).length === 0) {
                    onChange({
                      tieneHijos: val,
                      hijos: [
                        { nombres: "", apellidoPaterno: "", apellidoMaterno: "", fechaNacimiento: "", lugarNacimiento: "", lugarResidencia: "" },
                      ],
                    });
                  }
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {data.tieneHijos === "si" && (data.hijos || []).map((hijo, idx) => (
          <div
            key={idx}
            className="relative grid grid-cols-1 gap-4 md:grid-cols-3 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in"
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-brand-400 hover:text-red-500 transition-colors p-1"
              aria-label={`Eliminar hijo ${idx + 1}`}
              onClick={() => removeHijo(idx)}
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <h4 className="label-caps md:col-span-3 text-brand-600 font-bold border-b border-brand-100/30 pb-1 mb-1">
              Hijo #{idx + 1}
            </h4>

            <div className="flex flex-col gap-2">
              <label htmlFor={`hijo-${idx}-nombres`} className="label-caps">
                Nombre(s)
              </label>
              <input
                id={`hijo-${idx}-nombres`}
                type="text"
                className="input-glass"
                placeholder="Ej. Luis"
                value={hijo.nombres}
                onChange={(e) => handleHijoChange(idx, "nombres", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`hijo-${idx}-paterno`} className="label-caps">
                Apellido Paterno
              </label>
              <input
                id={`hijo-${idx}-paterno`}
                type="text"
                className="input-glass"
                placeholder="Ej. Sánchez"
                value={hijo.apellidoPaterno}
                onChange={(e) => handleHijoChange(idx, "apellidoPaterno", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`hijo-${idx}-materno`} className="label-caps">
                Apellido Materno
              </label>
              <input
                id={`hijo-${idx}-materno`}
                type="text"
                className="input-glass"
                placeholder="Ej. Torres"
                value={hijo.apellidoMaterno}
                onChange={(e) => handleHijoChange(idx, "apellidoMaterno", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`hijo-${idx}-nacimiento`} className="label-caps">
                Fecha de nacimiento
              </label>
              <input
                id={`hijo-${idx}-nacimiento`}
                type="date"
                className="input-glass"
                value={hijo.fechaNacimiento}
                onChange={(e) => handleHijoChange(idx, "fechaNacimiento", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`hijo-${idx}-lugarNacimiento`} className="label-caps">
                Lugar de nacimiento (Ciudad/País)
              </label>
              <input
                id={`hijo-${idx}-lugarNacimiento`}
                type="text"
                className="input-glass"
                placeholder="Ej. México o Texas"
                value={hijo.lugarNacimiento}
                onChange={(e) => handleHijoChange(idx, "lugarNacimiento", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`hijo-${idx}-lugarResidencia`} className="label-caps">
                Lugar de residencia actual (Dirección o País)
              </label>
              <input
                id={`hijo-${idx}-lugarResidencia`}
                type="text"
                className="input-glass"
                placeholder="Ej. México o Texas, EE. UU."
                value={hijo.lugarResidencia}
                onChange={(e) => handleHijoChange(idx, "lugarResidencia", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
