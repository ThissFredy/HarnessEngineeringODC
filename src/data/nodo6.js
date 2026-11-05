export const NODE_6_INITIAL_DIALOGUE =
  "Esta es la Base de Pruebas: un espacio protegido donde un agente puede trabajar sin salir de sus límites. Aquí verás por qué probar en un entorno aislado es necesario, pero no suficiente. Lee los dos bloques y abre los íconos «+» para aclarar conceptos como el gap virtual a real o la supervisión calibrada. Al final te plantearé un caso: ¿qué harías antes de desplegar? Piensa como un ingeniero responsable y tómate el tiempo que necesites. ¡Adelante!";

export const NODE_6_READING_BLOCKS = [
  {
    id: "sandbox",
    marker: "A",
    eyebrow: "AISLAMIENTO · EJECUCIÓN · APRENDIZAJE",
    title: "Probar sin tocar producción",
    introduction:
      "Un sandbox es un entorno aislado donde el agente ejecuta y prueba código sin tocar producción.",
    evidence: [
      {
        id: "microscope",
        label: "MICROSCOPIO CIENTÍFICO",
        highlight: "MESES → ≈ 3 SEMANAS",
        text:
          "El flujo combinó un sandbox digital, validación cruzada entre dos modelos y revisión humana obligatoria (Wang et al., 2026).",
      },
      {
        id: "fuzzing",
        label: "FUZZING · COBERTURA",
        highlight: "EJECUTAR → MEDIR → REFINAR",
        text:
          "Al generar arneses de fuzzing, los agentes refinan su trabajo con la cobertura obtenida (Loose et al., 2026).",
      },
    ],
    limitation:
      "LÍMITE · Lo validado en el sandbox puede fallar en el mundo real: es el gap virtual-a-real (Khaldi et al., 2026).",
  },
  {
    id: "guardrails",
    marker: "B",
    eyebrow: "LÍMITES · SUPERVISIÓN · VERIFICACIÓN",
    title: "Poner barreras y escalar con criterio",
    introduction:
      "Los guardrails limitan lo que el agente puede hacer. Doshi et al. (2026) proponen cuatro niveles con análisis formal para bloquear flujos inseguros de datos:",
    guardrailLevels: ["Blocklist", "Mustlist", "Allowlist", "Confirmation"],
    supervision: {
      label: "SUPERVISIÓN CALIBRADA",
      highlight: "98,2 % DE ÉXITO",
      text:
        "Un puntaje de confianza decide cuándo escalar a una persona; hubo intervención humana en solo el 14,5 % de los pasos (Kumar & Singh, 2026).",
    },
    limitation:
      "Los parches generados por LLM carecen de garantías deterministas (Bonilla et al., 2026). Por eso, sandbox, guardrails y revisión humana se complementan.",
  },
];

export const NODE_6_TERMS = [
  {
    id: "sandbox",
    label: "SANDBOX",
    title: "Sandbox",
    body:
      "Entorno aislado donde el agente ejecuta y prueba código sin tocar producción. Puede implementarse con contenedores, por ejemplo Docker.",
  },
  {
    id: "virtual-real-gap",
    label: "GAP VIRTUAL-A-REAL",
    title: "Gap virtual-a-real",
    body: "Lo validado en el sandbox puede fallar en el mundo real.",
    citation: "Khaldi et al., 2026",
  },
  {
    id: "validation-gap",
    label: "BRECHA DE VALIDACIÓN",
    title: "Brecha de validación",
    body:
      "Los parches generados por LLM carecen de garantías deterministas y faltan bancos de prueba estandarizados.",
    citation: "Bonilla et al., 2026",
  },
  {
    id: "calibrated-supervision",
    label: "SUPERVISIÓN CALIBRADA",
    title: "Supervisión calibrada",
    body: "Un puntaje de confianza decide cuándo escalar una acción a una persona.",
    citation: "Kumar & Singh, 2026",
  },
];

export const NODE_6_OPTIONS = [
  {
    id: "A",
    text: "Desplegar: si las pruebas pasaron, está listo.",
    feedback:
      "Pasar pruebas virtuales no garantiza el comportamiento real (Bonilla et al., 2026).",
  },
  {
    id: "B",
    text:
      "Complementar con validación cruzada, revisión humana y verificación en condiciones reales.",
    correct: true,
    feedback:
      "El flujo del microscopio combinó sandbox, dos modelos independientes y revisión humana obligatoria (Wang et al., 2026), y el gap virtual-a-real recuerda validar fuera del sandbox (Khaldi et al., 2026).",
  },
  {
    id: "C",
    text: "Quitar el sandbox para ahorrar tiempo en el siguiente ciclo.",
    feedback:
      "El sandbox es la primera barrera y aporta la retroalimentación de ejecución con la que los agentes refinan su trabajo (Loose et al., 2026).",
  },
  {
    id: "D",
    text: "Pedir al mismo agente que se autoevalúe y dar el visto bueno.",
    feedback:
      "Autoevaluarse no aporta una verificación independiente; el flujo del microscopio usó dos modelos distintos y revisión humana obligatoria (Wang et al., 2026).",
  },
];
