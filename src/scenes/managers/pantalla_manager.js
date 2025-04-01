import Managers from "/src/scenes/managers";
import PantallaPersoanjes from "/src/pantallas/game_objects/pantalla_personajes";

import { PANTALLA_MANAGER , DATA_INFO, SCENE_MANAGER } from "/src/data/scene_data.js";

// esta escena de momento solo lanza la escena de dialogo
class PantallaManager extends Managers {
    constructor() {
        super({ key: PANTALLA_MANAGER });

        this.offset_x = 0;
        this.offset_y = 0;

        this.can_move = false;
        this.animation_finnished = false;

        this.interactuables_animations = {};
        this.npcs_array = [];
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)

        this.data = this.data_info_scene.get_data_json();
        this.data_json = this.data.Json;

        this.pantallas_data = this.data_info_scene.get_json(this.data_json.Pantallas);

        this.scene_created();
    }

    _load_pantalla(pantalla) {
        this.pantalla_data = this.pantallas_data[pantalla];

        const { width, height } = this.sys.game.canvas;
        this._load_background(width, height);
        this._load_npcs();
        this._load_prota();
    }

    exit() {
        super.exit();

        this.background.visible = false;
        this.npcs_array.forEach((npc) => {
            npc.exit();
        });
        this.prota.exit();
    }

    enter(scene_data) {
        if ( !super.enter(scene_data) ) { return; }

        this._load_pantalla(scene_data)
        this.pause();
    }

    update() {
        super.update();
    }

    pause(){
        super.pause();

        this.prota.pause();
        this.npcs_array.forEach((npc) => {
            npc.pause();
        });
    }

    unpause(){
        super.unpause();

        this.prota.unpause();
        this.npcs_array.forEach((npc) => {
            npc.unpause();
        });
    }

    starting_animation() {
        this.pause();
    }

    finnish_animation() {
        this.unpause();
    }

    signal_click(on_click) {
        if (on_click.scene == 'pantalla') {
            this._load_pantalla(on_click.name);
        } else {
            this.scene.get(SCENE_MANAGER).signal_click(on_click);
        }
    }

    _load_background(width, height) {
        if (this.background) {
            this.background.destroy();
        }

        let img = this.data_info_scene.get_img(PANTALLA_MANAGER, this.pantalla_data.background)
        this.background = this.add.image(width / 2, height / 2, img);
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
}

export default PantallaManager;
