# AGENTS.md — Instrucciones del Proyecto ODC Harness Engineering

Este archivo es leído automáticamente por los agentes de opencode. **Léelo antes de tocar cualquier archivo.**

## Contexto en una línea

ODC gamificado (videojuego 2D estilo *Super Mario Bros 3*) sobre **Harness Engineering** para agentes LLM, exportable como **paquete SCORM 1.2** para Moodle. Requisito de grado — Universidad de Cundinamarca, CADI Aplicaciones de Machine Learning.

## Stack (todos open source — ver README «Política open source»)

| Capa | Herramienta | Licencia |
|---|---|---|
| Motor 2D | **Phaser 3** | MIT |
| Build | **Vite** | MIT |
| Package manager | **pnpm** | MIT |
| Empaquetado SCORM | **jszip** + scripts propios | MIT |
| API SCORM 1.2 | Wrapper custom en `src/scorm/scorm.js` | MIT (propio) |
| Fuentes | Press Start 2P, VT323, Inter, Roboto | OFL / Apache 2.0 |

**Regla dura:** 100 % open source. Nada de librerías comerciales, CDNs de pago, assets con copyright sin licencia libre, ni Google Fonts remotos. Todo se sirve offline desde el zip SCORM.

### Licencia del proyecto (mixta)

| Componente | Licencia | Archivo |
|---|---|---|
| **Código fuente** (`src/`, `scripts/`, configs, `.opencode/`, `AGENTS.md`) | **MIT** | [`LICENSE`](./LICENSE) |
| **Contenido educativo** (teoría, evaluaciones, textos UI, guiones, diagramas, sprites, audios, docs) | **CC BY 4.0** | [`LICENSE-CONTENT.txt`](./LICENSE-CONTENT.txt) |
| **Dependencias de terceros** | Ver tabla | [`THIRD_PARTY.md`](./THIRD_PARTY.md) |

**Reglas:**
- El código nuevo se publica bajo MIT (cabecera `Licencia: MIT`).
- Todo asset nuevo (sprite, audio, texto, diagrama) se registra en `THIRD_PARTY.md` y se publica bajo CC BY 4.0.
- El contenido generado con IA debe declararse como CC BY 4.0 y atribuir a la Universidad de Cundinamarca.
- Al agregar una dependencia, actualizar `THIRD_PARTY.md` con su licencia.

## Por qué Phaser sí exporta a SCORM

SCORM 1.2 solo exige que el contenido sea **HTML + JS + CSS** con un `imsmanifest.xml` en la raíz del zip y que se comunique con `window.API` (LMSInitialize / LMSSetValue / LMSFinish). Phaser compila a un bundle JS estándar que corre en el navegador, así que encaja perfecto. El artefacto final es un `.zip` con esta forma:

```
ODC-HarnessEngineering-SCORM12-vX.Y.Z.zip
├── imsmanifest.xml        ← raíz, obligatorio
├── index.html             ← entry point
├── assets/…               ← bundle JS/CSS/sprites
└── *.xsd                  ← schemas SCORM (opcional pero recomendable)
```

## Estructura de carpetas

```
HarnessEngineeringODC/
├── .opencode/
│   ├── opencode.json         # config opencode (instructions globales)
│   └── agent/
│       ├── ui-retro.md       # UI/UX pixel-art 16-bit
│       ├── academico.md      # contenido + evaluaciones
│       └── scorm-qa.md       # QA de compatibilidad SCORM/Moodle
├── docs/
│   └── nodos/                # material maestro en Markdown (fuente de verdad del contenido)
├── public/
│   ├── index.html            # entry point (Vite lo copia al dist)
│   └── scorm/                # imsmanifest.xml + XSDs + plantillas
├── scripts/
│   ├── scorm-pack.mjs        # build dist/ → .zip SCORM 1.2
│   └── validate-scorm.mjs    # checklist automático del paquete
├── src/
│   ├── main.js               # bootstrap Phaser + SCORM
│   ├── scorm/scorm.js        # wrapper SCORM 1.2 (MIT propio)
│   ├── styles/main.css       # variables, tipografía, componentes retro
│   ├── assets/{fonts,sprites,audio}/
│   └── game/
│       ├── config.js         # constantes del juego (CANVAS, nodos, colores)
│       ├── data/nodos.js     # datos de los 7 nodos (teoría + minijuegos)
│       ├── scenes/           # Boot, Preload, Title, Overworld, Node
│       └── scenes/components/
├── AGENTS.md                 # este archivo
├── README.md                 # documentación humana + política open source
├── package.json              # pnpm
└── vite.config.js            # base: './' (OBLIGATORIO para SCORM)
```

## Agentes disponibles (invocar con Task)

| Agente | Cuándo usarlo |
|---|---|
| `ui-retro` | CSS, sprites, paleta, tipografía, layout del mapa, HUD, accesibilidad visual |
| `academico` | Teoría de un nodo, preguntas, drag & drop, taxonomía de Bloom, REA |
| `scorm-qa` | Empaquetado, `imsmanifest.xml`, API SCORM, validación antes de subir a Moodle |

**Regla de colaboración:** cuando un cambio cruza responsabilidades, avisa al otro agente (ej. «el nodo 3 ahora tiene 5 preguntas, recalcula el promedio» o «este bloque necesita un diagrama, diseño la UI»).

## Reglas de código

1. **Vanilla JS / ESM.** Nada de TypeScript salvo que se pida explícitamente (mantiene el build simple para SCORM).
2. **Sin dependencias pesadas.** Antes de instalar algo, justifica el peso (bundle final < 20 MB).
3. **ES modules con alias** (`@/`, `@game/`, `@scorm/`, `@assets/`) definidos en `vite.config.js`.
4. **Sin paths absolutos** en runtime. `base: './'` es obligatorio en Vite config.
5. **Sin CDNs, analytics, tracking, hot-reload remoto.** Todo self-hosted.
6. **Sin `console.log` en producción** (usa un logger que se mute en build).
7. **Accesibilidad**: botones ≥ 48 px, foco visible, contraste AA, eventos mouse + touch.
8. **Persistencia**: todo progreso debe sobrevivir a `LMSFinish` → `LMSInitialize` vía `cmi.suspend_data`. `localStorage` solo como fallback de desarrollo.

## Flujo teórico-evaluativo (obligatorio en cada nodo)

Cada nodo se compone SIEMPRE de dos vistas, en este orden:

1. **Teoría** con avatar guía (hook → bloques → analogía → dato clave → glosario → cierre).
2. **Minijuego / evaluación** (quiz, drag & drop, ordenar, emparejar) con feedback inmediato y puntaje 0–100.

El **promedio de los 7 puntajes** se envía a `cmi.core.score.raw`. `cmi.core.lesson_status` pasa a `completed` solo cuando los 7 nodos están superados.

## Comandos útiles

```bash
pnpm install           # dependencias
pnpm dev               # desarrollo con HMR (sin SCORM, modo fallback)
pnpm build             # bundle a dist/
pnpm scorm:pack        # dist/ → .zip SCORM 1.2
pnpm scorm:validate    # checklist automático
pnpm export:check      # build + pack + validate
```

## Definiciones de Hecho (DoD)

- [ ] `pnpm build` compila sin errores ni warnings de paths.
- [ ] `pnpm scorm:pack` genera el `.zip` con `imsmanifest.xml` en la raíz.
- [ ] `pnpm scorm:validate` reporta 0 fallos BLOQUEANTES.
- [ ] El agente `scorm-qa` emite informe APTO.
- [ ] `THIRD_PARTY.md` actualizado con licencias (todas open source).
- [ ] Sin `console.log` de debug, sin TODOs que rompan el build.
- [ ] Contenido académico revisado por `academico` si se tocó.
- [ ] UI revisada por `ui-retro` si se tocó.

## Cosas que NO se hacen

- ❌ Cambiar `base: './'` en `vite.config.js`
- ❌ Usar un solo SCO con secuenciación SCORM 2004 (este proyecto es SCORM 1.2)
- ❌ Meter assets no licenciados o con copyright
- ❌ Conectar a CDNs en producción
- ❌ Guardar el progreso solo en `localStorage` (debe pasar por SCORM)
- ❌ Escribir contenido de nodos sin pasar por el agente `academico`
