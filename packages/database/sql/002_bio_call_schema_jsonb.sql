-- =============================================================================
-- Bio Call — esquema SIMPLIFICADO (1 tabla + JSONB + PDFs)
-- Alternativa liviana a 001_bio_call_schema.sql (15 tablas normalizadas).
--
-- Cuándo usar este archivo:
--   • Producción / integración con NOVA: menos tablas, mismo formulario y PDF.
--   • El payload JSONB guarda el BioCall completo (misma forma que POST /api/bio-calls).
--
-- Cuándo NO usar (seguir con 001):
--   • Necesitas consultas SQL por campo en muchas tablas o reportes relacionales.
--
-- Flujo en Supabase (SQL Editor):
--   • BD nueva: ejecutar solo ESTE archivo (002).
--   • Cambiar de 001 a 002: ejecutar 000_bio_call_reset.sql y luego ESTE archivo.
--     (000 borra datos y RLS; reconfigura RLS en Supabase si aplica.)
--
-- NO ejecutar 001 y 002 juntos: son esquemas excluyentes.
--
-- Tablas resultantes: bio_calls, bio_call_generated_pdfs (2 tablas).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE bio_call_status AS ENUM ('draft', 'in_review', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Tabla raiz: una fila = una Bio Call (datos en JSONB)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bio_calls (
  id                  TEXT PRIMARY KEY,
  form_capture_status bio_call_status NOT NULL DEFAULT 'draft',

  -- Snapshot completo del formulario (BioCall de @biocall/shared).
  -- Estructura: { personalData, contact, address, documents, family, caseBackground }
  payload             JSONB NOT NULL,

  -- Version del esquema del payload (para migraciones futuras del JSON).
  payload_version     TEXT NOT NULL DEFAULT '1',

  -- Columnas denormalizadas para busqueda / integracion con NOVA (opcionales al guardar).
  cliente_nombres     TEXT,
  cliente_segundo_nombre TEXT,
  cliente_apellido_paterno TEXT,
  cliente_apellido_materno TEXT,
  telefono            TEXT,
  correo_electronico  TEXT,
  expediente_id       TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT bio_calls_payload_is_object
    CHECK (jsonb_typeof(payload) = 'object')
);

COMMENT ON TABLE bio_calls IS
  'Bio Call: metadatos + payload JSONB completo. Alternativa liviana al modelo relacional de 001.';

COMMENT ON COLUMN bio_calls.payload IS
  'Formulario completo serializado. Misma estructura que bioCallSchema / POST /api/bio-calls.';

COMMENT ON COLUMN bio_calls.payload_version IS
  'Version logica del JSON (incrementar si cambia la forma del payload en la app).';

COMMENT ON COLUMN bio_calls.expediente_id IS
  'Enlace futuro al expediente en NOVA (nullable hasta integracion).';

COMMENT ON COLUMN bio_calls.cliente_nombres IS
  'Copia de personalData.nombres para busqueda sin parsear JSONB.';

-- Indices de busqueda
CREATE INDEX IF NOT EXISTS bio_calls_cliente_nombre_idx
  ON bio_calls (cliente_apellido_paterno, cliente_apellido_materno, cliente_nombres);

CREATE INDEX IF NOT EXISTS bio_calls_telefono_idx
  ON bio_calls (telefono)
  WHERE telefono IS NOT NULL;

CREATE INDEX IF NOT EXISTS bio_calls_correo_idx
  ON bio_calls (correo_electronico)
  WHERE correo_electronico IS NOT NULL;

CREATE INDEX IF NOT EXISTS bio_calls_expediente_id_idx
  ON bio_calls (expediente_id)
  WHERE expediente_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS bio_calls_created_at_idx
  ON bio_calls (created_at DESC);

-- Indice GIN para consultas dentro del JSON (opcional; util en reportes ad hoc).
CREATE INDEX IF NOT EXISTS bio_calls_payload_gin_idx
  ON bio_calls USING GIN (payload jsonb_path_ops);

-- ---------------------------------------------------------------------------
-- PDFs generados (Storage + metadatos) — igual que en 001
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bio_call_generated_pdfs (
  id                TEXT PRIMARY KEY,
  bio_call_id       TEXT NOT NULL REFERENCES bio_calls (id) ON DELETE CASCADE,
  storage_path      TEXT NOT NULL,
  download_filename TEXT,
  template_version  TEXT NOT NULL DEFAULT 'v2.0',
  file_size_bytes   INTEGER,
  generated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_current        BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS bio_call_generated_pdfs_bio_call_id_idx
  ON bio_call_generated_pdfs (bio_call_id, is_current);

CREATE UNIQUE INDEX IF NOT EXISTS bio_call_generated_pdfs_one_current_idx
  ON bio_call_generated_pdfs (bio_call_id)
  WHERE is_current = true;

COMMENT ON TABLE bio_call_generated_pdfs IS
  'Metadatos de PDFs generados; archivo binario en Supabase Storage.';

COMMENT ON COLUMN bio_call_generated_pdfs.download_filename IS
  'Nombre sugerido para descarga (Content-Disposition).';

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

DROP TRIGGER IF EXISTS bio_calls_set_updated_at ON bio_calls;

CREATE TRIGGER bio_calls_set_updated_at
  BEFORE UPDATE ON bio_calls
  FOR EACH ROW
  EXECUTE FUNCTION set_bio_calls_updated_at();

-- ---------------------------------------------------------------------------
-- Funcion auxiliar: sincronizar columnas de busqueda desde payload
-- (opcional; el backend puede hacerlo al guardar en lugar de usar el trigger)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION sync_bio_call_search_columns_from_payload()
RETURNS TRIGGER AS $$
BEGIN
  NEW.cliente_nombres := NULLIF(TRIM(NEW.payload #>> '{personalData,nombres}'), '');
  NEW.cliente_segundo_nombre := NULLIF(TRIM(NEW.payload #>> '{personalData,segundoNombre}'), '');
  NEW.cliente_apellido_paterno := NULLIF(TRIM(NEW.payload #>> '{personalData,apellidoPaterno}'), '');
  NEW.cliente_apellido_materno := NULLIF(TRIM(NEW.payload #>> '{personalData,apellidoMaterno}'), '');
  NEW.telefono := NULLIF(TRIM(NEW.payload #>> '{contact,telefono}'), '');
  NEW.correo_electronico := NULLIF(TRIM(NEW.payload #>> '{contact,correoElectronico}'), '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bio_calls_sync_search_from_payload ON bio_calls;

CREATE TRIGGER bio_calls_sync_search_from_payload
  BEFORE INSERT OR UPDATE OF payload ON bio_calls
  FOR EACH ROW
  EXECUTE FUNCTION sync_bio_call_search_columns_from_payload();

-- ---------------------------------------------------------------------------
-- Ejemplos de consulta (referencia; no se ejecutan)
-- ---------------------------------------------------------------------------
--
-- Buscar por apellido:
--   SELECT id, cliente_nombres, cliente_apellido_paterno, created_at
--   FROM bio_calls
--   WHERE cliente_apellido_paterno ILIKE 'vega%';
--
-- Leer payload completo:
--   SELECT id, payload FROM bio_calls WHERE id = 'vega-morales-roberto-20250702';
--
-- Campo dentro del JSON:
--   SELECT id, payload #>> '{documents,numeroPasaporte}' AS pasaporte
--   FROM bio_calls
--   WHERE payload #>> '{documents,tienePasaporte}' = 'si';
--
-- PDF actual:
--   SELECT b.id, p.storage_path, p.download_filename
--   FROM bio_calls b
--   JOIN bio_call_generated_pdfs p ON p.bio_call_id = b.id AND p.is_current = true
--   WHERE b.id = 'vega-morales-roberto-20250702';

-- Verificacion: deben listarse exactamente 2 tablas bio_call*
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'bio_call%'
ORDER BY table_name;
