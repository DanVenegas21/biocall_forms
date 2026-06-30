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
│   └── index.ts
└── sql/                      ← scripts para Supabase (000 reset, 001 schema, 002 seed)
```

## Configuracion

1. Copia `packages/database/.env.example` a `packages/database/.env`
2. Define `DATABASE_URL` apuntando a tu PostgreSQL / Supabase
3. Genera el cliente:

```bash
npm run db:generate --workspace @biocall/database
```

## Modelo de datos (14 tablas)

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

## PDFs generados

- Archivo binario: **Supabase Storage** bucket `bio-call-pdfs` (o carpeta local `apps/backend/.data/pdfs` en dev sin Supabase).
- Metadatos: tabla `bio_call_generated_pdfs` (`storage_path`, `template_version`, `is_current`).

## Mapeo por seccion

### `personalData` → `bio_call_personal_data`

Todos los campos del formulario tienen columna homonima en snake_case (`nombres`, `apellido_paterno`, `fecha_nacimiento`, `comprende_ingles`, etc.).

### `contact` → `bio_call_contact`

`telefono`, `correo_electronico`.

### `address` → `bio_call_address` + `bio_call_previous_addresses`

| Formulario | Destino |
|------------|---------|
| `calleNumero`, `aptoSuite`, `ciudad`, `estado`, `codigoPostal`, `fechaIngreso`, `resididoOtrosLugares` | `bio_call_address` |
| `direccionesAnteriores[]` | `bio_call_previous_addresses` (una fila por elemento, `sort_order`) |

### `documents` → `bio_call_documents`

Todos los campos escalares del formulario (`tiene_pasaporte`, `numero_pasaporte`, `a_number_value`, `ead_value`, etc.).

### `family` → `bio_call_family` + hijos + matrimonios

| Formulario | Destino |
|------------|---------|
| Conyuge, padres, banderas (`tieneConyuge`, `nombrePadre`, `casado`, …) | `bio_call_family` |
| `hijos[]` | `bio_call_children` |
| `matrimoniosPrevios[]` | `bio_call_previous_marriages` |

### `caseBackground` → `bio_call_case_background` + tablas hijas

| Formulario | Destino |
|------------|---------|
| Empleo actual, inadmisibilidad (`inad*`), falsa declaracion, FOIA | `bio_call_case_background` |
| `viajes[]` | `bio_call_trips` |
| `detencionesInmi[]` | `bio_call_immigration_detentions` |
| `arrestosPolicia[]` | `bio_call_police_arrests` |
| `empleosAnteriores[]` | `bio_call_previous_employments` |

FOIA: `foias.uscis.solicitar` → `foia_uscis_solicitar`, `foias.uscis.motivo` → `foia_uscis_motivo` (y lo mismo para `ice`, `cbp`, `eoir`, `fbi`, `policia`).

## Valores si / no

La mayoria de selects envian `si`, `no`, y en algunos casos `parcial`, `no_sabe` o `no_aplica`. Se persisten como `TEXT`.

## Scripts SQL (Supabase)

Flujo en el SQL Editor:

1. `000_bio_call_reset.sql` — borra tablas (solo pruebas)
2. `001_bio_call_schema.sql` — crea las 14 tablas
3. `002_bio_call_seed_example.sql` — 5 registros de ejemplo
