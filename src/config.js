import SceneManager from '/src/scenes/managers/scene_manager.js'; // Importamos la escena ScenePlay
import Managers from '/src/scenes/managers.js'; // Importamos la escena ScenePlay
import DataInfo from '/src/scenes/data_info.js'; // Importamos la escena ScenePlay
import Phaser from "phaser";

// Configuración del juego
const config = {
    // Tamaño del canvas
    width: 1820,
    height: 1358,
    
    // Contenedor del canvas (donde queremos poner el juego en el html)
    parent: 'juego',

    // Físicas del juego
    physics: { default: 'arcade', arcade: { gravity: { y: 600 }, debug: false } },

    // Escenas del juego
    scene: [
        DataInfo,
        Managers,
        SceneManager
    ],

    scale: {
        mode: Phaser.Scale.EXACT_FIT,  // Ajusta el canvas al contenedor sin distorsión
        autoCenter: Phaser.Scale.CENTER_BOTH  // Centra el juego en la pantalla
    }
}

// Creamos el juego con la configuración
new Phaser.Game(config);