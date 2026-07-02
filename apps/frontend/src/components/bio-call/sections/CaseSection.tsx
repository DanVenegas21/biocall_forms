"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import { FieldError, fieldInputClass } from "@/components/ui/FieldError";
import { SectionErrorBanner } from "@/components/ui/SectionErrorBanner";
import { getFieldError } from "@/lib/formErrors";

const PREFIX = "caseBackground";

export interface ViajeData {
  fechaEntrada: string;
  formaEntrada: string;
  lugarEntrada: string;
  fechaSalida: string;
  fueDetenido: string;
  detallesDetencion: string;
}

export interface EmpleoAnteriorData {
  empresa: string;
  puesto: string;
  direccionCalle: string;
  direccionApto: string;
  direccionCiudad: string;
  direccionEstado: string;
  direccionZip: string;
  direccionPais: string;
  fechaDesde: string;
  fechaHasta: string;
}

export interface DetencionInmiData {
  lugar: string;
  fecha: string;
  autoridad: string;
  ordenDeportacion: string;
  sancionCastigo: string;
  regresoVoluntario: string;
  fotosHuellas: string;
  citaCorte: string;
}

export interface ArrestoPoliciaData {
  paisCiudadEstado: string;
  fecha: string;
  motivo: string;
  autoridad: string;
  disposicion: string;
}

export interface FoiaItemData {
  solicitar: string;
  motivo: string;
}

interface CaseBackgroundData {
  viajes: ViajeData[];
  viajesComentarios: string;

  detenidoInmigracion: string;
  detencionesInmi: DetencionInmiData[];

  arrestadoPolicia: string;
  arrestosPolicia: ArrestoPoliciaData[];

  empleoNombre: string;
  empleoOcupacion: string;
  empleoDireccionCalle: string;
  empleoDireccionApto: string;
  empleoDireccionCiudad: string;
  empleoDireccionEstado: string;
  empleoDireccionZip: string;
  empleoDireccionPais: string;
  empleoFechaIngreso: string;
  empleoFechaSalida: string;
  empleoOtrosLugares: string;
  empleosAnteriores: EmpleoAnteriorData[];

  inadDetencionTrafico: string;
  inadCometidoDelito: string;
  inadInmunidadDiplomatica: string;
  inadProstitucionTrafico: string;
  inadAyudaIngresoIlegal: string;
  inadTerrorismo: string;
  inadFondosTerrorismo: string;
  inadAsociacionTerrorista: string;
  inadEspionaje: string;
  inadPartidoComunista: string;
  inadParticipadoPersecucion: string;
  inadProcedimientoRemocion: string;
  inadDenegadoVisa: string;
  inadVisaT: string;
  inadMyUscis: string;
  inadGrupoMilitar: string;
  inadFraudeMigratorio: string;
  inadTrastornoFisicoMental: string;
  inadEnfermedadPublica: string;
  inadAdictoDrogas: string;

  declaradoCiudadano: string;
  falsaDeclaracionLugar: string;
  falsaDeclaracionFecha: string;
  falsaDeclaracionComo: string;
  falsaDeclaracionIntencion: string;
  falsaDeclaracionDetalle: string;
  foias: {
    uscis: FoiaItemData;
    ice: FoiaItemData;
    cbp: FoiaItemData;
    eoir: FoiaItemData;
    fbi: FoiaItemData;
    policia: FoiaItemData;
  };
  documentosPendientes: string;
  correosPendientes: string;
}

interface CaseSectionProps {
  data: CaseBackgroundData;
  errors?: Record<string, string>;
  onChange: (fields: Partial<CaseBackgroundData>) => void;
}

export function CaseSection({ data, errors, onChange }: CaseSectionProps) {
  const [showInadmissibility, setShowInadmissibility] = useState(true);
  const err = (field: keyof CaseBackgroundData) =>
    getFieldError(errors, `${PREFIX}.${field}`);

  const inadKeys: Array<keyof CaseBackgroundData> = [
    "inadDetencionTrafico", "inadCometidoDelito", "inadInmunidadDiplomatica", "inadProstitucionTrafico",
    "inadAyudaIngresoIlegal", "inadTerrorismo", "inadFondosTerrorismo", "inadAsociacionTerrorista",
    "inadEspionaje", "inadPartidoComunista", "inadParticipadoPersecucion", "inadProcedimientoRemocion",
    "inadDenegadoVisa", "inadVisaT", "inadGrupoMilitar", "inadFraudeMigratorio",
    "inadTrastornoFisicoMental", "inadEnfermedadPublica", "inadAdictoDrogas"
  ];
  const hasAffirmativeSecurityAnswers = inadKeys.some(key => data[key] === "si") || (data.inadMyUscis !== "no" && data.inadMyUscis !== "");

  const handleChange = (field: keyof CaseBackgroundData, value: any) => {
    onChange({ [field]: value });
  };

  // --- Manejo de la lista dinámica de Viajes ---
  const addViaje = () => {
    const currentViajes = data.viajes || [];
    onChange({
      viajes: [
        ...currentViajes,
        {
          fechaEntrada: "",
          formaEntrada: "",
          lugarEntrada: "",
          fechaSalida: "",
          fueDetenido: "",
          detallesDetencion: "",
        },
      ],
    });
  };

  const removeViaje = (index: number) => {
    const currentViajes = data.viajes || [];
    onChange({
      viajes: currentViajes.filter((_, i) => i !== index),
    });
  };

  const handleViajeChange = (index: number, field: keyof ViajeData, value: string) => {
    const currentViajes = data.viajes || [];
    const newViajes = currentViajes.map((viaje, i) => {
      if (i === index) {
        return { ...viaje, [field]: value };
      }
      return viaje;
    });
    onChange({ viajes: newViajes });
  };

  // --- Manejo de la lista dinámica de Empleos Anteriores ---
  const addEmpleoAnterior = () => {
    const current = data.empleosAnteriores || [];
    onChange({
      empleosAnteriores: [
        ...current,
        {
          empresa: "",
          puesto: "",
          direccionCalle: "",
          direccionApto: "",
          direccionCiudad: "",
          direccionEstado: "",
          direccionZip: "",
          direccionPais: "",
          fechaDesde: "",
          fechaHasta: "",
        },
      ],
    });
  };

  const removeEmpleoAnterior = (index: number) => {
    const current = data.empleosAnteriores || [];
    onChange({
      empleosAnteriores: current.filter((_, i) => i !== index),
    });
  };

  const handleEmpleoAnteriorChange = (index: number, field: keyof EmpleoAnteriorData, value: string) => {
    const current = data.empleosAnteriores || [];
    const updated = current.map((emp, i) => {
      if (i === index) return { ...emp, [field]: value };
      return emp;
    });
    onChange({ empleosAnteriores: updated });
  };

  // --- Manejo de Detenciones por Inmigración ---
  const addDetencionInmi = () => {
    const current = data.detencionesInmi || [];
    onChange({
      detencionesInmi: [
        ...current,
        {
          lugar: "",
          fecha: "",
          autoridad: "",
          ordenDeportacion: "",
          sancionCastigo: "",
          regresoVoluntario: "",
          fotosHuellas: "",
          citaCorte: "",
        },
      ],
    });
  };

  const removeDetencionInmi = (index: number) => {
    const current = data.detencionesInmi || [];
    onChange({
      detencionesInmi: current.filter((_, i) => i !== index),
    });
  };

  const handleDetencionInmiChange = (index: number, field: keyof DetencionInmiData, value: string) => {
    const current = data.detencionesInmi || [];
    const updated = current.map((det, i) => {
      if (i === index) return { ...det, [field]: value };
      return det;
    });
    onChange({ detencionesInmi: updated });
  };

  // --- Manejo de Arrestos por la Policía ---
  const addArrestoPolicia = () => {
    const current = data.arrestosPolicia || [];
    onChange({
      arrestosPolicia: [
        ...current,
        {
          paisCiudadEstado: "",
          fecha: "",
          motivo: "",
          autoridad: "",
          disposicion: "",
        },
      ],
    });
  };

  const removeArrestoPolicia = (index: number) => {
    const current = data.arrestosPolicia || [];
    onChange({
      arrestosPolicia: current.filter((_, i) => i !== index),
    });
  };

  const handleArrestoPoliciaChange = (index: number, field: keyof ArrestoPoliciaData, value: string) => {
    const current = data.arrestosPolicia || [];
    const updated = current.map((arr, i) => {
      if (i === index) return { ...arr, [field]: value };
      return arr;
    });
    onChange({ arrestosPolicia: updated });
  };

  // --- Manejo de FOIA ---
  const handleFoiaChange = (agency: keyof CaseBackgroundData["foias"], field: keyof FoiaItemData, value: string) => {
    const currentFoias = data.foias || {
      uscis: { solicitar: "no", motivo: "" },
      ice: { solicitar: "no", motivo: "" },
      cbp: { solicitar: "no", motivo: "" },
      eoir: { solicitar: "no", motivo: "" },
      fbi: { solicitar: "no", motivo: "" },
      policia: { solicitar: "no", motivo: "" },
    };
    onChange({
      foias: {
        ...currentFoias,
        [agency]: {
          ...currentFoias[agency],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <SectionErrorBanner errors={errors} prefix={PREFIX} />
      {/* 1. Historial de Viajes / Entradas a EE. UU. */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-100/50 pb-2">
          <h3 className="panel-section-title text-base font-semibold">
            1. Historial de viajes a Estados Unidos
          </h3>
          <GlassButton
            type="button"
            variant="ghost"
            size="xs"
            className="uppercase tracking-wider"
            leftIcon={<Plus className="h-3 w-3" aria-hidden="true" />}
            onClick={addViaje}
          >
            Agregar Entrada
          </GlassButton>
        </div>

        <p className="text-xs text-brand-500/80">
          Registrar TODOS los ingresos. Si no recuerda la fecha exacta, registrar al menos mes y año.
        </p>

        {/* Lista de Viajes */}
        {(data.viajes || []).length === 0 ? (
          <div className="p-6 text-center border border-dashed border-brand-200 rounded-2xl text-brand-400 text-sm">
            No se han registrado viajes. Haz clic en "Agregar Entrada" para añadir uno.
          </div>
        ) : (
          (data.viajes || []).map((viaje, idx) => (
            <div
              key={idx}
              className="relative grid grid-cols-1 gap-4 md:grid-cols-3 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in"
            >
              <GlassButton
                type="button"
                variant="danger"
                size="xs"
                iconOnly
                className="absolute top-3 right-3"
                leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
                aria-label={`Eliminar viaje ${idx + 1}`}
                onClick={() => removeViaje(idx)}
              />

              <h4 className="label-caps md:col-span-3 text-brand-600 font-bold border-b border-brand-100/30 pb-1 mb-1">
                Viaje / Entrada #{idx + 1}
              </h4>

              <div className="flex flex-col gap-2">
                <label htmlFor={`viaje-${idx}-entrada`} className="label-caps">
                  Fecha de entrada
                </label>
                <input
                  id={`viaje-${idx}-entrada`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Junio 13 2008 o 2003"
                  value={viaje.fechaEntrada}
                  onChange={(e) => handleViajeChange(idx, "fechaEntrada", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`viaje-${idx}-forma`} className="label-caps">
                  Forma de entrada
                </label>
                <input
                  id={`viaje-${idx}-forma`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Visa de turista"
                  value={viaje.formaEntrada}
                  onChange={(e) => handleViajeChange(idx, "formaEntrada", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`viaje-${idx}-lugar`} className="label-caps">
                  Lugar de entrada
                </label>
                <input
                  id={`viaje-${idx}-lugar`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Ciudad fronteriza hacia ciudad en EE. UU."
                  value={viaje.lugarEntrada}
                  onChange={(e) => handleViajeChange(idx, "lugarEntrada", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`viaje-${idx}-salida`} className="label-caps">
                  Fecha de salida (si aplica)
                </label>
                <input
                  id={`viaje-${idx}-salida`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. 2004 o N/A"
                  value={viaje.fechaSalida}
                  onChange={(e) => handleViajeChange(idx, "fechaSalida", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`viaje-${idx}-detenido`} className="label-caps">
                  ¿Fue detenido al ingresar?
                </label>
                <select
                  id={`viaje-${idx}-detenido`}
                  className="input-glass"
                  value={viaje.fueDetenido}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== "si") {
                      const updated = (data.viajes || []).map((v, i) => {
                        if (i === idx) return { ...v, fueDetenido: val, detallesDetencion: "" };
                        return v;
                      });
                      onChange({ viajes: updated });
                    } else {
                      handleViajeChange(idx, "fueDetenido", val);
                    }
                  }}
                >
                  <option value="">Seleccione...</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              {viaje.fueDetenido === "si" && (
                <div className="flex flex-col gap-2 md:col-span-3 animate-fade-in">
                  <label htmlFor={`viaje-${idx}-detallesDetencion`} className="label-caps">
                    Autoridad y detalles de la detención
                  </label>
                  <input
                    id={`viaje-${idx}-detallesDetencion`}
                    type="text"
                    className="input-glass"
                    placeholder="Ej. Me detuvieron en la frontera y me regresaron."
                    value={viaje.detallesDetencion}
                    onChange={(e) => handleViajeChange(idx, "detallesDetencion", e.target.value)}
                  />
                </div>
              )}
            </div>
          ))
        )}

        <div className="flex flex-col gap-2 pt-2">
          <label htmlFor="viajesComentarios" className="label-caps">
            Comentarios o aclaraciones sobre el historial de viajes
          </label>
          <textarea
            id="viajesComentarios"
            rows={2}
            className="input-glass resize-none min-h-[60px]"
            placeholder="Ej. El cliente indica que no recuerda algunas fechas exactas."
            value={data.viajesComentarios || ""}
            onChange={(e) => handleChange("viajesComentarios", e.target.value)}
          />
        </div>
      </div>

      {/* 2. Detenciones por Inmigración */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-100/50 pb-2">
          <h3 className="panel-section-title text-base font-semibold">
            2. Detenciones por Inmigración (Cualquier lugar y fecha)
          </h3>
          {data.detenidoInmigracion === "si" && (
            <GlassButton
              type="button"
              variant="ghost"
              size="xs"
              className="uppercase tracking-wider"
              leftIcon={<Plus className="h-3 w-3" aria-hidden="true" />}
              onClick={addDetencionInmi}
            >
              Agregar Detención
            </GlassButton>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="detenidoInmigracion" className="label-caps">
              ¿Ha sido detenido(a) por inmigración alguna vez?
            </label>
            <select
              id="detenidoInmigracion"
              className="input-glass"
              value={data.detenidoInmigracion}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({
                    detenidoInmigracion: val,
                    detencionesInmi: [],
                  });
                } else {
                  onChange({ detenidoInmigracion: val });
                  if ((data.detencionesInmi || []).length === 0) {
                    onChange({
                      detenidoInmigracion: val,
                      detencionesInmi: [
                        {
                          lugar: "",
                          fecha: "",
                          autoridad: "",
                          ordenDeportacion: "",
                          sancionCastigo: "",
                          regresoVoluntario: "",
                          fotosHuellas: "",
                          citaCorte: "",
                        },
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

        {data.detenidoInmigracion === "si" && (data.detencionesInmi || []).map((det, idx) => (
          <div
            key={idx}
            className="relative grid grid-cols-1 gap-4 md:grid-cols-2 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in"
          >
            <GlassButton
              type="button"
              variant="danger"
              size="xs"
              iconOnly
              className="absolute top-3 right-3"
              leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
              aria-label={`Eliminar detención ${idx + 1}`}
              onClick={() => removeDetencionInmi(idx)}
            />

            <h4 className="label-caps md:col-span-2 text-brand-600 font-bold border-b border-brand-100/30 pb-1 mb-1">
              Detención #{idx + 1}
            </h4>

            <div className="flex flex-col gap-2">
              <label htmlFor={`det-${idx}-lugar`} className="label-caps">
                Lugar (ciudad y estado)
              </label>
              <input
                id={`det-${idx}-lugar`}
                type="text"
                className="input-glass"
                placeholder="Ej. Ciudad fronteriza, TX"
                value={det.lugar}
                onChange={(e) => handleDetencionInmiChange(idx, "lugar", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`det-${idx}-fecha`} className="label-caps">
                Fecha
              </label>
              <input
                id={`det-${idx}-fecha`}
                type="text"
                className="input-glass"
                placeholder="Ej. Junio 2008"
                value={det.fecha}
                onChange={(e) => handleDetencionInmiChange(idx, "fecha", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`det-${idx}-autoridad`} className="label-caps">
                Autoridad que lo detuvo (ICE / CBP / Border Patrol / otra)
              </label>
              <input
                id={`det-${idx}-autoridad`}
                type="text"
                className="input-glass"
                placeholder="Ej. Patrulla fronteriza"
                value={det.autoridad}
                onChange={(e) => handleDetencionInmiChange(idx, "autoridad", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`det-${idx}-ordenDeportacion`} className="label-caps">
                ¿Orden de deportación o remoción?
              </label>
              <select
                id={`det-${idx}-ordenDeportacion`}
                className="input-glass"
                value={det.ordenDeportacion}
                onChange={(e) => handleDetencionInmiChange(idx, "ordenDeportacion", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="no_sabe">No sabe</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`det-${idx}-sancionCastigo`} className="label-caps">
                ¿Sanción o castigo migratorio?
              </label>
              <select
                id={`det-${idx}-sancionCastigo`}
                className="input-glass"
                value={det.sancionCastigo}
                onChange={(e) => handleDetencionInmiChange(idx, "sancionCastigo", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="no_sabe">No sabe</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`det-${idx}-regresoVoluntario`} className="label-caps">
                ¿Salida o regreso voluntarios?
              </label>
              <select
                id={`det-${idx}-regresoVoluntario`}
                className="input-glass"
                value={det.regresoVoluntario}
                onChange={(e) => handleDetencionInmiChange(idx, "regresoVoluntario", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="no_sabe">No sabe</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`det-${idx}-fotosHuellas`} className="label-caps">
                ¿Huellas y fotografías?
              </label>
              <select
                id={`det-${idx}-fotosHuellas`}
                className="input-glass"
                value={det.fotosHuellas}
                onChange={(e) => handleDetencionInmiChange(idx, "fotosHuellas", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="no_sabe">No sabe</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`det-${idx}-citaCorte`} className="label-caps">
                ¿Cita en corte con juez de inmigración?
              </label>
              <select
                id={`det-${idx}-citaCorte`}
                className="input-glass"
                value={det.citaCorte}
                onChange={(e) => handleDetencionInmiChange(idx, "citaCorte", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="no_sabe">No sabe</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Arrestos por la Policía */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-100/50 pb-2">
          <h3 className="panel-section-title text-base font-semibold">
            3. Arrestos o Detenciones por Policía
          </h3>
          {data.arrestadoPolicia === "si" && (
            <GlassButton
              type="button"
              variant="ghost"
              size="xs"
              className="uppercase tracking-wider"
              leftIcon={<Plus className="h-3 w-3" aria-hidden="true" />}
              onClick={addArrestoPolicia}
            >
              Agregar Arresto
            </GlassButton>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="arrestadoPolicia" className="label-caps text-xs">
              ¿Alguna vez ha sido arrestado(a) por la policía? (EE. UU. u otro país, incluyendo arrestos por tickets de tráfico)
            </label>
            <select
              id="arrestadoPolicia"
              className="input-glass"
              value={data.arrestadoPolicia}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({
                    arrestadoPolicia: val,
                    arrestosPolicia: [],
                  });
                } else {
                  onChange({ arrestadoPolicia: val });
                  if ((data.arrestosPolicia || []).length === 0) {
                    onChange({
                      arrestadoPolicia: val,
                      arrestosPolicia: [
                        {
                          paisCiudadEstado: "",
                          fecha: "",
                          motivo: "",
                          autoridad: "",
                          disposicion: "",
                        },
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

        {data.arrestadoPolicia === "si" && (data.arrestosPolicia || []).map((arr, idx) => (
          <div
            key={idx}
            className="relative grid grid-cols-1 gap-4 md:grid-cols-2 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in"
          >
            <GlassButton
              type="button"
              variant="danger"
              size="xs"
              iconOnly
              className="absolute top-3 right-3"
              leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
              aria-label={`Eliminar arresto ${idx + 1}`}
              onClick={() => removeArrestoPolicia(idx)}
            />

            <h4 className="label-caps md:col-span-2 text-brand-600 font-bold border-b border-brand-100/30 pb-1 mb-1">
              Arresto #{idx + 1}
            </h4>

            <div className="flex flex-col gap-2">
              <label htmlFor={`arr-${idx}-paisCiudadEstado`} className="label-caps">
                País, ciudad y estado
              </label>
              <input
                id={`arr-${idx}-paisCiudadEstado`}
                type="text"
                className="input-glass"
                placeholder="Ej. Ciudad, Estado, EE. UU."
                value={arr.paisCiudadEstado}
                onChange={(e) => handleArrestoPoliciaChange(idx, "paisCiudadEstado", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`arr-${idx}-fecha`} className="label-caps">
                Fecha (mes y año)
              </label>
              <input
                id={`arr-${idx}-fecha`}
                type="text"
                className="input-glass"
                placeholder="Ej. 2019"
                value={arr.fecha}
                onChange={(e) => handleArrestoPoliciaChange(idx, "fecha", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`arr-${idx}-motivo`} className="label-caps">
                Motivo del arresto / Detalle
              </label>
              <input
                id={`arr-${idx}-motivo`}
                type="text"
                className="input-glass"
                placeholder="Ej. Infracción de tránsito"
                value={arr.motivo}
                onChange={(e) => handleArrestoPoliciaChange(idx, "motivo", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`arr-${idx}-autoridad`} className="label-caps">
                Autoridad que realizó el arresto / Policía local
              </label>
              <input
                id={`arr-${idx}-autoridad`}
                type="text"
                className="input-glass"
                placeholder="Ej. Departamento de policía local"
                value={arr.autoridad}
                onChange={(e) => handleArrestoPoliciaChange(idx, "autoridad", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor={`arr-${idx}-disposicion`} className="label-caps">
                Disposición o resultado (Ej. se pagó fianza, se resolvió con ticket, etc. Especifique brevemente motivo, fecha, lugar, si pasó la noche en la cárcel, fianza, etc.)
              </label>
              <textarea
                id={`arr-${idx}-disposicion`}
                rows={2}
                className="input-glass resize-none"
                placeholder="Ej. Detención breve, pagó fianza, caso cerrado"
                value={arr.disposicion}
                onChange={(e) => handleArrestoPoliciaChange(idx, "disposicion", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Historial Laboral */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <h3 className="panel-section-title text-base font-semibold border-b border-brand-100/50 pb-2">
          4. Historial Laboral del Cliente
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="empleoNombre" className="label-caps">
              Nombre del empleador / Compañía actual
            </label>
            <input
              id="empleoNombre"
              type="text"
              className="input-glass"
              placeholder="Ej. Independiente - Empresa Ejemplo S.A."
              value={data.empleoNombre || ""}
              onChange={(e) => handleChange("empleoNombre", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="empleoOcupacion" className="label-caps">
              Ocupación / Puesto
            </label>
            <input
              id="empleoOcupacion"
              type="text"
              className="input-glass"
              placeholder="Ej. Dueño / Contratista"
              value={data.empleoOcupacion || ""}
              onChange={(e) => handleChange("empleoOcupacion", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:col-span-2 border-t border-brand-100/30 pt-3">
            <h4 className="label-caps text-xs text-brand-600 md:col-span-3 font-semibold">
              Dirección del trabajo / Empleador
            </h4>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="empleoDireccionCalle" className="label-caps">
                Calle y Número del trabajo
              </label>
              <input
                id="empleoDireccionCalle"
                type="text"
                className="input-glass"
                placeholder="Ej. Av. Principal 123"
                value={data.empleoDireccionCalle || ""}
                onChange={(e) => handleChange("empleoDireccionCalle", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="empleoDireccionApto" className="label-caps">
                Apto / Suite / Unidad
              </label>
              <input
                id="empleoDireccionApto"
                type="text"
                className="input-glass"
                placeholder="Ej. Depto. 10 (opcional)"
                value={data.empleoDireccionApto || ""}
                onChange={(e) => handleChange("empleoDireccionApto", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:col-span-2 pb-3 border-b border-brand-100/30">
            <div className="flex flex-col gap-2">
              <label htmlFor="empleoDireccionCiudad" className="label-caps">
                Ciudad del trabajo
              </label>
              <input
                id="empleoDireccionCiudad"
                type="text"
                className="input-glass"
                placeholder="Ej. Ciudad de México"
                value={data.empleoDireccionCiudad || ""}
                onChange={(e) => handleChange("empleoDireccionCiudad", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="empleoDireccionEstado" className="label-caps">
                Estado del trabajo
              </label>
              <input
                id="empleoDireccionEstado"
                type="text"
                className="input-glass"
                placeholder="Ej. CDMX"
                value={data.empleoDireccionEstado || ""}
                onChange={(e) => handleChange("empleoDireccionEstado", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="empleoDireccionZip" className="label-caps">
                Código Postal (ZIP) del trabajo
              </label>
              <input
                id="empleoDireccionZip"
                type="text"
                className="input-glass"
                placeholder="Ej. 01000"
                value={data.empleoDireccionZip || ""}
                onChange={(e) => handleChange("empleoDireccionZip", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="empleoDireccionPais" className="label-caps">
                País del trabajo
              </label>
              <input
                id="empleoDireccionPais"
                type="text"
                className="input-glass"
                placeholder="Ej. México"
                value={data.empleoDireccionPais || ""}
                onChange={(e) => handleChange("empleoDireccionPais", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="empleoFechaIngreso" className="label-caps">
              Fecha de ingreso
            </label>
            <input
              id="empleoFechaIngreso"
              type="text"
              className="input-glass"
              placeholder="Ej. Febrero 2020 con otro nombre"
              value={data.empleoFechaIngreso || ""}
              onChange={(e) => handleChange("empleoFechaIngreso", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="empleoFechaSalida" className="label-caps">
              Fecha de salida / término
            </label>
            <input
              id="empleoFechaSalida"
              type="text"
              className="input-glass"
              placeholder="Ej. Actualmente laborando"
              value={data.empleoFechaSalida || ""}
              onChange={(e) => handleChange("empleoFechaSalida", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-brand-100/30 pt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="empleoOtrosLugares" className="label-caps font-semibold">
              ¿Ha laborado en algún otro lugar en los últimos 5 años?
            </label>
            <select
              id="empleoOtrosLugares"
              className="input-glass max-w-xs"
              value={data.empleoOtrosLugares || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({ empleoOtrosLugares: val, empleosAnteriores: [] });
                } else {
                  onChange({ empleoOtrosLugares: val });
                  if ((data.empleosAnteriores || []).length === 0) {
                    onChange({
                      empleoOtrosLugares: val,
                      empleosAnteriores: [
                        {
                          empresa: "",
                          puesto: "",
                          direccionCalle: "",
                          direccionApto: "",
                          direccionCiudad: "",
                          direccionEstado: "",
                          direccionZip: "",
                          direccionPais: "",
                          fechaDesde: "",
                          fechaHasta: "",
                        },
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

          {data.empleoOtrosLugares === "si" && (
            <GlassButton
              type="button"
              variant="ghost"
              size="xs"
              className="uppercase tracking-wider"
              leftIcon={<Plus className="h-3 w-3" aria-hidden="true" />}
              onClick={addEmpleoAnterior}
            >
              Agregar Empleo Anterior
            </GlassButton>
          )}
        </div>

        {data.empleoOtrosLugares === "si" && (data.empleosAnteriores || []).map((emp, idx) => (
          <div
            key={idx}
            className="relative grid grid-cols-1 gap-4 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in"
          >
            <GlassButton
              type="button"
              variant="danger"
              size="xs"
              iconOnly
              className="absolute top-3 right-3"
              leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
              aria-label={`Eliminar empleo anterior ${idx + 1}`}
              onClick={() => removeEmpleoAnterior(idx)}
            />

            <h4 className="label-caps text-brand-600 font-bold border-b border-brand-100/30 pb-1 mb-1">
              Empleo Anterior #{idx + 1}
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor={`emp-${idx}-empresa`} className="label-caps">
                  Nombre del Empleador / Compañía
                </label>
                <input
                  id={`emp-${idx}-empresa`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Empresa ABC"
                  value={emp.empresa}
                  onChange={(e) => handleEmpleoAnteriorChange(idx, "empresa", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`emp-${idx}-puesto`} className="label-caps">
                  Ocupación / Puesto
                </label>
                <input
                  id={`emp-${idx}-puesto`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Pintor"
                  value={emp.puesto}
                  onChange={(e) => handleEmpleoAnteriorChange(idx, "puesto", e.target.value)}
                />
              </div>
            </div>

            {/* Dirección del empleo anterior */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 border-t border-brand-100/20 pt-3">
              <h5 className="label-caps text-[10px] text-brand-500 font-bold md:col-span-3">
                Dirección del Empleo Anterior
              </h5>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor={`emp-${idx}-direccionCalle`} className="label-caps">
                  Calle y Número
                </label>
                <input
                  id={`emp-${idx}-direccionCalle`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Calle Secundaria 456"
                  value={emp.direccionCalle}
                  onChange={(e) => handleEmpleoAnteriorChange(idx, "direccionCalle", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`emp-${idx}-direccionApto`} className="label-caps">
                  Apto / Suite / Unidad
                </label>
                <input
                  id={`emp-${idx}-direccionApto`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Depto. 4B (opcional)"
                  value={emp.direccionApto}
                  onChange={(e) => handleEmpleoAnteriorChange(idx, "direccionApto", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-2">
                <label htmlFor={`emp-${idx}-direccionCiudad`} className="label-caps">
                  Ciudad
                </label>
                <input
                  id={`emp-${idx}-direccionCiudad`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Guadalajara"
                  value={emp.direccionCiudad}
                  onChange={(e) => handleEmpleoAnteriorChange(idx, "direccionCiudad", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`emp-${idx}-direccionEstado`} className="label-caps">
                  Estado
                </label>
                <input
                  id={`emp-${idx}-direccionEstado`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Jalisco"
                  value={emp.direccionEstado}
                  onChange={(e) => handleEmpleoAnteriorChange(idx, "direccionEstado", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`emp-${idx}-direccionZip`} className="label-caps">
                  Código Postal (ZIP)
                </label>
                <input
                  id={`emp-${idx}-direccionZip`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. 44100"
                  value={emp.direccionZip}
                  onChange={(e) => handleEmpleoAnteriorChange(idx, "direccionZip", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`emp-${idx}-direccionPais`} className="label-caps">
                  País
                </label>
                <input
                  id={`emp-${idx}-direccionPais`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. México"
                  value={emp.direccionPais}
                  onChange={(e) => handleEmpleoAnteriorChange(idx, "direccionPais", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 border-t border-brand-100/20 pt-3">
              <div className="flex flex-col gap-2">
                <label htmlFor={`emp-${idx}-fechaDesde`} className="label-caps">
                  Fecha de Inicio (Desde)
                </label>
                <input
                  id={`emp-${idx}-fechaDesde`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Marzo 2018"
                  value={emp.fechaDesde}
                  onChange={(e) => handleEmpleoAnteriorChange(idx, "fechaDesde", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`emp-${idx}-fechaHasta`} className="label-caps">
                  Fecha de Finalización (Hasta)
                </label>
                <input
                  id={`emp-${idx}-fechaHasta`}
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Enero 2020"
                  value={emp.fechaHasta}
                  onChange={(e) => handleEmpleoAnteriorChange(idx, "fechaHasta", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Cuestionario de Seguridad e Inadmisibilidad */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <button
          type="button"
          className="flex items-center justify-between w-full p-3 rounded-xl bg-brand-50/50 border border-brand-100 hover:bg-brand-50 transition-colors"
          onClick={() => setShowInadmissibility(!showInadmissibility)}
        >
          <span className="panel-section-title text-base font-semibold">
            5. Cuestionario de Seguridad e Inadmisibilidad (Preguntas Sí/No)
          </span>
          {showInadmissibility ? (
            <ChevronUp className="h-5 w-5 text-brand-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-brand-600" />
          )}
        </button>

        {showInadmissibility && (
          <div className="space-y-4 p-4 rounded-xl border border-brand-100/80 bg-white/50 animate-fade-in">
            <div className="p-3 rounded-lg bg-brand-50 border border-brand-200 text-xs text-brand-800 space-y-1 mb-2">
              <p className="font-semibold uppercase tracking-wider text-brand-700">
                Guión de Introducción Sugerido para el Especialista de Integración / CM:
              </p>
              <p className="italic">
                “Ahora le haré una serie de preguntas que deben responderse únicamente con Sí, No o No sabe. Algunas pueden ser delicadas, pero es importante responder con honestidad. Si alguna respuesta es Sí, solo la anotaremos y el abogado la revisará más adelante.”
              </p>
            </div>

            {hasAffirmativeSecurityAnswers && (
              <div className="p-3.5 rounded-xl bg-accent-50 border border-accent-200 text-accent-900 text-xs flex items-start gap-2.5 shadow-sm animate-fade-in mb-3">
                <AlertTriangle className="h-4 w-4 text-accent-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-accent-800">
                    Atención: Se ha registrado respuesta «Sí» en una o más preguntas legales.
                  </p>
                  <p className="text-accent-700 mt-0.5">
                    Estas respuestas serán destacadas automáticamente para evaluación prioritaria durante la consulta legal con el abogado.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4 divide-y divide-brand-100/30">
              {/* Pregunta 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3 first:pt-0">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  1. ¿Tiene historial de detenciones de tráfico que hayan requerido ir a corte (tickets de exceso de velocidad, DUI/manejar ebrio, etc.)?
                </span>
                <select
                  className="input-glass"
                  value={data.inadDetencionTrafico || ""}
                  onChange={(e) => handleChange("inadDetencionTrafico", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  2. ¿Ha cometido algún delito, sido arrestado, acusado, condenado, recibido sentencia suspendida, estado en prisión, o recibido algún perdón o amnistía?
                </span>
                <select
                  className="input-glass"
                  value={data.inadCometidoDelito || ""}
                  onChange={(e) => handleChange("inadCometidoDelito", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 3 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  3. ¿Ha ejercido inmunidad diplomática para evitar ser procesado en los Estados Unidos?
                </span>
                <select
                  className="input-glass"
                  value={data.inadInmunidadDiplomatica || ""}
                  onChange={(e) => handleChange("inadInmunidadDiplomatica", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 4 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  4. ¿Ha estado involucrado en prostitución, actividades comerciales ilegales, o tráfico de sustancias controladas?
                </span>
                <select
                  className="input-glass"
                  value={data.inadProstitucionTrafico || ""}
                  onChange={(e) => handleChange("inadProstitucionTrafico", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 5 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  5. ¿Ha ayudado a alguna persona a ingresar ilegalmente a los Estados Unidos?
                </span>
                <select
                  className="input-glass"
                  value={data.inadAyudaIngresoIlegal || ""}
                  onChange={(e) => handleChange("inadAyudaIngresoIlegal", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 6 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  6. ¿Alguna vez ha cometido, planeado, participado o conspirado en actividades ilegales o de carácter terrorista?
                </span>
                <select
                  className="input-glass"
                  value={data.inadTerrorismo || ""}
                  onChange={(e) => handleChange("inadTerrorismo", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 7 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  7. ¿Ha recolectado información o fondos para actividades como secuestro, sabotaje, asesinato o uso de armas peligrosas?
                </span>
                <select
                  className="input-glass"
                  value={data.inadFondosTerrorismo || ""}
                  onChange={(e) => handleChange("inadFondosTerrorismo", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 8 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  8. ¿Ha sido miembro, solicitado apoyo o estado asociado con una organización terrorista o grupo armado violento?
                </span>
                <select
                  className="input-glass"
                  value={data.inadAsociacionTerrorista || ""}
                  onChange={(e) => handleChange("inadAsociacionTerrorista", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 9 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  9. ¿Tiene la intención de participar en actividades como espionaje o actividades ilegales contra el gobierno de EE. UU.?
                </span>
                <select
                  className="input-glass"
                  value={data.inadEspionaje || ""}
                  onChange={(e) => handleChange("inadEspionaje", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 10 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  10. ¿Ha sido miembro del partido comunista o de algún partido totalitario en su país o el extranjero?
                </span>
                <select
                  className="input-glass"
                  value={data.inadPartidoComunista || ""}
                  onChange={(e) => handleChange("inadPartidoComunista", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 11 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  11. ¿Ha participado en la persecución, tortura, asesinato, desplazamiento forzoso o coerción sexual de personas en asociación con el régimen nazi o similares?
                </span>
                <select
                  className="input-glass"
                  value={data.inadParticipadoPersecucion || ""}
                  onChange={(e) => handleChange("inadParticipadoPersecucion", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 12 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  12. ¿Ha tenido procedimientos de remoción, exclusión, rescisión o deportación iniciados o pendientes en su contra en EE. UU.?
                </span>
                <select
                  className="input-glass"
                  value={data.inadProcedimientoRemocion || ""}
                  onChange={(e) => handleChange("inadProcedimientoRemocion", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 13 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  13. ¿Le ha sido denegada alguna vez una visa o admisión a los Estados Unidos?
                </span>
                <select
                  className="input-glass"
                  value={data.inadDenegadoVisa || ""}
                  onChange={(e) => handleChange("inadDenegadoVisa", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 14 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  14. ¿Alguna vez ha solicitado o le han otorgado una Visa T?
                </span>
                <select
                  className="input-glass"
                  value={data.inadVisaT || ""}
                  onChange={(e) => handleChange("inadVisaT", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 15 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  15. ¿Tiene cuenta de myUSCIS? En caso afirmativo, proporcione correo electrónico, contraseña, preguntas de seguridad y código de recuperación.
                </span>
                <select
                  className="input-glass"
                  value={data.inadMyUscis === "no" || data.inadMyUscis === "" ? "no" : "si"}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "no") {
                      handleChange("inadMyUscis", "no");
                    } else {
                      handleChange("inadMyUscis", "si");
                    }
                  }}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Credenciales de myUSCIS (Condicional) */}
              {data.inadMyUscis !== "no" && data.inadMyUscis !== "" && (
                <div className="grid grid-cols-1 gap-2 md:col-span-4 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in">
                  <label htmlFor="inadMyUscisDetails" className="label-caps font-semibold text-brand-700">
                    Detalles de myUSCIS (Correo, contraseña, preguntas de seguridad, código de recuperación)
                  </label>
                  <textarea
                    id="inadMyUscisDetails"
                    rows={3}
                    className="input-glass"
                    placeholder="Ej. Correo: correo@ejemplo.com&#10;Contraseña: ********&#10;Preguntas: 1. Mascota: Nombre...&#10;Código de recuperación: XXX-XXX-XXX"
                    value={data.inadMyUscis === "si" ? "" : data.inadMyUscis}
                    onChange={(e) => handleChange("inadMyUscis", e.target.value || "si")}
                  />
                </div>
              )}

              {/* Pregunta 16 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  16. ¿Ha participado en actos de violencia, coerción religiosa o ha sido parte de algún grupo militar, paramilitar o grupo de detención?
                </span>
                <select
                  className="input-glass"
                  value={data.inadGrupoMilitar || ""}
                  onChange={(e) => handleChange("inadGrupoMilitar", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 17 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  17. ¿Ha participado en actividades ilegales de armas, fraude migratorio, evitación del servicio militar o retención ilegal de un niño con ciudadanía estadounidense?
                </span>
                <select
                  className="input-glass"
                  value={data.inadFraudeMigratorio || ""}
                  onChange={(e) => handleChange("inadFraudeMigratorio", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 18 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  18. ¿Ha tenido o tiene algún trastorno físico o mental que pueda representar un riesgo para su seguridad o la de la propiedad?
                </span>
                <select
                  className="input-glass"
                  value={data.inadTrastornoFisicoMental || ""}
                  onChange={(e) => handleChange("inadTrastornoFisicoMental", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 19 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  19. ¿Tiene alguna enfermedad transmisible de importancia para la salud pública?
                </span>
                <select
                  className="input-glass"
                  value={data.inadEnfermedadPublica || ""}
                  onChange={(e) => handleChange("inadEnfermedadPublica", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>

              {/* Pregunta 20 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <span className="text-sm font-medium text-brand-700 md:col-span-3">
                  20. ¿Ha sido en algún momento abusador o adicto a las drogas?
                </span>
                <select
                  className="input-glass"
                  value={data.inadAdictoDrogas || ""}
                  onChange={(e) => handleChange("inadAdictoDrogas", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="no_sabe">No sabe</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Declaración de Ciudadanía y FOIA */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <h3 className="panel-section-title text-base font-semibold border-b border-brand-100/50 pb-2">
          6. Declaración de Ciudadanía y Solicitudes Legales
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="declaradoCiudadano" className="label-caps">
              ¿Alguna vez se ha declarado ciudadano de los EE. UU. sin serlo?
            </label>
            <select
              id="declaradoCiudadano"
              className="input-glass"
              value={data.declaradoCiudadano}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({
                    declaradoCiudadano: val,
                    falsaDeclaracionLugar: "",
                    falsaDeclaracionFecha: "",
                    falsaDeclaracionComo: "",
                    falsaDeclaracionIntencion: "",
                    falsaDeclaracionDetalle: "",
                  });
                } else {
                  onChange({ declaradoCiudadano: val });
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Detalles de Declaración Falsa (Condicional) */}
        {data.declaradoCiudadano === "si" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in">
            <h4 className="label-caps md:col-span-2 border-b border-brand-100/30 pb-1 mb-2 text-brand-600 font-semibold">
              Detalles de la Declaración Falsa de Ciudadanía
            </h4>

            <div className="flex flex-col gap-2">
              <label htmlFor="falsaDeclaracionLugar" className="label-caps">
                Lugar donde se declaró ciudadano
              </label>
              <input
                id="falsaDeclaracionLugar"
                type="text"
                className="input-glass"
                placeholder="Ej. Punto fronterizo o solicitud de empleo"
                value={data.falsaDeclaracionLugar || ""}
                onChange={(e) => handleChange("falsaDeclaracionLugar", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="falsaDeclaracionFecha" className="label-caps">
                Fecha de la declaración
              </label>
              <input
                id="falsaDeclaracionFecha"
                type="text"
                className="input-glass"
                placeholder="Ej. Octubre 2015"
                value={data.falsaDeclaracionFecha || ""}
                onChange={(e) => handleChange("falsaDeclaracionFecha", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="falsaDeclaracionComo" className="label-caps">
                ¿Cómo o en qué documento se declaró ciudadano?
              </label>
              <input
                id="falsaDeclaracionComo"
                type="text"
                className="input-glass"
                placeholder="Ej. Formulario I-9, verbalmente, acta de nacimiento falsa"
                value={data.falsaDeclaracionComo || ""}
                onChange={(e) => handleChange("falsaDeclaracionComo", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="falsaDeclaracionIntencion" className="label-caps">
                ¿Cuál era la intención de declararse ciudadano?
              </label>
              <input
                id="falsaDeclaracionIntencion"
                type="text"
                className="input-glass"
                placeholder="Ej. Obtener empleo o ingresar al país"
                value={data.falsaDeclaracionIntencion || ""}
                onChange={(e) => handleChange("falsaDeclaracionIntencion", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="falsaDeclaracionDetalle" className="label-caps">
                Detalles / Explicación adicional
              </label>
              <textarea
                id="falsaDeclaracionDetalle"
                rows={2}
                className="input-glass resize-none"
                placeholder="Ej. El cliente indica que un empleador le pidió declarar ciudadanía..."
                value={data.falsaDeclaracionDetalle || ""}
                onChange={(e) => handleChange("falsaDeclaracionDetalle", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Tabla / Checklist de FOIA */}
        <div className="border-t border-brand-100/30 pt-4 space-y-3">
          <h4 className="label-caps text-xs text-brand-600 font-bold">
            FOIA(s) a requerir (Chequeo de agencias)
          </h4>
          <p className="text-xs text-brand-500/80 pb-1">
            Seleccione las agencias a las que se les solicitará FOIA y especifique el motivo correspondiente.
          </p>

          <div className="overflow-x-auto rounded-xl border border-brand-100 bg-white/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-50/70 border-b border-brand-100">
                  <th className="p-3 text-xs font-semibold uppercase tracking-wider text-brand-600 w-1/4">Agencia</th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wider text-brand-600 w-1/4">¿Solicitar?</th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wider text-brand-600 w-2/4">Motivo / Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100/50 text-sm">
                {(["uscis", "ice", "cbp", "eoir", "fbi", "policia"] as const).map((agency) => {
                  const labelMap = {
                    uscis: "USCIS",
                    ice: "ICE",
                    cbp: "CBP",
                    eoir: "EOIR (Corte)",
                    fbi: "FBI",
                    policia: "Policía (Local/Estado)",
                  };
                  const agencyData = data.foias?.[agency] || { solicitar: "no", motivo: "" };

                  return (
                    <tr key={agency} className="hover:bg-brand-50/20 transition-colors">
                      <td className="p-3 font-medium text-brand-900">{labelMap[agency]}</td>
                      <td className="p-3">
                        <select
                          className="input-glass !py-1 !px-2 text-xs"
                          value={agencyData.solicitar || "no"}
                          onChange={(e) => handleFoiaChange(agency, "solicitar", e.target.value)}
                        >
                          <option value="no">No</option>
                          <option value="si">Sí</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          className="input-glass !py-1 !px-2 text-xs w-full"
                          placeholder={`Ej. Historial completo con ${labelMap[agency]}`}
                          disabled={agencyData.solicitar !== "si"}
                          value={agencyData.motivo || ""}
                          onChange={(e) => handleFoiaChange(agency, "motivo", e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 7. Documentos y Correos Pendientes */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <h3 className="panel-section-title text-base font-semibold border-b border-brand-100/50 pb-2">
          7. Documentos y Correos Pendientes de Seguimiento
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="documentosPendientes" className="label-caps font-semibold text-brand-700">
              Documentos Pendientes por Recabar / Entregar
            </label>
            <textarea
              id="documentosPendientes"
              rows={4}
              className={fieldInputClass(!!err("documentosPendientes"), "resize-y")}
              aria-invalid={!!err("documentosPendientes")}
              placeholder="Ej. Acta de nacimiento, identificación, comprobante de domicilio..."
              value={data.documentosPendientes || ""}
              onChange={(e) => handleChange("documentosPendientes", e.target.value)}
            />
            <FieldError message={err("documentosPendientes")} />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="correosPendientes" className="label-caps font-semibold text-brand-700">
              Correos / Trámites Pendientes por Enviar
            </label>
            <textarea
              id="correosPendientes"
              rows={4}
              className={fieldInputClass(!!err("correosPendientes"), "resize-y")}
              aria-invalid={!!err("correosPendientes")}
              placeholder="Ej. Enviar formulario para subir documentos, correo con instrucciones..."
              value={data.correosPendientes || ""}
              onChange={(e) => handleChange("correosPendientes", e.target.value)}
            />
            <FieldError message={err("correosPendientes")} />
          </div>
        </div>
      </div>
    </div>
  );
}
