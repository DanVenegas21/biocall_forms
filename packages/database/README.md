# @biocall/database

Capa de datos de la Bio Call: **Prisma**, cliente PostgreSQL y documentacion del esquema.

El esquema esta alineado con el formulario del frontend (`BioCallForm.tsx` y las secciones en `apps/frontend/src/components/bio-call/sections/`).

## Estructura del paquete

```
packages/database/
├── README.md                 ← este archivo (documentacion del esquema)
├── prisma/
│   └── schema.prisma         ← fuente de verdad en el repositorio
├── src/
│   ├── client.ts             ← singleton PrismaClient
│   └── index.ts
└── sql/                      ← scripts locales (NO se versionan; ver .gitignore)
    └── *.sql                 ← solo para ejecutar manualmente en Supabase
```

Los tipos de validacion del formulario viven en `packages/shared/src/schemas.ts` (Zod).

## Configuracion

1. Copia `packages/database/.env.example` a `packages/database/.env`
2. Define `DATABASE_URL` apuntando a tu PostgreSQL / Supabase
3. Genera el cliente:

```bash
npm run db:generate --workspace @biocall/database
```

Comandos utiles:

| Comando | Descripcion |
|---------|-------------|
| `db:generate` | Genera `@prisma/client` desde `schema.prisma` |
| `db:push` | Sincroniza el esquema con la BD (desarrollo) |
| `db:migrate` | Crea y aplica migraciones Prisma |
| `db:studio` | Abre Prisma Studio |

## Modelo de datos (7 tablas)

Cada Bio Call tiene una fila raiz y hasta seis tablas hijas **1:1** (una por seccion del formulario).

| Tabla | Seccion UI | Relacion |
|-------|------------|----------|
| `bio_calls` | — | Raiz (`form_capture_status`: `draft` \| `in_review` \| `completed`) |
| `bio_call_personal_data` | `personalData` | 1:1 |
| `bio_call_contact` | `contact` | 1:1 |
| `bio_call_address` | `address` | 1:1 |
| `bio_call_documents` | `documents` | 1:1 |
| `bio_call_family` | `family` | 1:1 |
| `bio_call_case_background` | `caseBackground` | 1:1 |

## Mapeo formulario → columnas

Convencion: **camelCase** en React → **snake_case** en PostgreSQL.

### `personalData` → `bio_call_personal_data`

| Formulario | Columna |
|------------|---------|
| `nombres` | `nombres` |
| `apellidoPaterno` | `apellido_paterno` |
| `apellidoMaterno` | `apellido_materno` |
| `otrosNombres` | `otros_nombres` |
| `fechaNacimiento` | `fecha_nacimiento` |
| `lugarNacimiento` | `lugar_nacimiento` |
| `sexo` | `sexo` |
| `estadoCivil` | `estado_civil` |
| `nacionalidad` | `nacionalidad` |
| `comprendeIngles` | `comprende_ingles` |
| `idiomaPreferido` | `idioma_preferido` |
| `hablaOtroIdioma` | `habla_otro_idioma` |
| `especificarIdioma` | `especificar_idioma` |

### `contact` → `bio_call_contact`

| Formulario | Columna |
|------------|---------|
| `telefono` | `telefono` |
| `correoElectronico` | `correo_electronico` |

### `address` → `bio_call_address`

| Formulario | Columna |
|------------|---------|
| `direccionCompleta` | `direccion_completa` |
| `fechaIngreso` | `fecha_ingreso` |

### `documents` → `bio_call_documents`

| Formulario | Columna |
|------------|---------|
| `tienePasaporte` | `tiene_pasaporte` |
| `pasaportePendiente` | `pasaporte_pendiente` |
| `numeroPasaporte` | `numero_pasaporte` |
| `paisEmision` | `pais_emision` |
| `fechaEmision` | `fecha_emision` |
| `fechaExpiracion` | `fecha_expiracion` |
| `tieneANumber` | `tiene_a_number` |
| `aNumberValue` | `a_number_value` |
| `aNumberOrigen` | `a_number_origen` |
| `tieneSSN` | `tiene_ssn` |
| `ssnValue` | `ssn_value` |
| `tieneEAD` | `tiene_ead` |
| `eadValue` | `ead_value` |

### `family` → `bio_call_family`

| Formulario | Columna |
|------------|---------|
| `tieneConyuge` | `tiene_conyuge` |
| `nombresConyuge` | `nombres_conyuge` |
| `apellidoPaternoConyuge` | `apellido_paterno_conyuge` |
| `apellidoMaternoConyuge` | `apellido_materno_conyuge` |
| `tieneHijos` | `tiene_hijos` |
| `cantidadHijos` | `cantidad_hijos` |

### `caseBackground` → `bio_call_case_background`

| Formulario | Columna |
|------------|---------|
| `fechaEntrada` | `fecha_entrada` |
| `formaEntrada` | `forma_entrada` |
| `lugarEntrada` | `lugar_entrada` |
| `detenidoAlIngresar` | `detenido_al_ingresar` |
| `detenidoInmigracion` | `detenido_inmigracion` |
| `cantidadDetencionesInmi` | `cantidad_detenciones_inmi` |
| `detallesDetencionesInmi` | `detalles_detenciones_inmi` |
| `inmiFotosHuellas` | `inmi_fotos_huellas` |
| `inmiOrdenDeportacion` | `inmi_orden_deportacion` |
| `inmiCitaCorte` | `inmi_cita_corte` |
| `inmiRegresoVoluntario` | `inmi_regreso_voluntario` |
| `inmiCastigoSancion` | `inmi_castigo_sancion` |
| `arrestadoPolicia` | `arrestado_policia` |
| `cantidadArrestosPoli` | `cantidad_arrestos_poli` |
| `explicacionArresto` | `explicacion_arresto` |
| `arrestoMotivo` | `arresto_motivo` |
| `arrestoFecha` | `arresto_fecha` |
| `arrestoLugar` | `arresto_lugar` |
| `arrestoPasoNocheCarcel` | `arresto_paso_noche_carcel` |
| `arrestoPagoFianza` | `arresto_pago_fianza` |
| `arrestoMontoFianza` | `arresto_monto_fianza` |
| `arrestoResolucion` | `arresto_resolucion` |
| `declaradoCiudadano` | `declarado_ciudadano` |
| `foiaRequerir` | `foia_requerir` |

## Valores si / no

La mayoria de selects del formulario envian `si`, `no`, y en algunos casos `parcial`, `no_sabe` o `no_aplica`. Se persisten como `TEXT` sin transformacion.

## Scripts SQL (solo local)

La carpeta `sql/` puede contener scripts para cargar el esquema en Supabase manualmente (`000` reset, `001` schema, `002` seed). **Esos archivos `.sql` no se suben al repositorio** (estan en `.gitignore`).

Para crear la BD en Supabase sin Prisma, usa tus copias locales de esos scripts en el SQL Editor.
