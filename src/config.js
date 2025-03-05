import Dialogo from '/src/scenes/dialogo.js';
import Bootloader from '/src/bootloader.js'; // Importamos el Bootloader
import SceneManager from '/src/scenes/scene_manager.js'; // Importamos la escena ScenePlay
import ScenePlay from '/src/scenes/scene_play.js'; // Importamos la escena ScenePlay
import Pantallas from '/src/scenes/pantallas.js'; // Importamos la escena Pantallas

// Configuración del juego
const config = {
    // Tamaño del canvas
    width: 1860,
    height: 1358,

    // width: 1860/1.2,
    // height: 1056+40,

    // Contenedor del canvas (donde queremos poner el juego en el html)
    parent: 'contenedor',

    // Físicas del juego
    physics: {
        default: 'arcade',
    },

    // Escenas del juego
    scene: [
        Bootloader,
        ScenePlay,
        Dialogo,
        Pantallas,
        SceneManager
    ],
}

// Creamos el juego con la configuración
new Phaser.Game(config);