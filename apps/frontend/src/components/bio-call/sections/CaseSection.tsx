"use client";

import React from "react";

interface CaseBackgroundData {
  fechaEntrada: string;
  formaEntrada: string;
  lugarEntrada: string;
  detenidoAlIngresar: string;
  detenidoInmigracion: string;
  cantidadDetencionesInmi: number | "";
  detallesDetencionesInmi: string;
  inmiFotosHuellas: string;
  inmiOrdenDeportacion: string;
  inmiCitaCorte: string;
  inmiRegresoVoluntario: string;
  inmiCastigoSancion: string;
  arrestadoPolicia: string;
  cantidadArrestosPoli: number | "";
  explicacionArresto: string;
  arrestoMotivo: string;
  arrestoFecha: string;
  arrestoLugar: string;
  arrestoPasoNocheCarcel: string;
  arrestoPagoFianza: string;
  arrestoMontoFianza: string;
  arrestoResolucion: string;
  declaradoCiudadano: string;
  foiaRequerir: string;
}

interface CaseSectionProps {
  data: CaseBackgroundData;
  onChange: (fields: Partial<CaseBackgroundData>) => void;
}

export function CaseSection({ data, onChange }: CaseSectionProps) {
  const handleChange = (field: keyof CaseBackgroundData, value: string | number) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 1. Información de Viaje / Entrada */}
      <div className="space-y-4">
        <h3 className="panel-section-title text-base font-semibold border-b border-brand-100/50 pb-2">
          1.1 Información de Entrada a EE. UU.
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="fechaEntrada" className="label-caps">
              Fecha de entrada (Mes y Año o exacta)
            </label>
            <input
              id="fechaEntrada"
              type="text"
              className="input-glass"
              placeholder="Ej. Septiembre 1995"
              value={data.fechaEntrada}
              onChange={(e) => handleChange("fechaEntrada", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="formaEntrada" className="label-caps">
              Forma de entrada
            </label>
            <input
              id="formaEntrada"
              type="text"
              className="input-glass"
              placeholder="Ej. Coyote/EWI o Visa de Turista"
              value={data.formaEntrada}
              onChange={(e) => handleChange("formaEntrada", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lugarEntrada" className="label-caps">
              Lugar de entrada (Puerto o Ciudad/Estado)
            </label>
            <input
              id="lugarEntrada"
              type="text"
              className="input-glass"
              placeholder="Ej. Calexico, CA"
              value={data.lugarEntrada}
              onChange={(e) => handleChange("lugarEntrada", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="detenidoAlIngresar" className="label-caps">
              ¿Fue detenido(a) por inmigración al ingresar?
            </label>
            <select
              id="detenidoAlIngresar"
              className="input-glass"
              value={data.detenidoAlIngresar}
              onChange={(e) => handleChange("detenidoAlIngresar", e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Detenciones por Inmigración */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <h3 className="panel-section-title text-base font-semibold border-b border-brand-100/50 pb-2">
          1.2 Detenciones por Inmigración (Cualquier lugar y fecha)
        </h3>
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
                    cantidadDetencionesInmi: "",
                    detallesDetencionesInmi: "",
                    inmiFotosHuellas: "",
                    inmiOrdenDeportacion: "",
                    inmiCitaCorte: "",
                    inmiRegresoVoluntario: "",
                    inmiCastigoSancion: "",
                  });
                } else {
                  onChange({ detenidoInmigracion: val });
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          {data.detenidoInmigracion === "si" && (
            <div className="flex flex-col gap-2 animate-fade-in">
              <label htmlFor="cantidadDetencionesInmi" className="label-caps">
                ¿Cuántas veces?
              </label>
              <input
                id="cantidadDetencionesInmi"
                type="number"
                min="1"
                className="input-glass"
                placeholder="Ej. 2"
                value={data.cantidadDetencionesInmi}
                onChange={(e) =>
                  handleChange(
                    "cantidadDetencionesInmi",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>
          )}
        </div>

        {data.detenidoInmigracion === "si" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in space-y-2 md:space-y-0">
            <h4 className="label-caps md:col-span-2 border-b border-brand-100/30 pb-1 mb-2">
              Detalles Legales de la Detención
            </h4>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="inmiFotosHuellas" className="label-caps !text-[11px]">
                ¿Le tomaron fotos y huellas?
              </label>
              <select
                id="inmiFotosHuellas"
                className="input-glass"
                value={data.inmiFotosHuellas}
                onChange={(e) => handleChange("inmiFotosHuellas", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="inmiOrdenDeportacion" className="label-caps !text-[11px]">
                ¿Le dieron orden de deportación?
              </label>
              <select
                id="inmiOrdenDeportacion"
                className="input-glass"
                value={data.inmiOrdenDeportacion}
                onChange={(e) => handleChange("inmiOrdenDeportacion", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="inmiCitaCorte" className="label-caps !text-[11px]">
                ¿Le dieron cita en corte con juez de inmigración?
              </label>
              <select
                id="inmiCitaCorte"
                className="input-glass"
                value={data.inmiCitaCorte}
                onChange={(e) => handleChange("inmiCitaCorte", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="inmiRegresoVoluntario" className="label-caps !text-[11px]">
                ¿Lo regresaron voluntariamente (salida voluntaria)?
              </label>
              <select
                id="inmiRegresoVoluntario"
                className="input-glass"
                value={data.inmiRegresoVoluntario}
                onChange={(e) => handleChange("inmiRegresoVoluntario", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="inmiCastigoSancion" className="label-caps !text-[11px]">
                ¿Le dieron algún castigo o sanción migratoria?
              </label>
              <select
                id="inmiCastigoSancion"
                className="input-glass"
                value={data.inmiCastigoSancion}
                onChange={(e) => handleChange("inmiCastigoSancion", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        )}

        {data.detenidoInmigracion === "si" && (
          <div className="flex flex-col gap-2 animate-fade-in">
            <label htmlFor="detallesDetencionesInmi" className="label-caps">
              Comentarios o detalles adicionales de la detención
            </label>
            <textarea
              id="detallesDetencionesInmi"
              rows={4}
              className="input-glass resize-none min-h-[100px]"
              placeholder="Ej. Intento 1: Noviembre 2022, al cruzar la frontera en Texas, me tomaron huellas y fotos, me dieron cita de corte..."
              value={data.detallesDetencionesInmi}
              onChange={(e) => handleChange("detallesDetencionesInmi", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 3. Detenciones por la Policía */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <h3 className="panel-section-title text-base font-semibold border-b border-brand-100/50 pb-2">
          1.3 Arrestos o Detenciones por Policía
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="arrestadoPolicia" className="label-caps text-xs">
              ¿Ha sido arrestado por la policía en EE. UU. o en otro país? (Incluya tickets de tráfico)
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
                    cantidadArrestosPoli: "",
                    explicacionArresto: "",
                    arrestoMotivo: "",
                    arrestoFecha: "",
                    arrestoLugar: "",
                    arrestoPasoNocheCarcel: "",
                    arrestoPagoFianza: "",
                    arrestoMontoFianza: "",
                    arrestoResolucion: "",
                  });
                } else {
                  onChange({ arrestadoPolicia: val });
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          {data.arrestadoPolicia === "si" && (
            <div className="flex flex-col gap-2 animate-fade-in">
              <label htmlFor="cantidadArrestosPoli" className="label-caps">
                ¿Cuántas veces?
              </label>
              <input
                id="cantidadArrestosPoli"
                type="number"
                min="1"
                className="input-glass"
                placeholder="Ej. 1"
                value={data.cantidadArrestosPoli}
                onChange={(e) =>
                  handleChange(
                    "cantidadArrestosPoli",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>
          )}
        </div>

        {data.arrestadoPolicia === "si" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in space-y-2 md:space-y-0">
            <h4 className="label-caps md:col-span-2 border-b border-brand-100/30 pb-1 mb-2">
              Detalles Estructurados del Arresto
            </h4>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="arrestoMotivo" className="label-caps">
                Motivo o Cargo del Arresto
              </label>
              <input
                id="arrestoMotivo"
                type="text"
                className="input-glass"
                placeholder="Ej. Manejar sin licencia, Ticket de tráfico"
                value={data.arrestoMotivo}
                onChange={(e) => handleChange("arrestoMotivo", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="arrestoFecha" className="label-caps">
                Fecha del arresto
              </label>
              <input
                id="arrestoFecha"
                type="text"
                className="input-glass"
                placeholder="Ej. Octubre 2021 o 10/15/2021"
                value={data.arrestoFecha}
                onChange={(e) => handleChange("arrestoFecha", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="arrestoLugar" className="label-caps">
                Lugar (Ciudad, Estado)
              </label>
              <input
                id="arrestoLugar"
                type="text"
                className="input-glass"
                placeholder="Ej. Astoria, Queens, NY"
                value={data.arrestoLugar}
                onChange={(e) => handleChange("arrestoLugar", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="arrestoPasoNocheCarcel" className="label-caps !text-[11px]">
                ¿Pasó la noche en la cárcel / bajo custodia?
              </label>
              <select
                id="arrestoPasoNocheCarcel"
                className="input-glass"
                value={data.arrestoPasoNocheCarcel}
                onChange={(e) => handleChange("arrestoPasoNocheCarcel", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="arrestoPagoFianza" className="label-caps !text-[11px]">
                ¿Pagó fianza (Bail)?
              </label>
              <select
                id="arrestoPagoFianza"
                className="input-glass"
                value={data.arrestoPagoFianza}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== "si") {
                    onChange({ arrestoPagoFianza: val, arrestoMontoFianza: "" });
                  } else {
                    onChange({ arrestoPagoFianza: val });
                  }
                }}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="no_aplica">No aplica</option>
              </select>
            </div>

            {data.arrestoPagoFianza === "si" && (
              <div className="flex flex-col gap-2 md:col-span-2 animate-fade-in">
                <label htmlFor="arrestoMontoFianza" className="label-caps">
                  Monto de la fianza
                </label>
                <input
                  id="arrestoMontoFianza"
                  type="text"
                  className="input-glass"
                  placeholder="Ej. $500 USD"
                  value={data.arrestoMontoFianza}
                  onChange={(e) => handleChange("arrestoMontoFianza", e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="arrestoResolucion" className="label-caps">
                Resultado / Resolución del caso (si se conoce)
              </label>
              <input
                id="arrestoResolucion"
                type="text"
                className="input-glass"
                placeholder="Ej. Caso cerrado, multa pagada, desestimado"
                value={data.arrestoResolucion}
                onChange={(e) => handleChange("arrestoResolucion", e.target.value)}
              />
            </div>
          </div>
        )}

        {data.arrestadoPolicia === "si" && (
          <div className="flex flex-col gap-2 animate-fade-in">
            <label htmlFor="explicacionArresto" className="label-caps">
              Comentarios o aclaraciones adicionales del arresto
            </label>
            <textarea
              id="explicacionArresto"
              rows={3}
              className="input-glass resize-none min-h-[80px]"
              placeholder="Ej. Corregí información del intake. Fui a la corte y pagué la multa."
              value={data.explicacionArresto}
              onChange={(e) => handleChange("explicacionArresto", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 4. Declaración de Ciudadanía y FOIA */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <h3 className="panel-section-title text-base font-semibold border-b border-brand-100/50 pb-2">
          1.4 Declaración de Ciudadanía y Solicitudes Legales
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
              onChange={(e) => handleChange("declaradoCiudadano", e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="foiaRequerir" className="label-caps">
              FOIA(s) a requerir (si aplica)
            </label>
            <input
              id="foiaRequerir"
              type="text"
              className="input-glass"
              placeholder="Ej. CBP / OBIM / USCIS"
              value={data.foiaRequerir}
              onChange={(e) => handleChange("foiaRequerir", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
