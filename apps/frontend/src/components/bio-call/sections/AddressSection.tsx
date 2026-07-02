"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import { FieldError, fieldInputClass } from "@/components/ui/FieldError";
import { SectionErrorBanner } from "@/components/ui/SectionErrorBanner";
import { getFieldError } from "@/lib/formErrors";
import { BioCallFieldLabel } from "../BioCallFieldLabel";

const PREFIX = "address";

export interface DireccionAnteriorData {
  calleNumero: string;
  aptoSuite: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
  fechaDesde: string;
  fechaHasta: string;
}

interface AddressData {
  calleNumero: string;
  aptoSuite: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
  fechaIngreso: string;
  resididoOtrosLugares: string;
  direccionesAnteriores: DireccionAnteriorData[];
}

interface AddressSectionProps {
  data: AddressData;
  errors?: Record<string, string>;
  onChange: (fields: Partial<AddressData>) => void;
}

export function AddressSection({ data, errors, onChange }: AddressSectionProps) {
  const err = (field: keyof AddressData) => getFieldError(errors, `${PREFIX}.${field}`);
  const errDir = (index: number, field: keyof DireccionAnteriorData) =>
    getFieldError(errors, `${PREFIX}.direccionesAnteriores.${index}.${field}`);
  const handleChange = (field: keyof AddressData, value: string) => {
    onChange({ [field]: value });
  };

  const addDireccion = () => {
    const current = data.direccionesAnteriores || [];
    onChange({
      direccionesAnteriores: [
        ...current,
        {
          calleNumero: "",
          aptoSuite: "",
          ciudad: "",
          estado: "",
          codigoPostal: "",
          pais: "",
          fechaDesde: "",
          fechaHasta: "",
        },
      ],
    });
  };

  const removeDireccion = (index: number) => {
    const current = data.direccionesAnteriores || [];
    onChange({
      direccionesAnteriores: current.filter((_, i) => i !== index),
    });
  };

  const handleDireccionChange = (index: number, field: keyof DireccionAnteriorData, value: string) => {
    const current = data.direccionesAnteriores || [];
    const updated = current.map((item, i) => {
      if (i === index) return { ...item, [field]: value };
      return item;
    });
    onChange({ direccionesAnteriores: updated });
  };

  return (
    <div className="space-y-6">
      <SectionErrorBanner errors={errors} prefix={PREFIX} />
      {/* Dirección actual */}
      <div className="space-y-4">
        <h3 className="panel-section-title text-base font-semibold border-b border-brand-100/50 pb-2">
          Dirección Residencial Actual
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2 md:col-span-2">
            <BioCallFieldLabel path="address.calleNumero" htmlFor="calleNumero" />
            <input
              id="calleNumero"
              type="text"
              className="input-glass"
              placeholder="Ej. Av. Principal 123"
              value={data.calleNumero || ""}
              onChange={(e) => handleChange("calleNumero", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <BioCallFieldLabel path="address.aptoSuite" htmlFor="aptoSuite" />
            <input
              id="aptoSuite"
              type="text"
              className="input-glass"
              placeholder="Ej. Depto. 4B (opcional)"
              value={data.aptoSuite || ""}
              onChange={(e) => handleChange("aptoSuite", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <BioCallFieldLabel path="address.ciudad" htmlFor="ciudad" />
            <input
              id="ciudad"
              type="text"
              className="input-glass"
              placeholder="Ej. Ciudad de México"
              value={data.ciudad || ""}
              onChange={(e) => handleChange("ciudad", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <BioCallFieldLabel path="address.estado" htmlFor="estado" />
            <input
              id="estado"
              type="text"
              className="input-glass"
              placeholder="Ej. CDMX"
              value={data.estado || ""}
              onChange={(e) => handleChange("estado", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <BioCallFieldLabel path="address.codigoPostal" htmlFor="codigoPostal" />
            <input
              id="codigoPostal"
              type="text"
              maxLength={15}
              className={fieldInputClass(!!err("codigoPostal"))}
              aria-invalid={!!err("codigoPostal")}
              placeholder="Ej. 70363"
              value={data.codigoPostal || ""}
              onChange={(e) => handleChange("codigoPostal", e.target.value)}
            />
            <FieldError message={err("codigoPostal")} />
          </div>

          <div className="flex flex-col gap-2">
            <BioCallFieldLabel path="address.pais" htmlFor="pais" />
            <input
              id="pais"
              type="text"
              className="input-glass"
              placeholder="Ej. México"
              value={data.pais || ""}
              onChange={(e) => handleChange("pais", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <BioCallFieldLabel path="address.fechaIngreso" htmlFor="fechaIngreso" />
            <input
              id="fechaIngreso"
              type="text"
              className="input-glass"
              placeholder="Ej. Diciembre 2018"
              value={data.fechaIngreso || ""}
              onChange={(e) => handleChange("fechaIngreso", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Historial previo de 5 años */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-100/50 pb-2">
          <h3 className="panel-section-title text-base font-semibold">
            ¿Ha residido en algún otro domicilio en los últimos 5 años?
          </h3>
          {data.resididoOtrosLugares === "si" && (
            <GlassButton
              type="button"
              variant="ghost"
              size="xs"
              className="uppercase tracking-wider"
              leftIcon={<Plus className="h-3 w-3" aria-hidden="true" />}
              onClick={addDireccion}
            >
              Agregar Dirección Anterior
            </GlassButton>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-2 md:col-span-2">
            <select
              id="resididoOtrosLugares"
              className="input-glass max-w-xs"
              value={data.resididoOtrosLugares}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "si") {
                  onChange({ resididoOtrosLugares: val, direccionesAnteriores: [] });
                } else {
                  onChange({ resididoOtrosLugares: val });
                  if ((data.direccionesAnteriores || []).length === 0) {
                    onChange({
                      resididoOtrosLugares: val,
                      direccionesAnteriores: [
                        {
                          calleNumero: "",
                          aptoSuite: "",
                          ciudad: "",
                          estado: "",
                          codigoPostal: "",
                          pais: "",
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
        </div>

        {data.resididoOtrosLugares === "si" && (data.direccionesAnteriores || []).map((dir, idx) => (
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
              aria-label={`Eliminar dirección anterior ${idx + 1}`}
              onClick={() => removeDireccion(idx)}
            />

            <h4 className="label-caps md:col-span-3 text-brand-600 font-bold border-b border-brand-100/30 pb-1 mb-1">
              Dirección Anterior #{idx + 1}
            </h4>

            <div className="flex flex-col gap-2 md:col-span-2">
              <BioCallFieldLabel path={`address.direccionesAnteriores.${idx}.calleNumero`} htmlFor={`dir-${idx}-calleNumero`} />
              <input
                id={`dir-${idx}-calleNumero`}
                type="text"
                className="input-glass"
                placeholder="Ej. Calle Secundaria 456"
                value={dir.calleNumero}
                onChange={(e) => handleDireccionChange(idx, "calleNumero", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <BioCallFieldLabel path={`address.direccionesAnteriores.${idx}.aptoSuite`} htmlFor={`dir-${idx}-aptoSuite`} />
              <input
                id={`dir-${idx}-aptoSuite`}
                type="text"
                className="input-glass"
                placeholder="Ej. Depto. 2A"
                value={dir.aptoSuite}
                onChange={(e) => handleDireccionChange(idx, "aptoSuite", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <BioCallFieldLabel path={`address.direccionesAnteriores.${idx}.ciudad`} htmlFor={`dir-${idx}-ciudad`} />
              <input
                id={`dir-${idx}-ciudad`}
                type="text"
                className="input-glass"
                placeholder="Ej. Guadalajara"
                value={dir.ciudad}
                onChange={(e) => handleDireccionChange(idx, "ciudad", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <BioCallFieldLabel path={`address.direccionesAnteriores.${idx}.estado`} htmlFor={`dir-${idx}-estado`} />
              <input
                id={`dir-${idx}-estado`}
                type="text"
                className="input-glass"
                placeholder="Ej. Jalisco"
                value={dir.estado}
                onChange={(e) => handleDireccionChange(idx, "estado", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <BioCallFieldLabel path={`address.direccionesAnteriores.${idx}.codigoPostal`} htmlFor={`dir-${idx}-codigoPostal`} />
              <input
                id={`dir-${idx}-codigoPostal`}
                type="text"
                maxLength={15}
                className={fieldInputClass(!!errDir(idx, "codigoPostal"))}
                aria-invalid={!!errDir(idx, "codigoPostal")}
                placeholder="Ej. 11377"
                value={dir.codigoPostal}
                onChange={(e) => handleDireccionChange(idx, "codigoPostal", e.target.value)}
              />
              <FieldError message={errDir(idx, "codigoPostal")} />
            </div>

            <div className="flex flex-col gap-2">
              <BioCallFieldLabel path={`address.direccionesAnteriores.${idx}.pais`} htmlFor={`dir-${idx}-pais`} />
              <input
                id={`dir-${idx}-pais`}
                type="text"
                className="input-glass"
                placeholder="Ej. México"
                value={dir.pais}
                onChange={(e) => handleDireccionChange(idx, "pais", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <BioCallFieldLabel path={`address.direccionesAnteriores.${idx}.fechaDesde`} htmlFor={`dir-${idx}-fechaDesde`} />
              <input
                id={`dir-${idx}-fechaDesde`}
                type="text"
                className="input-glass"
                placeholder="Ej. Enero 2019"
                value={dir.fechaDesde}
                onChange={(e) => handleDireccionChange(idx, "fechaDesde", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <BioCallFieldLabel path={`address.direccionesAnteriores.${idx}.fechaHasta`} htmlFor={`dir-${idx}-fechaHasta`} />
              <input
                id={`dir-${idx}-fechaHasta`}
                type="text"
                className="input-glass"
                placeholder="Ej. Abril 2023"
                value={dir.fechaHasta}
                onChange={(e) => handleDireccionChange(idx, "fechaHasta", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
