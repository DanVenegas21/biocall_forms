"use client";

import React from "react";
import { FieldError, fieldInputClass } from "@/components/ui/FieldError";
import { getFieldError } from "@/lib/formErrors";
import { BioCallFieldLabel } from "../BioCallFieldLabel";

const PREFIX = "contact";

interface ContactData {
  telefono: string;
  correoElectronico: string;
}

interface ContactSectionProps {
  data: ContactData;
  errors?: Record<string, string>;
  onChange: (fields: Partial<ContactData>) => void;
}

export function ContactSection({ data, errors, onChange }: ContactSectionProps) {
  const err = (field: keyof ContactData) => getFieldError(errors, `${PREFIX}.${field}`);

  const handleChange = (field: keyof ContactData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <BioCallFieldLabel path="contact.telefono" htmlFor="telefono" />
        <input
          id="telefono"
          type="tel"
          className={fieldInputClass(!!err("telefono"))}
          aria-invalid={!!err("telefono")}
          maxLength={20}
          placeholder="Ej. 423-353-0235 o 3474051108"
          value={data.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
        />
        <FieldError message={err("telefono")} />
      </div>

      <div className="flex flex-col gap-2">
        <BioCallFieldLabel path="contact.correoElectronico" htmlFor="correoElectronico" />
        <input
          id="correoElectronico"
          type="email"
          className={fieldInputClass(!!err("correoElectronico"))}
          aria-invalid={!!err("correoElectronico")}
          placeholder="Ej. cliente@gmail.com"
          value={data.correoElectronico}
          onChange={(e) => handleChange("correoElectronico", e.target.value)}
        />
        <FieldError message={err("correoElectronico")} />
      </div>
    </div>
  );
}
