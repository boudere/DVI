import Managers from "/src/scenes/managers";
import CuadradoDialogo from "/src/dialogos/game_objects/sprite/cuadrado_dialogo.js";
import DialogoPersonaje from "/src/dialogos/game_objects/sprite/dialogo_personaje.js";

import { DIALOGO_MANAGER, DATA_INFO, SCENE_MANAGER } from "/src/data/scene_data.js";

// esta escena de momento solo lanza la escena de dialogo
class DialogoManager extends Managers {
    constructor() {
        super({ key: DIALOGO_MANAGER });

        this.CUADRADO_DIALOGO = 'cuadrado_dialogo';

        this.BACKGROUND_DEPTH = 0;
        this.PERSONAJE_DEPTH = 1;
        this.CUADRADO_DIALOGO_DEPTH = 3;
    }

    _reset_data() {
        this.cuadrado_dialogo = null;
        this.main_text = null;
        this.dialogo_data_selected = null;
        this.npc = '';
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)
        this.dialogo_data = this.data_info_scene.get_json(this.data_info_scene.data_json.Dialogos);

        this.scene_created();
    }

    _load_dialogo(dialogo) {
        const { width, height } = this.sys.game.canvas;

        this.animation_finished = false;

        if (this.animate) this._load_cuadrado_dialogo(width, height);
        else this._set_main_text();
        this.total_animations++;

        this._load_background();

        if (this.animate) {
            this._load_personaje(width, height);
            this.total_animations++;
        }
        
        // this._load_nombre_personaje();
        // this.total_animations++;
    }

    exit() {
        super.exit();
        if ( this.cuadrado_dialogo ) this.cuadrado_dialogo.visible = false;
    }

    enter(scene_data) {
        if ( !super.enter(scene_data) ) { return; }

        this.dialogo_data_selected = this.dialogo_data[scene_data];

        this.animate = this.dialogo_data_selected.npc != this.npc;
        this.npc = this.dialogo_data_selected.npc;

        this.total_animations = 0;
        this.finished_animation = 0;

        this._load_dialogo(scene_data);
        
        this.background.visible = true;
        if ( this.animate ) this.persoanje.enter(); 
        this._set_events();
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

    starting_animation() {
        this.animation_finished = false;
        this.pause();
    }

    finish_animation() {
        this.finished_animation++;
        if (this.finished_animation == 1 && this.animate) {
            this.cuadrado_dialogo.enter();
            return;
        }

        if (this.finished_animation != this.total_animations) { return; }

        if (this.dialogo_data_selected.opciones) {}

        this.animation_finished = true;
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
        this.background = this.add.image(0, 0, img).setOrigin(0, 0).setDepth(this.BACKGROUND_DEPTH);
    }

    _load_cuadrado_dialogo(width, height) {
        if (this.cuadrado_dialogo) {
            this.cuadrado_dialogo.destroy();
        }
        let img = this.data_info_scene.get_img(DIALOGO_MANAGER, this.CUADRADO_DIALOGO);
        this.cuadrado_dialogo = new CuadradoDialogo(this, width / 2, height - 150, img, this.dialogo_data_selected.texto, true);
        this.cuadrado_dialogo.setDepth(this.CUADRADO_DIALOGO_DEPTH);
    }

    _set_main_text() {
        this.cuadrado_dialogo.setText(this.dialogo_data_selected.texto);
    }

    _load_personaje(width, height) {
        if (this.dialogo_data_selected.npc == 'none') { return; }
        if (this.persoanje) {
            this.persoanje.destroy();
        }

        let name = this.dialogo_data_selected.npc + "_" + this.dialogo_data_selected.pose;
        let img = this.data_info_scene.get_img(DIALOGO_MANAGER, name);
        this.persoanje = new DialogoPersonaje(this, 0, height -  height/4, img, 1000);
        this.persoanje.setDepth(this.PERSONAJE_DEPTH);
    }

    _load_nombre_personaje() {
        if (this.dialogo_data_selected.personaje == 'none') { return; }
    }

    _set_events() {
        this.input.on('pointerup', this._mouse_up, this);
    }

    _mouse_up() {
        if (this.animation_finished && !this.dialogo_data_selected.opciones) {
            if (this.dialogo_data_selected.opcion_1 != 'FIN') {
                this.enter(this.dialogo_data_selected.opcion_1);
            } else {   
                this.scene.get(SCENE_MANAGER).signal_click(on_click);
            }
        } else {
        }
    }
}

export default DialogoManager;
    