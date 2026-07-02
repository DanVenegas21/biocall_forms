-- =============================================================================
-- Bio Call — sincronizacion backend (inadMyUscisDetalle)
-- Ejecutar en Supabase si ya tienes 001/002 aplicados.
-- =============================================================================

ALTER TABLE bio_call_case_background
  ADD COLUMN IF NOT EXISTS inad_my_uscis_detalle TEXT;

COMMENT ON COLUMN bio_call_case_background.inad_my_uscis_detalle IS
  'Credenciales o detalle de cuenta myUSCIS cuando inad_my_uscis = si.';
