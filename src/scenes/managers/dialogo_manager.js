import Managers from "/src/scenes/managers";
import CuadradoDialogo from "/src/dialogos/game_objects/cuadrado_dialogo.js";
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
        this.dialogo_data_selected = null;
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)
        this.dialogo_data = this.data_info_scene.get_json(this.data_info_scene.data_json.Dialogos);

        this.scene_created();
    }

    _load_dialogo(dialogo) {
        const { width, height } = this.sys.game.canvas;

        this._load_cuadrado_dialogo(width, height);
        this.total_animations++;

        this._load_background();

        this._load_personaje();
        this.total_animations++;
        this._load_nombre_personaje();
        this.total_animations++;
    }

    exit() {
        super.exit();
        if ( this.cuadrado_dialogo ) this.cuadrado_dialogo.visible = false;
    }

    enter(scene_data) {
        if ( !super.enter(scene_data) ) { return; }

        this.dialogo_data_selected = this.dialogo_data[scene_data];

        this.total_animations = 0;
        this.finished_animation = 0;

        this._load_dialogo(scene_data);
        this.cuadrado_dialogo.enter();
        this.background.visible = true;

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

    finish_animation() {
        this.finished_animation++;
        if (this.finished_animation != this.total_animations) { return; }

        this.animation_finished = false;
        this.unpause();
    }

    signal_click(on_click) {
        if (on_click.scene == 'dialogo') {
            this._load_dialogo(on_click.name);
        } else {
            this.scene.get(SCENE_MANAGER).signal_click(on_click);
        }
    }

    _load_background() {
        if (this.background) {
            this.background.destroy();
        }
        
        let img = this.data_info_scene.get_img(DIALOGO_MANAGER, this.dialogo_data_selected.fondo);
        this.background = this.add.image(0, 0, img).setOrigin(0, 0);
    }

    _load_cuadrado_dialogo(width, height) {
        if (this.cuadrado_dialogo) {
            this.cuadrado_dialogo.destroy();
        }
        let img = this.data_info_scene.get_img(DIALOGO_MANAGER, this.CUADRADO_DIALOGO);
        this.cuadrado_dialogo = new CuadradoDialogo(this, width / 2, height - 150, img, 1000, this.dialogo_data_selected.texto);
    }

    _load_personaje() {
        if (this.dialogo_data_selected.personaje == 'none') { return; }
    }

    _load_nombre_personaje() {
        if (this.dialogo_data_selected.personaje == 'none') { return; }
    }
}

export default DialogoManager;
