# 🚀 Proyecto ODC: Harness Engineering — El Nuevo Paradigma

> Objeto Digital de Conocimiento (ODC) gamificado, requisito de grado — **Universidad de Cundinamarca**, CADI *Aplicaciones de Machine Learning*.

## 📌 Descripción General

Este repositorio contiene el desarrollo de un **Objeto Digital de Conocimiento gamificado** que traduce los hallazgos de una revisión sistemática de literatura (metodología **PRISMA**) en una experiencia interactiva web, empaquetada bajo el estándar **SCORM 1.2** para su despliegue en **Moodle**.

Visual y mecánicamente, el ODC funciona como un **videojuego 2D clásico estilo *Super Mario Bros 3***: el estudiante navega un mapa *Overworld* para desbloquear niveles secuenciales que combinan **teoría** y **evaluación interactiva**.

**Todo el ODC está construido con HTML, CSS y JavaScript puro (vanilla): sin frameworks, sin bundler y sin dependencias.** La razón de fondo: **SCORM 1.2 no exige nada más**, y sin capa de build el código fuente *es* el SCO — lo que se desarrolla es exactamente lo que el LMS sirve.

### 🎯 Resultado Esperado de Aprendizaje (REA)

> Comprender la arquitectura de *Harness Engineering* para la implementación segura y escalable de agentes LLM en el ciclo vital de desarrollo de software (SDLC).

| | |
|---|---|
| **Población objetivo** | Estudiantes de Ingeniería de Sistemas y Computación · Especialización en Analítica y Ciencia de Datos |
| **CADI** | Aplicaciones de Machine Learning |
| **Metodología** | Exploración gamificada sobre mapa con 7 nodos temáticos |
| **Evaluación** | Sumativa. Cada nodo cierra con un minijuego; el SCO reporta el promedio final (0–100) a Moodle vía `cmi.core.score.raw` |

---

## 🤔 ¿Por qué HTML/CSS/JS puro (y no un framework)?

**Porque es el formato nativo de SCORM 1.2, y elimina toda fricción de empaquetado.**

SCORM 1.2 no impone motor ni framework: solo exige que el contenido sea **HTML + JS + CSS** dentro de un `.zip`, con un `imsmanifest.xml` en la raíz y comunicación con el objeto `window.API` que expone el LMS (`LMSInitialize`, `LMSSetValue`, `LMSCommit`, `LMSFinish`).

| Ventaja | Detalle |
|---|---|
| **Sin build** | No hay Vite/webpack/npm: el código fuente es el SCO. Dev = prod = LMS. |
| **Sin dependencias** | Cero `node_modules`, cero licencias de terceros que auditar (solo fuentes tipográficas). |
| **Sin fricción de rutas** | Sin bundler no hay `base` que configurar ni assets con hash: todas las referencias son relativas y auditables a simple vista. |
| **Empaquetado trivial** | El `.zip` SCORM se arma con `zip` (CLI estándar) desde un script de shell. |
| **Longevidad** | El SCO funcionará dentro del LMS hoy y en 10 años, al margen del ciclo de vida de cualquier framework. |

**Reglas duras de compatibilidad SCORM (aplican a todo el código):**

- ✅ Todas las rutas **relativas** (`./`, `../`). ❌ Jamás absolutas (`/assets/...`).
- ✅ JavaScript clásico cargado con `<script defer src="...">` (sin módulos ES) — máxima compatibilidad, incluso abriendo `index.html` por `file://`.
- ✅ Todo *self-contained*: fuentes, sprites y audios viven dentro del zip.
- ❌ Ningún CDN, ningún servicio externo en producción (analytics, hotjar, etc.).

---

## 📦 Modelo de datos SCORM 1.2

Cómo el ODC se comunica con el LMS (encapsulado en `js/scorm.js`, wrapper propio MIT):

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
| Wrapper SCORM 1.2 (`js/scorm.js`) | MIT (propio) | ✅ |
| `zip` / `unzip` (empaquetado, herramienta de sistema) | Info-ZIP | ✅ |

**Reglas duras:**
- ❌ Ninguna librería comercial o cerrada.
- ❌ Ninguna fuente servida por CDN externo: los `.woff2` se sirven **offline** desde el zip SCORM.
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
| Estructura | **HTML5** | `index.html` = entry point del SCO |
| Presentación | **CSS3** (custom properties, grid/flex, media queries) | Estética 16-bit, responsive 360→1280 px |
| Lógica | **JavaScript vanilla (ES6+)** | Sin frameworks, sin bundler, sin módulos ES |
| Render del juego | DOM + CSS para paneles/quiz; `<canvas>` con JS vanilla para el mapa Overworld y sprites | Pixel art con `image-rendering: pixelated` |
| API SCORM 1.2 | `js/scorm.js` (custom MIT) | Wrapper ligero, sin dependencias, fallback `localStorage` |
| Empaquetado SCORM | `zip` (CLI) + `scripts/scorm-pack.sh` | Genera `.zip` con `imsmanifest.xml` en la raíz |
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
├── index.html               # entry point del SCO
├── imsmanifest.xml          # manifest SCORM 1.2 (referencias relativas)
├── css/
│   └── main.css             # variables, tipografía, componentes retro
├── js/
│   ├── main.js              # bootstrap
│   ├── scorm.js             # wrapper SCORM 1.2 (MIT propio)
│   ├── data/
│   │   └── nodos.js         # contenido de los 7 nodos
│   └── ui/                  # overworld, paneles de teoría, minijuegos
├── assets/
│   ├── fonts/               # .woff2 locales (SIL OFL / Apache 2.0)
│   ├── sprites/
│   └── audio/
├── scorm/                   # schemas XSD (se copian a la raíz del zip)
├── docs/nodos/              # material maestro de contenido (NO se empaqueta)
├── scripts/
│   ├── scorm-pack.sh        # arma el .zip SCORM 1.2
│   └── validate-scorm.sh    # checklist automático
├── .gitignore
├── README.md
├── LICENSE                  # MIT (código)
└── LICENSE-CONTENT.txt      # CC BY 4.0 (contenido educativo)
```

> `docs/`, `scripts/`, `README.md` y las licencias **no** van dentro del zip: son archivos de trabajo del repositorio. El SCO es solo `index.html` + `imsmanifest.xml` + `css/` + `js/` + `assets/` + `scorm/`.

---

## 🚀 Inicio rápido

### Requisitos
- Navegador moderno (Firefox / Chrome / Edge)
- Git
- `zip` (empaquetado; en Windows: 7-Zip o `Compress-Archive` de PowerShell)
- Opcional: Python 3 (servidor local) y `xmllint` (validar manifest)

### Instalación

```bash
git clone https://github.com/ThissFredy/HarnessEngineeringODC.git
cd HarnessEngineeringODC
```

No hay nada que instalar: **no existen dependencias**.

### Desarrollo

Opción directa: abrir `index.html` en el navegador. Sin LMS, el wrapper SCORM entra en **modo fallback** (`localStorage` + traza en consola).

Opción con servidor local (recomendada, simula mejor el iframe de Moodle):

```bash
python3 -m http.server 8000
```

Abre http://localhost:8000.

### Empaquetar SCORM 1.2

```bash
bash scripts/scorm-pack.sh
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
├── imsmanifest.xml         # raíz del zip (obligatorio)
├── index.html              # entry point del SCO
├── css/  js/  assets/      # todo el juego, self-contained
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
