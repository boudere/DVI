// src/config.js

import Phaser from "phaser";
import SceneManager from '/src/scenes/managers/scene_manager.js';
import Managers from '/src/scenes/managers.js';
import DataInfo from '/src/scenes/data_info.js';

const config = {
  width: 1820,
  height: 1358,
  parent: 'juego',

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },

  scene: [
    DataInfo,
    Managers,
    SceneManager
  ],

  scale: {
    mode: Phaser.Scale.EXACT_FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
