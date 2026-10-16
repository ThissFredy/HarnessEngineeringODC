export const NODE_1_DIALOGUE = [
  {
    type: "story",
    text: "Bienvenido al Laboratorio de los Orígenes. Si miras a tu alrededor, verás grandes servidores antiguos y pizarrones con ecuaciones. Aquí es donde comenzó todo. Antes de los LLM, la Inteligencia Artificial aplicada al software usaba aprendizaje automático clásico y redes bayesianas para tareas muy acotadas, como predecir defectos (Alzahrani, 2026). Todo se basaba en redes neuronales, que básicamente aprenden a identificar patrones ajustando sus parámetros internos a partir de datos de ejemplo.",
  },
  {
    type: "story",
    text: "Pero la tecnología evolucionó. Los Grandes Modelos de Lenguaje, o LLM, llevaron esa misma idea a una escala gigantesca. Basados en la arquitectura Transformer (Vaswani et al., 2017), estos modelos se entrenan con volúmenes masivos de texto y código con un objetivo: predecir el siguiente fragmento. Gracias a esto, hoy pueden explicar, redactar y completar código simplemente recibiendo instrucciones en lenguaje natural.",
  },
  {
    type: "story",
    text: "Además, cuando intentamos usar estos modelos en proyectos de software reales, nos estrellamos con problemas de contexto largo (Goldman et al., 2024). Por eso, lo que realmente ha transformado la ingeniería de software no es solo el modelo, sino el entorno arquitectónico que se construye a su alrededor. Ese entorno es el tema de este recurso, y en los siguientes módulos lo descompondremos pieza por pieza.\n\nPero antes de avanzar, ¡vamos a pasar a una pequeña prueba!",
  },
  {
    type: "concept",
    conceptNumber: 1,
    title: "Transformer",
    text: "Arquitectura de red neuronal basada en mecanismos de atención, base de los LLM actuales (Vaswani et al., 2017).",
  },
  {
    type: "concept",
    conceptNumber: 2,
    title: "Temperatura",
    text: "Parámetro de inferencia que controla cuán variable es la salida; junto con el modelo y el lenguaje, forma parte de las configuraciones que se pueden optimizar (K. Zhang et al., 2025).",
  },
  {
    type: "concept",
    conceptNumber: 3,
    title: "SLM (Modelo de lenguaje pequeño)",
    text: "Categoría de la taxonomía de Alzahrani (2026), junto a los LLM y los sistemas multiagente.",
  },
  {
    type: "concept",
    conceptNumber: 4,
    title: "Red bayesiana",
    text: "Modelo probabilístico clásico usado en predicción de defectos antes de los LLM (Alzahrani, 2026).",
  },
];

export const NODE_1_QUIZ_OPTIONS = [
  { id: "classical-ml", label: "ML clásico y redes bayesianas" },
  { id: "deep-neural", label: "Redes neuronales profundas" },
  { id: "transformer-llm", label: "LLM basado en Transformer" },
  { id: "multi-agent", label: "Sistemas multiagentes basados en LLM" },
];

export const NODE_1_CORRECT_ORDER = [
  "classical-ml",
  "deep-neural",
  "transformer-llm",
  "multi-agent",
];

export const NODE_1_INITIAL_ORDER = [
  "deep-neural",
  "transformer-llm",
  "classical-ml",
  "multi-agent",
];
