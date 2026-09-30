/**
 * NodeScene — orquesta la vista de teoría y el minijuego de un nodo.
 */
import Phaser from 'phaser';
import { COLORS, FONTS, STATE_KEYS, defaultState, averageScore, NODOS_TOTAL } from '@/game/config.js';
import { NODOS, getNodo } from '@/game/data/nodos.js';
import { scorm } from '@/scorm/scorm.js';
import { TeoriaPanel } from './components/TeoriaPanel.js';
import { MinijuegoPanel } from './components/MinijuegoPanel.js';

export default class NodeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NodeScene' });
  }

  init(data) {
    this.nodoId = Number(data?.nodoId || 1);
    this.nodo = getNodo(this.nodoId) || NODOS[0];
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(COLORS.BG_DEEP);

    this.add.rectangle(width / 2, 30, width, 60, 0x0b0e14).setStrokeStyle(2, 0x2a3142);
    this.add
      .text(24, 30, `NODO ${this.nodo.id}  ·  ${this.nodo.titulo.toUpperCase()}`, {
        fontFamily: FONTS.PIXEL,
        fontSize: '12px',
        color: COLORS.TITLE
      })
      .setOrigin(0, 0.5);

    this.add
      .text(width - 24, 30, '[  VOLVER AL MAPA  ]', {
        fontFamily: FONTS.PIXEL,
        fontSize: '10px',
        color: COLORS.ACCENT,
        backgroundColor: '#141926',
        padding: { x: 10, y: 8 }
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this._backToMap());

    this._renderStage('teoria');
  }

  _renderStage(stage) {
    this.children.removeAll(true);
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, 30, width, 60, 0x0b0e14).setStrokeStyle(2, 0x2a3142);
    this.add
      .text(24, 30, `NODO ${this.nodo.id}  ·  ${this.nodo.titulo.toUpperCase()}`, {
        fontFamily: FONTS.PIXEL,
        fontSize: '12px',
        color: COLORS.TITLE
      })
      .setOrigin(0, 0.5);

    this.add
      .text(width - 24, 30, '[  VOLVER AL MAPA  ]', {
        fontFamily: FONTS.PIXEL,
        fontSize: '10px',
        color: COLORS.ACCENT,
        backgroundColor: '#141926',
        padding: { x: 10, y: 8 }
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this._backToMap());

    if (stage === 'teoria') {
      this.teoria = new TeoriaPanel(this, {
        nodo: this.nodo,
        onContinue: () => this._renderStage('minijuego')
      });
    } else {
      this.minijuego = new MinijuegoPanel(this, {
        nodo: this.nodo,
        onFinish: (score) => this._onFinish(score)
      });
    }
  }

  _onFinish(score) {
    const state = this.registry.get('state') || defaultState();
    state[STATE_KEYS.NODE_SCORES] = state[STATE_KEYS.NODE_SCORES] || {};
    state[STATE_KEYS.NODE_SCORES][this.nodo.id] = score;
    state[STATE_KEYS.LAST_NODE] = this.nodo.id;

    const unlocked = new Set(state[STATE_KEYS.NODES_UNLOCKED] || [1]);
    unlocked.add(this.nodo.id);
    if (this.nodo.id < NODOS_TOTAL) unlocked.add(this.nodo.id + 1);
    state[STATE_KEYS.NODES_UNLOCKED] = [...unlocked].sort((a, b) => a - b);

    const avg = averageScore(state);
    const allDone = Object.keys(state[STATE_KEYS.NODE_SCORES]).length >= NODOS_TOTAL;
    state[STATE_KEYS.COMPLETED] = allDone;

    scorm.saveProgress(state);
    scorm.setScore(avg);
    scorm.setLessonStatus(allDone ? 'completed' : 'incomplete');
    scorm.commit();

    this.registry.set('state', state);
    this._backToMap();
  }

  _backToMap() {
    this.scene.start('OverworldScene');
  }
}
