export const NODE_5_INITIAL_DIALOGUE =
  "Bienvenido a la Estación de Conexiones. A un lado verás los puertos MCP y al otro las Skills: dos piezas distintas que se complementan. Lee los dos bloques y abre los íconos «+» para ver ejemplos de servidores y de la estructura de una Skill. Después, tu reto será relacionar cada concepto con su descripción. Fíjate en la diferencia entre conectarse a algo y saber cómo hacerlo. Tómate el tiempo que necesites. ¡Adelante!";

export const NODE_5_READING_BLOCKS = [
  {
    id: "mcp",
    marker: "A",
    eyebrow: "ACCESO A CAPACIDADES",
    title: "MCP: conectar herramientas y datos",
    text:
      "Para actuar, un agente necesita herramientas y datos. MCP estandariza cómo una aplicación de IA se comunica con servidores que exponen esas capacidades. El cliente puede pedir los recursos pertinentes cuando los necesita; el protocolo no decide por sí solo qué carga cada aplicación (Anthropic, 2024).",
    diagram: ["APLICACIÓN DE IA", "SERVIDOR MCP", "HERRAMIENTAS · DATOS"],
    evidence: [
      {
        eyebrow: "FUZZING · COBERTURA DIRIGIDA",
        text:
          "Cinco agentes consultaron documentación, código y call graph mediante MCP. La cobertura dirigida al método mejoró una mediana del 26 % frente a OSS-Fuzz; el costo promedio fue USD 3,20 por arnés (Loose et al., 2026).",
      },
      {
        eyebrow: "CIBERSEGURIDAD · AVDA",
        text:
          "El flujo agéntico obtuvo 19 % más similitud general que el baseline zero-shot sin herramientas MCP; la comparación no es contra una generación sin ningún contexto (Bulut et al., 2026).",
      },
    ],
  },
  {
    id: "skills",
    marker: "B",
    eyebrow: "CONOCIMIENTO PROCEDIMENTAL",
    title: "Skills: saber cómo hacer una tarea",
    text:
      "Una Skill reúne instrucciones y recursos para realizar una tarea. Al inicio se descubren su nombre y descripción; el agente carga las instrucciones cuando la tarea las necesita y consulta archivos de apoyo si hacen falta. Esta divulgación progresiva ayuda a mantener enfocado el contexto (Zhang et al., 2025).",
    diagram: ["NOMBRE · DESCRIPCIÓN", "SKILL.MD", "RECURSOS SI HACEN FALTA"],
    callout:
      "MCP responde «¿con qué me conecto?»; una Skill, «¿cómo hago bien esta tarea?». Doshi et al. (2026) proponen además etiquetar capacidades, confidencialidad y confianza para aplicar políticas al flujo de datos. Esa propuesta no es un campo obligatorio del MCP actual.",
  },
];

export const NODE_5_TERMS = [
  {
    id: "mcp-server",
    label: "SERVIDOR MCP",
    title: "Servidor MCP",
    body:
      "Es un programa que ofrece herramientas o recursos a una aplicación de IA mediante el protocolo MCP. El cliente solicita las capacidades pertinentes; cada servidor tiene sus propios permisos y alcances.",
    citation: "Protocolo y ejemplos oficiales del Model Context Protocol.",
    examples: [
      {
        title: "FILESYSTEM · MIT",
        body:
          "Permite leer, buscar o modificar archivos dentro de directorios configurados para el servidor.",
      },
      {
        title: "GIT · MIT",
        body:
          "Expone operaciones sobre un repositorio, como consultar estado y diferencias; algunas herramientas también pueden modificarlo.",
      },
    ],
  },
  {
    id: "skill-anatomy",
    label: "ANATOMÍA DE UNA SKILL",
    title: "Anatomía de una Skill",
    body:
      "Carpeta con un archivo SKILL.md que define nombre, descripción e instrucciones. Puede incluir scripts, referencias y recursos opcionales (Zhang et al., 2025).",
  },
  {
    id: "progressive-disclosure",
    label: "DIVULGACIÓN PROGRESIVA",
    title: "Divulgación progresiva",
    body:
      "Primero se muestran el nombre y la descripción de una Skill. El agente lee sus instrucciones al activarla y abre archivos de apoyo solo cuando son pertinentes (Zhang et al., 2025).",
  },
  {
    id: "security-labels",
    label: "ETIQUETAS DE SEGURIDAD",
    title: "Etiquetas de seguridad",
    body:
      "Doshi et al. (2026) proponen metadatos estructurados para expresar capacidades, confidencialidad de los datos y nivel de confianza de una herramienta. Así podrían aplicarse políticas sobre qué datos fluyen entre herramientas.",
  },
];

export const NODE_5_MATCHES = [
  {
    id: "mcp",
    label: "MCP",
    description:
      "Protocolo abierto para que una aplicación de IA acceda a herramientas y datos externos expuestos por servidores.",
    correctFeedback:
      "Es el canal estandarizado de acceso. Los estudios citados muestran usos de MCP, no una garantía de resultado del protocolo por sí solo.",
    incorrectFeedback:
      "Busca la descripción que habla de conectar una aplicación de IA con capacidades externas, no de empaquetar instrucciones.",
  },
  {
    id: "skill",
    label: "Skill",
    description:
      "Carpeta con instrucciones y recursos para realizar una tarea; su contenido se carga cuando resulta pertinente.",
    correctFeedback:
      "Una Skill aporta saber hacer. No es un servidor ni una herramienta externa (Zhang et al., 2025).",
    incorrectFeedback:
      "Busca el paquete de instrucciones que guía cómo realizar una tarea, en vez del canal de conexión.",
  },
  {
    id: "progressive-disclosure",
    label: "Divulgación progresiva",
    description:
      "Cargar primero nombre y descripción; leer instrucciones y recursos detallados solo cuando hacen falta.",
    correctFeedback:
      "Así se evita cargar todos los detalles de cada Skill en el contexto desde el inicio (Zhang et al., 2025).",
    incorrectFeedback:
      "Distingue el paquete Skill de la estrategia que carga sus detalles por etapas.",
  },
  {
    id: "security-labels",
    label: "Etiquetas de seguridad",
    description:
      "Metadatos propuestos para declarar capacidades, confidencialidad y confianza de herramientas MCP.",
    correctFeedback:
      "Doshi et al. (2026) proponen estas etiquetas para apoyar políticas de flujo de datos; no son obligatorias en MCP.",
    incorrectFeedback:
      "Busca la descripción sobre metadatos de seguridad de una herramienta, no sobre cómo se carga una Skill.",
  },
];

export const NODE_5_DESCRIPTION_ORDER = [
  "security-labels",
  "progressive-disclosure",
  "mcp",
  "skill",
];
