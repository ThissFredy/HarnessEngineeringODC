# docs/nodos — Material maestro de contenido

Fuente de verdad en Markdown del contenido teórico y evaluativo de cada nodo del ODC.

| # | Slug | Archivo | Estado |
|---|---|---|---|
| 1 | `redes-neuronales-a-llms` | `01-redes-neuronales-a-llms.md` | 🟡 placeholder |
| 2 | `nuevo-sdlc` | `02-nuevo-sdlc.md` | 🟡 placeholder |
| 3 | `limitaciones-y-evolucion` | `03-limitaciones-y-evolucion.md` | 🟡 placeholder |
| 4 | `agentes-de-ia` | `04-agentes-de-ia.md` | 🟡 placeholder |
| 5 | `skills-y-mcp` | `05-skills-y-mcp.md` | 🟡 placeholder |
| 6 | `sandbox-y-guardrails` | `06-sandbox-y-guardrails.md` | 🟡 placeholder |
| 7 | `harness-engineering` | `07-harness-engineering.md` | 🟡 placeholder |

## Flujo de trabajo

1. El agente `academico` escribe el material siguiendo `00-plantilla.md`.
2. Se copia el resultado estructurado a `src/game/data/nodos.js` (JSON compatible).
3. El agente `ui-retro` ajusta el render visual del nodo si hay componentes nuevos (diagramas, timeline, etc.).
4. El agente `scorm-qa` verifica que el promedio final siga calculándose correctamente.

## Estados

- 🔴 **Vacío:** el archivo no existe.
- 🟡 **Placeholder:** estructura creada, contenido en `TODO`.
- 🟢 **Listo:** contenido revisado y publicado en `src/game/data/nodos.js`.
- 🔵 **Revisión:** esperando validación académica.
