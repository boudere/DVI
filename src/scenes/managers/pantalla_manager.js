import Managers from "/src/scenes/managers";
import PantallaPersoanjes from "/src/pantallas/game_objects/pantalla_personajes";
import PantallaPuertas from "/src/pantallas/game_objects/pantalla_puertas";
import PantallaObjetos from "/src/pantallas/game_objects/pantalla_objetos";

import { PANTALLA_MANAGER , DATA_INFO, SCENE_MANAGER } from "/src/data/scene_data.js";

// esta escena de momento solo lanza la escena de dialogo
class PantallaManager extends Managers {
    constructor() {
        super({ key: PANTALLA_MANAGER });

        this.offset_x = 0;
        this.offset_y = 0;

        this.can_move = false;
        this.animation_finished = false;

        this.interactuables_animations = {};
        this.npcs_array = [];

        this.PISO_MUSICA = 'tema_inicial';

    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)

        this.data = this.data_info_scene.get_data_json();
        this.data_json = this.data.Json;

        this.pantallas_data = this.data_info_scene.get_json(this.data_json.Pantallas);
        
        this.musica = this.sound.add(this.data_info_scene.get_musica(this.PISO_MUSICA), {
            loop: true,
            volume: 0.1
        });

        this.input.on('pointermove', this._handle_pointer_move, this);

        this.scene_created();
    }

    scroll(offsetX, offsetY) {
        let new_offset_x = this.offset_x + offsetX;
        let new_offset_y = this.offset_y + offsetY;
    
        new_offset_x = Phaser.Math.Clamp(new_offset_x, - this.scroll_limit_x, this.scroll_limit_x);
        new_offset_y = Phaser.Math.Clamp(new_offset_y, - this.scroll_limit_y, this.scroll_limit_y);
    
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
    
    

    _load_pantalla(pantalla) {
        this.pantalla_data = this.pantallas_data[pantalla];

        const { width, height } = this.sys.game.canvas;

        this._load_background();
        this._load_npcs();

        this.npcs_array.forEach((npc) => {
            this.total_animations++;
        });

        this._load_prota();
        this.total_animations++;

        this._load_puertas();
        this._load_objetos();
    }

    exit() {
        super.exit();

        if (this.background) this.background.visible = false;
        this.npcs_array.forEach((npc) => {
            npc.exit();
        });
        if (this.prota) this.prota.exit();
        this.musica.stop();
    }

    enter(scene_data) {
        if (!super.enter(scene_data)) return;
    
        if (!this.musica.isPlaying) this.musica.play();
    
        this.offset_x = 0;
        this.offset_y = 0;

        this.animations_finished = 0;
        this.total_animations = 0;
    
        this.edge_margin = 200;
        this.scroll_speed = 1;
    
        this._load_pantalla(scene_data);

        this.scroll_limit_x = (this.background.displayWidth - this.sys.game.canvas.width) / 2;
        this.scroll_limit_y = (this.background.displayHeight - this.sys.game.canvas.height) / 2;

        // Centrado inicial
        this.scroll(-this.scroll_limit_x, -this.scroll_limit_y);

        this.offset_x = 0;
        this.offset_y = 0;
    
        this.pause();
    }
    

    _update(time, delta) {
        super._update();
        if (this.can_scroll) {
            this.scroll(this.movement_x * delta, this.movement_y * delta);
        }
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
        this.animation_finished = false;
        this.unpause();
    }

    signal_click(on_click) {
        if (on_click.scene == 'pantalla') {
            this.enter(on_click.name);
        } else {
            this.scene.get(SCENE_MANAGER).signal_click(on_click);
        }
    }

    _load_background() {
        if (this.background) {
            this.background.destroy();
        }

        let img = this.data_info_scene.get_img(PANTALLA_MANAGER, this.pantalla_data.background)
        this.background = this.add.image(0, 0, img).setOrigin(0, 0);
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
            this.npcs_array[this.npcs_array.length - 1].enter();
        });
    }

    _load_prota() {
        this.prota = this._load_personaje(this.pantalla_data.prota)
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
            let puerta = new PantallaPuertas(this, pos_x, pos_y, img, on_click, nombre);
            puerta.enter();

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
            objeto.enter();

            this.objetos.push(objeto);
        });
    }

    _handle_pointer_move(pointer) {
        const margin = this.edge_margin;
        const maxSpeed = this.scroll_speed;
    
        this.movement_x = 0;
        this.movement_y = 0;
    
        // Horizontal
        if (pointer.x < margin) {
            const factor = (margin - pointer.x) / margin;
            this.movement_x = maxSpeed * factor;
        } else if (pointer.x > this.sys.game.config.width - margin) {
            const factor = (pointer.x - (this.sys.game.config.width - margin)) / margin;
            this.movement_x = -maxSpeed * factor;
        }
    
        // Vertical
        if (pointer.y < margin) {
            const factor = (margin - pointer.y) / margin;
            this.movement_y = maxSpeed * factor;
        } else if (pointer.y > this.sys.game.config.height - margin) {
            const factor = (pointer.y - (this.sys.game.config.height - margin)) / margin;
            this.movement_y = -maxSpeed * factor;
        }
    
        this.can_scroll = (this.movement_x !== 0 || this.movement_y !== 0);
    }
}

export default PantallaManager;
