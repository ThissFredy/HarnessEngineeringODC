/**
 * Bootstrap de Phaser + SCORM — ODC Harness Engineering
 * Licencia: MIT (ver archivo LICENSE)
 */
import Phaser from 'phaser';
import '@/styles/main.css';
import { GAME, COLORS } from '@/game/config.js';
import BootScene from '@/game/scenes/BootScene.js';
import PreloadScene from '@/game/scenes/PreloadScene.js';
import TitleScene from '@/game/scenes/TitleScene.js';
import OverworldScene from '@/game/scenes/OverworldScene.js';
import NodeScene from '@/game/scenes/NodeScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  backgroundColor: COLORS.BG_DEEP,
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, PreloadScene, TitleScene, OverworldScene, NodeScene]
};

const game = new Phaser.Game(config);

window.addEventListener('pagehide', () => {
  try {
    game.destroy(true);
  } catch (_) {
    /* noop */
  }
});

export default game;
