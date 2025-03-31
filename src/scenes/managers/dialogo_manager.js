import Managers from "/src/scenes/managers";
import DialogoGameObjects from "/src/dialogos/game_objects/dialogo_game_objects";

import { DIALOGO_MANAGER, DATA_INFO, SCENE_MANAGER } from "/src/data/scene_data.js";

// esta escena de momento solo lanza la escena de dialogo
class DialogoManager extends Managers {
    constructor() {
        super({ key: DIALOGO_MANAGER });

        this.CUADRADO_DIALOGO = 'cuadrado_dialogo';
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)
        this._load_dialogo(0);

        this.scene_created();
    }

    _load_dialogo(dialogo) {
        const { width, height } = this.sys.game.canvas;

        this._load_cuadrado_dialogo(width, height);
    }

    exit() {
        super.exit();

        this.cuadrado_dialogo.visible = false;
    }

    enter(scene_data) {
        if ( !super.enter(scene_data) ) { return; }

        this.cuadrado_dialogo.enter();

        this._tween_cuadrado_dialogo();
    }

    update() {
        super.update();
    }

    pause(){
        super.pause();
    }

    unpause(){
        super.unpause();
    }

    startting_animation() {
        this.pause();
    }

    finnish_animation() {
        this.unpause();
    }

    signal_click(on_click) {
        if (on_click.scene == 'dialogo') {
            this._load_dialogo(on_click.name);
        } else {
            this.scene.get(SCENE_MANAGER).signal_click(on_click);
        }
    }

    _load_cuadrado_dialogo(width, height) {
        let img = this.data_info_scene.get_img(DIALOGO_MANAGER, this.CUADRADO_DIALOGO);
        this.cuadrado_dialogo = new DialogoGameObjects(this, width / 2, height - 150, img, 1000);
        // this.cuadrado_dialogo = this.add.image(width / 2, height - 150, img);
    }

    _tween_cuadrado_dialogo() {
        // this.cuadrado_dialogo.scaleX = 0;
        // this.cuadrado_dialogo.scaleY = 0;
        // this.cuadrado_dialogo.alpha = 0;

        // this.tweens.add({
        //     targets: this.cuadrado_dialogo,
        //     scaleX: 1.2,
        //     scaleY: 1.2,
        //     alpha: 1,
        //     duration: 1000,
        //     ease: 'Power2',
        //     onComplete: () => {
        //         console.log("Animation complete");
        //     }
        // });
    }

    _load_main_text(width, height) {
        this.main_text = this.add.text(width / 2, height - 150, "Hola", {});
    }
}

export default DialogoManager;
