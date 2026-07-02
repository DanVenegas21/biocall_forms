"use client";

import React from "react";
import {
  INADMISSIBILITY_QUESTIONS,
  type CaseBackground,
  type InadQuestionField,
} from "@biocall/shared";
import { FieldError, fieldInputClass } from "@/components/ui/FieldError";

interface InadQuestionnaireProps {
  data: Pick<CaseBackground, InadQuestionField>;
  inadMyUscisDetalle: string;
  getError: (field: string) => string | undefined;
  onFieldChange: (field: string, value: string) => void;
  onMyUscisChange: (inadMyUscis: string, inadMyUscisDetalle: string) => void;
}

export function InadQuestionnaire({
  data,
  inadMyUscisDetalle,
  getError,
  onFieldChange,
  onMyUscisChange,
}: InadQuestionnaireProps) {
  return (
    <div className="space-y-4 divide-y divide-brand-100/30">
      {INADMISSIBILITY_QUESTIONS.map((item) => (
        <React.Fragment key={item.field}>
          <div
            className={`grid grid-cols-1 md:grid-cols-4 gap-4 pt-3${item.number === 1 ? " first:pt-0" : ""}`}
          >
            <span className="text-sm font-medium text-brand-700 md:col-span-3">
              {item.number}. {item.question}
            </span>
            <select
              className="input-glass"
              value={(data[item.field] as string) || (item.field === "inadMyUscis" ? "no" : "")}
              onChange={(e) => {
                const val = e.target.value;
                if (item.field === "inadMyUscis") {
                  if (val === "si") {
                    onMyUscisChange("si", inadMyUscisDetalle);
                  } else {
                    onMyUscisChange(val, "");
                  }
                } else {
                  onFieldChange(item.field, val);
                }
              }}
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
              <option value="no_sabe">No sabe</option>
            </select>
          </div>

          {item.field === "inadMyUscis" && data.inadMyUscis === "si" && (
            <div className="grid grid-cols-1 gap-2 md:col-span-4 p-4 rounded-xl bg-brand-50/40 border border-brand-100/50 animate-fade-in">
              <label htmlFor="inadMyUscisDetalle" className="label-caps font-semibold text-brand-700">
                Detalles de myUSCIS (Correo, contraseña, preguntas de seguridad, código de recuperación)
              </label>
              <textarea
                id="inadMyUscisDetalle"
                rows={3}
                className={fieldInputClass(!!getError("inadMyUscisDetalle"))}
                aria-invalid={!!getError("inadMyUscisDetalle")}
                placeholder="Ej. Correo: correo@ejemplo.com&#10;Contraseña: ********&#10;Preguntas: 1. Mascota: Nombre...&#10;Código de recuperación: XXX-XXX-XXX"
                value={inadMyUscisDetalle || ""}
                onChange={(e) => onMyUscisChange("si", e.target.value)}
              />
              <FieldError message={getError("inadMyUscisDetalle")} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}