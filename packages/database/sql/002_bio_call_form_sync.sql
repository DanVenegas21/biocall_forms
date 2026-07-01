-- =============================================================================
-- Bio Call — migracion 002: alinear BD con formulario actualizado
-- Ejecutar DESPUES de 001_bio_call_schema.sql en Supabase (SQL Editor → Run).
--
-- Cambios:
--   1. Lugar de nacimiento: lugar_nacimiento → ciudad / estado / pais
--   2. Familia: fechas del conyuge actual
--   3. Caso: documentos y correos pendientes
--
-- Re-ejecutable: usa IF NOT EXISTS / comprobaciones de columna.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Datos personales — lugar de nacimiento en 3 campos
-- ---------------------------------------------------------------------------

ALTER TABLE bio_call_personal_data
  ADD COLUMN IF NOT EXISTS ciudad_nacimiento  TEXT,
  ADD COLUMN IF NOT EXISTS estado_nacimiento  TEXT,
  ADD COLUMN IF NOT EXISTS pais_nacimiento  TEXT;

-- Migrar datos del campo legacy (si existe y las nuevas columnas estan vacias)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bio_call_personal_data'
      AND column_name = 'lugar_nacimiento'
  ) THEN
    UPDATE bio_call_personal_data
    SET ciudad_nacimiento = lugar_nacimiento
    WHERE (ciudad_nacimiento IS NULL OR trim(ciudad_nacimiento) = '')
      AND lugar_nacimiento IS NOT NULL
      AND trim(lugar_nacimiento) <> '';

    ALTER TABLE bio_call_personal_data DROP COLUMN lugar_nacimiento;
  END IF;
END $$;

COMMENT ON COLUMN bio_call_personal_data.ciudad_nacimiento IS 'Ciudad de nacimiento (PersonalDataSection).';
COMMENT ON COLUMN bio_call_personal_data.estado_nacimiento IS 'Estado o provincia de nacimiento.';
COMMENT ON COLUMN bio_call_personal_data.pais_nacimiento IS 'Pais de nacimiento.';

-- ---------------------------------------------------------------------------
-- 2. Familia — fechas del conyuge actual
-- ---------------------------------------------------------------------------

ALTER TABLE bio_call_family
  ADD COLUMN IF NOT EXISTS fecha_lugar_matrimonio_conyuge  TEXT,
  ADD COLUMN IF NOT EXISTS fecha_lugar_nacimiento_conyuge  TEXT;

COMMENT ON COLUMN bio_call_family.fecha_lugar_matrimonio_conyuge IS 'Fecha y lugar de matrimonio con conyuge actual.';
COMMENT ON COLUMN bio_call_family.fecha_lugar_nacimiento_conyuge IS 'Fecha y lugar de nacimiento del conyuge actual.';

-- ---------------------------------------------------------------------------
-- 3. Caso — documentos y correos pendientes de seguimiento
-- ---------------------------------------------------------------------------

ALTER TABLE bio_call_case_background
  ADD COLUMN IF NOT EXISTS documentos_pendientes  TEXT,
  ADD COLUMN IF NOT EXISTS correos_pendientes     TEXT;

COMMENT ON COLUMN bio_call_case_background.documentos_pendientes IS 'Documentos pendientes por recabar o entregar.';
COMMENT ON COLUMN bio_call_case_background.correos_pendientes IS 'Correos o tramites pendientes por enviar.';

-- ---------------------------------------------------------------------------
-- Verificacion (debe listar las columnas nuevas)
-- ---------------------------------------------------------------------------

SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'bio_call_personal_data',
    'bio_call_family',
    'bio_call_case_background'
  )
  AND column_name IN (
    'ciudad_nacimiento',
    'estado_nacimiento',
    'pais_nacimiento',
    'lugar_nacimiento',
    'fecha_lugar_matrimonio_conyuge',
    'fecha_lugar_nacimiento_conyuge',
    'documentos_pendientes',
    'correos_pendientes'
  )
ORDER BY table_name, column_name;
