# 🚀 Proyecto ODC: Harness Engineering — El Nuevo Paradigma

> Objeto Digital de Conocimiento (ODC) gamificado, requisito de grado — **Universidad de Cundinamarca**, CADI *Aplicaciones de Machine Learning*.

## 📌 Descripción General

Este repositorio contiene el desarrollo de un **Objeto Digital de Conocimiento gamificado** que traduce los hallazgos de una revisión sistemática de literatura (metodología **PRISMA**) en una experiencia interactiva web, empaquetada bajo el estándar **SCORM 1.2** para su despliegue en **Moodle**.

Visual y mecánicamente, el ODC funciona como un **videojuego 2D clásico estilo *Super Mario Bros 3***: el estudiante navega un mapa *Overworld* para desbloquear niveles secuenciales que combinan **teoría** y **evaluación interactiva**.

**El ODC se desarrolla con React + Tailwind CSS + Vite (todo open source) y se despliega como SCO estático: el artefacto SCORM es el `dist/` — HTML/CSS/JS autocontenido, sin CDN ni servicios externos.** La razón de fondo: **SCORM 1.2 solo exige contenido estático**; al LMS le da igual cómo se generó — sirve lo que produce `pnpm build`.

### 🎯 Resultado Esperado de Aprendizaje (REA)

> Comprender la arquitectura de *Harness Engineering* para la implementación segura y escalable de agentes LLM en el ciclo vital de desarrollo de software (SDLC).

| | |
|---|---|
| **Población objetivo** | Estudiantes de Ingeniería de Sistemas y Computación · Especialización en Analítica y Ciencia de Datos |
| **CADI** | Aplicaciones de Machine Learning |
| **Metodología** | Exploración gamificada sobre mapa con 7 nodos temáticos |
| **Evaluación** | Sumativa. Cada nodo cierra con un minijuego; el SCO reporta el promedio final (0–100) a Moodle vía `cmi.core.score.raw` |

---

## 🤔 ¿Por qué React + Tailwind + Vite?

**Porque el requisito duro es del artefacto, no del toolchain: el SCO debe ser HTML+CSS+JS estático, self-contained y sin servicios externos. Eso lo garantiza el build, no la ausencia de framework.**

SCORM 1.2 solo exige que el contenido sea **HTML + JS + CSS** dentro de un `.zip`, con un `imsmanifest.xml` en la raíz y comunicación con el objeto `window.API` que expone el LMS (`LMSInitialize`, `LMSSetValue`, `LMSCommit`, `LMSFinish`). El LMS sirve archivos estáticos: no importa si se escribieron a mano o los generó un build.

| Ventaja | Detalle |
|---|---|
| **Desarrollo moderno** | Componentes React reutilizables por escena (`Inicio`, `Mapa`, `Nodo`, minijuegos) y estilos Tailwind con tokens (`@theme`). |
| **Producción estática pura** | `pnpm build` produce `dist/`: HTML + JS + CSS + fuentes + imágenes, 100 % autocontenido. |
| **Sin CDN, sin servicios externos** | Vite con `base: './'`: todas las referencias relativas; fuentes y assets empaquetados en el zip. |
| **Empaquetado trivial** | El `.zip` SCORM se arma desde `dist/` + `imsmanifest.xml` en la raíz (con `zip` o fallback `python3`, ambos Info-ZIP/PSF). |
| **Longevidad** | El SCO servido al LMS es estático: funcionará hoy y en 10 años, al margen del ciclo de vida de cualquier framework. |
| **100 % open source** | React, Vite, rolldown, Tailwind: MIT; lightningcss: MPL-2.0. Detalle en [`THIRD_PARTY.md`](./THIRD_PARTY.md). |

**Reglas duras de compatibilidad SCORM (aplican al `dist/`):**

- ✅ Todas las rutas **relativas** (`./`). Configuradas con `base: './'` en `vite.config.js`. ❌ Jamás absolutas (`/assets/...`).
- ✅ Todo *self-contained*: fuentes, sprites y audios viven dentro del zip.
- ❌ Ningún CDN, ningún servicio externo en producción (analytics, hotjar, etc.).
- ℹ️ El `dist/` contiene cadenas de texto con URLs (cabecera de licencia de Tailwind, mensajes de error de React, namespaces SVG). Son **inertes**: no se cargan ni se ejecutan; ninguna petición de red sale del SCO.

---

## 📦 Modelo de datos SCORM 1.2

Cómo el ODC se comunica con el LMS (encapsulado en `src/scorm/`, wrapper propio MIT):

| Elemento / llamada | Uso en el ODC |
|---|---|
| `LMSInitialize` / `LMSFinish` | Conectar y desconectar el SCO del LMS. |
| `cmi.core.lesson_status` | `incomplete` al iniciar → `completed` al superar los 7 nodos. |
| `cmi.core.score.raw` | Promedio final de los 7 minijuegos (0–100). Moodle lo toma como calificación. |
| `cmi.core.lesson_location` | Nodo actual, para reanudar la sesión donde quedó el estudiante. |
| `cmi.suspend_data` | Estado de progreso detallado. ⚠️ SCORM 1.2 lo limita a **4096 caracteres**: guardar JSON minificado y compacto. |
| `LMSCommit` | Persistencia periódica (al cerrar cada nodo/minijuego). |

El wrapper busca el objeto `API` en `window`, `window.parent` y `window.opener` (cadena de iframes de Moodle). Si no hay LMS — modo desarrollo — entra en **fallback**: usa `localStorage` y loguea la traza SCORM en consola.

---

## ⚖️ Política Open Source (obligatoria)

**El 100 % de las herramientas, librerías, fuentes y recursos multimedia de este proyecto deben ser OPEN SOURCE.** Esta restricción es de requisito del proyecto y no admite excepciones.

Al usar HTML/CSS/JS puro **no existe ninguna dependencia de código**; la auditoría se reduce a recursos:

| Recurso | Licencia | Verificada |
|---|---|---|
| [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) | SIL OFL 1.1 | ✅ |
| [VT323](https://fonts.google.com/specimen/VT323) | SIL OFL 1.1 | ✅ |
| [Inter](https://rsms.me/inter/) | SIL OFL 1.1 | ✅ |
| [Roboto](https://fonts.google.com/specimen/Roboto) | Apache 2.0 | ✅ |
| React / ReactDOM 19 | MIT | ✅ |
| Vite 8 + rolldown | MIT | ✅ |
| Tailwind CSS 4 (+ postcss) | MIT | ✅ |
| lightningcss (dep de Tailwind) | MPL-2.0 (OSI) | ✅ |
| Node.js / pnpm | MIT | ✅ |
| Wrapper SCORM 1.2 (`src/scorm/`) | MIT (propio) | ✅ |
| `zip` / `unzip` (empaquetado, herramienta de sistema) | Info-ZIP | ✅ |

Detalle de versiones y licencias por paquete: [`THIRD_PARTY.md`](./THIRD_PARTY.md).

**Reglas duras:**
- ❌ Ninguna librería comercial o cerrada.
- ❌ Ninguna fuente servida por CDN externo: las fuentes se sirven **offline** desde el zip SCORM.
- ❌ Ningún asset con copyright sin licencia libre (CC0 / CC-BY / dominio público).
- ❌ Ningún servicio externo en producción (analytics, hotjar, etc.).
- ✅ Todo asset generado con IA debe declararse como **CC BY 4.0** (licencia del proyecto) y registrarse en `THIRD_PARTY.md`.

---

## 📜 Licencia del proyecto (mixta)

El proyecto aplica **dos licencias** en función del tipo de artefacto. Esto es necesario porque Creative Commons **no** se recomienda para código, y MIT **no** es la más adecuada para contenido didáctico.

| Componente | Licencia | Archivo | Notas |
|---|---|---|---|
| **Código fuente** (HTML/CSS/JS del SCO, `scripts/`, configs) | **MIT** | [`LICENSE`](./LICENSE) | Uso libre, incluso comercial, con atribución. |
| **Contenido educativo** (teoría de los 7 nodos, evaluaciones, textos de UI, guiones de audio, diagramas, sprites, audios, docs) | **CC BY 4.0** | [`LICENSE-CONTENT.txt`](./LICENSE-CONTENT.txt) | Requiere atribución. Permite usos comerciales y derivados. |
| **Recursos de terceros** (fuentes tipográficas) | Ver tabla | [`THIRD_PARTY.md`](./THIRD_PARTY.md) | Conservan sus licencias originales. No se pueden relicenciar. |

**Atribución sugerida** al reutilizar el contenido:

> «Harness Engineering – El Nuevo Paradigma» (2026)
> Universidad de Cundinamarca · CADI Aplicaciones de Machine Learning
> Licencia CC BY 4.0

**Símbolos:**
- [MIT](https://opensource.org/license/mit)
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) · [Código legal](https://creativecommons.org/licenses/by/4.0/legalcode)

---

## 🛠️ Stack Tecnológico y Arquitectura

| Capa | Tecnología | Notas |
|---|---|---|
| Estructura | **HTML5** | `index.html` = entry de Vite |
| UI | **React 19** (MIT) | Componentes por escena (`src/scenes/`): `Inicio`, `Mapa`, `Nodo` |
| Estilos | **Tailwind CSS 4** (MIT) | Tokens en `@theme` (`#ffa822`, fuente pixel); utilidades arbitrarias px para el diseño 16-bit |
| Build | **Vite 8 + rolldown** (MIT) | `base: './'` (rutas relativas), output estático en `dist/` |
| Lógica | **JavaScript (ESM + JSX)** | Runtime: solo React; el resto es propio |
| Render del juego | Stage DOM 1024×559 escalado (`transform`) + CSS | Letterbox, zoom/pan táctil, pixel art con `image-rendering: pixelated` |
| API SCORM 1.2 | `src/scorm/` (custom MIT) | Wrapper ligero, fallback `localStorage` |
| Empaquetado SCORM | `zip` (CLI) + `scripts/scorm-pack.sh` | Zip de `dist/` + `imsmanifest.xml` en la raíz |
| Validación | `scripts/validate-scorm.sh` | Checklist automático de compatibilidad |
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

*(Estructura objetivo; se construye por iteraciones.)*

```
HarnessEngineeringODC/
├── index.html               # entry de Vite (desarrollo)
├── vite.config.js           # base './' + plugins react/tailwind
├── package.json             # scripts: dev, build, preview, pack
├── src/
│   ├── main.jsx             # bootstrap React
│   ├── App.jsx              # frame + stage + gestor de escenas + API window.ODC
│   ├── index.css            # @import tailwindcss + @theme + @font-face
│   ├── components/
│   │   └── Stage.jsx        # 1024×559, transform-origin 0 0
│   ├── hooks/
│   │   └── useStageViewport.js   # fit + zoom/pan (pellizco 2 dedos, rueda)
│   ├── scenes/
│   │   ├── Scene.jsx        # wrapper: fondo + capa de contenido
│   │   ├── Inicio.jsx       # pantalla de inicio
│   │   ├── Mapa.jsx         # overworld (futuro)
│   │   └── Nodo.jsx         # nodo temático reutilizable (futuro)
│   ├── data/
│   │   ├── scenes.js        # registro de escenas + fondos
│   │   └── nodos.js         # contenido de los 7 nodos (futuro)
│   ├── scorm/               # wrapper SCORM 1.2 (futuro)
│   └── assets/
│       ├── fonts/           # .ttf + licencias (SIL OFL)
│       ├── backgrounds/     # un fondo por escena
│       ├── sprites/         # avatar, tiles (futuro)
│       └── audio/           # clips (futuro)
├── imsmanifest.xml          # manifest SCORM 1.2 (futura iteración)
├── scripts/
│   ├── scorm-pack.sh        # pnpm build + zip de dist/ (+ manifest)
│   └── validate-scorm.sh    # checklist automático
├── dist/                    # SCO construido (gitignored, se regenera)
├── docs/nodos/              # material maestro de contenido (NO se empaqueta)
├── THIRD_PARTY.md           # licencias de terceros (verificadas)
├── .gitignore
├── README.md
├── LICENSE                  # MIT (código)
└── LICENSE-CONTENT.txt      # CC BY 4.0 (contenido educativo)
```

> El zip SCORM lleva **solo `dist/` + `imsmanifest.xml`**. `node_modules/`, `src/`, `docs/`, `scripts/` y las licencias del repo **no** van dentro del zip: son archivos de trabajo.

---

## 🚀 Inicio rápido

### Requisitos
- Node.js 20+ y pnpm
- Git
- `zip` (empaquetado; en Windows: 7-Zip o `Compress-Archive` de PowerShell)
- Navegador moderno (Firefox / Chrome / Edge)
- Opcional: Python 3 (servidor local del `dist/`) y `xmllint` (validar manifest)

### Instalación

```bash
git clone https://github.com/ThissFredy/HarnessEngineeringODC.git
cd HarnessEngineeringODC
pnpm install
```

### Desarrollo

```bash
pnpm dev
```

Dev server con HMR en http://localhost:5173. Sin LMS, el wrapper SCORM entra en **modo fallback** (`localStorage` + traza en consola).

Navegación dev (invisible, se retira en producción): teclas `1`–`9` cambian de escena, `←/→` ciclan, `0` o doble toque resetea el zoom.

### Build (genera el SCO)

```bash
pnpm build
```

Produce `dist/` estático. Preview local (simula mejor el iframe de Moodle):

```bash
pnpm preview
```

### Empaquetar SCORM 1.2

```bash
pnpm scorm
```

Genera `export/ODC-HarnessEngineering-SCORM12-v<versión>.zip` listo para subir a Moodle.

### Validar compatibilidad SCORM

```bash
bash scripts/validate-scorm.sh
```

Corre un checklist automático: manifest válido, entry point declarado, rutas relativas, cero referencias a CDN/servicios externos, estructura del zip.

### Pipeline completo (recomendado antes de cada entrega)

```bash
bash scripts/scorm-pack.sh && bash scripts/validate-scorm.sh
```

---

## 📦 Artefacto SCORM final

```
ODC-HarnessEngineering-SCORM12-v<versión>.zip
├── imsmanifest.xml         # raíz del zip (obligatorio; futura iteración)
├── index.html              # entry point del SCO (construido)
├── assets/                 # js + css + fuentes + imágenes, self-contained
├── adlcp_rootv1p2.xsd      # schemas (recomendables)
├── imscp_rootv1p1p2.xsd
└── imsmd_rootv1p2p1.xsd
```

---

## 📦 Configuración del entorno Moodle (futuro)

El testeo real se hará con **Moodle local vía Docker**. Servicio pendiente de configurar en una iteración futura. Mientras tanto, se valida con el checklist de `scripts/validate-scorm.sh` + SCORM Cloud gratuito.

---

## 📄 Licencia

**Proyecto con licencia mixta:**

- **Código fuente:** [MIT](./LICENSE) © 2026 Universidad de Cundinamarca — CADI Aplicaciones de Machine Learning.
- **Contenido educativo, evaluaciones y assets:** [CC BY 4.0](./LICENSE-CONTENT.txt) © 2026 Universidad de Cundinamarca — CADI Aplicaciones de Machine Learning.
- **Recursos de terceros:** ver [`THIRD_PARTY.md`](./THIRD_PARTY.md).
