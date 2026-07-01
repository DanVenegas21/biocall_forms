-- Migracion: columnas separadas para padres, hijos y ex-conyuges.
-- Ejecutar en BD existente creada con 001-004.
-- Las columnas legacy (nombre, nombre_padre, nombre_ex_conyuge) se conservan como fallback.

-- Padres en bio_call_family
ALTER TABLE bio_call_family
  ADD COLUMN IF NOT EXISTS nombres_padre TEXT,
  ADD COLUMN IF NOT EXISTS apellido_paterno_padre TEXT,
  ADD COLUMN IF NOT EXISTS apellido_materno_padre TEXT,
  ADD COLUMN IF NOT EXISTS nombres_madre TEXT,
  ADD COLUMN IF NOT EXISTS apellido_paterno_madre TEXT,
  ADD COLUMN IF NOT EXISTS apellido_materno_madre TEXT;

UPDATE bio_call_family
SET nombres_padre = nombre_padre
WHERE (nombres_padre IS NULL OR TRIM(nombres_padre) = '')
  AND nombre_padre IS NOT NULL
  AND TRIM(nombre_padre) <> '';

UPDATE bio_call_family
SET nombres_madre = nombre_madre
WHERE (nombres_madre IS NULL OR TRIM(nombres_madre) = '')
  AND nombre_madre IS NOT NULL
  AND TRIM(nombre_madre) <> '';

-- Hijos en bio_call_children
ALTER TABLE bio_call_children
  ADD COLUMN IF NOT EXISTS nombres TEXT,
  ADD COLUMN IF NOT EXISTS apellido_paterno TEXT,
  ADD COLUMN IF NOT EXISTS apellido_materno TEXT;

UPDATE bio_call_children
SET nombres = nombre
WHERE (nombres IS NULL OR TRIM(nombres) = '')
  AND nombre IS NOT NULL
  AND TRIM(nombre) <> '';

-- Matrimonios previos
ALTER TABLE bio_call_previous_marriages
  ADD COLUMN IF NOT EXISTS nombres_ex_conyuge TEXT,
  ADD COLUMN IF NOT EXISTS apellido_paterno_ex_conyuge TEXT,
  ADD COLUMN IF NOT EXISTS apellido_materno_ex_conyuge TEXT;

UPDATE bio_call_previous_marriages
SET nombres_ex_conyuge = nombre_ex_conyuge
WHERE (nombres_ex_conyuge IS NULL OR TRIM(nombres_ex_conyuge) = '')
  AND nombre_ex_conyuge IS NOT NULL
  AND TRIM(nombre_ex_conyuge) <> '';
