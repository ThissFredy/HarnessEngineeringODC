# THIRD_PARTY.md

Recursos y herramientas de terceros utilizados por el proyecto. **Todo es open source.**

## Fuentes tipográficas (se empaquetan dentro del SCO)

| Recurso | Licencia | Archivo de licencia | Uso |
|---|---|---|---|
| [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Cody Boisclair) | SIL OFL 1.1 | `src/assets/fonts/OFL-PressStart2P.txt` (viaja dentro de `dist/`) | Tipografía de interfaz |
| Ilustración retro pixel art de biblioteca y campus (arte original del proyecto) | CC BY 4.0 | `LICENSE-CONTENT.txt` | Fuente SVG `src/assets/backgrounds/inicio.svg`; versión raster pixelada `src/assets/backgrounds/inicio-pixel.png` usada en portada |
| Mapa Overworld retro pixel art (arte original del proyecto) | CC BY 4.0 | `LICENSE-CONTENT.txt` | Fuente SVG `src/assets/backgrounds/mapa.svg`; versión raster de 768×450 y 80 colores `src/assets/backgrounds/mapa-pixel.png` usada en mapa |

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
