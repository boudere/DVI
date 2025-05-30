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

        // profundidad de los objetos
        this.BACKGROUND_DEPTH = 0;
        this.PERSONAJE_DEPTH = 1;
        this.CUADRADO_DIALOGO_DEPTH = 3;

        // musica de fondo
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
        this.opciones_dialogo_data = this.data_info_scene.get_json(this.data_info_scene.data_json.OpcionesDialogo);
        this.variables_dialogo_data = this.data_info_scene.get_json(this.data_info_scene.data_json.VariablesDialogo);

        this.scene_created();
    }

    _load_dialogo(dialogo) {
        const { width, height } = this.sys.game.canvas;

        this.animation_finished = false;

        if (this.animate) this._load_cuadrado_dialogo(width, height);
        else {
            if (this.cuadrado_dialogo) {this.cuadrado_dialogo.visible = true;}
            this._set_main_text();
        }
        this.total_animations++;

        this._load_background();

        if (this.animate) {
            this._load_personaje(width, height);
            this.total_animations++;
        } else if (this.persoanje) {
            this.persoanje.visible = true;
        }

        if (this.buttons) this.buttons.forEach(button => button.destroy());
        
        if ( this.dialogo_data_selected.opciones ) {
            this._load_buttons(width, height);
        }
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

        this._remove_events();
    }

    enter(scene_data) {
        let name = null;
        if (scene_data.name) { name = scene_data.name; }
        else { name = scene_data; }

        if ( !super.enter(name) ) { return; }
        
        this.play_music(this.PISO_MUSICA);

        this.dialogo_data_selected = this.dialogo_data[name];
        this.opciones_dialogo_data_selected = null;
        if (this.dialogo_data_selected && this.dialogo_data_selected.opciones) {
            this.opciones_dialogo_data_selected = this.opciones_dialogo_data[this.dialogo_data_selected.next_id];
        }
        
        this.animate = this.dialogo_data_selected.npc != this.npc;
        this.npc = this.dialogo_data_selected.npc;
        
        this.total_animations = 0;
        this.finished_animation = 0;
        this.buttons_index = 0;

        this._load_dialogo(name);
        
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
        if ( on_click.var_id || on_click.scene != 'dialogo') {
            if (on_click.var_id) {
                on_click.scene = 'afinidad_dialogo';
            }
            this.scene.get(SCENE_MANAGER).signal_click(on_click);
        }
        else {
            this.enter(on_click);
        }
    }

    _load_background() {
        if (this.background) {
            this.background.destroy();
        }
        
        let img = this.data_info_scene.get_img(DIALOGO_MANAGER, this.dialogo_data_selected.fondo);
        this.background = this.add.image(0, 0, img).setOrigin(0, 0);
        this.background.setDepth(this.BACKGROUND_DEPTH);
        
        let canvasHeight = this.scale.height;
        let imgHeight = this.background.height;
    
        // Calcular escala para que ocupe todo el canvas
        let scale = canvasHeight / imgHeight;
        this.background.setScale(scale);
    }

    _load_cuadrado_dialogo(width, height, animacion=true) {
        if (this.cuadrado_dialogo) {
            this.cuadrado_dialogo.destroy();
        }
        let img = this.data_info_scene.get_img(DIALOGO_MANAGER, this.CUADRADO_DIALOGO);
        this.cuadrado_dialogo = new CuadradoDialogo(this, width / 2, height - 150, img, this.dialogo_data_selected.texto, animacion);
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
        this.persoanje = new DialogoPersonaje(this, 0, height * 0.64, img, 1000);
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
        while (this.buttons_index <= 4 && this.opciones_dialogo_data_selected["texto_" + this.buttons_index]) {
            let button = new ButtonCuadradoDialogo(this, x, y, img, this.opciones_dialogo_data_selected["texto_" + this.buttons_index], this.opciones_dialogo_data_selected["opcion_" + this.buttons_index] , true);
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
            if (this.dialogo_data_selected.next_id != 'FIN' && !this.dialogo_data_selected.opciones) {
                this.enter(this.dialogo_data_selected.next_id);
            } else {
                let on_click = {
                    scene: this.dialogo_data_selected.next_scene_type,
                    name: this.dialogo_data_selected.next_scene_id,
                    var_id: this.dialogo_data_selected.var_id
                };
                
                this.scene.get(SCENE_MANAGER).signal_click(on_click);
            }
        }
    }
}

export default DialogoManager;
    