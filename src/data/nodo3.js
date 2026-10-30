export const NODE_3_INITIAL_DIALOGUE =
  "¡Bienvenido al Gran Archivo de la Mente! Este desorden representa lo que le ocurre a un modelo cuando su contexto se llena. Lee los dos bloques para entender el problema y cómo ha evolucionado la respuesta de la industria, y abre los íconos «+» para repasar los términos. Después deberás responder tres afirmaciones de verdadero o falso. Tómate tu tiempo: ordenar este caos es el primer paso para dominarlo. ¡Vamos!";

export const NODE_3_TERMS = [
  {
    id: "context-window",
    label: "VENTANA DE CONTEXTO",
    title: "Ventana de contexto",
    body: "Cantidad máxima de texto (tokens) que el modelo puede considerar a la vez.",
  },
  {
    id: "agentic-trajectory",
    label: "TRAYECTORIA AGÉNTICA",
    title: "Trayectoria agéntica",
    body: "Secuencia de acciones de un agente. Graphectory detecta oscilación y estancamiento; su intervención en línea mejoró entre 6,9 % y 23,5 % las tasas de resolución (Liu et al., 2026).",
  },
  {
    id: "token",
    label: "TOKEN",
    title: "Token",
    body: "Unidad mínima de texto que procesa un modelo; su consumo refleja el costo y la carga de contexto.",
  },
  {
    id: "engineering-evolution",
    label: "EVOLUCIÓN",
    title: "Evolución de la ingeniería",
    body: "Prompt Engineering (2023) → Context Engineering (2025) → Harness Engineering (He et al., 2026).",
  },
];

export const NODE_3_QUIZ = [
  {
    id: "newer-model",
    statement:
      "Un modelo más reciente garantiza mejor desempeño en cualquier flujo agéntico.",
    correctAnswer: "false",
    correctLabel: "FALSO",
    feedback:
      "GPT-5.2 resolvió el 53,3 % del primer caso de uso y Gemini-3-Pro el 100 % (Khaldi et al., 2026).",
  },
  {
    id: "lossless-summary",
    statement:
      "Resumir el contexto para liberar espacio no tiene costo en la calidad.",
    correctAnswer: "false",
    correctLabel: "FALSO",
    feedback:
      "Comprimir mediante resumen implica pérdida de detalle (Khaldi et al., 2026).",
  },
  {
    id: "engineering-stages",
    statement:
      "Prompt, Context y Harness Engineering son etapas de una misma evolución, cada una con mayor alcance.",
    correctAnswer: "true",
    correctLabel: "VERDADERO",
    feedback:
      "Del prompt (instrucciones) al contexto (qué información entra) y de ahí al arnés (todo el entorno de ejecución y control).",
  },
];
