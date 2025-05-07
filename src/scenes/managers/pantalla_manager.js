import Managers from "/src/scenes/managers";
import PantallaPersoanjes from "/src/pantallas/game_objects/pantalla_personajes";
import CreadorPantalla from "/src/pantallas/creador_pantalla.js";

import { PANTALLA_MANAGER , DATA_INFO, SCENE_MANAGER } from "/src/data/scene_data.js";

// esta escena de momento solo lanza la escena de dialogo
class PantallaManager extends Managers {
    constructor() {
        super({ key: PANTALLA_MANAGER });
        this.NOMBRE_MUSICA = 'tema_inicial';

        // profundidad de los objetos (para q todo se vea como se tiene q ver)
        this.BACKGROUND_DEPTH = 0;
        this.PUERTAS_DEPTH = 1;
        this.OBJETOS_DEPTH = 1;
        this.NPCS_DEPTH = 2;
        this.PROTA_DEPTH = 3;

        this._reset_variables();

        // datos de la escena
        this.interactuables_animations = {};
        this.npcs_array = [];
        this.puertas = [];
        this.objetos = [];
    }

    _reset_variables() {
        this.offset_x = 0;
        this.offset_y = 0;

        this.can_move = false;
        this.animation_finished = false;
        this.total_animations = 0;
        this.animations_finished = 0;

        this.move_limit_x = 0;
        this.move_limit_y = 0;
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)

        this.data = this.data_info_scene.get_data_json();
        this.data_json = this.data.Json;

        this.pantallas_data = this.data_info_scene.get_json(this.data_json.Pantallas);
        this.personajes_data = this.data_info_scene.get_json(this.data_json.PersonajesInfo);

        // avisa q se ha creado la escena
        this.scene_created();
    }


    // mueve el fondo y los objetos de la escena, etc.
    move(offsetX, offsetY) {
        if (!this.animation_finished) return;
        let new_offset_x = this.offset_x + offsetX;
        let new_offset_y = this.offset_y + offsetY;
    
        new_offset_x = Phaser.Math.Clamp(new_offset_x, - this.move_limit_x, this.move_limit_x);
        new_offset_y = Phaser.Math.Clamp(new_offset_y, - this.move_limit_y, this.move_limit_y);
    
        const realOffsetX = new_offset_x - this.offset_x;
        const realOffsetY = new_offset_y - this.offset_y;
    
        this.offset_x = new_offset_x;
        this.offset_y = new_offset_y;
    
        // aplicar desplazamiento horizontal
        if (realOffsetX !== 0) {
            if (this.background) this.background.x += realOffsetX;
            if (this.prota) this.prota.x += realOffsetX;
            this.npcs_array.forEach((npc) => npc.x += realOffsetX);
            if (this.puertas) this.puertas.forEach((puerta) => puerta.x += realOffsetX);
            if (this.objetos) this.objetos.forEach((objeto) => objeto.x += realOffsetX);
        }
    
        // aplicar desplazamiento vertical
        if (realOffsetY !== 0) {
            if (this.background) this.background.y += realOffsetY;
            if (this.prota) this.prota.y += realOffsetY;
            this.npcs_array.forEach((npc) => npc.y += realOffsetY);
            if (this.puertas) this.puertas.forEach((puerta) => puerta.y += realOffsetY);
            if (this.objetos) this.objetos.forEach((objeto) => objeto.y += realOffsetY);
        }
    }
    
    // carga la pantalla y los objetos de la escena
    _load_pantalla(pantalla) {
        this.pantalla_data = this.pantallas_data[pantalla];

        this.creador_pantalla = new CreadorPantalla(this, this.pantalla_data);

        const { width, height } = this.sys.game.canvas;

        this._load_background();
        this._load_npcs();

        this._load_prota();

        this._load_puertas();
        this._load_objetos();
    }

    // destruye la escena y los objetos de la escena o los oculta
    exit() {
        super.exit();

        if (this.prota) this.prota.exit();
        if (this.background) this.background.destroy();
        this.npcs_array.forEach((npc) => {
            npc.exit();
        });
        this.puertas.forEach((puerta) => {
            puerta.exit();
        });
        this.objetos.forEach((objeto) => {
            objeto.exit();
        });
    }

    // entra en la escena y carga los objetos de la escena
    enter(scene_data) {
        let name = null;
        if (scene_data.name) { name = scene_data.name; }
        else { name = scene_data; }

        if (!super.enter(name)) return;

        this.play_music(this.NOMBRE_MUSICA);
        this._reset_variables();
    
        this._load_pantalla(name);

        if (this.background.displayWidth > this.sys.game.canvas.width) {
            this.move_limit_x = (this.background.displayWidth - this.sys.game.canvas.width) / 2;
            this.move_limit_y = (this.background.displayHeight - this.sys.game.canvas.height) / 2;
            
            // Centrado inicial
            this.animation_finished = true;
            this.move(-this.move_limit_x, -this.move_limit_y);
        }
        else {
            this.move_limit_x = (this.background.displayWidth - this.sys.game.canvas.width) / 2;
            this.move_limit_y = (this.background.displayHeight - this.sys.game.canvas.height) / 2;

            // Centrado inicial
            this.animation_finished = true;
            this.move(-this.move_limit_x, -this.move_limit_y);
        }
        this.animation_finished = false;

        this.offset_x = 0;
        this.offset_y = 0;
    
        this.pause();
    }
    

    _update(time, delta) {
        super._update();
    }

    pause(){
        super.pause();

        if (this.prota) this.prota.pause();
        this.npcs_array.forEach((npc) => {
            npc.pause();
        });
    }

    unpause(){
        super.unpause();

        if (this.prota) this.prota.unpause();
        this.npcs_array.forEach((npc) => {
            npc.unpause();
        });
        this.puertas.forEach((puerta) => {
            puerta.unpause();
        });
        this.objetos.forEach((objeto) => {
            objeto.unpause();
        });
    }

    starting_animation() {
        this.pause();
    }

    finish_animation() {
        this.animations_finished++;
        if (this.animations_finished != this.total_animations) { return; }
        this.animation_finished = true;
        this.unpause();
    }

    signal_click(on_click) {
        if (on_click.scene == 'pantalla') {
            this.exit();
            this.enter(on_click.name);
        } else {
            this.scene.get(SCENE_MANAGER).signal_click(on_click);
        }
    }

    _load_background() {
        this.background = this.creador_pantalla.cargar_fondo();
        this.background.setDepth(this.BACKGROUND_DEPTH);
        this.background.setSize(1.2, 1.2);
    }
    
    _load_npcs() {
        if (this.npcs_array.length > 0) {
            this.npcs_array.forEach((npc) => {
                npc.destroy();
            });
        }
        this.npcs_array = [];
        if (!this.pantalla_data.npcs) return;
        let pantalla_data_npcs = this.pantalla_data.npcs;
        
        Object.keys(pantalla_data_npcs).forEach((key) => {
            this.npcs_array.push(this._load_personaje(pantalla_data_npcs[key]));
            this.npcs_array[this.npcs_array.length - 1].setDepth(this.NPCS_DEPTH);
            this.npcs_array[this.npcs_array.length - 1].enter();
        });
    }

    _load_prota() {
        if (this.pantalla_data.prota == null) return;
        this.prota = this._load_personaje(this.pantalla_data.prota);
        this.prota.setDepth(this.PROTA_DEPTH);
        this.prota.enter();
    }

    _load_personaje(datos) {
        this.total_animations++;
        return new PantallaPersoanjes(this, datos, this.personajes_data);
    }

    _load_puertas() {
        if (this.puertas) {
            this.puertas.forEach((puerta) => {
                puerta.destroy();
            });
        }

        this.puertas = this.creador_pantalla.cargar_puertas(this.scale);
        this.puertas.forEach((puerta) => {
            puerta.setDepth(this.PUERTAS_DEPTH);
            puerta.enter();
            this.total_animations++;
        });
    }

    _load_objetos() {
        if (this.objetos) {
            this.objetos.forEach((objeto) => {
                objeto.destroy();
            });
        }
        
        this.objetos = this.creador_pantalla.cargar_objetos();
        this.objetos.forEach((objeto) => {
            objeto.setDepth(this.OBJETOS_DEPTH);
            objeto.enter();
            this.total_animations++;
        });
    }
}

export default PantallaManager;
