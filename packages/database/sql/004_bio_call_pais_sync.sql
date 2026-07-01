-- =============================================================================
-- Bio Call — sincronizacion campos pais (domicilio y empleo)
-- Ejecutar en Supabase si ya tienes 001/002/003 aplicados.
-- Alineado con Formulario_front: address.pais, empleoDireccionPais, etc.
-- =============================================================================

ALTER TABLE bio_call_address
  ADD COLUMN IF NOT EXISTS pais TEXT;

COMMENT ON COLUMN bio_call_address.pais IS 'Pais del domicilio actual (address.pais).';

ALTER TABLE bio_call_previous_addresses
  ADD COLUMN IF NOT EXISTS pais TEXT;

COMMENT ON COLUMN bio_call_previous_addresses.pais IS 'Pais de la direccion anterior (direccionesAnteriores[].pais).';

ALTER TABLE bio_call_case_background
  ADD COLUMN IF NOT EXISTS empleo_direccion_pais TEXT;

COMMENT ON COLUMN bio_call_case_background.empleo_direccion_pais IS
  'Pais del empleo actual (caseBackground.empleoDireccionPais).';

ALTER TABLE bio_call_previous_employments
  ADD COLUMN IF NOT EXISTS direccion_pais TEXT;

COMMENT ON COLUMN bio_call_previous_employments.direccion_pais IS
  'Pais del empleo anterior (empleosAnteriores[].direccionPais).';
