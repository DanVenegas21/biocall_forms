# BioCall Forms

Monorepo para la **Bio Call** de la oficina **Manuel Solis**: formulario web de captura de datos personales del cliente, con validación en servidor y diseño basado en el sistema NOVA.

## Descripcion general

La Bio Call recopila la informacion necesaria para generar el documento legal del cliente. El formulario se organiza en seis secciones navegables:

| Seccion | Contenido |
|---------|-----------|
| Datos personales | Nombre, fecha de nacimiento, nacionalidad, idioma |
| Contacto | Telefono y correo electronico |
| Domicilio | Direccion actual e historial de residencia |
| Documentos | Pasaporte, A-Number, SSN, EAD |
| Familia | Conyuge, padres, matrimonios previos, hijos |
| Antecedentes del caso | Viajes, detenciones, empleo, inadmisibilidad, FOIA |

El frontend guarda un borrador automatico en `localStorage` y puede enviar los datos al backend para validacion con Zod.

## Estructura del monorepo

```
biocall-forms/
├── apps/
│   ├── frontend/       # Next.js 14 + React 18 + Tailwind CSS
│   ├── backend/        # API Express (validacion y persistencia futura)
│   └── ai-service/     # FastAPI — esqueleto para autocompletado con IA (fase 2)
└── packages/
    ├── shared/         # Tipos, constantes y schemas Zod compartidos
    ├── database/       # Prisma + PostgreSQL
    └── config/         # Presets de TypeScript, ESLint y Prettier
```

## Requisitos

| Herramienta | Version | Obligatorio para |
|-------------|---------|------------------|
| **Node.js** | >= 18.18 | Frontend y backend |
| **npm** | (incluido con Node) | Instalar dependencias del monorepo |
| **PostgreSQL** o **Supabase** | — | Guardar Bio Calls y generar PDFs (`POST /api/bio-calls`) |
| **Python** | >= 3.11 | Solo el servicio de IA (fase 2, opcional) |

> **Nota:** Puedes abrir el formulario y probar validacion en el navegador sin base de datos (borrador en `localStorage`). Para **enviar y persistir** una Bio Call necesitas PostgreSQL configurado y el backend en marcha.

## Instalacion (una sola vez)

```bash
git clone <url-del-repositorio>
cd biocall-forms
npm install
```

### 1. Variables de entorno

Copia los archivos de ejemplo y ajusta los valores:

```bash
# Backend (API + Supabase Storage para PDFs)
cp apps/backend/.env.example apps/backend/.env

# Base de datos (Prisma)
cp packages/database/.env.example packages/database/.env

# Servicio de IA (opcional)
cp apps/ai-service/.env.example apps/ai-service/.env
```

En **Windows (PowerShell)** usa `Copy-Item` en lugar de `cp`:

```powershell
Copy-Item apps\backend\.env.example apps\backend\.env
Copy-Item packages\database\.env.example packages\database\.env
```

| Variable | Archivo | Descripcion |
|----------|---------|-------------|
| `PORT` | `apps/backend/.env` | Puerto de la API (por defecto `4000`) |
| `CORS_ORIGIN` | `apps/backend/.env` | Origen del frontend para CORS (por defecto `http://localhost:3000`) |
| `DATABASE_URL` | `apps/backend/.env` y `packages/database/.env` | Pooler transaccional (puerto `6543`) para el backend en runtime |
| `DIRECT_URL` | `apps/backend/.env` y `packages/database/.env` | Pooler de sesion (puerto `5432`) para migraciones Prisma |
| `SUPABASE_URL` | `apps/backend/.env` | URL del proyecto Supabase (almacenamiento de PDFs) |
| `SUPABASE_SERVICE_ROLE_KEY` | `apps/backend/.env` | Clave de servicio de Supabase |
| `SUPABASE_STORAGE_BUCKET` | `apps/backend/.env` | Bucket de PDFs (por defecto `bio-call-pdfs`) |
| `NEXT_PUBLIC_API_URL` | opcional en `apps/frontend/.env.local` | URL del backend si no es `http://localhost:4000` |
| `AI_SERVICE_PORT` | `apps/ai-service/.env` | Puerto del servicio de IA (por defecto `8000`) |

Configura `DATABASE_URL` y `DIRECT_URL` con las cadenas del **Connection Pooler** de Supabase (ver seccion de solucion de problemas mas abajo). Usa la misma contraseña de Database (Project Settings → Database).

### 2. Cliente Prisma y esquema de base de datos

Desde la raiz del monorepo:

```bash
npm run db:generate --workspace @biocall/database
npm run db:migrate --workspace @biocall/database
```

Si aun no tienes migraciones aplicadas en tu entorno, puedes sincronizar el esquema con:

```bash
npm run db:push --workspace @biocall/database
```

Otros comandos utiles:

```bash
npm run db:studio --workspace @biocall/database   # interfaz visual de Prisma
```

## Levantar el proyecto (desarrollo)

Necesitas **dos terminales** en la raiz del monorepo (`biocall-forms/`).

**Terminal 1 — Frontend (Next.js, puerto 3000):**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

**Terminal 2 — Backend (Express, puerto 4000):**

```bash
npm run dev:backend
```

Comprueba que la API responde:

- [http://localhost:4000/health](http://localhost:4000/health) — estado del servicio
- [http://localhost:4000/api/bio-calls/sections](http://localhost:4000/api/bio-calls/sections) — metadatos de las secciones

El frontend llama al backend en `http://localhost:4000` por defecto. Si cambias el puerto de la API, crea `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Endpoints principales del backend

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `/health` | Estado del servicio |
| `GET` | `/api/bio-calls/sections` | Metadatos de las secciones del formulario |
| `POST` | `/api/bio-calls` | Valida, guarda en PostgreSQL y genera PDF |
| `GET` | `/api/bio-calls/:id/pdf` | Descarga el PDF de una Bio Call |

### Resumen rapido

```
1. npm install
2. Copiar .env (backend + database) y configurar DATABASE_URL
3. npm run db:generate --workspace @biocall/database
4. npm run db:migrate --workspace @biocall/database   (o db:push)
5. npm run dev          → frontend en :3000
6. npm run dev:backend  → backend en :4000
```

### Servicio de IA (FastAPI, opcional)

```bash
cd apps/ai-service
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health check: [http://localhost:8000/health](http://localhost:8000/health)

## Solucion de problemas

### `P1001: Can't reach database server at db.*.supabase.co:5432`

Supabase expone la conexion **directa** (`db.<ref>.supabase.co`) solo por **IPv6**. Muchas redes en Mexico y oficinas solo tienen IPv4, por eso Prisma no puede conectar aunque el proyecto exista.

**Solucion:** usa el **Connection Pooler** (Supavisor), que si tiene IPv4:

1. Entra a [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto → **Project Settings** → **Database**
2. En **Connection string**, elige **Transaction pooler** y copia la URI (puerto `6543`)
3. Elige **Session pooler** y copia la URI (puerto `5432`)
4. Pega ambas en `apps/backend/.env` y `packages/database/.env`:

```env
# Runtime (backend + Prisma Client)
DATABASE_URL=postgresql://postgres.mogtigntgzjqihckjfyf:TU_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=30

# Migraciones (Prisma CLI)
DIRECT_URL=postgresql://postgres.mogtigntgzjqihckjfyf:TU_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?connect_timeout=30
```

5. Regenera el cliente y aplica el esquema:

```bash
npm run db:generate --workspace @biocall/database
npm run db:push --workspace @biocall/database
```

6. Reinicia el backend (`npm run dev:backend`)

> Sustituye `REGION` por la region que muestra tu dashboard (ej. `us-east-1`). El usuario cambia de `postgres` a `postgres.<project-ref>`.

## Scripts disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo del frontend |
| `npm run dev:backend` | Servidor de desarrollo del backend |
| `npm run build` | Build de shared, database, frontend y backend |
| `npm run build:frontend` | Build de produccion del frontend |
| `npm run build:backend` | Build de produccion del backend |
| `npm run typecheck` | Verificacion de tipos en todos los workspaces |
| `npm run lint` | ESLint en todos los workspaces |
| `npm run format` | Formateo con Prettier |

## Stack tecnologico

| Capa | Tecnologias |
|------|-------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS 3, Framer Motion, Radix UI, react-hot-toast |
| Backend | Node.js, Express, TypeScript, Zod |
| Base de datos | PostgreSQL, Prisma |
| IA (fase 2) | Python, FastAPI, Pydantic |
| Monorepo | npm workspaces |

## Arquitectura del frontend

```
Providers (TooltipProvider + Toaster)
  SkipLink
  AppHeader
  BioCallForm          → secciones + indice lateral sticky
  AppFooter
```

`BioCallForm` consume `BIO_CALL_SECTIONS` desde `@biocall/shared` y renderiza cada seccion con su componente dedicado en `apps/frontend/src/components/bio-call/sections/`. Los ids de seccion funcionan como anclas para la navegacion lateral.

### Sistema de diseno NOVA

El proyecto reutiliza el sistema de diseno NOVA de la oficina. Consulta `GUIDELINES.md` antes de crear pantallas o componentes nuevos. Convenciones clave:

- **Superficies glass** (`components/glass/`) para header y elementos destacados
- **Superficies solid** (`components/ui/`) para formularios y areas de trabajo
- Clases semanticas en `globals.css`: `.page-title`, `.input-glass`, `.cta-primary`, `.nav-tab`, etc.
- Accesibilidad obligatoria: skip link, foco visible, soporte de `prefers-reduced-motion`
- Interfaz en espanol (`lang="es"`)

## Paquete compartido (`@biocall/shared`)

Centraliza la logica comun entre frontend y backend:

- `BIO_CALL_SECTIONS` — metadatos de las secciones
- `bioCallSchema` — validacion Zod del payload completo del formulario
- Tipos TypeScript derivados del esquema

Cualquier cambio en la estructura del formulario debe reflejarse aqui para mantener la coherencia entre capas.

## Estado actual del proyecto

| Componente | Estado |
|------------|--------|
| Layout y diseno del formulario | Implementado |
| Secciones de captura (6) | Implementadas |
| Borrador en localStorage | Implementado |
| Validacion en backend (Zod) | Implementada |
| Persistencia en PostgreSQL | Esquema Prisma listo; integracion pendiente |
| Autocompletado con IA | Boton deshabilitado; servicio FastAPI en esqueleto |
| Tests automatizados | No configurados |

## Licencia

Proyecto privado de la oficina Manuel Solis.
