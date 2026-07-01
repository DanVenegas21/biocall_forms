-- =============================================================================
-- Bio Call — esquema alineado al formulario del frontend
-- Fuente de campos: BioCallForm.tsx + packages/shared/src/schemas.ts
-- Oficina Manuel Solis
--
-- Supabase → SQL Editor → pegar TODO el archivo → Run.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE bio_call_status AS ENUM ('draft', 'in_review', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Tabla raiz: una fila = una Bio Call del cliente
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bio_calls (
  id                  TEXT PRIMARY KEY,
  form_capture_status bio_call_status NOT NULL DEFAULT 'draft',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE bio_calls IS 'Registro raiz de cada Bio Call capturada.';

-- ---------------------------------------------------------------------------
-- Seccion: datos-personales (1:1) — personalData
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bio_call_personal_data (
  bio_call_id         TEXT PRIMARY KEY REFERENCES bio_calls (id) ON DELETE CASCADE,
  nombres             TEXT NOT NULL,
  apellido_paterno    TEXT NOT NULL,
  apellido_materno    TEXT,
  otros_nombres       TEXT,
  fecha_nacimiento    DATE NOT NULL,
  ciudad_nacimiento   TEXT,
  estado_nacimiento   TEXT,
  pais_nacimiento     TEXT,
  sexo                TEXT,
  estado_civil        TEXT,
  nacionalidad        TEXT NOT NULL,
  comprende_ingles    TEXT,
  idioma_preferido    TEXT,
  habla_otro_idioma   TEXT,
  especificar_idioma  TEXT
);

COMMENT ON TABLE bio_call_personal_data IS 'Seccion: Datos personales (PersonalDataSection).';

-- ---------------------------------------------------------------------------
-- Seccion: contacto (1:1) — contact
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bio_call_contact (
  bio_call_id         TEXT PRIMARY KEY REFERENCES bio_calls (id) ON DELETE CASCADE,
  telefono            TEXT NOT NULL,
  correo_electronico  TEXT NOT NULL
);

COMMENT ON TABLE bio_call_contact IS 'Seccion: Telefono y correo (ContactSection).';

-- ---------------------------------------------------------------------------
-- Seccion: domicilio (1:1) — address
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bio_call_address (
  bio_call_id             TEXT PRIMARY KEY REFERENCES bio_calls (id) ON DELETE CASCADE,
  calle_numero            TEXT NOT NULL,
  apto_suite              TEXT,
  ciudad                  TEXT NOT NULL,
  estado                  TEXT NOT NULL,
  codigo_postal           TEXT NOT NULL,
  pais                    TEXT,
  fecha_ingreso           TEXT,
  residido_otros_lugares  TEXT
);

COMMENT ON TABLE bio_call_address IS 'Seccion: Domicilio actual (AddressSection).';
COMMENT ON COLUMN bio_call_address.residido_otros_lugares IS 'si | no — si ha vivido en otros lugares.';

-- Direcciones anteriores (1:N) — address.direccionesAnteriores[]
CREATE TABLE IF NOT EXISTS bio_call_previous_addresses (
  id              TEXT PRIMARY KEY,
  bio_call_id     TEXT NOT NULL REFERENCES bio_calls (id) ON DELETE CASCADE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  calle_numero    TEXT,
  apto_suite      TEXT,
  ciudad          TEXT,
  estado          TEXT,
  codigo_postal   TEXT,
  pais            TEXT,
  fecha_desde     TEXT,
  fecha_hasta     TEXT
);

CREATE INDEX IF NOT EXISTS bio_call_previous_addresses_bio_call_id_idx
  ON bio_call_previous_addresses (bio_call_id, sort_order);

COMMENT ON TABLE bio_call_previous_addresses IS 'Direcciones anteriores del cliente (lista repetible).';

-- ---------------------------------------------------------------------------
-- Seccion: documentos (1:1) — documents
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bio_call_documents (
  bio_call_id         TEXT PRIMARY KEY REFERENCES bio_calls (id) ON DELETE CASCADE,
  tiene_pasaporte     TEXT,
  pasaporte_pendiente TEXT,
  numero_pasaporte    TEXT,
  pais_emision        TEXT,
  fecha_emision       DATE,
  fecha_expiracion    DATE,
  tiene_a_number      TEXT,
  a_number_value      TEXT,
  a_number_origen     TEXT,
  tiene_ssn           TEXT,
  ssn_value           TEXT,
  tiene_ead           TEXT,
  ead_value           TEXT
);

COMMENT ON TABLE bio_call_documents IS 'Seccion: Documentos e identificacion (DocumentsSection).';

-- ---------------------------------------------------------------------------
-- Seccion: familia (1:1 + listas) — family
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bio_call_family (
  bio_call_id              TEXT PRIMARY KEY REFERENCES bio_calls (id) ON DELETE CASCADE,
  tiene_conyuge            TEXT,
  nombres_conyuge          TEXT,
  apellido_paterno_conyuge TEXT,
  apellido_materno_conyuge       TEXT,
  fecha_lugar_matrimonio_conyuge TEXT,
  fecha_lugar_nacimiento_conyuge TEXT,
  nombre_padre                   TEXT,
  nombre_madre             TEXT,
  casado                   TEXT,
  previamente_casado       TEXT,
  tiene_hijos              TEXT
);

COMMENT ON TABLE bio_call_family IS 'Seccion: Conyuge, padres y banderas familiares (FamilySection).';

-- Hijos (1:N) — family.hijos[]
CREATE TABLE IF NOT EXISTS bio_call_children (
  id                  TEXT PRIMARY KEY,
  bio_call_id         TEXT NOT NULL REFERENCES bio_calls (id) ON DELETE CASCADE,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  nombre              TEXT,
  fecha_nacimiento    TEXT,
  lugar_nacimiento    TEXT,
  lugar_residencia    TEXT
);

CREATE INDEX IF NOT EXISTS bio_call_children_bio_call_id_idx
  ON bio_call_children (bio_call_id, sort_order);

COMMENT ON TABLE bio_call_children IS 'Hijos del cliente (lista repetible).';

-- Matrimonios previos (1:N) — family.matrimoniosPrevios[]
CREATE TABLE IF NOT EXISTS bio_call_previous_marriages (
  id                        TEXT PRIMARY KEY,
  bio_call_id               TEXT NOT NULL REFERENCES bio_calls (id) ON DELETE CASCADE,
  sort_order                INTEGER NOT NULL DEFAULT 0,
  nombre_ex_conyuge         TEXT,
  fecha_lugar_matrimonio    TEXT,
  fecha_lugar_nacimiento    TEXT,
  fecha_lugar_divorcio      TEXT
);

CREATE INDEX IF NOT EXISTS bio_call_previous_marriages_bio_call_id_idx
  ON bio_call_previous_marriages (bio_call_id, sort_order);

COMMENT ON TABLE bio_call_previous_marriages IS 'Matrimonios previos del cliente (lista repetible).';

-- ---------------------------------------------------------------------------
-- Seccion: caso / antecedentes (1:1 + listas) — caseBackground
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bio_call_case_background (
  bio_call_id                     TEXT PRIMARY KEY REFERENCES bio_calls (id) ON DELETE CASCADE,
  viajes_comentarios              TEXT,
  detenido_inmigracion            TEXT,
  arrestado_policia               TEXT,
  empleo_nombre                   TEXT,
  empleo_ocupacion                TEXT,
  empleo_direccion_calle          TEXT,
  empleo_direccion_apto           TEXT,
  empleo_direccion_ciudad         TEXT,
  empleo_direccion_estado         TEXT,
  empleo_direccion_zip            TEXT,
  empleo_direccion_pais           TEXT,
  empleo_fecha_ingreso            TEXT,
  empleo_fecha_salida             TEXT,
  empleo_otros_lugares            TEXT,
  inad_detencion_trafico          TEXT DEFAULT 'no',
  inad_cometido_delito            TEXT DEFAULT 'no',
  inad_inmunidad_diplomatica      TEXT DEFAULT 'no',
  inad_prostitucion_trafico       TEXT DEFAULT 'no',
  inad_ayuda_ingreso_ilegal       TEXT DEFAULT 'no',
  inad_terrorismo                 TEXT DEFAULT 'no',
  inad_fondos_terrorismo          TEXT DEFAULT 'no',
  inad_asociacion_terrorista      TEXT DEFAULT 'no',
  inad_espionaje                  TEXT DEFAULT 'no',
  inad_partido_comunista          TEXT DEFAULT 'no',
  inad_participado_persecucion    TEXT DEFAULT 'no',
  inad_procedimiento_remocion     TEXT DEFAULT 'no',
  inad_denegado_visa              TEXT DEFAULT 'no',
  inad_visa_t                     TEXT DEFAULT 'no',
  inad_my_uscis                   TEXT DEFAULT 'no',
  inad_my_uscis_detalle           TEXT,
  inad_grupo_militar              TEXT DEFAULT 'no',
  inad_fraude_migratorio          TEXT DEFAULT 'no',
  inad_trastorno_fisico_mental    TEXT DEFAULT 'no',
  inad_enfermedad_publica         TEXT DEFAULT 'no',
  inad_adicto_drogas              TEXT DEFAULT 'no',
  declarado_ciudadano             TEXT,
  falsa_declaracion_lugar         TEXT,
  falsa_declaracion_fecha         TEXT,
  falsa_declaracion_como          TEXT,
  falsa_declaracion_intencion     TEXT,
  falsa_declaracion_detalle       TEXT,
  foia_uscis_solicitar            TEXT DEFAULT 'no',
  foia_uscis_motivo               TEXT,
  foia_ice_solicitar              TEXT DEFAULT 'no',
  foia_ice_motivo                 TEXT,
  foia_cbp_solicitar              TEXT DEFAULT 'no',
  foia_cbp_motivo                 TEXT,
  foia_eoir_solicitar             TEXT DEFAULT 'no',
  foia_eoir_motivo                TEXT,
  foia_fbi_solicitar              TEXT DEFAULT 'no',
  foia_fbi_motivo                 TEXT,
  foia_policia_solicitar          TEXT DEFAULT 'no',
  foia_policia_motivo             TEXT,
  documentos_pendientes           TEXT,
  correos_pendientes              TEXT
);

COMMENT ON TABLE bio_call_case_background IS 'Seccion: Antecedentes del caso — campos escalares (CaseSection).';

-- Viajes a EE.UU. (1:N) — caseBackground.viajes[]
CREATE TABLE IF NOT EXISTS bio_call_trips (
  id                  TEXT PRIMARY KEY,
  bio_call_id         TEXT NOT NULL REFERENCES bio_calls (id) ON DELETE CASCADE,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  fecha_entrada       TEXT,
  forma_entrada       TEXT,
  lugar_entrada       TEXT,
  fecha_salida        TEXT,
  fue_detenido        TEXT,
  detalles_detencion  TEXT
);

CREATE INDEX IF NOT EXISTS bio_call_trips_bio_call_id_idx
  ON bio_call_trips (bio_call_id, sort_order);

COMMENT ON TABLE bio_call_trips IS 'Historial de viajes / entradas a EE.UU. (lista repetible).';

-- Detenciones de inmigracion (1:N) — caseBackground.detencionesInmi[]
CREATE TABLE IF NOT EXISTS bio_call_immigration_detentions (
  id                  TEXT PRIMARY KEY,
  bio_call_id         TEXT NOT NULL REFERENCES bio_calls (id) ON DELETE CASCADE,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  lugar               TEXT,
  fecha               TEXT,
  autoridad           TEXT,
  orden_deportacion   TEXT,
  sancion_castigo     TEXT,
  regreso_voluntario  TEXT,
  fotos_huellas       TEXT,
  cita_corte          TEXT
);

CREATE INDEX IF NOT EXISTS bio_call_immigration_detentions_bio_call_id_idx
  ON bio_call_immigration_detentions (bio_call_id, sort_order);

COMMENT ON TABLE bio_call_immigration_detentions IS 'Detenciones por inmigracion (lista repetible).';

-- Arrestos de policia (1:N) — caseBackground.arrestosPolicia[]
CREATE TABLE IF NOT EXISTS bio_call_police_arrests (
  id                  TEXT PRIMARY KEY,
  bio_call_id         TEXT NOT NULL REFERENCES bio_calls (id) ON DELETE CASCADE,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  pais_ciudad_estado  TEXT,
  fecha               TEXT,
  motivo              TEXT,
  autoridad           TEXT,
  disposicion         TEXT
);

CREATE INDEX IF NOT EXISTS bio_call_police_arrests_bio_call_id_idx
  ON bio_call_police_arrests (bio_call_id, sort_order);

COMMENT ON TABLE bio_call_police_arrests IS 'Arrestos o detenciones policiales (lista repetible).';

-- Empleos anteriores (1:N) — caseBackground.empleosAnteriores[]
CREATE TABLE IF NOT EXISTS bio_call_previous_employments (
  id                  TEXT PRIMARY KEY,
  bio_call_id         TEXT NOT NULL REFERENCES bio_calls (id) ON DELETE CASCADE,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  empresa             TEXT,
  puesto              TEXT,
  direccion_calle     TEXT,
  direccion_apto      TEXT,
  direccion_ciudad    TEXT,
  direccion_estado    TEXT,
  direccion_zip       TEXT,
  direccion_pais      TEXT,
  fecha_desde         TEXT,
  fecha_hasta         TEXT
);

CREATE INDEX IF NOT EXISTS bio_call_previous_employments_bio_call_id_idx
  ON bio_call_previous_employments (bio_call_id, sort_order);

COMMENT ON TABLE bio_call_previous_employments IS 'Empleos anteriores del cliente (lista repetible).';

-- ---------------------------------------------------------------------------
-- PDFs generados (Storage + metadatos)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bio_call_generated_pdfs (
  id               TEXT PRIMARY KEY,
  bio_call_id      TEXT NOT NULL REFERENCES bio_calls (id) ON DELETE CASCADE,
  storage_path     TEXT NOT NULL,
  template_version TEXT NOT NULL DEFAULT 'v1',
  file_size_bytes  INTEGER,
  generated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_current       BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS bio_call_generated_pdfs_bio_call_id_idx
  ON bio_call_generated_pdfs (bio_call_id, is_current);

CREATE UNIQUE INDEX IF NOT EXISTS bio_call_generated_pdfs_one_current_idx
  ON bio_call_generated_pdfs (bio_call_id)
  WHERE is_current = true;

COMMENT ON TABLE bio_call_generated_pdfs IS 'Metadatos de PDFs generados; archivo en Supabase Storage.';

-- ---------------------------------------------------------------------------
-- Trigger: actualizar updated_at en bio_calls
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_bio_calls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'bio_calls'
  ) THEN
    DROP TRIGGER IF EXISTS bio_calls_set_updated_at ON bio_calls;

    CREATE TRIGGER bio_calls_set_updated_at
      BEFORE UPDATE ON bio_calls
      FOR EACH ROW
      EXECUTE FUNCTION set_bio_calls_updated_at();
  END IF;
END $$;

-- Verificacion: debe listar 15 tablas bio_call*
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'bio_call%'
ORDER BY table_name;
