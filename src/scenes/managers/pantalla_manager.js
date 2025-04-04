import Managers from "/src/scenes/managers";
import PantallaPersoanjes from "/src/pantallas/game_objects/pantalla_personajes";
import PantallaPuertas from "/src/pantallas/game_objects/pantalla_puertas";
import PantallaObjetos from "/src/pantallas/game_objects/pantalla_objetos";

import { PANTALLA_MANAGER , DATA_INFO, SCENE_MANAGER } from "/src/data/scene_data.js";

// esta escena de momento solo lanza la escena de dialogo
class PantallaManager extends Managers {
    constructor() {
        super({ key: PANTALLA_MANAGER });
        this.PISO_MUSICA = 'tema_inicial';

        this.BACKGROUND_DEPTH = 0;
        this.PUERTAS_DEPTH = 1;
        this.OBJETOS_DEPTH = 1;
        this.NPCS_DEPTH = 2;
        this.PROTA_DEPTH = 3;

        this.MUSIC_VOLUME = 0.1;
        this.MUSIC_LOOP = true;

        this._reset_variables();

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
        
        this.musica = this.sound.add(this.data_info_scene.get_musica(this.PISO_MUSICA), {
            loop: this.MUSIC_LOOP,
            volume: this.MUSIC_VOLUME
        });

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
    
        // Aplicar desplazamiento horizontal
        if (realOffsetX !== 0) {
            if (this.background) this.background.x += realOffsetX;
            if (this.prota) this.prota.x += realOffsetX;
            this.npcs_array.forEach((npc) => npc.x += realOffsetX);
            if (this.puertas) this.puertas.forEach((puerta) => puerta.x += realOffsetX);
            if (this.objetos) this.objetos.forEach((objeto) => objeto.x += realOffsetX);
        }
    
        // Aplicar desplazamiento vertical
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
        this.musica.stop();
    }

    // entra en la escena y carga los objetos de la escena
    enter(scene_data) {
        if (!super.enter(scene_data)) return;
    
        if (!this.musica.isPlaying) this.musica.play();

        this._reset_variables();
        
    
        this._load_pantalla(scene_data);

        this.move_limit_x = (this.background.displayWidth - this.sys.game.canvas.width) / 2;
        this.move_limit_y = (this.background.displayHeight - this.sys.game.canvas.height) / 2;

        // Centrado inicial
        this.animation_finished = true;
        this.move(-this.move_limit_x, -this.move_limit_y);
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
        let img = this.data_info_scene.get_img(PANTALLA_MANAGER, this.pantalla_data.background)
        this.background = this.add.image(0, 0, img).setOrigin(0, 0)
        this.background.setDepth(this.BACKGROUND_DEPTH);
    }
    _load_npcs() {
        if (this.npcs_array.length > 0) {
            this.npcs_array.forEach((npc) => {
                npc.destroy();
            });
        }
        this.npcs_array = [];
        let pantalla_data_npcs = this.pantalla_data.npcs;
        
        Object.keys(pantalla_data_npcs).forEach((key) => {
            this.npcs_array.push(this._load_personaje(pantalla_data_npcs[key]));
            this.npcs_array[this.npcs_array.length - 1].setDepth(this.NPCS_DEPTH);
            this.npcs_array[this.npcs_array.length - 1].enter();
        });
    }

    _load_prota() {
        this.prota = this._load_personaje(this.pantalla_data.prota);
        this.prota.setDepth(this.PROTA_DEPTH);
        this.prota.enter();
    }

    _load_personaje(datos) {
        let nombre = datos.nombre;
        let pose = datos.pose;
        let x = datos.pos_x;
        let y = datos.pos_y;
        let size = datos.size;
        let delay = datos.delay;
        let animation = datos.animation;
        let on_click = datos.on_click;

        let nombre_img = this.data_info_scene.get_img(PANTALLA_MANAGER, nombre + "_" + pose);
        this.total_animations++;

        return new PantallaPersoanjes(this, x, y, nombre_img, size, delay, animation, on_click, nombre);
    }

    _load_puertas() {
        if (this.puertas) {
            this.puertas.forEach((puerta) => {
                puerta.destroy();
            });
        }      
        let data_puertas = this.pantalla_data.puertas;

        this.puertas = [];
        Object.keys(data_puertas).forEach((key) => {
            let nombre = data_puertas[key].nombre;
            let pos_x = data_puertas[key].pos_x;
            let pos_y = data_puertas[key].pos_y;
            let on_click = data_puertas[key].on_click;

            let img = this.data_info_scene.get_img(PANTALLA_MANAGER, key);
            let puerta = new PantallaPuertas(this, pos_x, pos_y, img, on_click, nombre).setDepth(this.PUERTAS_DEPTH)
            puerta.enter();

            this.total_animations++;

            this.puertas.push(puerta);
        });
    }

    _load_objetos() {
        if (this.objetos) {
            this.objetos.forEach((objeto) => {
                objeto.destroy();
            });
        }
        let data_objetos = this.pantalla_data.objetos;
        
        this.objetos = [];
        Object.keys(data_objetos).forEach((key) => {
            let nombre = data_objetos[key].nombre;
            let pos_x = data_objetos[key].pos_x;
            let pos_y = data_objetos[key].pos_y;
            let on_click = data_objetos[key].on_click;

            let img = this.data_info_scene.get_img(PANTALLA_MANAGER, key);
            let objeto = new PantallaObjetos(this, pos_x, pos_y, img, on_click, nombre);
            objeto.setDepth(this.OBJETOS_DEPTH);
            objeto.enter();

            this.objetos.push(objeto);
        });
    }
}

export default PantallaManager;
