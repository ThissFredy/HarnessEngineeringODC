/**
 * Datos de los 7 nodos del ODC Harness Engineering.
 * Fuente de verdad de contenido: docs/nodos/*.md (generar con agente `academico`).
 *
 * Licencia:
 *   - Esta estructura / código JS: MIT (LICENSE)
 *   - El contenido educativo que alberga (textos, preguntas, evaluaciones):
 *     CC BY 4.0 (LICENSE-CONTENT.txt)
 */

export const NODOS = [
  {
    id: 1,
    slug: 'redes-neuronales-a-llms',
    titulo: 'De Redes Neuronales a LLMs',
    resumen: 'Fundamentos matemáticos y evolución de las redes neuronales hasta los grandes modelos de lenguaje.',
    visual: {
      icono: 'terminal',
      fondo: 'lab-servers',
      color: '#46c2ff'
    },
    teoria: {
      hook: 'TODO: hook inicial (agente academico)',
      bloques: [
        { titulo: 'Del perceptrón al deep learning', cuerpo: 'TODO' },
        { titulo: 'Arquitectura Transformer', cuerpo: 'TODO' },
        { titulo: 'Tokens, embeddings y atención', cuerpo: 'TODO' }
      ],
      analogia: 'TODO',
      datoClave: 'TODO',
      glosario: [
        { termino: 'Embedding', definicion: 'TODO' },
        { termino: 'Attention', definicion: 'TODO' }
      ],
      cierre: 'TODO'
    },
    minijuego: {
      tipo: 'quiz',
      preguntas: [
        {
          enunciado: 'TODO',
          opciones: [
            { texto: 'TODO A', correcta: true },
            { texto: 'TODO B', correcta: false },
            { texto: 'TODO C', correcta: false },
            { texto: 'TODO D', correcta: false }
          ],
          feedbackCorrecto: 'TODO',
          feedbackIncorrecto: 'TODO',
          dificultad: 'facil'
        }
      ]
    }
  },
  {
    id: 2,
    slug: 'nuevo-sdlc',
    titulo: 'El Nuevo SDLC',
    resumen: 'Transformación del ciclo de desarrollo y mutación del rol del programador hacia la orquestación.',
    visual: {
      icono: 'wrench',
      fondo: 'dev-desk',
      color: '#6ee7a0'
    },
    teoria: {
      hook: 'TODO',
      bloques: [
        { titulo: 'SDLC clásico vs asistido por IA', cuerpo: 'TODO' },
        { titulo: 'Plan → Generate → Review → Test → Deploy', cuerpo: 'TODO' },
        { titulo: 'El programador orquestador', cuerpo: 'TODO' }
      ],
      analogia: 'TODO',
      datoClave: 'TODO',
      glosario: [{ termino: 'SDLC', definicion: 'TODO' }],
      cierre: 'TODO'
    },
    minijuego: {
      tipo: 'quiz',
      preguntas: [
        {
          enunciado: 'TODO',
          opciones: [
            { texto: 'TODO A', correcta: true },
            { texto: 'TODO B', correcta: false },
            { texto: 'TODO C', correcta: false },
            { texto: 'TODO D', correcta: false }
          ],
          feedbackCorrecto: 'TODO',
          feedbackIncorrecto: 'TODO',
          dificultad: 'facil'
        }
      ]
    }
  },
  {
    id: 3,
    slug: 'limitaciones-y-evolucion',
    titulo: 'Limitaciones y Evolución',
    resumen: 'Saturación de contexto y el paso del Prompt/Context Engineering a arquitecturas robustas.',
    visual: {
      icono: 'bubble',
      fondo: 'chaos-library',
      color: '#ff6b6b'
    },
    teoria: {
      hook: 'TODO',
      bloques: [
        { titulo: 'Context window y sus límites', cuerpo: 'TODO' },
        { titulo: 'Alucinaciones y pérdida de instrucciones', cuerpo: 'TODO' },
        { titulo: 'De prompt a arquitectura', cuerpo: 'TODO' }
      ],
      analogia: 'TODO',
      datoClave: 'TODO',
      glosario: [{ termino: 'Context window', definicion: 'TODO' }],
      cierre: 'TODO'
    },
    minijuego: {
      tipo: 'drag-drop',
      categorias: ['Limitación', 'Mitigación'],
      items: [
        { texto: 'TODO item 1', categoria: 'Limitación' },
        { texto: 'TODO item 2', categoria: 'Mitigación' }
      ],
      feedbackCorrecto: 'TODO',
      feedbackIncorrecto: 'TODO'
    }
  },
  {
    id: 4,
    slug: 'agentes-de-ia',
    titulo: 'Agentes de IA',
    resumen: 'Autonomía de los modelos y flujos de trabajo agénticos (agentic workflows).',
    visual: {
      icono: 'robot',
      fondo: 'future-city',
      color: '#b48cff'
    },
    teoria: {
      hook: 'TODO',
      bloques: [
        { titulo: 'Bucle percepción-decisión-acción', cuerpo: 'TODO' },
        { titulo: 'Agentic workflows: ReAct y Plan-and-Execute', cuerpo: 'TODO' },
        { titulo: 'Memoria y tools', cuerpo: 'TODO' }
      ],
      analogia: 'TODO',
      datoClave: 'TODO',
      glosario: [{ termino: 'Agentic workflow', definicion: 'TODO' }],
      cierre: 'TODO'
    },
    minijuego: {
      tipo: 'ordenar',
      pasos: ['TODO paso 1', 'TODO paso 2', 'TODO paso 3', 'TODO paso 4'],
      feedbackCorrecto: 'TODO',
      feedbackIncorrecto: 'TODO'
    }
  },
  {
    id: 5,
    slug: 'skills-y-mcp',
    titulo: 'Skills y MCP',
    resumen: 'Integración de herramientas y estandarización a través del Model Context Protocol.',
    visual: {
      icono: 'plug',
      fondo: 'tool-armory',
      color: '#ffd700'
    },
    teoria: {
      hook: 'TODO',
      bloques: [
        { titulo: 'Qué es un Skill', cuerpo: 'TODO' },
        { titulo: 'Model Context Protocol', cuerpo: 'TODO' },
        { titulo: 'Clientes, servidores e interoperabilidad', cuerpo: 'TODO' }
      ],
      analogia: 'TODO',
      datoClave: 'TODO',
      glosario: [
        { termino: 'MCP', definicion: 'TODO' },
        { termino: 'Skill', definicion: 'TODO' }
      ],
      cierre: 'TODO'
    },
    minijuego: {
      tipo: 'emparejar',
      pares: [
        { izquierda: 'TODO concepto', derecha: 'TODO definición' },
        { izquierda: 'TODO concepto', derecha: 'TODO definición' }
      ],
      feedbackCorrecto: 'TODO',
      feedbackIncorrecto: 'TODO'
    }
  },
  {
    id: 6,
    slug: 'sandbox-y-guardrails',
    titulo: 'Sandbox y Guardrails',
    resumen: 'Entornos de prueba, observabilidad y reglas de negocio para auditoría y mitigación de riesgos.',
    visual: {
      icono: 'shield',
      fondo: 'containment',
      color: '#8ab4ff'
    },
    teoria: {
      hook: 'TODO',
      bloques: [
        { titulo: 'Sandbox y least privilege', cuerpo: 'TODO' },
        { titulo: 'Observabilidad y auditoría', cuerpo: 'TODO' },
        { titulo: 'Guardrails, políticas y red teaming', cuerpo: 'TODO' }
      ],
      analogia: 'TODO',
      datoClave: 'TODO',
      glosario: [{ termino: 'Guardrail', definicion: 'TODO' }],
      cierre: 'TODO'
    },
    minijuego: {
      tipo: 'verdadero-falso',
      preguntas: [
        { enunciado: 'TODO', correcta: true, feedback: 'TODO' },
        { enunciado: 'TODO', correcta: false, feedback: 'TODO' }
      ]
    }
  },
  {
    id: 7,
    slug: 'harness-engineering',
    titulo: 'Harness Engineering',
    resumen: 'Consolidación de la arquitectura que envuelve y controla todo el sistema.',
    visual: {
      icono: 'rocket',
      fondo: 'mission-control',
      color: '#ffb347'
    },
    teoria: {
      hook: 'TODO',
      bloques: [
        { titulo: 'Qué es un Harness', cuerpo: 'TODO' },
        { titulo: 'Integración de los 6 pilares', cuerpo: 'TODO' },
        { titulo: 'Implicaciones y trabajo futuro', cuerpo: 'TODO' }
      ],
      analogia: 'TODO',
      datoClave: 'TODO',
      glosario: [{ termino: 'Harness', definicion: 'TODO' }],
      cierre: 'TODO'
    },
    minijuego: {
      tipo: 'quiz',
      preguntas: [
        {
          enunciado: 'TODO',
          opciones: [
            { texto: 'TODO A', correcta: true },
            { texto: 'TODO B', correcta: false },
            { texto: 'TODO C', correcta: false },
            { texto: 'TODO D', correcta: false }
          ],
          feedbackCorrecto: 'TODO',
          feedbackIncorrecto: 'TODO',
          dificultad: 'dificil'
        }
      ]
    }
  }
];

export function getNodo(id) {
  return NODOS.find((n) => n.id === Number(id)) || null;
}
