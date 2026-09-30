# Plantilla de contenido de nodo — ODC Harness Engineering

> Esta plantilla define la estructura maestra en Markdown. El agente `academico` la usa para generar el contenido de cada nodo, que luego se consume desde `src/game/data/nodos.js`.

## Estructura requerida por nodo

```markdown
# Nodo N — Título del Nodo

## Hook
1-2 frases que enganchen al estudiante.

## Bloques conceptuales

### 1. Título del bloque (60-120 palabras)
Cuerpo...

### 2. Título del bloque (60-120 palabras)
Cuerpo...

### 3. Título del bloque (60-120 palabras)
Cuerpo...

## Analogía
Analogía concreta con ingeniería de software o ML.

## Dato clave
Una sola idea memorable.

## Glosario
| Término | Definición |
|---|---|
| ... | ... |

## Cierre
Transición natural al minijuego.

## Minijuego (quiz / drag-drop / ordenar / emparejar / verdadero-falso)

### Pregunta 1 (dificultad: fácil)
- Enunciado
- Opciones (A, B, C, D) con la correcta marcada
- Feedback correcto
- Feedback incorrecto

### Pregunta 2 (dificultad: media)
...

### Pregunta 3 (dificultad: difícil)
...
```

## Convenciones

- **Idioma:** español académico de Colombia.
- **Longitud de teoría:** 3-4 minutos de lectura.
- **Longitud de minijuego:** 2-3 minutos.
- **Puntaje por nodo:** 0-100 (% de respuestas correctas ponderado por dificultad).
- **Peso en el promedio final:** todos los nodos pesan igual (1/7).

## Población y REA

- **Población:** estudiantes de Ingeniería de Sistemas y Computación + especialización en Analítica y Ciencia de Datos.
- **REA:** comprender la arquitectura de *Harness Engineering* para la implementación segura y escalable de agentes LLM en el SDLC.
- **CADI:** Aplicaciones de Machine Learning.
- **Metodología:** exploración gamificada sobre mapa con 7 nodos.
- **Evaluación:** sumativa (promedio final reportado a Moodle).
