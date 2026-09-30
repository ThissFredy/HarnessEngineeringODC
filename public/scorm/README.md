# Carpeta `public/scorm/`

Aquí vive el **manifiesto SCORM 1.2** y los schemas XSD que se empaquetan junto al bundle de Vite.

## Contenido actual

| Archivo | Propósito | Requerido |
|---|---|---|
| `imsmanifest.xml` | Manifiesto SCORM 1.2 (raíz del zip). Declara el SCO, entry point y metadatos. | ✅ Sí |
| `imscp_rootv1p1p2.xsd` | Schema IMS Content Packaging. | Opcional |
| `adlcp_rootv1p2.xsd` | Schema ADL Content Package (1.2). | Opcional |
| `adlcp_v1p3.xsd` | Extensión ADL 1.3. | Opcional |
| `imsss_rootv1p0.xsd` | Sequencing & Navigation (referenciado por SCORM 1.2). | Opcional |
| `ims_xml.xsd` | Common XML schema (imports). | Opcional |

## Sobre los XSD

Moodle **no valida los XSD en runtime**: solo lee `imsmanifest.xml` y ejecuta el SCO. Los XSD son necesarios únicamente si usas un validador externo (Reload Editor, SCORM Cloud «Validate», ADL Test Suite).

Si necesitas los XSD oficiales de ADL, descárgalos desde el sitio de ADL Net y colócalos en esta carpeta. El script `scorm-pack.mjs` los incluirá automáticamente en el `.zip` si existen.

## Recordatorio de estructura del zip final

```
ODC-HarnessEngineering-SCORM12-v<X>.zip
├── imsmanifest.xml    ← en la RAÍZ del zip, no en subcarpeta
├── index.html         ← entry point referenciado en href
├── assets/            ← bundle de Vite
└── *.xsd              ← este directorio
```

⚠️ **Nunca** pongas `imsmanifest.xml` dentro de una carpeta dentro del zip: Moodle no lo detecta.
