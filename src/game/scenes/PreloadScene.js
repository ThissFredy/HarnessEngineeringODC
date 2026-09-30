/**
 * PreloadScene — carga de assets del ODC.
 * Coloca los sprites en src/assets/sprites/ y registra las cargas aquí.
 */
import Phaser from 'phaser';
import { GAME, COLORS, FONTS } from '@/game/config.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    const { width, height } = this.scale;

    const barW = 320;
    const barH = 16;
    const x = width / 2 - barW / 2;
    const y = height / 2 + 40;

    const bg = this.add.rectangle(width / 2, y + barH / 2, barW, barH).setStrokeStyle(2, COLORS.ACCENT);
    const bar = this.add.rectangle(x + 2, y + 2, 0, barH - 4, Phaser.Display.Color.HexStringToColor(COLORS.SUCCESS).color);
    bar.setOrigin(0, 0);

    this.add
      .text(width / 2, y - 20, 'PREPARANDO MUNDO', {
        fontFamily: FONTS.PIXEL,
        fontSize: '14px',
        color: COLORS.TITLE
      })
      .setOrigin(0.5);

    this.load.on('progress', (v) => {
      bar.width = (barW - 4) * v;
    });

    // TODO(ui-retro): registrar aquí las cargas de assets reales.
    // Ejemplo:
    // this.load.spritesheet('player', new URL('@assets/sprites/player.png', import.meta.url).href, {
    //   frameWidth: 32, frameHeight: 32
    // });
    // this.load.audio('bgm-overworld', [ ... ]);
    void bg;
  }

  create() {
    this.scene.start('TitleScene');
  }
}
