"use client";

import React from "react";

interface PersonalDataData {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
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
  onChange: (fields: Partial<PersonalDataData>) => void;
}

export function PersonalDataSection({ data, onChange }: PersonalDataSectionProps) {
  const handleChange = (field: keyof PersonalDataData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Fila 1: Nombres y Apellidos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="nombres" className="label-caps">
            Nombre(s)
          </label>
          <input
            id="nombres"
            type="text"
            className="input-glass"
            placeholder="Ej. Natalia Hilda"
            value={data.nombres}
            onChange={(e) => handleChange("nombres", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="apellidoPaterno" className="label-caps">
            Apellido Paterno
          </label>
          <input
            id="apellidoPaterno"
            type="text"
            className="input-glass"
            placeholder="Ej. Reyes"
            value={data.apellidoPaterno}
            onChange={(e) => handleChange("apellidoPaterno", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="apellidoMaterno" className="label-caps">
            Apellido Materno
          </label>
          <input
            id="apellidoMaterno"
            type="text"
            className="input-glass"
            placeholder="Ej. González"
            value={data.apellidoMaterno}
            onChange={(e) => handleChange("apellidoMaterno", e.target.value)}
          />
        </div>
      </div>

      {/* Fila 1.1: Otros nombres */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="otrosNombres" className="label-caps">
            Otros nombres utilizados (alias, nombres anteriores, variaciones)
          </label>
          <input
            id="otrosNombres"
            type="text"
            className="input-glass"
            placeholder="Ej. NATALIA REYES (O escribe N/A)"
            value={data.otrosNombres}
            onChange={(e) => handleChange("otrosNombres", e.target.value)}
          />
        </div>
      </div>

      {/* Fila 2: Fecha de nacimiento, Lugar de nacimiento y Sexo */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="fechaNacimiento" className="label-caps">
            Fecha de nacimiento
          </label>
          <input
            id="fechaNacimiento"
            type="date"
            className="input-glass"
            value={data.fechaNacimiento}
            onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="lugarNacimiento" className="label-caps">
            Lugar de nacimiento (Ciudad/Estado/País)
          </label>
          <input
            id="lugarNacimiento"
            type="text"
            className="input-glass"
            placeholder="Ej. Tamaulipas, México"
            value={data.lugarNacimiento}
            onChange={(e) => handleChange("lugarNacimiento", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="sexo" className="label-caps">
            Sexo
          </label>
          <select
            id="sexo"
            className="input-glass"
            value={data.sexo}
            onChange={(e) => handleChange("sexo", e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro / No especificar</option>
          </select>
        </div>
      </div>

      {/* Fila 3: Estado civil y Nacionalidad */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="estadoCivil" className="label-caps">
            Estado civil
          </label>
          <select
            id="estadoCivil"
            className="input-glass"
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
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="nacionalidad" className="label-caps">
            Nacionalidad
          </label>
          <input
            id="nacionalidad"
            type="text"
            className="input-glass"
            placeholder="Ej. Mexicana"
            value={data.nacionalidad}
            onChange={(e) => handleChange("nacionalidad", e.target.value)}
          />
        </div>
      </div>

      {/* Idioma y Comprensión (Con lógica condicional) */}
      <div className="border-t border-brand-100/50 pt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="comprendeIngles" className="label-caps">
              ¿Puede leer y comprender inglés?
            </label>
            <select
              id="comprendeIngles"
              className="input-glass"
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
              <option value="parcial">Parcial</option>
            </select>
          </div>

          {(data.comprendeIngles === "no" || data.comprendeIngles === "parcial") && (
            <div className="flex flex-col gap-2 animate-fade-in">
              <label htmlFor="idiomaPreferido" className="label-caps">
                Idioma preferido para comunicación
              </label>
              <input
                id="idiomaPreferido"
                type="text"
                className="input-glass"
                placeholder="Ej. Español"
                value={data.idiomaPreferido}
                onChange={(e) => handleChange("idiomaPreferido", e.target.value)}
              />
            </div>
          )}
        </div>

        {(data.comprendeIngles === "no" || data.comprendeIngles === "parcial") && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start animate-fade-in">
            <div className="flex flex-col gap-2">
              <label htmlFor="hablaOtroIdioma" className="label-caps">
                ¿Habla otro(s) idioma(s) además de español e inglés?
              </label>
              <select
                id="hablaOtroIdioma"
                className="input-glass"
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
            </div>

            {data.hablaOtroIdioma === "si" && (
              <div className="flex flex-col gap-2 animate-fade-in">
                <label htmlFor="especificarIdioma" className="label-caps">
                  Especificar idioma(s)
                </label>
                <input
                  id="especificarIdioma"
                  type="text"
                  className="input-glass"
                  placeholder="Ej. Náhuatl, Francés"
                  value={data.especificarIdioma}
                  onChange={(e) => handleChange("especificarIdioma", e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
