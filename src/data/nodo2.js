export const NODE_2_INITIAL_DIALOGUE =
  "Bienvenido a la Oficina del Desarrollador. Aquí verás cómo la IA ya participa en todo el ciclo de vida del software y qué pasa con el rol humano. Lee los dos bloques y abre los íconos «+» para conocer casos reales. Luego, en el reto, deberás ubicar cada caso en la fase del ciclo donde actúa. Recuerda: lo importante no es memorizar datos, sino entender dónde interviene la IA y dónde sigues tú. ¡Manos a la obra!";

export const NODE_2_READING_BLOCKS = [
  {
    id: "lifecycle",
    marker: "A",
    eyebrow: "EL ROL HUMANO",
    title: "De escribir a orquestar",
    text: "La IA ya apoya el ciclo completo, de requisitos a operación. El trabajo humano pasa de escribir cada línea a orquestar y revisar estos sistemas (Verastegui et al., 2025).",
    glossaryIds: ["sdlc", "voice-requirements", "autocover"],
  },
  {
    id: "human-loop",
    marker: "B",
    eyebrow: "PERSONA + IA",
    title: "La IA acelera; tú decides",
    text: "No hay una sola forma de colaborar: algunas propuestas se aplican rápido; otras vuelven al ingeniero para revisión. Los equipos ajustan así el nivel de supervisión (Mao et al., 2026; Wang et al., 2026).",
    glossaryIds: ["commandeer-revise"],
  },
];

export const NODE_2_GLOSSARY = [
  {
    id: "autocover",
    term: "AUTOCOVER",
    definition:
      "Flujo multiagente para automatizar pruebas: Preparador, Generador, Ejecutor, Validador y Reparador. En modo IDE obtuvo 44 % de aceptación explícita (Rastenis et al., 2026).",
  },
  {
    id: "commandeer-revise",
    term: "Commandeer-revise",
    definition:
      "El ingeniero toma una propuesta de la IA, la modifica y la revisa. El patrón se observó en WhatsApp (Mao et al., 2026).",
  },
  {
    id: "sdlc",
    term: "SDLC",
    definition:
      "Ciclo de vida del software: requisitos, diseño, implementación, pruebas, despliegue y mantenimiento.",
  },
  {
    id: "voice-requirements",
    term: "Requisitos por voz",
    definition:
      "Un agente conversa con usuarios y convierte sus necesidades en requisitos candidatos (Weerakoon et al., 2026).",
  },
];

export const NODE_2_PHASES = [
  { id: "requirements", label: "Requisitos", shortLabel: "Requisitos" },
  { id: "design", label: "Diseño", shortLabel: "Diseño" },
  {
    id: "implementation",
    label: "Implementación",
    shortLabel: "Implementación",
  },
  { id: "testing", label: "Pruebas", shortLabel: "Pruebas" },
  {
    id: "operations",
    label: "Operación y mantenimiento",
    shortLabel: "Operación / mant.",
  },
];

export const NODE_2_CASES = [
  {
    id: "requirements",
    phaseId: "requirements",
    label: "Voz: captar necesidades y formular requisitos.",
    teaser: "Agente de voz",
    popupTitle: "Requisitos por voz",
    popupBody:
      "El estudio compara un agente conversacional con una herramienta de código abierto para elicitar necesidades de usuarios (Weerakoon et al., 2026).",
    feedback:
      "El agente encontró el 77,5 % de los requisitos relevantes, frente al 35 % del referente de código abierto (Weerakoon et al., 2026).",
  },
  {
    id: "design",
    phaseId: "design",
    label: "Microscopio: IA diseña el control; una persona lo valida.",
    teaser: "Control científico",
    popupTitle: "Diseño de un instrumento científico",
    popupBody:
      "La IA apoyó el diseño del sistema de control de un microscopio y una persona revisó el resultado (Wang et al., 2026).",
    feedback:
      "La IA apoyó el diseño y la implementación; dos modelos se validaron entre sí y una persona revisó el resultado (Wang et al., 2026).",
  },
  {
    id: "implementation",
    phaseId: "implementation",
    label: "WhatsApp: aplicar una propuesta de IA o revisarla.",
    teaser: "Cambios en WhatsApp",
    popupTitle: "Cambios a gran escala en WhatsApp",
    popupBody:
      "Los ingenieros integraron propuestas de IA en su flujo habitual de trabajo en WhatsApp (Mao et al., 2026).",
    feedback:
      "En 25 meses, el 60 % de las interacciones fue despliegue con un clic y el 40 % revisión con toma de control (Mao et al., 2026).",
  },
  {
    id: "testing",
    phaseId: "testing",
    label: "AUTOCOVER: generar, ejecutar, validar y reparar pruebas.",
    teaser: "Pruebas industriales",
    popupTitle: "AUTOCOVER en las pruebas de Uber",
    popupBody:
      "AUTOCOVER automatiza varias etapas del flujo de pruebas que se estudió a escala industrial (Rastenis et al., 2026).",
    feedback:
      "AUTOCOVER genera cerca del 11 % de las nuevas pruebas de Uber (Rastenis et al., 2026).",
  },
  {
    id: "operations",
    phaseId: "operations",
    label: "Edge–cloud: hallar la causa y reparar fallos.",
    teaser: "Operación edge–cloud",
    popupTitle: "Edge–cloud en operación",
    popupBody:
      "Edge–cloud combina dispositivos cercanos a la fuente de datos con recursos en la nube; el caso estudia su supervisión automatizada (Bonilla et al., 2026).",
    feedback:
      "Los agentes pasan del monitoreo al diagnóstico y la reparación autónoma en edge–cloud (Bonilla et al., 2026).",
  },
];

export const NODE_2_QUIZ_CASE_ORDER = [
  "testing",
  "implementation",
  "requirements",
  "operations",
  "design",
];
