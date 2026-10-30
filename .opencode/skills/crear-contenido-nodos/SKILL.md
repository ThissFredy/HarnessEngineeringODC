---
name: Crear contenido de nodos
description: Diseña e implementa nodos educativos nuevos para ODC, desde el contenido y sus citas hasta la escena interactiva, evaluación, calificación e integración con el mapa.
---

# Crear contenido de nodos ODC

Usa esta skill cuando el usuario pida desarrollar un nodo nuevo o ampliar uno existente en este videojuego educativo. El trabajo incluye diseño pedagógico y, cuando corresponda, implementación completa en React.

## 1. Reconocer el proyecto antes de editar

1. Lee `AGENTS.md` y sigue sus convenciones visuales y funcionales. Si hay otros archivos de instrucciones aplicables, léelos también.
2. Revisa `git status` y los cambios existentes antes de editar. Trata archivos modificados o no versionados como trabajo del usuario: no los descartes ni los sustituyas sin inspeccionarlos.
3. Examina el nodo más cercano en número y los patrones actuales. Como referencias iniciales:
   - `src/scenes/Nodo.jsx`: diálogos con escritura progresiva, audio y minievaluación.
   - `src/scenes/Nodo2.jsx` y `src/data/nodo2.js`: casos, conceptos, ventanas emergentes y clasificación.
   - `src/scenes/Nodo3.jsx` y `src/data/nodo3.js`: bloques de lectura, glosario consultable, evaluación y gestión del foco.
   - `src/data/mudekAnimations.js`: fotogramas y ciclos de MUDEK.
   - `src/components/Stage.jsx`, `src/data/scenes.js`, `src/App.jsx` y `src/scenes/Mapa.jsx`: escenario, registro de escenas, notas y desbloqueos.
4. Usa esos nodos como patrones, no como plantillas rígidas. Respeta el estilo existente y el objetivo de aprendizaje del nodo nuevo.
5. Comprueba que los audios, imágenes y sprites referenciados existan antes de importarlos. No inventes rutas ni recursos.

## 2. Aclarar solo lo que falte

Antes de redactar o implementar, reúne estos datos del brief. No vuelvas a preguntar algo que el usuario ya haya especificado; usa preguntas breves para completar vacíos o resolver contradicciones.

- **Objetivo de aprendizaje**: pregúntalo si falta. Infiere el público y sus conocimientos previos a partir del curso y de los nodos existentes; pregunta por ellos solo si el contexto no alcanza o hay una contradicción.
- **Conceptos y alcance**: términos clave, nivel de detalle y extensión deseada.
- **Evidencias**: fuentes verificadas, citas autor-año, cifras y afirmaciones que deban conservarse.
- **Casos y evaluación**: ejemplos, fase o respuesta correcta, tipo de reto y retroalimentación.
- **Recursos**: audio y ruta, imágenes, sprites u otros materiales, si aplican.
- **Cierre**: condición de aprobación, calificación y nodo o módulo que debe desbloquearse.

Pregunta solo por los elementos ausentes que sean necesarios para diseñar el nodo con seguridad. Si el usuario no proporciona referencias para una afirmación empírica, no inventes la cita: pide la fuente o deja esa afirmación fuera hasta confirmarla.

## 3. Diseñar el contenido antes de maquetarlo

- Redacta en español claro, natural y adecuado al público inferido. **Parafrasea** para mejorar fluidez y comprensión; no copies literalmente las notas si una adaptación comunica mejor la idea.
- Las fuentes respaldan los datos, no dictan la redacción. Conserva con precisión cifras, fechas, resultados, comparaciones y alcance. No inventes hechos, estudios, autores ni relaciones causales.
- Coloca cada cita junto a la afirmación que sustenta, con el formato autor-año usado por el proyecto. No presentes una interpretación propia como resultado del estudio.
- Elige la estructura según el objetivo: relato, comparación, línea de tiempo, diagrama, tarjetas, conceptos emergentes u otro formato pertinente. No fuerces todos los nodos a repetir exactamente los dos bloques o el reto de Nodo 2.
- Divide el contenido en unidades breves, con títulos informativos y jerarquía visual. Evita párrafos densos y texto amontonado.
- Asigna una función distinta a cada elemento: el bloque explica la idea, el caso aporta evidencia, el glosario define el término y la retroalimentación ayuda a corregir o comprender la respuesta. **No repitas el mismo párrafo o dato completo** en el bloque, la ventana del caso, el glosario y el reto. Reitera una cifra en la evaluación solo si es necesaria para explicar el acierto.
- Mantén visibles las citas incluso cuando el texto se presente en ventanas emergentes o retroalimentación.
- Si hay conceptos emergentes, usa definiciones concisas. Si hay casos, haz explícita su relación con la etapa o decisión que el estudiante debe aprender a reconocer.

## 4. Diseñar una evaluación que enseñe

- Escoge el tipo de interacción que mida el objetivo: clasificación, asociación, verdadero/falso, ordenamiento, selección u otra. No uses arrastrar como única opción cuando una alternativa de clic/teclado sea viable.
- Define por adelantado la respuesta correcta y la retroalimentación de cada elemento. La respuesta correcta debe explicar brevemente por qué; la incorrecta debe orientar el siguiente intento sin resultar punitiva.
- Haz que la condición para aprobar y desbloquear corresponda al brief. No otorgues la nota máxima ni desbloquees el nodo siguiente ante una respuesta parcial cuando se exige completar todo.
- Guarda la nota usando el mecanismo existente y conecta el desbloqueo con el mapa y la navegación. Revisa tanto el estado visual de bloqueo como la validación real de entrada al nodo.
- Representa claramente progreso, selección, acierto, error, deshabilitado y finalización. No dependas solo del color para comunicar un estado.

## 5. Implementar con las convenciones del juego

- Conserva el escenario de **1024 × 599 px** y diseña en coordenadas de `Stage`; comprueba la alineación al cambiar la escala.
- Mantén la estética retro 16-bit, la paleta del proyecto (`#101725`, `#17263a`, `#f0ca63`, `#35d8ff`, `#080d16`) y `font-pixel` / Press Start 2P. No sustituyas la tipografía.
- Conserva proporciones y nitidez de sprites pixel art. No fuerces `pixelated` en fondos que deban usar `imageRendering: "auto"`.
- Mantén MUDEK sin cubrir ni desplazar en Nodo 1. En otros nodos, respeta la composición y ubicación establecidas por el nodo existente.
- Los controles dentro del escenario deben estar dentro de un elemento con `data-stage-interactive`.
- Añade clic y tacto a toda acción visible; conserva una alternativa usable con teclado. Explica los controles en pantalla y actualiza las instrucciones cuando cambien.
- Implementa estados distinguibles de reposo, hover, pulsado, deshabilitado y foco visible. Usa objetivos táctiles adecuados al diseño del escenario.
- Usa HTML semántico y añade nombres/relaciones accesibles (`aria-label`, `aria-labelledby`, `aria-describedby`, listas, grupos, progreso o `aria-live`) donde corresponda. Asegura que se pueda completar el reto con teclado.
- Para ventanas emergentes: panel completo opaco, fondo oscuro, borde/sombra de la paleta, `role="dialog"`, `aria-modal`, título y descripción asociados, foco al abrir, retorno del foco al cerrar y cierre con Escape. No dejes el texto sobre un panel transparente.
- Respeta `prefers-reduced-motion` en animaciones y ciclos de sprites.
- Si el nodo tiene diálogo narrado, sigue `AGENTS.md`: escritura progresiva; MUDEK habla solo mientras se escribe; primer Espacio/clic completa el mensaje; el segundo avanza. Si se completa de golpe, pausa y reinicia el audio asociado y no lo reanudes mientras el globo siga visible. Detén audio al avanzar o salir.
- Separa datos pedagógicos de la escena cuando el proyecto ya use módulos de datos (`src/data/nodoN.js`). Conserva los nombres y patrones de los nodos vecinos.

## 6. Integrar y verificar

Al implementar un nodo completo, actualiza solo las piezas necesarias y de acuerdo con la estructura actual del proyecto:

1. Datos/copy, citas, términos, casos y respuestas.
2. Componente de escena y sus interacciones.
3. Registro de escena y fondo en `src/data/scenes.js`.
4. Cableado en `src/App.jsx`, callbacks de nota y salida.
5. Desbloqueo real y mensaje visual en el mapa, si aplica.
6. Imports de audio/arte existentes y estados de reproducción.

Antes de terminar:

- Ejecuta `npm run build` y resuelve los errores introducidos por el cambio.
- Ejecuta `git diff --check`.
- Revisa que no haya texto repetido innecesariamente, citas perdidas, recursos inexistentes, controles sin alternativa accesible ni una ruta que permita saltarse el requisito de desbloqueo.
- No añadas dependencias si el proyecto existente permite resolverlo.
- En la respuesta final, resume el contenido e interacción implementados, indica cómo se obtiene la nota/desbloqueo y qué validación ejecutaste. Señala cualquier cita o recurso que haya quedado pendiente de confirmar.
