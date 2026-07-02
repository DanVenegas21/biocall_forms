"use client";

import React from "react";
import { FieldError, fieldInputClass } from "@/components/ui/FieldError";
import { getFieldError } from "@/lib/formErrors";
import { BioCallFieldLabel } from "../BioCallFieldLabel";

const PREFIX = "personalData";

interface PersonalDataData {
  nombres: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  ciudadNacimiento: string;
  estadoNacimiento: string;
  paisNacimiento: string;
  sexo: string;
  estadoCivil: string;
  nacionalidad: string;
  comprendeIngles: string;
  idiomaPreferido: string;
  hablaOtroIdioma: string;
  especificarIdioma: string;
  otrosNombres: string;
}

interface PersonalDataSectionProps {
  data: PersonalDataData;
  errors?: Record<string, string>;
  onChange: (fields: Partial<PersonalDataData>) => void;
}

export function PersonalDataSection({ data, errors, onChange }: PersonalDataSectionProps) {
  const err = (field: keyof PersonalDataData) =>
    getFieldError(errors, `${PREFIX}.${field}`);

  const handleChange = (field: keyof PersonalDataData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.nombres" htmlFor="nombres" />
          <input
            id="nombres"
            type="text"
            className={fieldInputClass(!!err("nombres"))}
            aria-invalid={!!err("nombres")}
            placeholder="Ej. Juan"
            value={data.nombres}
            onChange={(e) => handleChange("nombres", e.target.value)}
          />
          <FieldError message={err("nombres")} />
        </div>

        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.segundoNombre" htmlFor="segundoNombre" />
          <input
            id="segundoNombre"
            type="text"
            className={fieldInputClass(!!err("segundoNombre"))}
            aria-invalid={!!err("segundoNombre")}
            placeholder="Ej. Carlos"
            value={data.segundoNombre || ""}
            onChange={(e) => handleChange("segundoNombre", e.target.value)}
          />
          <FieldError message={err("segundoNombre")} />
        </div>

        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.apellidoPaterno" htmlFor="apellidoPaterno" />
          <input
            id="apellidoPaterno"
            type="text"
            className={fieldInputClass(!!err("apellidoPaterno"))}
            aria-invalid={!!err("apellidoPaterno")}
            placeholder="Ej. Pérez"
            value={data.apellidoPaterno}
            onChange={(e) => handleChange("apellidoPaterno", e.target.value)}
          />
          <FieldError message={err("apellidoPaterno")} />
        </div>

        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.apellidoMaterno" htmlFor="apellidoMaterno" />
          <input
            id="apellidoMaterno"
            type="text"
            className={fieldInputClass(!!err("apellidoMaterno"))}
            aria-invalid={!!err("apellidoMaterno")}
            placeholder="Ej. García"
            value={data.apellidoMaterno}
            onChange={(e) => handleChange("apellidoMaterno", e.target.value)}
          />
          <FieldError message={err("apellidoMaterno")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:col-span-2">
          <BioCallFieldLabel path="personalData.otrosNombres" htmlFor="otrosNombres" />
          <input
            id="otrosNombres"
            type="text"
            className={fieldInputClass(!!err("otrosNombres"))}
            aria-invalid={!!err("otrosNombres")}
            placeholder="Ej. JUAN PÉREZ (o escribe N/A)"
            value={data.otrosNombres}
            onChange={(e) => handleChange("otrosNombres", e.target.value)}
          />
          <FieldError message={err("otrosNombres")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.fechaNacimiento" htmlFor="fechaNacimiento" />
          <input
            id="fechaNacimiento"
            type="date"
            className={fieldInputClass(!!err("fechaNacimiento"))}
            aria-invalid={!!err("fechaNacimiento")}
            value={data.fechaNacimiento}
            onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
          />
          <FieldError message={err("fechaNacimiento")} />
        </div>

        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.sexo" htmlFor="sexo" />
          <select
            id="sexo"
            className={fieldInputClass(!!err("sexo"))}
            aria-invalid={!!err("sexo")}
            value={data.sexo}
            onChange={(e) => handleChange("sexo", e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro / No especificar</option>
          </select>
          <FieldError message={err("sexo")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.ciudadNacimiento" htmlFor="ciudadNacimiento" />
          <input
            id="ciudadNacimiento"
            type="text"
            className={fieldInputClass(!!err("ciudadNacimiento"))}
            aria-invalid={!!err("ciudadNacimiento")}
            placeholder="Ej. Ciudad de México"
            value={data.ciudadNacimiento}
            onChange={(e) => handleChange("ciudadNacimiento", e.target.value)}
          />
          <FieldError message={err("ciudadNacimiento")} />
        </div>

        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.estadoNacimiento" htmlFor="estadoNacimiento" />
          <input
            id="estadoNacimiento"
            type="text"
            className={fieldInputClass(!!err("estadoNacimiento"))}
            aria-invalid={!!err("estadoNacimiento")}
            placeholder="Ej. CDMX"
            value={data.estadoNacimiento}
            onChange={(e) => handleChange("estadoNacimiento", e.target.value)}
          />
          <FieldError message={err("estadoNacimiento")} />
        </div>

        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.paisNacimiento" htmlFor="paisNacimiento" />
          <input
            id="paisNacimiento"
            type="text"
            className={fieldInputClass(!!err("paisNacimiento"))}
            aria-invalid={!!err("paisNacimiento")}
            placeholder="Ej. México"
            value={data.paisNacimiento}
            onChange={(e) => handleChange("paisNacimiento", e.target.value)}
          />
          <FieldError message={err("paisNacimiento")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.estadoCivil" htmlFor="estadoCivil" />
          <select
            id="estadoCivil"
            className={fieldInputClass(!!err("estadoCivil"))}
            aria-invalid={!!err("estadoCivil")}
            value={data.estadoCivil}
            onChange={(e) => handleChange("estadoCivil", e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="Soltero(a)">Soltero(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viudo(a)">Viudo(a)</option>
            <option value="Unión libre">Unión libre</option>
          </select>
          <FieldError message={err("estadoCivil")} />
        </div>

        <div className="flex flex-col gap-2">
          <BioCallFieldLabel path="personalData.nacionalidad" htmlFor="nacionalidad" />
          <input
            id="nacionalidad"
            type="text"
            className={fieldInputClass(!!err("nacionalidad"))}
            aria-invalid={!!err("nacionalidad")}
            placeholder="Ej. Mexicana"
            value={data.nacionalidad}
            onChange={(e) => handleChange("nacionalidad", e.target.value)}
          />
          <FieldError message={err("nacionalidad")} />
        </div>
      </div>

      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <BioCallFieldLabel path="personalData.comprendeIngles" htmlFor="comprendeIngles" />
            <select
              id="comprendeIngles"
              className={fieldInputClass(!!err("comprendeIngles"))}
              aria-invalid={!!err("comprendeIngles")}
              value={data.comprendeIngles}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "si") {
                  onChange({ comprendeIngles: val, idiomaPreferido: "", hablaOtroIdioma: "", especificarIdioma: "" });
                } else {
                  onChange({ comprendeIngles: val });
                }
              }}
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
            <FieldError message={err("comprendeIngles")} />
          </div>

          {data.comprendeIngles === "no" && (
            <div className="flex flex-col gap-2 animate-fade-in">
              <BioCallFieldLabel path="personalData.idiomaPreferido" htmlFor="idiomaPreferido" />
              <input
                id="idiomaPreferido"
                type="text"
                className={fieldInputClass(!!err("idiomaPreferido"))}
                aria-invalid={!!err("idiomaPreferido")}
                placeholder="Ej. Español"
                value={data.idiomaPreferido}
                onChange={(e) => handleChange("idiomaPreferido", e.target.value)}
              />
              <FieldError message={err("idiomaPreferido")} />
            </div>
          )}
        </div>

        {data.comprendeIngles === "no" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start animate-fade-in">
            <div className="flex flex-col gap-2">
              <BioCallFieldLabel path="personalData.hablaOtroIdioma" htmlFor="hablaOtroIdioma" />
              <select
                id="hablaOtroIdioma"
                className={fieldInputClass(!!err("hablaOtroIdioma"))}
                aria-invalid={!!err("hablaOtroIdioma")}
                value={data.hablaOtroIdioma}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({ hablaOtroIdioma: val, especificarIdioma: val === "no" ? "NO" : "" });
                }}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
              <FieldError message={err("hablaOtroIdioma")} />
            </div>

            {data.hablaOtroIdioma === "si" && (
              <div className="flex flex-col gap-2 animate-fade-in">
                <BioCallFieldLabel path="personalData.especificarIdioma" htmlFor="especificarIdioma" />
                <input
                  id="especificarIdioma"
                  type="text"
                  className={fieldInputClass(!!err("especificarIdioma"))}
                  aria-invalid={!!err("especificarIdioma")}
                  placeholder="Ej. Inglés, Francés"
                  value={data.especificarIdioma}
                  onChange={(e) => handleChange("especificarIdioma", e.target.value)}
                />
                <FieldError message={err("especificarIdioma")} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
