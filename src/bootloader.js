import { SCENE_BOOTLOADER, SCENE_PLAY } from "/src/data/scene_data.ts";

// la idea es q este se encarge de agregar cada escena y cargue los assets correspondientes 
// ( de momento solo carga el dialogo )
class Bootloader extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_BOOTLOADER, active: true });
    }

    preload() {// Diccionario que mapea cadenas de texto a funciones
        setTimeout(() => {
        this.scene_play();
        }, 500);
    }

    scene_play() {
        this.scene.start(SCENE_PLAY);
        this.scene.stop(SCENE_BOOTLOADER); 
    }
}

export default Bootloader;