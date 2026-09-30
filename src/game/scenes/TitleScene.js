/**
 * TitleScene — pantalla de inicio retro estilo consola.
 */
import Phaser from 'phaser';
import { GAME, COLORS, FONTS, defaultState, STATE_KEYS, averageScore } from '@/game/config.js';
import { scorm } from '@/scorm/scorm.js';
import { NODOS } from '@/game/data/nodos.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(COLORS.BG_DEEP);

    this.add
      .text(width / 2, height * 0.28, GAME.TITLE.toUpperCase(), {
        fontFamily: FONTS.PIXEL,
        fontSize: '36px',
        color: COLORS.TITLE,
        stroke: '#000',
        strokeThickness: 4,
        shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 0, fill: true }
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.28 + 52, GAME.SUBTITLE.toUpperCase(), {
        fontFamily: FONTS.PIXEL,
        fontSize: '14px',
        color: COLORS.ACCENT
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.52, 'V1.2 · ODC · UNIVERSIDAD DE CUNDINAMARCA', {
        fontFamily: FONTS.PIXEL,
        fontSize: '10px',
        color: COLORS.TEXT_DIM
      })
      .setOrigin(0.5);

    const start = this.add
      .text(width / 2, height * 0.72, '[  COMENZAR  ]', {
        fontFamily: FONTS.PIXEL,
        fontSize: '18px',
        color: COLORS.GOLD,
        backgroundColor: '#1a2132',
        padding: { x: 20, y: 12 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    start.on('pointerover', () => start.setStyle({ backgroundColor: '#242c3d' }));
    start.on('pointerout', () => start.setStyle({ backgroundColor: '#1a2132' }));
    start.on('pointerdown', () => this._begin());

    this.tweens.add({
      targets: start,
      alpha: { from: 1, to: 0.6 },
      duration: 700,
      yoyo: true,
      repeat: -1
    });

    this.input.keyboard?.on('keydown-ENTER', () => this._begin());
    this.input.keyboard?.on('keydown-SPACE', () => this._begin());
  }

  _begin() {
    const state = this.registry.get('state') || defaultState();
    const avg = averageScore(state);
    const done = Object.keys(state[STATE_KEYS.NODE_SCORES] || {}).length;
    scorm.setLessonStatus(done >= NODOS.length ? 'completed' : 'incomplete');
    scorm.setScore(avg);
    scorm.setLessonLocation(String(state[STATE_KEYS.LAST_NODE] || 1));
    scorm.commit();
    this.scene.start('OverworldScene');
  }
}
