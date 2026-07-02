-- =============================================================================
-- Bio Call — RESETEO COMPLETO (solo desarrollo / pruebas)
-- CUIDADO: borra todas las tablas y enums de la Bio Call.
--
-- Flujo rapido en Supabase (SQL Editor):
--   1. Ejecutar ESTE archivo (000) para borrar todo.
--   2. Ejecutar 001_bio_call_schema.sql para crear el esquema actual.
-- =============================================================================

DROP TRIGGER IF EXISTS bio_calls_set_updated_at ON bio_calls;
DROP FUNCTION IF EXISTS set_bio_calls_updated_at();

-- Tablas hijas (listas repetibles)
DROP TABLE IF EXISTS bio_call_generated_pdfs CASCADE;
DROP TABLE IF EXISTS bio_call_previous_employments CASCADE;
DROP TABLE IF EXISTS bio_call_police_arrests CASCADE;
DROP TABLE IF EXISTS bio_call_immigration_detentions CASCADE;
DROP TABLE IF EXISTS bio_call_trips CASCADE;
DROP TABLE IF EXISTS bio_call_previous_marriages CASCADE;
DROP TABLE IF EXISTS bio_call_children CASCADE;
DROP TABLE IF EXISTS bio_call_previous_addresses CASCADE;

-- Tablas 1:1 por seccion
DROP TABLE IF EXISTS bio_call_case_background CASCADE;
DROP TABLE IF EXISTS bio_call_family CASCADE;
DROP TABLE IF EXISTS bio_call_documents CASCADE;
DROP TABLE IF EXISTS bio_call_address CASCADE;
DROP TABLE IF EXISTS bio_call_contact CASCADE;
DROP TABLE IF EXISTS bio_call_personal_data CASCADE;
DROP TABLE IF EXISTS bio_calls CASCADE;

-- Tablas legacy (esquema anterior)
DROP TABLE IF EXISTS bio_call_family_members CASCADE;
DROP TABLE IF EXISTS bio_call_identifications CASCADE;

-- Enums legacy
DROP TYPE IF EXISTS employment_type CASCADE;
DROP TYPE IF EXISTS immigration_status_category CASCADE;
DROP TYPE IF EXISTS manner_of_entry CASCADE;
DROP TYPE IF EXISTS case_urgency CASCADE;
DROP TYPE IF EXISTS case_area CASCADE;
DROP TYPE IF EXISTS family_relationship CASCADE;
DROP TYPE IF EXISTS identification_type CASCADE;
DROP TYPE IF EXISTS contact_method CASCADE;
DROP TYPE IF EXISTS marital_status CASCADE;
DROP TYPE IF EXISTS bio_call_status CASCADE;
