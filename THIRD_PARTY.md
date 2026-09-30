# THIRD_PARTY — Licencias de dependencias y recursos

Este archivo registra **todas** las dependencias, librerías, fuentes y recursos externos utilizados por el ODC «Harness Engineering», junto con sus licencias.

**Política del proyecto:** 100 % open source. No se admite ninguna librería, CDN, servicio o asset comercial/cerrado ni con copyright sin licencia libre.

---

## Dependencias de runtime (bundle)

| Paquete | Versión mínima | Licencia | Uso en el proyecto | Repo |
|---|---|---|---|---|
| **Phaser 3** | `^3.85.2` | **MIT** | Motor 2D (mapa Overworld, sprites, escenas, tweens) | <https://github.com/phaserjs/phaser> |

## Dependencias de desarrollo (no se empaquetan en SCORM)

| Paquete | Versión mínima | Licencia | Uso en el proyecto | Repo |
|---|---|---|---|---|
| **Vite** | `^6.3.5` | **MIT** | Bundler y dev server | <https://github.com/vitejs/vite> |
| **pnpm** | `12.0.2` (packageManager) | **MIT** | Package manager | <https://github.com/pnpm/pnpm> |
| **jszip** | `^3.10.1` | **MIT** (dual GPL-2.0-or-later) — usamos solo MIT | Generación del `.zip` SCORM en `scripts/scorm-pack.mjs` | <https://github.com/Stuk/jszip> |

> jszip está publicado bajo **MIT O GPL-2.0-or-later** (a elección). Este proyecto ejerce la opción **MIT**.

## Fuentes tipográficas (self-hosted, descargadas en `src/assets/fonts/`)

| Fuente | Licencia | Uso |
|---|---|---|
| **Press Start 2P** | SIL Open Font License 1.1 | Títulos, HUD, botones, interfaz |
| **VT323** | SIL Open Font License 1.1 | Efectos de terminal retro, subtítulos |
| **Inter** | SIL Open Font License 1.1 | Cuerpo de texto (teoría e instrucciones) |
| **Roboto** | Apache License 2.0 | Cuerpo de texto (alternativa a Inter) |

> Verificadas en [Google Fonts / repositorios oficiales](https://fonts.google.com). Licencias permiten redistribución embebida en la aplicación.

## Wrapper SCORM 1.2

| Componente | Licencia | Nota |
|---|---|---|
| `src/scorm/scorm.js` | **MIT** (propio) | Wrapper custom sin dependencias externas. No usa `pipwerks.SCORM` para evitar problemas de licencia; se re-implementa el subconjunto necesario. |

## Assets multimedia

| Tipo | Origen | Licencia | Verificado |
|---|---|---|---|
| Sprites pixel-art | Propios / generados con IA | **CC BY 4.0** (ver `LICENSE-CONTENT.txt`) | 🟡 pendiente |
| Iconos | Propios / generados con IA | **CC BY 4.0** | 🟡 pendiente |
| Audios narrados | Generados con TTS open source / voz propia | **CC BY 4.0** | 🟡 pendiente |
| Música | Bibliotecas CC0/CC-BY (ej. OpenGameArt, Free Music Archive con filtro CC) | **CC0 / CC BY** | 🟡 pendiente |

> Cada asset debe declararse en esta tabla a medida que se agregue. Ningún asset con copyright sin licencia libre.

## Schemas SCORM (opcionales)

| Archivo | Licencia | Origen |
|---|---|---|
| `imscp_rootv1p1p2.xsd` | IMS Global Learning Consortium (uso libre para implementaciones SCORM) | ADL / IMS |
| `adlcp_rootv1p2.xsd` | ADL Initiative (uso libre para implementaciones SCORM) | ADL Net |
| `adlcp_v1p3.xsd` | ADL Initiative | ADL Net |
| `imsss_rootv1p0.xsd` | IMS Global | IMS |
| `ims_xml.xsd` | IMS Global | IMS |

> Ver `public/scorm/README.md`. Estos schemas se usan solo para validación; no son estrictamente necesarios para ejecutar el SCO en Moodle.

## Licencia del proyecto (resumen)

| Componente | Licencia | Archivo |
|---|---|---|
| Código fuente (JS, HTML, CSS, scripts) | **MIT** | `LICENSE` |
| Contenido educativo, evaluaciones, assets, docs | **CC BY 4.0** | `LICENSE-CONTENT.txt` |
| Dependencias de terceros | Ver tabla arriba | `THIRD_PARTY.md` (este archivo) |

## Checklist de cumplimiento (usado por `scorm-qa`)

- [ ] Toda dependencia instalada aparece en esta tabla.
- [ ] Toda fuente tipográfica tiene licencia OFL / Apache 2.0 / equivalente permisiva.
- [ ] Todo asset nuevo se registra con su licencia (CC0 / CC-BY / CC BY 4.0 propio).
- [ ] Ningún asset viene de origen dudoso sin licencia expresa.
- [ ] Ninguna librería comercial/cerrada.
- [ ] Ningún CDN en producción.
- [ ] Ningún servicio externo (analytics, hotjar, etc.).
