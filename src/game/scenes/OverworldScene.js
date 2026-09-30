/**
 * OverworldScene — mapa estilo Super Mario Bros 3 con los 7 nodos.
 * Los nodos son interactivos (mouse + touch) y respetan el estado de desbloqueo.
 */
import Phaser from 'phaser';
import { COLORS, FONTS, STATE_KEYS, defaultState, averageScore } from '@/game/config.js';
import { NODOS } from '@/game/data/nodos.js';

const NODE_POS = [
  { x: 120, y: 430 },
  { x: 250, y: 350 },
  { x: 390, y: 420 },
  { x: 520, y: 300 },
  { x: 650, y: 380 },
  { x: 790, y: 280 },
  { x: 920, y: 200 }
];

export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'OverworldScene' });
  }

  create() {
    const state = this.registry.get('state') || defaultState();
    this.cameras.main.setBackgroundColor(COLORS.BG_DEEP);

    this._drawBackground();
    this._drawHUD(state);
    this._drawPath();
    this._drawNodes(state);
  }

  _drawBackground() {
    const { width, height } = this.scale;
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height * 0.7);
      const r = Phaser.Math.Between(1, 2);
      this.add.circle(x, y, r, 0x2a3142, 0.6);
    }
    this.add.rectangle(width / 2, height - 40, width, 120, 0x141926).setOrigin(0.5);
    this.add
      .text(width / 2, height - 28, 'MAPA  ·  SUPERAR LOS 7 NODOS PARA COMPLETAR EL ODC', {
        fontFamily: FONTS.PIXEL,
        fontSize: '10px',
        color: COLORS.TEXT_DIM
      })
      .setOrigin(0.5);
  }

  _drawHUD(state) {
    const { width } = this.scale;
    this.add.rectangle(width / 2, 30, width, 60, 0x0b0e14).setStrokeStyle(2, 0x2a3142);

    this.add
      .text(24, 30, 'HARNESS ENGINEERING', {
        fontFamily: FONTS.PIXEL,
        fontSize: '14px',
        color: COLORS.TITLE
      })
      .setOrigin(0, 0.5);

    const avg = averageScore(state);
    this.add
      .text(width - 24, 30, `PROMEDIO  ${avg}%`, {
        fontFamily: FONTS.PIXEL,
        fontSize: '12px',
        color: COLORS.GOLD
      })
      .setOrigin(1, 0.5);
  }

  _drawPath() {
    const g = this.add.graphics();
    g.lineStyle(6, 0x2a3142, 1);
    g.beginPath();
    g.moveTo(NODE_POS[0].x, NODE_POS[0].y);
    for (let i = 1; i < NODE_POS.length; i++) {
      g.lineTo(NODE_POS[i].x, NODE_POS[i].y);
    }
    g.strokePath();

    g.lineStyle(2, 0x46c2ff, 0.4);
    g.beginPath();
    g.moveTo(NODE_POS[0].x, NODE_POS[0].y);
    for (let i = 1; i < NODE_POS.length; i++) {
      g.lineTo(NODE_POS[i].x, NODE_POS[i].y);
    }
    g.strokePath();
  }

  _drawNodes(state) {
    const unlocked = new Set(state[STATE_KEYS.NODES_UNLOCKED] || [1]);
    const scores = state[STATE_KEYS.NODE_SCORES] || {};

    NODOS.forEach((nodo, idx) => {
      const { x, y } = NODE_POS[idx];
      const isUnlocked = unlocked.has(nodo.id);
      const score = scores[nodo.id];
      const isDone = typeof score === 'number';

      const color = isUnlocked
        ? Phaser.Display.Color.HexStringToColor(nodo.visual.color).color
        : 0x2a3142;

      const ring = this.add.circle(x, y, 34).setStrokeStyle(4, color, 1).setFillStyle(0x0b0e14, 1);
      const inner = this.add.circle(x, y, 26).setFillStyle(color, isUnlocked ? 0.25 : 0.1);

      this.add
        .text(x, y, isUnlocked ? String(nodo.id) : '🔒', {
          fontFamily: FONTS.PIXEL,
          fontSize: '16px',
          color: isUnlocked ? COLORS.TEXT : COLORS.TEXT_DIM
        })
        .setOrigin(0.5);

      this.add
        .text(x, y + 52, nodo.titulo.toUpperCase(), {
          fontFamily: FONTS.PIXEL,
          fontSize: '9px',
          color: isUnlocked ? COLORS.TEXT : COLORS.TEXT_DIM,
          align: 'center',
          wordWrap: { width: 160 }
        })
        .setOrigin(0.5);

      if (isDone) {
        this.add
          .text(x + 30, y - 30, '★', {
            fontFamily: FONTS.PIXEL,
            fontSize: '16px',
            color: COLORS.GOLD
          })
          .setOrigin(0.5);
      }

      const hit = this.add.circle(x, y, 48).setStrokeStyle(0).setFillStyle(0xffffff, 0.001);
      hit.setInteractive({ useHandCursor: true, pixelPerfect: false });

      hit.on('pointerover', () => {
        if (isUnlocked) ring.setStrokeStyle(6, color, 1);
      });
      hit.on('pointerout', () => {
        ring.setStrokeStyle(4, color, 1);
      });
      hit.on('pointerdown', () => {
        if (!isUnlocked) {
          this._flashMessage('NODO BLOQUEADO');
          return;
        }
        this.scene.start('NodeScene', { nodoId: nodo.id });
      });

      void inner;
    });
  }

  _flashMessage(text) {
    const { width, height } = this.scale;
    const msg = this.add
      .text(width / 2, height * 0.15, text, {
        fontFamily: FONTS.PIXEL,
        fontSize: '14px',
        color: COLORS.DANGER,
        backgroundColor: '#0b0e14',
        padding: { x: 14, y: 10 }
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: msg,
      alpha: 0,
      duration: 900,
      delay: 500,
      onComplete: () => msg.destroy()
    });
  }
}
