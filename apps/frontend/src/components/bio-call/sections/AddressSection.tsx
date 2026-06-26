"use client";

import React from "react";

interface AddressData {
  direccionCompleta: string;
  fechaIngreso: string;
}

interface AddressSectionProps {
  data: AddressData;
  onChange: (fields: Partial<AddressData>) => void;
}

export function AddressSection({ data, onChange }: AddressSectionProps) {
  const handleChange = (field: keyof AddressData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="direccionCompleta" className="label-caps">
          Dirección actual (Completa, tal como aparece en servicios/mapas)
        </label>
        <input
          id="direccionCompleta"
          type="text"
          className="input-glass"
          placeholder="Ej. 2058 Autumn Lane, Morristown, Tennessee 37814"
          value={data.direccionCompleta}
          onChange={(e) => handleChange("direccionCompleta", e.target.value)}
        />
        <p className="text-xs text-brand-500/80">
          Nota: Se recomienda verificar la dirección en Google Maps.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="fechaIngreso" className="label-caps">
            Fecha de ingreso a esta dirección (Mes y Año o Fecha exacta)
          </label>
          <input
            id="fechaIngreso"
            type="text"
            className="input-glass"
            placeholder="Ej. Mayo 2023 o Septiembre 2016"
            value={data.fechaIngreso}
            onChange={(e) => handleChange("fechaIngreso", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
