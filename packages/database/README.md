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

## ID legible (`bio_calls.id`)

Nuevas Bio Calls reciben un ID tipo slug + fecha, generado en `allocateBioCallId()`:

| Caso | Ejemplo |
|------|---------|
| Primera del dia | `vega-morales-roberto-20250702` |
| Colision mismo cliente/dia | `vega-morales-roberto-20250702-02` |

- Formato: `{apellido-paterno}-{apellido-materno}-{primer-nombre}-{YYYYMMDD}`
- Re-guardado con `bioCallId` existente conserva el mismo ID.
- Registros antiguos con UUID siguen siendo validos.

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

Padres, hijos y ex-conyuges se guardan en **columnas separadas** (`nombres`, `segundo_nombre`, `apellido_paterno`, `apellido_materno`). Las columnas legacy (`nombre_padre`, `nombre`, `nombre_ex_conyuge`) se conservan como fallback de lectura para datos antiguos.

## PDFs generados

- Archivo binario: **Supabase Storage** bucket `bio-call-pdfs` (o carpeta local `apps/backend/.data/pdfs` en dev sin Supabase).
- Ruta legible: `bio-calls/{bioCallId}/biocall-{bioCallId}.pdf` (el `bioCallId` coincide con `bio_calls.id`).
- Metadatos: tabla `bio_call_generated_pdfs` (`storage_path`, `download_filename`, `template_version`, `is_current`).

## Scripts SQL (Supabase)

Solo **dos archivos** en `sql/`:

| Script | Cuando ejecutar |
|--------|-----------------|
| `000_bio_call_reset.sql` | Borra todas las tablas Bio Call (datos + politicas RLS ligadas a esas tablas) |
| `001_bio_call_schema.sql` | Crea el esquema completo y actual |

**BD nueva (sin tablas `bio_call*`):** ejecuta solo `001` en Supabase → SQL Editor → Run.

**Actualizar esquema o error "column does not exist":** ejecuta `000` y luego `001`.

Desde terminal (equivalente a 000 + 001):

```bash
npm run db:reset --workspace @biocall/database
```

**Importante:** `000` elimina datos y politicas RLS de las tablas Bio Call. Tras `000` + `001`, si usas RLS en Supabase debes volver a configurarlo en el panel (no forma parte de estos scripts).

El `001` siempre refleja el estado actual de `schema.prisma`. Si cambias el esquema en codigo, actualiza `001` y recrea con `000` + `001`.

Tras cambiar `schema.prisma`, ejecuta:

```bash
npm run db:generate --workspace @biocall/database
```

## API relacionada

- `POST /api/bio-calls` — guarda con `bioCallSaveSchema` + `saveBioCall`
- `GET /api/bio-calls/:id` — `getBioCall(id)` devuelve `BioCallRecord`
