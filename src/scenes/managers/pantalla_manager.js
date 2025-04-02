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
            volume: 0.8
        });

        this.scene_created();
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
        if ( !super.enter(scene_data) ) { return; }
        
        this.animations_finished = 0;
        this.total_animations = 0;

        this.musica.play();

        this._load_pantalla(scene_data)
        this.pause();
    }

    update() {
        super.update();
    }

    pause(){
        super.pause();

        if (this.prota) this.prota.pause();
        this.npcs_array.forEach((npc) => {
            npc.pause();
        });

        this.musica.pause();
    }

    unpause(){
        super.unpause();

        if (this.prota) this.prota.unpause();
        this.npcs_array.forEach((npc) => {
            npc.unpause();
        });

        this.musica.unpause();
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
            this._load_pantalla(on_click.name);
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
}

export default PantallaManager;
