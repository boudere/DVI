import Dialogo from '/src/scenes/dialogo.js';
import Bootloader from '/src/bootloader.js'; // Importamos el Bootloader
import SceneManager from '/src/scenes/scene_manager.js'; // Importamos la escena ScenePlay
import ScenePlay from '/src/scenes/scene_play.js'; // Importamos la escena ScenePlay
import Pantallas from '/src/scenes/pantallas.js'; // Importamos la escena Pantallas
import Phaser from "phaser";

// Configuración del juego
const config = {
    // Tamaño del canvas
    width: 1820,
    height: 1358,
    
    // Contenedor del canvas (donde queremos poner el juego en el html)
    parent: 'juego',

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

    scale: {
        mode: Phaser.Scale.EXACT_FIT,  // Ajusta el canvas al contenedor sin distorsión
        autoCenter: Phaser.Scale.CENTER_BOTH  // Centra el juego en la pantalla
    }
}

// Creamos el juego con la configuración
new Phaser.Game(config);