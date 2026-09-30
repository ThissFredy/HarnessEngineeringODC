/**
 * Configuración global del juego — ODC Harness Engineering
 * Licencia: MIT (ver archivo LICENSE)
 */

export const GAME = {
  TITLE: 'Harness Engineering',
  SUBTITLE: 'El Nuevo Paradigma',
  VERSION: '0.1.0',
  WIDTH: 1024,
  HEIGHT: 600,
  BACKGROUND: '#0b0e14'
};

export const COLORS = {
  BG_DEEP: '#0b0e14',
  BG_PANEL: '#0f1220',
  TITLE: '#ffc857',
  TITLE_2: '#ffb347',
  ACCENT: '#46c2ff',
  SUCCESS: '#6ee7a0',
  DANGER: '#ff6b6b',
  GOLD: '#ffd700',
  TEXT: '#e8ecf4',
  TEXT_DIM: '#a9b4c4'
};

export const FONTS = {
  PIXEL: '"Press Start 2P", "VT323", "Courier New", monospace',
  BODY: '"Inter", "Roboto", system-ui, sans-serif'
};

export const SCORE = {
  MIN: 0,
  MAX: 100
};

export const NODOS_TOTAL = 7;

export const STATE_KEYS = {
  NODES_UNLOCKED: 'nodesUnlocked',
  NODE_SCORES: 'nodeScores',
  CURRENT_NODE: 'currentNode',
  LAST_NODE: 'ultimoNodo',
  COMPLETED: 'completed'
};

export function defaultState() {
  return {
    [STATE_KEYS.NODES_UNLOCKED]: [1],
    [STATE_KEYS.NODE_SCORES]: {},
    [STATE_KEYS.CURRENT_NODE]: 1,
    [STATE_KEYS.LAST_NODE]: 1,
    [STATE_KEYS.COMPLETED]: false
  };
}

export function averageScore(state) {
  const scores = state?.[STATE_KEYS.NODE_SCORES] || {};
  const values = Object.values(scores).map(Number).filter(Number.isFinite);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
