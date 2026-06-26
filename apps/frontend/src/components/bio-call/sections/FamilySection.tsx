"use client";

import React from "react";

interface FamilyData {
  tieneConyuge: string;
  nombresConyuge: string;
  apellidoPaternoConyuge: string;
  apellidoMaternoConyuge: string;
  tieneHijos: string;
  cantidadHijos: number | "";
}

interface FamilySectionProps {
  data: FamilyData;
  onChange: (fields: Partial<FamilyData>) => void;
}

export function FamilySection({ data, onChange }: FamilySectionProps) {
  const handleChange = (field: keyof FamilyData, value: string | number) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Cónyuge */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
        <div className="flex flex-col gap-2">
          <label htmlFor="tieneConyuge" className="label-caps">
            ¿Tiene cónyuge o pareja de hecho?
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
                });
              } else {
                onChange({ tieneConyuge: val });
              }
            }}
          >
            <option value="">Seleccione una opción...</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
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
              placeholder="Ej. María del Carmen"
              value={data.nombresConyuge}
              onChange={(e) => handleChange("nombresConyuge", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="apellidoPaternoConyuge" className="label-caps">
              Apellido Paternal
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
              Apellido Maternal
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
        </div>
      )}

      {/* Hijos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start pt-4 border-t border-brand-100/50">
        <div className="flex flex-col gap-2">
          <label htmlFor="tieneHijos" className="label-caps">
            ¿Tiene hijos?
          </label>
          <select
            id="tieneHijos"
            className="input-glass"
            value={data.tieneHijos}
            onChange={(e) => {
              const val = e.target.value;
              if (val !== "si") {
                onChange({ tieneHijos: val, cantidadHijos: "" });
              } else {
                onChange({ tieneHijos: val });
              }
            }}
          >
            <option value="">Seleccione una opción...</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        {data.tieneHijos === "si" && (
          <div className="flex flex-col gap-2 animate-fade-in">
            <label htmlFor="cantidadHijos" className="label-caps">
              Número de hijos
            </label>
            <input
              id="cantidadHijos"
              type="number"
              min="1"
              className="input-glass"
              placeholder="Ej. 2"
              value={data.cantidadHijos}
              onChange={(e) =>
                handleChange(
                  "cantidadHijos",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
