-- =============================================================================
-- Bio Call — migracion 006: columnas segundo_nombre (primer + segundo nombre)
-- Ejecutar en Supabase si ya tienes 001-005 aplicados.
-- Alineado con schema.prisma y packages/shared (segundoNombre en formulario).
-- =============================================================================

ALTER TABLE bio_call_personal_data
  ADD COLUMN IF NOT EXISTS segundo_nombre TEXT;

ALTER TABLE bio_call_family
  ADD COLUMN IF NOT EXISTS segundo_nombre_conyuge TEXT,
  ADD COLUMN IF NOT EXISTS segundo_nombre_padre TEXT,
  ADD COLUMN IF NOT EXISTS segundo_nombre_madre TEXT;

ALTER TABLE bio_call_children
  ADD COLUMN IF NOT EXISTS segundo_nombre TEXT;

ALTER TABLE bio_call_previous_marriages
  ADD COLUMN IF NOT EXISTS segundo_nombre_ex_conyuge TEXT;

COMMENT ON COLUMN bio_call_personal_data.segundo_nombre IS 'Segundo nombre del cliente (opcional).';
COMMENT ON COLUMN bio_call_family.segundo_nombre_conyuge IS 'Segundo nombre del conyuge (opcional).';
COMMENT ON COLUMN bio_call_family.segundo_nombre_padre IS 'Segundo nombre del padre (opcional).';
COMMENT ON COLUMN bio_call_family.segundo_nombre_madre IS 'Segundo nombre de la madre (opcional).';
COMMENT ON COLUMN bio_call_children.segundo_nombre IS 'Segundo nombre del hijo (opcional).';
COMMENT ON COLUMN bio_call_previous_marriages.segundo_nombre_ex_conyuge IS 'Segundo nombre del ex-conyuge (opcional).';
