# @biocall/database

Capa de datos de la Bio Call: **Prisma**, cliente PostgreSQL y documentacion del esquema.

El esquema esta alineado con el formulario del frontend (`BioCallForm.tsx`) y los esquemas Zod en `packages/shared/src/schemas.ts`.

## Estructura del paquete

```
packages/database/
├── README.md                 ← este archivo (documentacion del esquema)
├── prisma/
│   └── schema.prisma         ← fuente de verdad en el repositorio
├── src/
│   ├── client.ts             ← singleton PrismaClient
│   ├── saveBioCall.ts        ← persistencia (guardado estricto)
│   ├── getBioCall.ts         ← lectura GET /api/bio-calls/:id
│   └── index.ts
└── sql/                      ← scripts para Supabase
```

## Configuracion

1. Copia `packages/database/.env.example` a `packages/database/.env`
2. Define `DATABASE_URL` apuntando a tu PostgreSQL / Supabase (Session pooler recomendado)
3. Genera el cliente:

```bash
npm run db:generate --workspace @biocall/database
```

## Politica de guardado

El backend valida con `bioCallSaveSchema` antes de llamar a `saveBioCall`:

- Campos NOT NULL obligatorios: nombres, apellido paterno, fecha de nacimiento, nacionalidad, telefono, correo, direccion minima.
- **No** se insertan placeholders (`"Pendiente"`, correos ficticios).
- Cada guardado actualiza `bio_calls.updated_at`.

## Modelo de datos (15 tablas)

| Tabla | Seccion UI | Relacion |
|-------|------------|----------|
| `bio_calls` | — | Raiz |
| `bio_call_personal_data` | `personalData` | 1:1 |
| `bio_call_contact` | `contact` | 1:1 |
| `bio_call_address` | `address` | 1:1 |
| `bio_call_previous_addresses` | `address.direccionesAnteriores[]` | 1:N |
| `bio_call_documents` | `documents` | 1:1 |
| `bio_call_family` | `family` (campos escalares) | 1:1 |
| `bio_call_children` | `family.hijos[]` | 1:N |
| `bio_call_previous_marriages` | `family.matrimoniosPrevios[]` | 1:N |
| `bio_call_case_background` | `caseBackground` (campos escalares) | 1:1 |
| `bio_call_trips` | `caseBackground.viajes[]` | 1:N |
| `bio_call_immigration_detentions` | `caseBackground.detencionesInmi[]` | 1:N |
| `bio_call_police_arrests` | `caseBackground.arrestosPolicia[]` | 1:N |
| `bio_call_previous_employments` | `caseBackground.empleosAnteriores[]` | 1:N |
| `bio_call_generated_pdfs` | Metadatos del PDF (archivo en Storage) | 1:N |

Convencion: **camelCase** en React → **snake_case** en PostgreSQL.

## Nombres en familia

Padres, hijos y ex-conyuges se guardan en **columnas separadas** (`nombres`, `apellido_paterno`, `apellido_materno`). Las columnas legacy (`nombre_padre`, `nombre`, `nombre_ex_conyuge`) se conservan solo como fallback de lectura para registros anteriores a la migracion `005`.

## PDFs generados

- Archivo binario: **Supabase Storage** bucket `bio-call-pdfs` (o carpeta local `apps/backend/.data/pdfs` en dev sin Supabase).
- Ruta legible: `bio-calls/{apellido-paterno-apellido-materno-nombre}-{shortId}/biocall-{slug}-{YYYYMMDD}.pdf` (ver `buildBioCallPdfNames` en `@biocall/shared`).
- Metadatos: tabla `bio_call_generated_pdfs` (`storage_path`, `download_filename`, `template_version`, `is_current`).

## Scripts SQL (Supabase)

| Script | Cuando ejecutar |
|--------|-----------------|
| `000_bio_call_reset.sql` | Solo pruebas: borra todas las tablas |
| `001_bio_call_schema.sql` | Instalacion nueva (incluye columnas actuales) |
| `002_bio_call_form_sync.sql` | BD existente creada con `001` antiguo (lugar_nacimiento, columnas familia/caso) |
| `003_bio_call_backend_sync.sql` | BD existente: columna `inad_my_uscis_detalle` |
| `004_bio_call_pais_sync.sql` | BD existente: columnas `pais` en domicilio y empleo |
| `005_bio_call_names_split.sql` | BD existente: nombres separados en padres, hijos y ex-conyuges |
| `006_bio_call_segundo_nombre.sql` | BD existente: columnas `segundo_nombre` en cliente, familia, hijos y ex-conyuges |
| `007_bio_call_pdf_download_filename.sql` | BD existente: columna `download_filename` en PDFs generados |

Tras `003`, `004`, `005`, `006` o `007`, ejecutar `npm run db:generate --workspace @biocall/database` si cambiaste `schema.prisma`.

## API relacionada

- `POST /api/bio-calls` — guarda con `bioCallSaveSchema` + `saveBioCall`
- `GET /api/bio-calls/:id` — `getBioCall(id)` devuelve `BioCallRecord`
