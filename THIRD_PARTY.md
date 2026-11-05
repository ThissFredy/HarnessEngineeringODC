# THIRD_PARTY.md

Recursos y herramientas de terceros utilizados por el proyecto. **Todo es open source.**

## Recursos visuales y fuentes tipográficas (se empaquetan dentro del SCO)

| Recurso | Licencia | Archivo de licencia | Uso |
|---|---|---|---|
| [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Cody Boisclair) | SIL OFL 1.1 | `src/assets/fonts/OFL-PressStart2P.txt` (viaja dentro de `dist/`) | Tipografía de interfaz |
| [Pixel bug](https://freesvg.org/pixel-bug), de OpenClipart | CC0 1.0 / dominio público | No requiere atribución ni archivo de licencia | PNG reducido a 128×128 en `src/assets/illustrations/pixel-bug.png`; ilustración del ejemplo de fuzzing del Nodo 4 |
| [Logotipo de Python, solo isotipo](https://commons.wikimedia.org/wiki/File:Python-logo-notext.svg) (fuente indicada: python.org) | Dominio público por geometría simple (CC0); marca comercial de Python Software Foundation | [Política de marcas de PSF](https://www.python.org/psf/trademarks/) (uso nominativo, logo sin alterar y acompañado de ™) | `src/assets/illustrations/python-logo-notext.svg`; identifica el destino Python del ejemplo COBOL → Python |
| Ilustración retro pixel art de biblioteca y campus (arte original del proyecto) | CC BY 4.0 | `LICENSE-CONTENT.txt` | Fuente SVG `src/assets/backgrounds/inicio.svg`; versión raster pixelada `src/assets/backgrounds/inicio-pixel.png` usada en portada |
| Mapa Overworld retro pixel art (arte original del proyecto) | CC BY 4.0 | `LICENSE-CONTENT.txt` | Fuente SVG `src/assets/backgrounds/mapa.svg`; versión raster de 768×450 y 80 colores `src/assets/backgrounds/mapa-pixel.png` usada en mapa |
| Estación de Conexiones (arte original del proyecto) | CC BY 4.0 | `LICENSE-CONTENT.txt` | `src/assets/backgrounds/nodo-5.jpeg` |
| Narración inicial del Nodo 5 (audio generado con ElevenLabs; plan pago, no Beta; el servicio no se empaqueta en el SCO) | CC BY 4.0 | `LICENSE-CONTENT.txt` | `src/assets/audio/Nodo-5-1.mp3` |

## Referencias de ejemplos didácticos MCP (no se empaqueta código)

| Recurso | Licencia | Fuente | Uso |
|---|---|---|---|
| Filesystem MCP Server | MIT | [Repositorio oficial](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) | Ejemplo de servidor con acceso limitado a directorios configurados |
| Git MCP Server | MIT | [Repositorio oficial](https://github.com/modelcontextprotocol/servers/tree/main/src/git) | Ejemplo de herramientas para consultar y modificar un repositorio Git |

## Dependencias de desarrollo (NO se empaquetan en el SCO)

El SCO (`dist/`) no incluye `node_modules/`: solo el HTML/CSS/JS construido.

| Paquete | Versión | Licencia | Uso |
|---|---|---|---|
| `react` / `react-dom` | 19.3.0 | MIT | UI componentizada |
| `vite` | 8.3.3 | MIT | Dev server y build |
| `rolldown` (motor de Vite 8) | 1.2.12 | MIT | Bundler (Rust) |
| `@vitejs/plugin-react` | 6.1.2 | MIT | Integración React |
| `tailwindcss` / `@tailwindcss/vite` | 4.3.3 | MIT | Estilos (tokens en `@theme`) |
| `postcss` (dep de Tailwind) | 8.5.29 | MIT | Procesamiento CSS |
| `lightningcss` (dep de Tailwind) | 1.32.0 | MPL-2.0 (OSI) | Transpilado/minificado CSS |

## Herramientas de sistema (no se distribuyen)

| Herramienta | Licencia | Uso |
|---|---|---|
| Node.js | MIT | Runtime de build |
| pnpm | MIT | Gestor de paquetes |
| `zip` / `unzip` (Info-ZIP) | Info-ZIP | Empaquetado SCORM |
| Python 3 (servidor local opcional) | PSF | Preview de `dist/` |
