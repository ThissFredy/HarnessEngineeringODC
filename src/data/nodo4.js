export const NODE_4_INITIAL_DIALOGUE =
  "Estás en el Centro de Control de Agentes. Aquí aprenderás cómo se organiza el trabajo de varios agentes y cuánta autonomía darles. Lee los dos bloques y abre los íconos «+» para aclarar términos como ReAct o orquestación determinista. Luego te presentaré tres escenarios: tu reto es elegir el tipo de flujo más adecuado para cada uno. Piensa en la tarea, en el riesgo y en el costo: cada flujo tiene ventajas y límites. ¡Tú decides!";

export const NODE_4_TERMS = [
  {
    id: "react",
    label: "REACT",
    title: "ReAct",
    body: "El agente alterna razonamiento y acciones; observa el resultado antes de decidir el siguiente paso.",
    citation: "Loose et al., 2026",
  },
  {
    id: "deterministic-orchestration",
    label: "ORQUESTACIÓN DETERMINISTA",
    title: "Orquestación determinista",
    body: "El sistema fija el orden de las etapas y cuándo validar o reintentar.",
    citation: "Lwin & Kumar, 2026",
  },
  {
    id: "agentic-workflow",
    label: "AGENTIC WORKFLOW",
    title: "Agentic workflow",
    body: "Plan que reparte tareas entre agentes y define el orden y la revisión de resultados.",
  },
  {
    id: "whatscode",
    label: "WHATS CODE",
    title: "WhatsCode",
    body: "Plataforma para programar desde WhatsApp: evolucionó de RAG a flujos deterministas «agentless».",
    citation: "Mao et al., 2026",
  },
];

export const NODE_4_READING_BLOCKS = [
  {
    id: "agent-cycles",
    marker: "A",
    eyebrow: "SISTEMAS AGÉNTICOS",
    title: "DEL MODELO AL EQUIPO DE AGENTES",
    text: "Un agente combina un modelo con herramientas y decisiones iterativas: observa el estado, actúa y usa el resultado para elegir el siguiente paso. En sistemas multiagente, especialistas pueden dividir la tarea y revisar resultados (Loose et al., 2026).",
    flowLabels: ["OBSERVAR", "DECIDIR", "ACTUAR", "OBSERVAR"],
    evidenceEyebrow: "EJEMPLO · FUZZING DE BIBLIOTECAS JAVA",
    evidenceText:
      "Cinco agentes ReAct investigaron, generaron y repararon el arnés; después midieron y mejoraron su cobertura (Loose et al., 2026).",
  },
  {
    id: "autonomy",
    marker: "B",
    eyebrow: "DISEÑO DEL FLUJO",
    title: "¿QUIÉN DEFINE EL SIGUIENTE PASO?",
    text: "La secuencia puede fijarla el sistema, decidirla el modelo o combinar autonomía con supervisión humana según el riesgo. No hay que dar la misma autonomía a todas las tareas:",
    evidence: [
      {
        eyebrow: "A · DETERMINISTA · COBOL → PYTHON™",
        text: "Con etapas de validación explícitas, redujo hasta 3,5× los tokens con precisión computacional comparable (Lwin & Kumar, 2026).",
        logo: "python",
      },
      {
        eyebrow: "B · FLUJO SECUENCIAL · CIBERSEGURIDAD",
        text: "Alcanzó el 87 % de la calidad del agéntico con unas 40× menos tokens (Bulut et al., 2026).",
      },
      {
        eyebrow: "C · SUPERVISIÓN CALIBRADA",
        text: "En 5.000 tareas sintéticas de automatización empresarial, un marco logró 98,2 % de éxito con intervención humana en el 14,5 % de los pasos (Kumar & Singh, 2026).",
      },
    ],
  },
];

export const NODE_4_FLOW_OPTIONS = [
  {
    id: "A",
    label: "FLUJO FIJO",
    detail: "El sistema define etapas",
  },
  {
    id: "B",
    label: "AGENTE DINÁMICO",
    detail: "El modelo decide",
  },
  {
    id: "C",
    label: "AGENTE + HUMANO",
    detail: "Intervención por riesgo",
  },
];

export const NODE_4_QUIZ = [
  {
    id: "cobol-migration",
    prompt:
      "Migrar cientos de programas COBOL a Python con etapas de validación explícitas.",
    correctAnswer: "A",
    correctFeedback:
      "En la modernización COBOL evaluada, la orquestación determinista usó hasta 3,5× menos tokens con precisión comparable y mayor robustez en el peor caso (Lwin & Kumar, 2026).",
    incorrectFeedback:
      "Pista: si las etapas y sus validaciones están previstas, piensa quién debería conservar el orden del proceso.",
  },
  {
    id: "fuzzing-harness",
    prompt:
      "Generar un arnés de fuzzing para una biblioteca desconocida: investigar el código, medir cobertura y refinar.",
    correctAnswer: "B",
    correctFeedback:
      "Cinco agentes ReAct consultaron información bajo demanda y lograron una mejora mediana del 26 % en cobertura dirigida frente a OSS-Fuzz, por unos 3,20 USD y 10 minutos por arnés (Loose et al., 2026).",
    incorrectFeedback:
      "Pista: hay que descubrir cómo funciona el código y adaptar los pasos según la cobertura obtenida.",
  },
  {
    id: "enterprise-automation",
    prompt:
      "Automatización empresarial con decisiones inciertas: se busca precisión cercana a la revisión humana total sin revisar cada paso.",
    correctAnswer: "C",
    correctFeedback:
      "En 5.000 tareas empresariales sintéticas, el marco obtuvo 98,2 % de éxito frente a 99,1 % con revisión humana estática, interviniendo en solo el 14,5 % de los pasos de decisión (Kumar & Singh, 2026).",
    incorrectFeedback:
      "Pista: no se busca eliminar la supervisión, sino reservarla para los pasos donde la incertidumbre o el riesgo la justifican.",
  },
];
