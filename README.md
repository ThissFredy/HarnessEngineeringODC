# 🚀 Proyecto ODC: Harness Engineering — El Nuevo Paradigma

> Objeto Digital de Conocimiento (ODC) gamificado, requisito de grado — **Universidad de Cundinamarca**, CADI *Aplicaciones de Machine Learning*.

## 📌 Descripción General

Este repositorio contiene el desarrollo de un **Objeto Digital de Conocimiento gamificado** que traduce los hallazgos de una revisión sistemática de literatura (metodología **PRISMA**) en una experiencia interactiva web, empaquetada bajo el estándar **SCORM 1.2** para su despliegue en **Moodle**.

Visual y mecánicamente, el ODC funciona como un **videojuego 2D clásico estilo *Super Mario Bros 3***: el estudiante navega un mapa *Overworld* para desbloquear niveles secuenciales que combinan **teoría** y **evaluación interactiva**.

### 🎯 Resultado Esperado de Aprendizaje (REA)

> Comprender la arquitectura de *Harness Engineering* para la implementación segura y escalable de agentes LLM en el ciclo vital de desarrollo de software (SDLC).

| | |
|---|---|
| **Población objetivo** | Estudiantes de Ingeniería de Sistemas y Computación · Especialización en Analítica y Ciencia de Datos |
| **CADI** | Aplicaciones de Machine Learning |
| **Metodología** | Exploración gamificada sobre mapa con 7 nodos temáticos |
| **Evaluación** | Sumativa. Cada nodo cierra con un minijuego; el SCORM reporta el promedio final a Moodle |

---

## ⚖️ Política Open Source (obligatoria)

**El 100 % de las herramientas, librerías, fuentes y recursos multimedia de este proyecto deben ser OPEN SOURCE.** Esta restricción es de requisito del proyecto y no admite excepciones.

| Herramienta / recurso | Licencia | Verificada |
|---|---|---|
| [Phaser 3](https://phaser.io) | MIT | ✅ |
| [Vite](https://vitejs.dev) | MIT | ✅ |
| [pnpm](https://pnpm.io) | MIT | ✅ |
| [jszip](https://stuk.github.io/jszip/) | MIT (opción dual MIT/GPL) | ✅ |
| [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) | SIL OFL 1.1 | ✅ |
| [VT323](https://fonts.google.com/specimen/VT323) | SIL OFL 1.1 | ✅ |
| [Inter](https://rsms.me/inter/) | SIL OFL 1.1 | ✅ |
| [Roboto](https://fonts.google.com/specimen/Roboto) | Apache 2.0 | ✅ |
| Wrapper SCORM 1.2 (`src/scorm/scorm.js`) | MIT (propio) | ✅ |

**Reglas duras:**
- ❌ Ninguna librería comercial o cerrada.
- ❌ Ninguna fuente servida por CDN externo (todo se sirve offline desde el zip SCORM).
- ❌ Ningún asset con copyright sin licencia libre (CC0 / CC-BY / dominio público).
- ❌ Ningún servicio externo en producción (analytics, hotjar, etc.).
- ✅ Todo asset generado con IA debe declararse como **CC BY 4.0** (licencia del proyecto) y registrarse en `THIRD_PARTY.md`.

---

## 📜 Licencia del proyecto (mixta)

El proyecto aplica **dos licencias** en función del tipo de artefacto. Esto es necesario porque Creative Commons **no** se recomienda para código, y MIT **no** es la más adecuada para contenido didáctico.

| Componente | Licencia | Archivo | Notas |
|---|---|---|---|
| **Código fuente** (`src/`, `scripts/`, configs, `AGENTS.md`, `.opencode/`) | **MIT** | [`LICENSE`](./LICENSE) | Uso libre, incluso comercial, con atribución. |
| **Contenido educativo** (teoría de los 7 nodos, evaluaciones, textos de UI, guiones de audio, diagramas, sprites, audios, docs) | **CC BY 4.0** | [`LICENSE-CONTENT.txt`](./LICENSE-CONTENT.txt) | Requiere atribución. Permite usos comerciales y derivados. |
| **Dependencias de terceros** (Phaser, Vite, jszip, pnpm, fuentes) | Ver tabla | [`THIRD_PARTY.md`](./THIRD_PARTY.md) | Conservan sus licencias originales. No se pueden relicenciar. |

**Atribución sugerida** al reutilizar el contenido:

> «Harness Engineering – El Nuevo Paradigma» (2026)
> Universidad de Cundinamarca · CADI Aplicaciones de Machine Learning
> Licencia CC BY 4.0

**Símbolos:**
- [MIT](https://opensource.org/license/mit)
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) · [Código legal](https://creativecommons.org/licenses/by/4.0/legalcode)

---

## 🎮 ¿Phaser 3 puede exportarse a SCORM?

**Sí, sin ninguna fricción.** SCORM 1.2 no impone motor ni framework: solo exige que el contenido sea **HTML + JS + CSS** dentro de un `.zip`, con un `imsmanifest.xml` en la raíz y comunicación con el objeto `window.API` que expone el LMS (`LMSInitialize`, `LMSSetValue`, `LMSCommit`, `LMSFinish`).

Phaser 3 compila a un **bundle JS estándar** que corre en el navegador dentro del iframe de Moodle. El artefacto final se ve así:

```
ODC-HarnessEngineering-SCORM12-v0.1.0.zip
├── imsmanifest.xml        ← raíz del zip (obligatorio)
├── index.html             ← entry point del SCO
├── assets/
│   ├── main-abc123.js     ← bundle Phaser + juego
│   ├── main-abc123.css
│   └── …
├── adlcp_rootv1p2.xsd     ← schemas (recomendables)
├── imscp_rootv1p1p2.xsd
└── …
```

Lo único que hay que cuidar en Vite es `base: './'` para que todos los assets se referencien con paths **relativos** (el LMS sirve el contenido desde una ruta arbitraria).

---

## 🛠️ Stack Tecnológico y Arquitectura

| Capa | Tecnología | Notas |
|---|---|---|
| Motor / Frontend | **Phaser 3** | Mapa Overworld, sprites pixel-art, escenas |
| UI / DOM | HTML5 + CSS3 + JS vanilla | Paneles de teoría, quiz, drag & drop |
| Build | **Vite 6** | `base: './'`, sin code splitting de CSS |
| Package manager | **pnpm** | `packageManager: pnpm@12.x` |
| Empaquetado SCORM | **jszip** + `scripts/scorm-pack.mjs` | Genera `.zip` con `imsmanifest.xml` |
| API SCORM 1.2 | `src/scorm/scorm.js` (custom MIT) | Wrapper ligero, sin dependencias |
| Assets | PNG/JPG/OGG/MP3 ligeros | Generados con IA o propios, licencia libre |
| Multimedia | Avatar 2D + audios con subtítulos | Clips ≤ 30 s |

---

## 🗺️ Estructura del Mapa (Overworld) y Niveles

| # | Nodo | Visual | Ideas clave |
|---|---|---|---|
| 1 | **De Redes Neuronales a LLMs** | Terminal retro / laboratorio de servidores | Perceptrón → deep learning → transformers → LLMs. Embeddings y atención. |
| 2 | **El Nuevo SDLC** | Llave inglesa + disquete / escritorio moderno | SDLC asistido por IA. El programador muta a **orquestador**. |
| 3 | **Limitaciones y Evolución** | Globo de texto estallando / biblioteca caótica | Saturación de contexto, alucinaciones. Del *prompt engineering* a arquitecturas robustas. |
| 4 | **Agentes de IA** | Cabeza de robot amigable / ciudad automatizada | Autonomía, bucles percepción-decisión-acción, *agentic workflows*. |
| 5 | **Skills y MCP** | Enchufe brillante / armería de herramientas | *Skills* reutilizables, **Model Context Protocol** e interoperabilidad. |
| 6 | **Sandbox y Guardrails** | Escudo de metal / cámara de contención | Entornos aislados, observabilidad, auditoría y mitigación de riesgos. |
| 7 | **Harness Engineering** | Cohete espacial / sala de control panorámica | La arquitectura que **envuelve y controla** todo el sistema. |

Cada nodo = **vista de teoría (con avatar) + minijuego de evaluación**.

---

## 🎨 Guía de Estilo y UI

- **Estética principal:** 16-bit retro, *pixel art*.
- **Fondos:** neutros oscurecidos. **Paneles de texto:** fondo negro semitransparente (50–60 % opacidad) para legibilidad.
- **Títulos:** naranja/dorado con sombreado (*drop shadow*) o borde negro de 1 px.
- **Tipografía:**
  - Títulos, botones e interfaz: **Press Start 2P**, **VT323**.
  - Cuerpo de texto (teoría e instrucciones): **Inter**, **Roboto** (limpias, anti fatiga visual).
- **Accesibilidad:** botones ≥ 48 px, foco visible, contraste AA, mouse + táctil, responsive 360→1280 px.

---

## 📁 Estructura del Proyecto

```
HarnessEngineeringODC/
├── .opencode/                # agentes de opencode (UI, académico, SCORM-QA)
├── docs/nodos/               # material maestro de contenido (Markdown)
├── public/
│   ├── index.html            # entry point
│   └── scorm/                # imsmanifest.xml + schemas
├── scripts/
│   ├── scorm-pack.mjs        # dist/ → .zip SCORM 1.2
│   └── validate-scorm.mjs    # checklist automático
├── src/
│   ├── main.js               # bootstrap
│   ├── scorm/scorm.js        # wrapper SCORM 1.2
│   ├── styles/main.css       # variables, tipografía, componentes
│   ├── assets/{fonts,sprites,audio}/
│   └── game/
│       ├── config.js
│       ├── data/nodos.js
│       ├── scenes/{Boot,Preload,Title,Overworld,Node}Scene.js
│       └── scenes/components/
├── AGENTS.md                 # instrucciones para agentes de IA
├── README.md
├── package.json
└── vite.config.js            # base: './'  (OBLIGATORIO para SCORM)
```

---

## 🚀 Inicio rápido

### Requisitos
- **Node.js ≥ 20** (recomendado 26 LTS)
- **pnpm ≥ 10** (`corepack enable && corepack prepare pnpm@latest --activate`)
- Git

### Instalación

```bash
git clone https://github.com/<tu-org>/HarnessEngineeringODC.git
cd HarnessEngineeringODC
pnpm install
```

### Desarrollo

```bash
pnpm dev
```

Abre http://localhost:5173. En modo dev no hay LMS, así que `src/scorm/scorm.js` entra en **modo fallback** (usa `localStorage` y loguea en consola).

### Build de producción

```bash
pnpm build
```

Genera `dist/` listo para servir con cualquier servidor estático.

### Exportar paquete SCORM 1.2

```bash
pnpm scorm:pack
```

Genera `export/ODC-HarnessEngineering-SCORM12-v<version>.zip` listo para subir a Moodle.

### Validar compatibilidad SCORM

```bash
pnpm scorm:validate
```

Corre un checklist automático (manifest, entry point, llamadas a la API, paths relativos, ausencia de archivos prohibidos).

### Pipeline completo (recomendado antes de cada entrega)

```bash
pnpm export:check
```

Build + pack + validate en cadena. Ideal para ejecutar antes de cada commit o entrega al docente.

---

## 🧠 Agentes de opencode (`.opencode/agent/`)

El proyecto incluye tres agentes especializados para acelerar el desarrollo con IA:

| Agente | Responsabilidad | Cuándo invocarlo |
|---|---|---|
| **`ui-retro`** | Sistema visual 16-bit: paleta, tipografía *Press Start 2P*, layout del Overworld, HUD, sprites, accesibilidad. | Cualquier cambio CSS/HTML visual o de sprites. |
| **`academico`** | Contenido de los 7 nodos, evaluaciones interactivas (quiz, drag & drop), taxonomía de Bloom, REA. | Redactar teoría, diseñar preguntas, revisar rigor. |
| **`scorm-qa`** | Compatibilidad SCORM 1.2 / Moodle: `imsmanifest.xml`, wrapper API, `.zip`, licencias. | Cada iteración antes de subir a Moodle. |

Se invocan con el Task tool de opencode. Ejemplo conceptual: «con `academico`, escribe el nodo 3» / «con `ui-retro`, ajusta el Overworld» / «con `scorm-qa`, valida el último `.zip`».

---

## 📦 Configuración del entorno Moodle (futuro)

El testeo real se hará con **Moodle local vía Docker**. Servicio pendiente de configurar en una iteración futura. Mientras tanto, se valida con el checklist de `scripts/validate-scorm.mjs` + SCORM Cloud gratuito.

---

## 📄 Licencia

**Proyecto con licencia mixta:**

- **Código fuente:** [MIT](./LICENSE) © 2026 Universidad de Cundinamarca — CADI Aplicaciones de Machine Learning.
- **Contenido educativo, evaluaciones y assets:** [CC BY 4.0](./LICENSE-CONTENT.txt) © 2026 Universidad de Cundinamarca — CADI Aplicaciones de Machine Learning.
- **Dependencias de terceros:** ver [`THIRD_PARTY.md`](./THIRD_PARTY.md).
