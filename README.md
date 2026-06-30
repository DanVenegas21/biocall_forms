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

- **Node.js** >= 18.18
- **npm** (workspaces)
- **PostgreSQL** (para persistencia; opcional en desarrollo inicial)
- **Python** >= 3.11 (solo si se ejecuta el servicio de IA)

## Instalacion

```bash
git clone <url-del-repositorio>
cd BioCall_Form
npm install
```

## Variables de entorno

Copia los archivos de ejemplo y ajusta los valores:

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Base de datos
cp packages/database/.env.example packages/database/.env

# Servicio de IA (opcional)
cp apps/ai-service/.env.example apps/ai-service/.env
```

| Variable | Ubicacion | Descripcion |
|----------|-----------|-------------|
| `PORT` | `apps/backend/.env` | Puerto de la API (por defecto `4000`) |
| `CORS_ORIGIN` | `apps/backend/.env` | Origen permitido para CORS (por defecto `http://localhost:3000`) |
| `DATABASE_URL` | `apps/backend/.env` o `packages/database/.env` | Session pooler de Supabase (misma URL para todo el equipo) |
| `AI_SERVICE_PORT` | `apps/ai-service/.env` | Puerto del servicio de IA (por defecto `8000`) |

### Conexion a Supabase (PostgreSQL)

Usa la URL del **Session pooler** (puerto `5432`) en `.env.example` — funciona en redes IPv4 e IPv6. Todos los desarrolladores comparten la misma `DATABASE_URL` y la contraseña de base de datos (compartirla por un gestor de contraseñas, no por chat).

1. Copia `apps/backend/.env.example` → `apps/backend/.env`
2. Sustituye `[YOUR-PASSWORD]` por la contraseña en **Supabase → Project Settings → Database**
3. Si la contraseña tiene caracteres especiales (`@`, `#`, `%`, etc.), codificalos en URL (ej. `@` → `%40`)

No uses la conexion directa (`db....supabase.co`): en muchas redes solo resuelve por IPv6 y provoca el error Prisma P1001 (*Can't reach database server*).

## Desarrollo

### Frontend (Next.js)

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Backend (Express)

En otra terminal:

```bash
npm run dev:backend
```

La API queda disponible en [http://localhost:4000](http://localhost:4000).

Endpoints principales:

- `GET /health` — estado del servicio
- `GET /api/bio-calls/sections` — metadatos de las secciones del formulario
- `POST /api/bio-calls` — recibe y valida el payload del formulario

### Base de datos (Prisma)

Desde la raiz del monorepo:

```bash
npm run db:generate --workspace @biocall/database
npm run db:migrate --workspace @biocall/database
```

Otros comandos utiles:

```bash
npm run db:push --workspace @biocall/database   # sincronizar esquema sin migracion
npm run db:studio --workspace @biocall/database # interfaz visual de Prisma
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
