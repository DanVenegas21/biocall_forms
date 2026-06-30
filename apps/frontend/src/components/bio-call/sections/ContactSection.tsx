"use client";

import React from "react";

interface ContactData {
  telefono: string;
  correoElectronico: string;
}

interface ContactSectionProps {
  data: ContactData;
  onChange: (fields: Partial<ContactData>) => void;
}

export function ContactSection({ data, onChange }: ContactSectionProps) {
  const handleChange = (field: keyof ContactData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="telefono" className="label-caps">
          Teléfono de contacto
        </label>
        <input
          id="telefono"
          type="tel"
          className="input-glass"
          placeholder="Ej. 555-123-4567"
          value={data.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="correoElectronico" className="label-caps">
          Correo electrónico
        </label>
        <input
          id="correoElectronico"
          type="email"
          className="input-glass"
          placeholder="Ej. correo@ejemplo.com"
          value={data.correoElectronico}
          onChange={(e) => handleChange("correoElectronico", e.target.value)}
        />
      </div>
    </div>
  );
}
