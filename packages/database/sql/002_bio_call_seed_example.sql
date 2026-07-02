-- =============================================================================
-- Bio Call — registros de prueba alineados al formulario del frontend
-- Ejecutar DESPUES de 001_bio_call_schema.sql
-- Re-ejecutable: borra los ids bc_% antes de insertar.
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'bio_calls'
  ) THEN
    RAISE EXCEPTION
      'La tabla bio_calls no existe. Ejecuta primero 001_bio_call_schema.sql';
  END IF;
END $$;

DELETE FROM bio_calls WHERE id LIKE 'bc_%';

-- ---------------------------------------------------------------------------
-- Raiz
-- ---------------------------------------------------------------------------

INSERT INTO bio_calls (id, form_capture_status, created_at, updated_at) VALUES
  ('bc_001', 'completed', '2025-01-08 09:15:00+00', '2025-02-01 10:00:00+00'),
  ('bc_002', 'draft',       '2025-02-12 14:30:00+00', '2025-02-12 14:30:00+00'),
  ('bc_003', 'in_review',   '2025-02-01 11:00:00+00', '2025-02-03 16:45:00+00'),
  ('bc_004', 'completed',   '2024-11-20 08:00:00+00', '2024-12-05 10:20:00+00'),
  ('bc_005', 'draft',       '2025-02-14 17:50:00+00', '2025-02-14 17:50:00+00');

-- ---------------------------------------------------------------------------
-- Datos personales
-- ---------------------------------------------------------------------------

INSERT INTO bio_call_personal_data (
  bio_call_id, nombres, apellido_paterno, apellido_materno, otros_nombres,
  fecha_nacimiento, lugar_nacimiento, sexo, estado_civil, nacionalidad,
  comprende_ingles, idioma_preferido, habla_otro_idioma, especificar_idioma
) VALUES
  ('bc_001', 'Natalia Hilda', 'Reyes', 'Gonzalez', 'NATALIA REYES',
   '1985-03-14', 'Tamaulipas, Mexico', 'Femenino', 'Casado(a)', 'Mexicana',
   'no', 'Espanol', 'no', 'NO'),
  ('bc_002', 'Carlos', 'Ramirez', NULL, NULL,
   '1988-03-22', 'Jalisco, Mexico', 'Masculino', 'Soltero(a)', 'Mexicano',
   'parcial', 'Espanol', 'si', 'Nahuatl'),
  ('bc_003', 'Ana', 'Martinez', 'Hernandez', 'Ana M. Smith',
   '1992-11-08', 'San Pedro Sula, Honduras', 'Femenino', 'Soltero(a)', 'Hondurena',
   'si', NULL, NULL, NULL),
  ('bc_004', 'Roberto', 'Silva', 'Mendoza', NULL,
   '1975-07-30', 'Lima, Peru', 'Masculino', 'Casado(a)', 'Peruana',
   'no', 'Espanol', 'no', 'NO'),
  ('bc_005', 'Elena', 'Torres', 'Vega', NULL,
   '1995-01-12', 'Monterrey, Nuevo Leon, Mexico', 'Femenino', 'Union libre', 'Mexicana',
   'parcial', 'Espanol', 'no', 'NO');

-- ---------------------------------------------------------------------------
-- Contacto
-- ---------------------------------------------------------------------------

INSERT INTO bio_call_contact (bio_call_id, telefono, correo_electronico) VALUES
  ('bc_001', '423-353-0235', 'natalia.reyes@ejemplo.com'),
  ('bc_002', '3474051108', 'carlos.ramirez@ejemplo.com'),
  ('bc_003', '+1 555 100 0004', 'ana.martinez@ejemplo.com'),
  ('bc_004', '+1 555 100 0006', 'roberto.silva@ejemplo.com'),
  ('bc_005', '+1 555 100 0007', 'elena.torres@ejemplo.com');

-- ---------------------------------------------------------------------------
-- Domicilio
-- ---------------------------------------------------------------------------

INSERT INTO bio_call_address (
  bio_call_id, calle_numero, apto_suite, ciudad, estado, codigo_postal,
  fecha_ingreso, residido_otros_lugares
) VALUES
  ('bc_001', '2058 Autumn Lane', NULL, 'Morristown', 'Tennessee', '37814', 'Mayo 2023', 'si'),
  ('bc_002', '1420 Broadway', 'Apt 4B', 'New York', 'NY', '10018', 'Septiembre 2016', 'no'),
  ('bc_003', '890 Oak Street', NULL, 'Houston', 'TX', '77002', 'Enero 2024', 'si'),
  ('bc_004', '456 Maple Ave', NULL, 'Los Angeles', 'CA', '90001', 'Marzo 2010', 'si'),
  ('bc_005', '12 Calle Principal', NULL, 'San Antonio', 'TX', '78205', NULL, 'no');

INSERT INTO bio_call_previous_addresses (
  id, bio_call_id, sort_order, calle_numero, apto_suite, ciudad, estado,
  codigo_postal, fecha_desde, fecha_hasta
) VALUES
  ('addr_001_01', 'bc_001', 0, '1200 Main St', 'Apt 2', 'Knoxville', 'TN', '37902', '2018', 'Mayo 2023'),
  ('addr_003_01', 'bc_003', 0, 'Calle 5ta', NULL, 'San Pedro Sula', 'Cortes', '21101', '2015', '2020'),
  ('addr_004_01', 'bc_004', 0, '1000 Vine St', NULL, 'Hollywood', 'CA', '90028', '2005', '2010');

-- ---------------------------------------------------------------------------
-- Documentos
-- ---------------------------------------------------------------------------

INSERT INTO bio_call_documents (
  bio_call_id, tiene_pasaporte, pasaporte_pendiente, numero_pasaporte, pais_emision,
  fecha_emision, fecha_expiracion, tiene_a_number, a_number_value, a_number_origen,
  tiene_ssn, ssn_value, tiene_ead, ead_value
) VALUES
  ('bc_001', 'si', 'no', 'G27123695', 'Mexico', '2019-06-01', '2029-06-01',
   'si', '123456789', 'Notificacion de USCIS', 'no', NULL, 'si', 'SRC1234567890'),
  ('bc_002', 'no', NULL, NULL, NULL, NULL, NULL,
   'no_sabe', NULL, NULL, 'no', NULL, 'no', NULL),
  ('bc_003', 'si', 'si', 'PENDIENTE', 'PENDIENTE', NULL, NULL,
   'no', NULL, NULL, 'no', NULL, 'no', NULL),
  ('bc_004', 'si', 'no', 'P1234567', 'Peru', '2015-01-10', '2025-01-10',
   'si', '987654321', 'EAD', 'si', '000-00-1234', 'no', NULL),
  ('bc_005', 'no', NULL, NULL, NULL, NULL, NULL,
   'no', NULL, NULL, 'no', NULL, 'no', NULL);

-- ---------------------------------------------------------------------------
-- Familia
-- ---------------------------------------------------------------------------

INSERT INTO bio_call_family (
  bio_call_id, tiene_conyuge, nombres_conyuge, apellido_paterno_conyuge,
  apellido_materno_conyuge, nombre_padre, nombre_madre,
  nombres_padre, apellido_paterno_padre, nombres_madre, apellido_materno_madre,
  casado, previamente_casado, tiene_hijos
) VALUES
  ('bc_001', 'si', 'Juan Carlos', 'Reyes', 'Lopez', 'Pedro Reyes', 'Maria Gonzalez',
   'Pedro', 'Reyes', 'Maria', 'Gonzalez', 'si', 'no', 'si'),
  ('bc_002', 'no', NULL, NULL, NULL, 'Jose Ramirez', 'Carmen Lopez',
   'Jose', 'Ramirez', 'Carmen', 'Lopez', 'no', 'no', 'no'),
  ('bc_003', 'no', NULL, NULL, NULL, NULL, 'Rosa Hernandez',
   NULL, NULL, 'Rosa', 'Hernandez', 'no', 'si', 'si'),
  ('bc_004', 'si', 'Maria Elena', 'Silva', 'Rojas', 'Antonio Silva', 'Carmen Mendoza',
   'Antonio', 'Silva', 'Carmen', 'Mendoza', 'si', 'si', 'si'),
  ('bc_005', 'si', 'Pedro', 'Torres', 'Diaz', NULL, NULL,
   NULL, NULL, NULL, NULL, 'no', 'no', 'no');

INSERT INTO bio_call_children (
  id, bio_call_id, sort_order, nombre, nombres, apellido_paterno, apellido_materno,
  fecha_nacimiento, lugar_nacimiento, lugar_residencia
) VALUES
  ('child_001_01', 'bc_001', 0, 'Sofia Reyes Lopez', 'Sofia', 'Reyes', 'Lopez',
   '2010-05-20', 'Morristown, TN', 'Morristown, TN'),
  ('child_001_02', 'bc_001', 1, 'Mateo Reyes Lopez', 'Mateo', 'Reyes', 'Lopez',
   '2013-08-15', 'Knoxville, TN', 'Morristown, TN'),
  ('child_003_01', 'bc_003', 0, 'Diego Martinez', 'Diego', 'Martinez', NULL,
   '2018-02-01', 'Honduras', 'Houston, TX'),
  ('child_004_01', 'bc_004', 0, 'Ana Silva', 'Ana', 'Silva', NULL,
   '2000-01-10', 'Lima, Peru', 'Los Angeles, CA'),
  ('child_004_02', 'bc_004', 1, 'Luis Silva', 'Luis', 'Silva', NULL,
   '2003-06-22', 'Los Angeles, CA', 'Los Angeles, CA'),
  ('child_004_03', 'bc_004', 2, 'Carla Silva', 'Carla', 'Silva', NULL,
   '2008-11-30', 'Los Angeles, CA', 'Los Angeles, CA');

INSERT INTO bio_call_previous_marriages (
  id, bio_call_id, sort_order, nombre_ex_conyuge, fecha_lugar_matrimonio,
  fecha_lugar_nacimiento, fecha_lugar_divorcio
) VALUES
  ('marr_003_01', 'bc_003', 0, 'Carlos Pineda', '2010, San Pedro Sula', '1985, Honduras', '2016, San Pedro Sula'),
  ('marr_004_01', 'bc_004', 0, 'Patricia Gomez', '1998, Lima', '1976, Peru', '2002, Lima');

-- ---------------------------------------------------------------------------
-- Caso / antecedentes (escalares)
-- ---------------------------------------------------------------------------

INSERT INTO bio_call_case_background (
  bio_call_id, viajes_comentarios, detenido_inmigracion, arrestado_policia,
  empleo_nombre, empleo_ocupacion, empleo_direccion_calle, empleo_direccion_apto,
  empleo_direccion_ciudad, empleo_direccion_estado, empleo_direccion_zip,
  empleo_fecha_ingreso, empleo_fecha_salida, empleo_otros_lugares,
  inad_detencion_trafico, inad_cometido_delito, inad_procedimiento_remocion,
  declarado_ciudadano,
  falsa_declaracion_lugar, falsa_declaracion_fecha, falsa_declaracion_como,
  falsa_declaracion_intencion, falsa_declaracion_detalle,
  foia_uscis_solicitar, foia_uscis_motivo, foia_cbp_solicitar, foia_cbp_motivo
) VALUES
  (
    'bc_001',
    'Primera entrada en 1995; reingreso en 2020.',
    'si', 'si',
    'Morristown Manufacturing', 'Operadora de linea',
    '500 Industrial Blvd', NULL, 'Morristown', 'TN', '37814',
    'Junio 2021', NULL, 'no',
    'no', 'no', 'si',
    'no',
    NULL, NULL, NULL, NULL, NULL,
    'no', NULL, 'si', 'Verificar entradas previas'
  ),
  (
    'bc_002',
    NULL, 'no', 'no',
    'Restaurant La Esquina', 'Mesero',
    '88 2nd Ave', NULL, 'New York', 'NY', '10003',
    '2016', NULL, 'no',
    'no', 'no', 'no',
    'no',
    NULL, NULL, NULL, NULL, NULL,
    'no', NULL, 'no', NULL
  ),
  (
    'bc_003',
    'Entrada sin inspeccion en 2020.',
    'si', 'no',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, 'no',
    'no', 'no', 'no',
    'no',
    NULL, NULL, NULL, NULL, NULL,
    'si', 'Historial de solicitudes', 'no', NULL
  ),
  (
    'bc_004',
    'Entrada con visa B1/B2 en 2005; ajuste posterior.',
    'no', 'si',
    'Pacific Construction LLC', 'Supervisor de obra',
    '1200 Builder Way', 'Suite 10', 'Los Angeles', 'CA', '90012',
    '2010', NULL, 'si',
    'si', 'no', 'no',
    'no',
    NULL, NULL, NULL, NULL, NULL,
    'no', NULL, 'no', NULL
  ),
  (
    'bc_005',
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,
    'no', 'no', 'no',
    NULL,
    NULL, NULL, NULL, NULL, NULL,
    'no', NULL, 'no', NULL
  );

-- Viajes
INSERT INTO bio_call_trips (
  id, bio_call_id, sort_order, fecha_entrada, forma_entrada, lugar_entrada,
  fecha_salida, fue_detenido, detalles_detencion
) VALUES
  ('trip_001_01', 'bc_001', 0, 'Septiembre 1995', 'Coyote / EWI', 'Calexico, CA', NULL, 'no', NULL),
  ('trip_001_02', 'bc_001', 1, 'Marzo 2020', 'Sin inspeccion', 'Laredo, TX', NULL, 'no', NULL),
  ('trip_003_01', 'bc_003', 0, 'Enero 2020', 'Sin inspeccion', 'Laredo, TX', 'Enero 2020', 'si', 'Regreso voluntario al dia siguiente'),
  ('trip_004_01', 'bc_004', 0, 'Julio 2005', 'Visa B1/B2', 'Miami, FL', '2008', 'no', NULL);

-- Detenciones inmigracion
INSERT INTO bio_call_immigration_detentions (
  id, bio_call_id, sort_order, lugar, fecha, autoridad, orden_deportacion,
  sancion_castigo, regreso_voluntario, fotos_huellas, cita_corte
) VALUES
  ('det_001_01', 'bc_001', 0, 'Texas', 'Noviembre 2022', 'CBP', 'no', 'no', 'no', 'si', 'si'),
  ('det_001_02', 'bc_001', 1, 'Arizona', '2018', 'ICE', 'no', 'no', 'si', 'si', 'no'),
  ('det_003_01', 'bc_003', 0, 'Laredo, TX', 'Enero 2020', 'CBP', 'no', 'no', 'si', 'si', 'no');

-- Arrestos policia
INSERT INTO bio_call_police_arrests (
  id, bio_call_id, sort_order, pais_ciudad_estado, fecha, motivo, autoridad, disposicion
) VALUES
  ('arr_001_01', 'bc_001', 0, 'Morristown, TN', 'Octubre 2021', 'Manejar sin licencia', 'Morristown PD', 'Multa pagada'),
  ('arr_004_01', 'bc_004', 0, 'Los Angeles, CA', '2015', 'Ticket de trafico', 'LAPD', 'Multa pagada'),
  ('arr_004_02', 'bc_004', 1, 'Los Angeles, CA', '2018', 'Detencion menor', 'LAPD', 'Caso cerrado');

-- Empleos anteriores
INSERT INTO bio_call_previous_employments (
  id, bio_call_id, sort_order, empresa, puesto, direccion_calle, direccion_apto,
  direccion_ciudad, direccion_estado, direccion_zip, fecha_desde, fecha_hasta
) VALUES
  ('emp_001_01', 'bc_001', 0, 'Knoxville Foods', 'Empacadora', '200 Market St', NULL,
   'Knoxville', 'TN', '37902', '2018', '2021'),
  ('emp_004_01', 'bc_004', 0, 'Valley Drywall', 'Ayudante', '4500 Sunset', NULL,
   'Hollywood', 'CA', '90028', '2005', '2010');

-- Resumen
SELECT
  bc.id,
  bc.form_capture_status,
  pd.nombres || ' ' || pd.apellido_paterno AS cliente,
  ct.telefono,
  CASE WHEN ad.bio_call_id IS NOT NULL THEN 'si' ELSE 'no' END AS tiene_domicilio,
  CASE WHEN doc.bio_call_id IS NOT NULL THEN 'si' ELSE 'no' END AS tiene_documentos,
  CASE WHEN fam.bio_call_id IS NOT NULL THEN 'si' ELSE 'no' END AS tiene_familia,
  CASE WHEN cb.bio_call_id IS NOT NULL THEN 'si' ELSE 'no' END AS tiene_caso,
  (SELECT COUNT(*) FROM bio_call_trips t WHERE t.bio_call_id = bc.id) AS viajes,
  (SELECT COUNT(*) FROM bio_call_children c WHERE c.bio_call_id = bc.id) AS hijos
FROM bio_calls bc
LEFT JOIN bio_call_personal_data pd ON pd.bio_call_id = bc.id
LEFT JOIN bio_call_contact ct ON ct.bio_call_id = bc.id
LEFT JOIN bio_call_address ad ON ad.bio_call_id = bc.id
LEFT JOIN bio_call_documents doc ON doc.bio_call_id = bc.id
LEFT JOIN bio_call_family fam ON fam.bio_call_id = bc.id
LEFT JOIN bio_call_case_background cb ON cb.bio_call_id = bc.id
WHERE bc.id LIKE 'bc_%'
ORDER BY bc.id;
