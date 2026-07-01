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

## Nombres concatenados (limitacion temporal)

Padres, hijos y ex-conyuges se guardan como un solo campo de texto (`nombre_padre`, `nombre`, `nombre_ex_conyuge`). `getBioCall` devuelve el nombre completo en `nombres` con apellidos vacios. La migracion a columnas separadas queda pendiente.

## PDFs generados

- Archivo binario: **Supabase Storage** bucket `bio-call-pdfs` (o carpeta local `apps/backend/.data/pdfs` en dev sin Supabase).
- Metadatos: tabla `bio_call_generated_pdfs` (`storage_path`, `template_version`, `is_current`).

## Scripts SQL (Supabase)

| Script | Cuando ejecutar |
|--------|-----------------|
| `000_bio_call_reset.sql` | Solo pruebas: borra todas las tablas |
| `001_bio_call_schema.sql` | Instalacion nueva (incluye columnas actuales) |
| `002_bio_call_form_sync.sql` | BD existente creada con `001` antiguo (lugar_nacimiento, columnas familia/caso) |
| `003_bio_call_backend_sync.sql` | BD existente: columna `inad_my_uscis_detalle` |

Tras `003`, ejecutar `npm run db:generate --workspace @biocall/database`.

## API relacionada

- `POST /api/bio-calls` — guarda con `bioCallSaveSchema` + `saveBioCall`
- `GET /api/bio-calls/:id` — `getBioCall(id)` devuelve `BioCallRecord`
