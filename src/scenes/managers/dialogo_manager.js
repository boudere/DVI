import Managers from "/src/scenes/managers";
import DialogoGameObjects from "/src/dialogos/game_objects/dialogo_game_objects.js";
import DialogoMainText from "/src/dialogos/game_objects/text/dialogo_main_text.js";

import { DIALOGO_MANAGER, DATA_INFO, SCENE_MANAGER } from "/src/data/scene_data.js";

// esta escena de momento solo lanza la escena de dialogo
class DialogoManager extends Managers {
    constructor() {
        super({ key: DIALOGO_MANAGER });

        this.CUADRADO_DIALOGO = 'cuadrado_dialogo';
    }

    _reset_data() {
        this.cuadrado_dialogo = null;
        this.main_text = null;
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)

        this.scene_created();
    }

    _load_dialogo(dialogo) {
        const { width, height } = this.sys.game.canvas;

        this._load_cuadrado_dialogo(width, height);
        this._load_main_text(width, height);
    }

    exit() {
        super.exit();
        if ( this.cuadrado_dialogo ) this.cuadrado_dialogo.visible = false;
    }

    enter(scene_data) {
        if ( !super.enter(scene_data) ) { return; }

        this._load_dialogo(scene_data);
        this.cuadrado_dialogo.enter();

        this.pause();
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
        if (this.cuadrado_dialogo) {
            console.log("destroy cuadrado_dialogo");
            this.cuadrado_dialogo.destroy();
        }
        let img = this.data_info_scene.get_img(DIALOGO_MANAGER, this.CUADRADO_DIALOGO);
        this.cuadrado_dialogo = new DialogoGameObjects(this, width / 2, height - 150, img, 1000);
    }

    _load_main_text(width, height) { 
        this.main_text = new DialogoMainText(this, width / 2, height - 150, 1000, "Hola", 1000);
    }
}

export default DialogoManager;
