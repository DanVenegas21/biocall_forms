-- Nombres legibles de descarga para PDFs generados (Content-Disposition).

ALTER TABLE bio_call_generated_pdfs
  ADD COLUMN IF NOT EXISTS download_filename TEXT;

COMMENT ON COLUMN bio_call_generated_pdfs.download_filename IS
  'Nombre sugerido para descarga en navegador (Content-Disposition).';
