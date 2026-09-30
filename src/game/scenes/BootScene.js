/**
 * BootScene — carga mínima y arranque del wrapper SCORM.
 */
import Phaser from 'phaser';
import { scorm } from '@/scorm/scorm.js';
import { GAME, defaultState, STATE_KEYS } from '@/game/config.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  init() {
    const ok = scorm.init();
    if (!ok) {
      // Modo dev / fallback sin LMS: se permite continuar con estado por defecto.
      // eslint-disable-next-line no-console
      console.warn('[SCORM] No se detectó API del LMS. Ejecutando en modo desarrollo.');
    }
    const saved = scorm.loadProgress() || defaultState();
    this.registry.set('state', saved);
  }

  preload() {
    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2, 'CARGANDO...', {
        fontFamily: '"Press Start 2P", "VT323", monospace',
        fontSize: '18px',
        color: '#ffc857'
      })
      .setOrigin(0.5);
  }

  create() {
    this.scene.start('PreloadScene');
  }
}
