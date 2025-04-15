// src/config.js

import Phaser from "phaser";
import SceneManager from '/src/scenes/managers/scene_manager.js';
import Managers from '/src/scenes/managers.js';
import DataInfo from '/src/scenes/data_info.js';

import { loginGoogle } from '/src/databese/auth.js';
import { guardarProgresoCompleto, cargarProgresoCompleto } from '/src/database/save-data.js';
let usuario = null;
let progreso = {
  nivel: 1,
  puntos: 0,
};

async function iniciarJuego() {
  usuario = await loginGoogle();

  if (usuario) {
    const datos = await cargarProgresoCompleto(usuario.uid);
    if (datos) {
      progreso = datos;
    }

    // Configuración del juego
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

    const game = new Phaser.Game(config);

    // Guardamos datos accesibles para todas las escenas
    game.registry.set('progreso', progreso);
    game.registry.set('userId', usuario.uid);
  }
}

iniciarJuego();
