# Guía de diseño — NOVA

Guía de diseño y UI para **NOVA** (*Control de expedientes legales*), la aplicación web de clasificación, indexación, verificación y análisis inteligente de documentos legales de la oficina Manuel Solis.

Esta guía documenta las decisiones visuales, patrones de interfaz y convenciones técnicas ya presentes en el código del frontend (`frontend/`). Úsala como referencia al crear pantallas, componentes o flujos nuevos.

---

## 1. Identidad del producto

| Atributo | Valor |
|----------|-------|
| Nombre | NOVA |
| Subtítulo | Control de expedientes legales |
| Idioma de la interfaz | Español (`lang="es"`) |
| Esquema de color | Solo claro (`color-scheme: light`) |
| Audiencia | Abogados, case managers, supervisores y administradores |
| Contexto de uso | Gestión de expedientes legales con apoyo de IA (OCR, RAG, autocompletado de formularios, QC) |

### Principios de diseño

1. **Profesional y confiable.** Paleta azul profundo con acentos dorados; sensación de producto legal/enterprise, no consumer.
2. **Cristal líquido (liquid glass).** Superficies translúcidas con blur, bordes claros y sombras suaves. Degradado a sólido cuando el navegador no soporta el efecto.
3. **Claridad operativa.** Jerarquía tipográfica marcada, estados explícitos (carga, vacío, error, bloqueo) y feedback inmediato (toasts, overlays, badges).
4. **IA como copiloto, no como verdad absoluta.** Los flujos de IA muestran progreso y el pie de página recuerda revisar siempre con supervisión humana.
5. **Accesibilidad pragmática.** Focus visible, skip link, `aria-*` en modales y menús, textos `sr-only` en cargas, respeto a `prefers-reduced-motion`.

---

## 2. Paleta de color

### Colores de marca (tokens `nova`)

| Token | Hex | Uso |
|-------|-----|-----|
| `nova-deep` | `#143457` | Marca principal, header, CTAs primarios |
| `nova-gold` | `#bd9655` | Acento premium, hover de CTAs, progreso IA |
| `nova-gold-light` | `#e3c48e` | Degradados dorados, highlights |
| `nova-ice` | `#e8f1f8` | Fondos suaves, superficies secundarias |
| `nova-slate` | `#0a1c30` | Texto oscuro, overlays modales |
| `nova-snow` | `#ffffff` | Superficies de lectura, inputs |

### Escalas Tailwind

- **`brand` (50–900):** Escala azul derivada de la marca. Texto principal: `brand-800`. Texto secundario: `brand-500`–`brand-600`. Bordes: `brand-100`.
- **`accent` (50–900):** Escala dorada. Mensajes de IA y progreso: `accent-600`.
- **`surface`:** `#e8f1f8` — fondo base del `<body>` en HTML.

### Colores semánticos

| Contexto | Color | Ejemplo en código |
|----------|-------|-------------------|
| Éxito | Verde (`green-600`) | Badges de estado completado |
| Error / destructivo | Rojo (`red-600`, `red-50`) | Botón danger, cerrar sesión, toasts de error |
| Información / foco | `brand-400` / `#2d5a85` | Anillo de focus (`--focus-ring`) |
| Overlay modal | `nova-slate/60` | Fondo de diálogos |

### Degradados recurrentes

```css
/* Header y CTAs primarios — nova-horizon */
linear-gradient(to bottom left, #2d5a85 0%, #143457 52%, #0a1c30 100%)

/* Hover dorado — glow-gold */
linear-gradient(to bottom left, #bd9655 0%, #e3c48e 100%)

/* Superficie glass — glass-gradient */
linear-gradient(to bottom left, rgba(255,255,255,0.72) 0%, rgba(232,241,248,0.45) 100%)
```

### Fondo de la aplicación

El `body` usa un degradado fijo claro (`#ffffff` → `#eeeeee` → `#dddddd`), `background-attachment: fixed`. No usar fondos oscuros en páginas internas.

---

## 3. Tipografía

### Familias

| Rol | Familia | Token Tailwind | Uso |
|-----|---------|----------------|-----|
| Cuerpo | Inter | `font-sans` | Texto general, formularios, tablas |
| Titulares | Outfit | `font-heading` | h1–h6, títulos de panel |
| Datos / IDs | JetBrains Mono | `font-mono` | Metadatos, contadores, `.data-mono` |

Fuentes cargadas vía Google Fonts en `index.html`.

### Jerarquía

| Elemento | Clase / estilo | Tamaño aprox. |
|----------|----------------|---------------|
| Título de página | `.page-title` | `text-2xl sm:text-3xl`, weight 800 |
| Subtítulo | `.page-subtitle` | `text-sm`, `brand-600/80` |
| Título de panel | `.panel-section-title` | `text-lg`, semibold |
| Etiqueta de campo | `.label-caps` | `text-xs`, uppercase, `tracking-wider` |
| Meta de tarjeta | `.case-card-meta` | `text-[11px]`, uppercase |
| Pie legal | Footer | `text-[11px]`, `brand-400/90` |

### Reglas

- Cuerpo: `leading-relaxed`, `antialiased`, color base `brand-800`.
- Titulares: `tracking-tight`. En variantes `.uppercase`, `letter-spacing: 0.05em`.
- Selección de texto: fondo `brand-200`, texto `brand-900`.
- Evitar mezclar más de dos familias en un mismo bloque de lectura.

---

## 4. Espaciado y layout

### Contenedor principal

```html
<div class="page-container">
  <!-- max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in -->
</div>
```

### Header fijo

- Altura mínima: `--app-header-height` (64px).
- Clase: `.app-header` con degradado `nova-horizon`.
- Contenido principal: `pt-[var(--app-header-height)]` para compensar el header fijo.

### Breakpoints (Tailwind estándar)

| Prefijo | Ancho mínimo | Patrones habituales |
|---------|--------------|---------------------|
| `sm` | 640px | Padding horizontal, títulos más grandes |
| `md` | 768px | Mostrar nombre de usuario en header |
| `lg` | 1024px | Layouts de workspace en columnas |

### Radios de borde

| Elemento | Radio |
|----------|-------|
| Botones | `rounded-full` (pill) |
| Tarjetas / paneles | `rounded-2xl` |
| Empty states grandes | `rounded-3xl` |
| Inputs | `rounded-xl` |
| Badges / pills | `rounded-full` o `rounded-md` |

### Sombras

| Token | Uso |
|-------|-----|
| `shadow-glass` | Tarjetas glass, header |
| `shadow-glass-lg` | Hover de tarjetas, menús desplegables |
| `shadow-nova` | Header |
| `shadow-gold` | Hover de CTAs dorados |

---

## 5. Sistema de superficies

NOVA usa dos familias de contenedores: **glass** (translúcido) y **solid** (opaco semitransparente).

### Glass (`GlassSurface`, `GlassCard`)

- Componente base: `GlassSurface` con detección de soporte (`supportsLiquidGlass()`).
- Con soporte: `backdrop-filter: url(#filterId)` + `bg-white/10`.
- Sin soporte: clase `.glass-fallback` (`bg-glass-gradient backdrop-blur-glass`).
- Siempre incluye borde `border-glass-border` y highlight superior (`.glass-edge-top`).
- `GlassCard`: `rounded-2xl p-5`, hover con `shadow-glass-lg` y ligero `-translate-y-0.5`.

**Cuándo usar glass:** header, tarjetas destacadas, elementos flotantes sobre el fondo degradado.

### Solid (`SolidCard`)

- Variante normal: `.solid-panel` — `bg-white/75 border border-brand-100/80 shadow-sm`.
- Variante lectura: `.reading-surface` — fondo blanco sólido para contenido denso.
- Radio: `rounded-2xl`.

**Cuándo usar solid:** paneles de trabajo, formularios, empty states, barras de tabs (`.nav-tabs-bar`).

### Acento superior en paneles

`.section-panel-accent`: franja de 6px con degradado `nova-horizon` en el borde superior. Usar en secciones principales del workspace.

---

## 6. Componentes

### Botones (`GlassButton`)

Variantes disponibles:

| Variante | Clase CSS | Cuándo usar |
|----------|-----------|-------------|
| `primary` | `.cta-primary` | Acción principal (crear, guardar, confirmar) |
| `secondary` | Estilo sólido claro | Acciones secundarias |
| `ghost` | Fondo `brand-50/80` | Acciones terciarias, toggles inactivos |
| `danger` | `bg-red-600` | Eliminar, acciones irreversibles |
| `ai` | `.cta-ai` / `.ai-cta-button` | Disparar procesos de IA |

Tamaños: `xs`, `sm`, `md` (default), `lg`. Soporte `iconOnly`, `fullWidth`, `loading`, `isActive`.

**Comportamiento común:**
- Forma pill (`rounded-full`).
- Hover primario/IA: transición a degradado dorado con texto `nova-slate`.
- `active:scale-[0.98]`, `disabled:opacity-50`.
- Focus: `ring-2 ring-brand-400 ring-offset-2`.
- Iconos en badge circular: `.glass-btn-icon-badge`.

Para botones dentro de otros estilos, existe `LoadingButton` (spinner + `aria-busy`).

### Tarjetas de expediente (`CaseCard`)

- Clase `.case-card` con acento superior animado (`.case-card-accent`).
- Hover: borde más marcado y sombra reforzada.
- Meta: `.case-card-meta` (uppercase pequeño).
- Stats: `.case-card-stat` (mono, tabular-nums).

### Formularios

| Elemento | Clase | Notas |
|----------|-------|-------|
| Input / textarea | `.input-glass` | Fondo blanco, borde `brand-100`, focus ring |
| Label | `.label-caps` | Mayúsculas, semibold |
| Campos bloqueados | `.form-fields-locked` | Cursor not-allowed, fondo `brand-50` |

Placeholders: `placeholder:text-brand-400/70`.

### Barras de acción y navegación

- **Barra de acciones del dashboard:** `.dashboard-action-bar` — contenedor pill con fondo semitransparente.
- **Tabs de workspace:** `.nav-tabs-bar` + `.nav-tab-active` para pestaña seleccionada.
- **Stats del workspace:** `.workspace-stats-bar` y badges `.workspace-stat-badge`.

### Empty states (`EmptyState`)

- Panel sólido centrado con icono animado (documentos, carpeta, checklist, maletín).
- Props: `title`, `description`, `icon`, `action`, `compact`.
- Animación de entrada con Framer Motion (`opacity`, `y`, `scale`).

### Estados de carga

| Componente | Uso |
|------------|-----|
| `LoadingSkeleton` | Listas y grids (con `sr-only` descriptivo) |
| `SkeletonBlock` | Bloques individuales con barrido animado |
| `AiProcessingOverlay` | Overlay sobre formularios durante IA (`role="status"`, `aria-live="polite"`) |
| `NovaBreathingLogo` | Indicador de marca pulsante en procesos IA |

Barra de progreso IA: `.ai-progress-track` + `.ai-progress-bar` (relleno dorado con shine animado).

### Resultados de IA / RAG

- Fila de resultado: `.ai-result-row`.
- Píldora meta: `.rag-result-meta-pill`.
- Highlight de búsqueda: `.rag-search-highlight`.

### Modales

Patrón estándar (portales con `createPortal`):

```tsx
<div
  className="fixed inset-0 z-[80] flex items-center justify-center bg-nova-slate/60 p-4"
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
>
  <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
    <h2 id={titleId} className="text-lg font-bold text-gray-800">{title}</h2>
    {/* contenido */}
  </div>
</div>
```

- Cierre con clic en overlay (salvo cuando `closeDisabled`).
- Focus automático en primer input al abrir.
- Bloqueo de scroll del body mientras está abierto.

### Tooltips (`Tooltip`)

- Basados en Radix UI.
- Estilo: fondo `gray-900/80`, texto blanco, `text-xs`, blur.
- `delayDuration`: 200ms (global en `TooltipProvider`).

### Toasts (`react-hot-toast`)

- Posición: `top-right`, duración 4000ms.
- Estilo: blanco semitransparente, borde `white/60`, `shadow-glass-lg`.
- Éxito: icono `#1e3a5f`. Error: icono `#dc2626`.

### Iconografía

- Librería: **Lucide React** (`lucide-react`).
- Tamaño habitual en botones: `h-4 w-4`. En badges de stats: `h-3.5 w-3.5`.
- Siempre `aria-hidden="true"` cuando el texto adyacente describe la acción.

---

## 7. Animación y movimiento

### Animaciones definidas

| Nombre | Uso |
|--------|-----|
| `fade-in` | Entrada de páginas (`.page-container`), menús |
| `shimmer` / `skeleton-sweep` | Skeletons de carga |
| `ai-cta-shine` | Brillo en botones IA |
| `ai-progress-shine` | Brillo en barra de progreso |
| `nova-breathe` / `nova-glow-pulse` | Logo pulsante |

### Framer Motion

Usar para empty states, transiciones de panel y presencia condicional (`AnimatePresence`). Mantener duraciones cortas (0.3–0.4s) y easing `easeOut`.

### Reducción de movimiento

Todo usuario con `prefers-reduced-motion: reduce` recibe:
- Transiciones y animaciones reducidas a ~0ms.
- Desactivación de shines en CTAs IA y barras de progreso.
- Scroll behavior `auto`.

**Regla:** toda animación decorativa debe tener fallback estático bajo reduced motion.

---

## 8. Accesibilidad

### Obligatorio en código nuevo

| Patrón | Implementación |
|--------|----------------|
| Skip link | Enlace "Saltar al contenido" → `#main-content` |
| Focus visible | `:focus-visible` con outline `2px solid var(--focus-ring)` |
| Modales | `role="dialog"`, `aria-modal`, `aria-labelledby` |
| Menús | `role="menu"`, `role="menuitem"`, `aria-expanded` |
| Carga | `aria-busy` en botones, `sr-only` en skeletons |
| IA en curso | `role="status"`, `aria-live="polite"` |
| Iconos decorativos | `aria-hidden="true"` |
| Imágenes de marca | `alt=""` cuando el texto adyacente identifica la marca |

### Teclado

- `Escape` cierra menús desplegables.
- Formularios: envío con Enter donde aplique (`onKeyDown` en campos).

### Contraste

- Texto principal sobre fondos claros: `brand-800` sobre blanco/ice (ratio adecuado).
- Header: texto `nova-snow` sobre degradado oscuro.
- No depender solo del color para estado; combinar icono + texto + badge.

---

## 9. Patrones de interacción

### Drag and drop

- Overlay de arrastre: clase `.drag-overlay` (escala 1.03, sombra profunda).
- Zona activa: `.drop-zone-active` (borde `nova-deep`, fondo azul tenue).
- Librería: `@dnd-kit/core`.

### Scroll personalizado

Clase `.custom-scroll` en áreas con overflow: scrollbar de 6px, thumb `rgba(20, 52, 87, 0.25)`.

### Paginación

Grids paginados (dashboard: 9 expedientes; workspace páginas: 27). Controles con iconos Chevrons + números de página.

### Búsqueda

Input con icono `Search`, botón clear (`X`) cuando hay texto. Highlight de términos en resultados RAG.

### Permisos y roles

La UI adapta acciones según rol (`admin`, `supervisor`, `casemanager`). Ocultar acciones no permitidas en lugar de mostrarlas deshabilitadas sin contexto.

---

## 10. Microcopy y tono

### Idioma

- Interfaz en **español** con convenciones formales pero directas.
- Fechas: utilidades en `utils/dateFormat.ts` (`formatLongDate`).
- Nombres de usuario en mayúsculas se normalizan a Title Case en el header.

### Mensajes de error

- Preferir mensajes concretos: "No se pudo guardar el alcance de documentos" en lugar de "Error".
- Toasts de error con duración estándar; no bloquear la UI.

### IA y responsabilidad

Texto fijo en footer:

> Los contenidos generados por IA pueden contener errores. Revise siempre la información con supervisión humana.

Mostrar progreso explícito durante operaciones IA ("Generando redacción automática…").

### Placeholders

Ejemplos contextuales y humanos: "Ej. Juan Pérez", "Detalles adicionales del caso…".

---

## 11. Estructura de archivos relevante

```
frontend/
├── src/
│   ├── index.css              # Tokens CSS, clases @layer components
│   ├── components/
│   │   ├── glass/             # GlassSurface, GlassButton, GlassCard
│   │   ├── ui/                # EmptyState, SolidCard, CaseCard, Tooltip…
│   │   ├── form-filling/      # Paneles de formularios
│   │   └── checklist/         # QC Builder
│   ├── pages/                 # Dashboard, CaseWorkspace, Teams…
│   └── lib/liquid-glass/      # Detección y filtros SVG
├── tailwind.config.js         # Tokens de color, sombras, animaciones
└── index.html                 # Meta theme-color, fuentes
```

---

## 12. Checklist para nuevas pantallas

- [ ] Contenido dentro de `.page-container` o layout equivalente con padding responsive.
- [ ] Título con `.page-title` y subtítulo opcional con `.page-subtitle`.
- [ ] Acción principal con `GlassButton variant="primary"`; IA con `variant="ai"`.
- [ ] Estados vacío, carga y error contemplados.
- [ ] Formularios con `.label-caps` + `.input-glass` + ids enlazados.
- [ ] Modales con portal, ARIA y focus trap básico.
- [ ] Toasts para feedback de acciones async.
- [ ] Animaciones respetan `prefers-reduced-motion`.
- [ ] Textos en español, tono profesional.
- [ ] Iconos Lucide con tamaños consistentes.

---

## 13. Qué evitar

- Introducir una paleta de colores nueva sin extender `tailwind.config.js`.
- Botones rectangulares (`rounded-md`) salvo casos excepcionales; la forma pill es la norma.
- Fondos oscuros en contenido principal (solo header y overlays).
- Animaciones largas o bloqueantes sin indicador de progreso.
- Confianza ciega en salidas de IA sin estado de revisión o disclaimer.
- Estilos inline repetidos que deberían ser clases en `index.css`.
- Mezclar inglés y español en la UI visible al usuario.

---

## 14. Referencia rápida de tokens CSS

```css
:root {
  --nova-deep: #143457;
  --nova-gold: #bd9655;
  --nova-gold-light: #e3c48e;
  --nova-ice: #e8f1f8;
  --nova-slate: #0a1c30;
  --nova-snow: #ffffff;
  --glass-blur: 16px;
  --glass-opacity: 0.65;
  --glass-border: rgba(255, 255, 255, 0.45);
  --focus-ring: #2d5a85;
  --app-header-height: 64px;
  --font-display: "Outfit", "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

---

*Documento generado a partir del código del repositorio. Actualizar cuando se modifiquen tokens en `tailwind.config.js` o clases globales en `index.css`.*
