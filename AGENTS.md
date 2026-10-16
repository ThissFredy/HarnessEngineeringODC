# Convenciones de juego retro

## Estética y escenario

- Conserva la estética de videojuego **retro 16-bit / pixel art**. Prefiere formas geométricas marcadas, bordes tipo píxel y sombras duras desplazadas; evita que los paneles importantes parezcan capas planas o transparentes.
- El escenario de juego es de **1024 × 599 px** y se escala desde `Stage`. Diseña y posiciona los elementos en coordenadas del escenario, sin depender del tamaño de la ventana; comprueba que sigan alineados al cambiar la escala.
- Mantén la paleta del proyecto: azul noche `#101725`, azul panel `#17263a`, dorado `#f0ca63`, cian `#35d8ff` y sombra `#080d16`. Usa contraste suficiente entre escena, interfaz y texto.
- Conserva **Press Start 2P** (`font-pixel`) en diálogos, títulos e interfaz. Ajusta el tamaño y el interlineado a la escala del escenario para que el texto siga siendo legible; no cambies la tipografía sin que se solicite.
- Para sprites y recursos pixel art, conserva la nitidez con `image-rendering: pixelated` y la proporción del arte. No fuerces ese tratamiento en fondos que deban renderizarse con `imageRendering: "auto"`.
- MUDEK permanece abajo a la izquierda en Nodo 1. No tapes ni muevas al personaje al añadir interfaz.

## Controles y feedback

- Conserva la convención actual: **flechas** para moverse y **Espacio** para interactuar o continuar. Añade clic y controles táctiles cuando haya acciones visibles; actualiza las instrucciones en pantalla si cambia una interacción.
- Haz evidentes los estados de los controles (reposo, hover, pulsado, deshabilitado y foco de teclado) con cambios visuales coherentes con la paleta retro.
- Los controles dentro del escenario deben conservar `data-stage-interactive` para que sus gestos no se interpreten como paneo o zoom del escenario.
- Respeta `prefers-reduced-motion` en animaciones y ciclos de sprites.

## Pop-ups y diálogos

Al crear o modificar globos de diálogo, mensajes de éxito o paneles de evaluación, conserva el estilo establecido en Nodo 1:

- El **fondo opaco debe estar en el contenedor completo del pop-up**, no solo detrás del texto. Usa como base el azul oscuro `#101725`, borde dorado `#f0ca63`, acentos cian `#35d8ff` y sombras oscuras `#080d16`. Puedes separar encabezado, cuerpo y controles con tonos azulados, pero el panel completo debe distinguirse del fondo de la escena.
- Aplica el mismo tratamiento al panel entero de evaluación: fondo oscuro, borde y aro de color, sombra visible y filas de opciones diferenciadas. No dejes el pop-up de evaluación transparente o sin el estilo del diálogo.
- Mantén **Press Start 2P** (`font-pixel`) en el diálogo y la evaluación. Ajusta el tamaño y el interlineado —aproximadamente 7–9 px y `leading` amplio en el cuerpo— para que los textos largos quepan y sigan siendo legibles en el escenario.

## Escritura y animación de MUDEK

- Muestra el cuerpo del mensaje con efecto de escritura progresiva, no todo de una vez. Mientras se escribe, MUDEK usa la animación `MUDEK_ANIMATIONS.hablar` de `src/data/mudekAnimations.js` y sus fotogramas `hablar-01/02/03.svg` como capas sobre el sprite base.
- Al terminar de escribir, detén el ciclo de habla y devuelve a MUDEK a su estado idle.
- Durante la escritura, el primer **Espacio o clic** completa el mensaje actual; un segundo **Espacio o clic** avanza al siguiente globo o sección. Mantén este comportamiento también en mensajes finales que deban leerse antes de continuar.
- Si el globo tiene audio, al completar de golpe la escritura con el primer **Espacio o clic**, detén ese audio y no lo reanudes mientras el globo siga visible. Al avanzar o salir de la escena, detén también el audio asociado.
- Respeta `prefers-reduced-motion`: no cicles los fotogramas de habla cuando el usuario solicite movimiento reducido.

Usa `src/scenes/Nodo.jsx` como referencia visual y funcional para diálogos, escritura y evaluación; usa `src/data/mudekAnimations.js` como fuente de las animaciones del personaje.
