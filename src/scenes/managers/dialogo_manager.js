import Managers from "/src/scenes/managers";
import CuadradoDialogo from "/src/dialogos/game_objects/sprite/cuadrado_dialogo.js";
import ButtonCuadradoDialogo from "/src/dialogos/game_objects/sprite/button_cuadrado_dialogo.js";
import DialogoPersonaje from "/src/dialogos/game_objects/sprite/dialogo_personaje.js";

import { DIALOGO_MANAGER, DATA_INFO, SCENE_MANAGER } from "/src/data/scene_data.js";

// esta escena de momento solo lanza la escena de dialogo
class DialogoManager extends Managers {
    constructor() {
        super({ key: DIALOGO_MANAGER });

        this.CUADRADO_DIALOGO = 'cuadrado_dialogo';
        this.BUTTON_CUADRADO_DIALOGO = 'boton_dialogo';

        this.BACKGROUND_DEPTH = 0;
        this.PERSONAJE_DEPTH = 1;
        this.CUADRADO_DIALOGO_DEPTH = 3;
        this.PISO_MUSICA = 'tema_inicial';
    }

    _reset_data() {
        this.cuadrado_dialogo = null;
        this.main_text = null;
        this.dialogo_data_selected = null;
        this.npc = '';
        this.buttons_index = 0;
        this.buttons = [];
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)
        this.dialogo_data = this.data_info_scene.get_json(this.data_info_scene.data_json.Dialogos);

        this.musica = this.sound.add(this.data_info_scene.get_musica(this.PISO_MUSICA), {
            loop: true,
            volume: 0.1
        });

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

        if (this.buttons) this.buttons.forEach(button => button.destroy());
        
        if ( this.dialogo_data_selected.opciones ) {
            this._load_buttons(width, height);
        }
        
        // this._load_nombre_personaje();
        // this.total_animations++;
    }

    exit() {
        super.exit();

        if ( this.cuadrado_dialogo ) {
            this.cuadrado_dialogo.visible = false;
            this.cuadrado_dialogo.main_text.visible = false;
        }
        if ( this.persoanje ) {
            this.persoanje.visible = false;
        }
        if ( this.background ) {
            this.background.visible = false;
        }

        this.musica.stop(); 
        this._remove_events();
    }

    enter(scene_data) {
        if ( !super.enter(scene_data) ) { return; }
        
        if (!this.musica.isPlaying ) this.musica.play();

        this.dialogo_data_selected = this.dialogo_data[scene_data];
        
        this.animate = this.dialogo_data_selected.npc != this.npc;
        this.npc = this.dialogo_data_selected.npc;
        
        this.total_animations = 0;
        this.finished_animation = 0;
        this.buttons_index = 0;

        this._load_dialogo(scene_data);
        
        this.background.visible = true;
        if ( this.animate && this.persoanje ) this.persoanje.enter(); 
        this._set_events();
        this.pause();
    }

    _update() {
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

        if (this.dialogo_data_selected.opciones &&  this.buttons_index < this.buttons.length) {
            this.buttons[this.buttons_index].enter();
            this.buttons_index++;
            return;
        }

        if (this.finished_animation != this.total_animations) { return; }

        this.animation_finished = true;

        if (this.dialogo_data_selected.opciones) {
            this.buttons.forEach(button => button.unpause());
        }

        this.unpause();
    }

    signal_click(on_click) {
        if (on_click.scene == 'dialogo') {
            this.enter(on_click.name);
        } else {
            this.scene.get(SCENE_MANAGER).signal_click(on_click);
        }
    }

    _load_background() {
        if (this.background) {
            this.background.destroy();
        }
        
        let img = this.data_info_scene.get_img(DIALOGO_MANAGER, this.dialogo_data_selected.fondo);
        this.background = this.add.image(0, 0, img).setOrigin(0, 0)
        this.background.setDepth(this.BACKGROUND_DEPTH);
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

    _load_buttons(width, height) {
        this.buttons = [];

        let img = this.data_info_scene.get_img(DIALOGO_MANAGER, this.BUTTON_CUADRADO_DIALOGO);
        let x = this.cuadrado_dialogo.x + (this.cuadrado_dialogo.width / 2 * this.cuadrado_dialogo.SCALE);
        let y = this.cuadrado_dialogo.y - (this.cuadrado_dialogo.height / 2 * this.cuadrado_dialogo.SCALE);
        this.buttons_index = 1;
        while (this.buttons_index <= 3 && this.dialogo_data_selected["texto_" + this.buttons_index]) {
            let button = new ButtonCuadradoDialogo(this, x, y, img, this.dialogo_data_selected["texto_" + this.buttons_index], this.dialogo_data_selected["opcion_" + this.buttons_index] , true);
            button.setDepth(this.CUADRADO_DIALOGO_DEPTH + 1);

            this.buttons_index++;
            y -= button.height;
            this.buttons.push(button);

            this.total_animations++;
        }
        this.buttons_index = 0;
    }

    _set_events() {
        this.input.on('pointerup', this._mouse_up, this);
    }
    _remove_events() {
        this.input.off('pointerup', this._mouse_up, this);
    }

    _mouse_up() {
        if (this.animation_finished && !this.dialogo_data_selected.opciones) {
            if (this.dialogo_data_selected.opcion_1 != 'FIN') {
                this.enter(this.dialogo_data_selected.opcion_1);
            } else {  
                let on_click = {
                    scene: this.dialogo_data_selected.texto_1,
                    name: this.dialogo_data_selected.opcion_2
                };
                
                this.scene.get(SCENE_MANAGER).signal_click(on_click);
            }
        }
    }
}

export default DialogoManager;
    