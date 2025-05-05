// src/config.js

import SceneManager from '/src/scenes/managers/scene_manager.js';
import DataInfo from '/src/scenes/data_info.js';

const config = {
  width: 1820,
  height: 1358,
  parent: 'juego',

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: true
    }
  },

  scene: [
    DataInfo,
    SceneManager
  ],

  scale: {
    mode: Phaser.Scale.EXACT_FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
