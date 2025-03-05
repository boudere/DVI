import { SCENE_DIALOGO, SCENE_MANAGER } from '/src/data/scene_data.ts';
import { EVENT_TEXTO_DIALOGO, EVENT_SKIP_TEXTO_DIALOGO, EVENT_NEXT_TEXTO_DIALOGO, EVENT_START_PANTALLA } from '/src/data/events_data.ts';

import CuadroDialogo from "/src/gameObjects/dialogos/cuadrado_dialogo.js";
import BotonDialogo from "/src/gameObjects/dialogos/boton_dialogo.js";
import Personaje from "/src/gameObjects/dialogos/personaje_dialogo.js";
import BackgroundDialogo from '/src/gameObjects/dialogos/background_dialogo.js';
import AssetsData from '/src/data/assets_data.js';

class Dialogo extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_DIALOGO, active: false });

        this.assets_data = new AssetsData(this);
    }

    init(texto) {
        // inicializar variables
        this.assets_data.recargar_datos();

        this.texto_finalizado = false;
        this.nombre_dialogo = texto;
        this.dialogo_data = this.cache.json.get(this.assets_data.get_json_dialogo()).Dialogo;
        this.skip_animation = false;
        this.can_be_clicked = false;
    }

    preload() {
        // cargar los assets
        this.assets_data.cargar_img_dialogos();
        this.assets_data.cargar_personajes_dialogos();
        this.assets_data.cargar_backgrounds_dialogos();

        setTimeout(() => {
            this.can_be_clicked = true;
        }, 100);
    }

    create() {
        // Obtener dimensiones del juego
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;

        this.background = new BackgroundDialogo(this, 0, 0, this.assets_data.get_background_dialogos(this.dialogo_data[this.nombre_dialogo]['fondo']));

        // Cuadro de diálogo
        this.cuadro_dialogo = new CuadroDialogo(this, this.width / 2, this.height - 150, this.assets_data.get_cuadrado_dialogo(), this.dialogo_data[this.nombre_dialogo]['texto'], false);
        
        // Capturar tecla de espacio
        this.cursor = this.input.keyboard.createCursorKeys();

        // añade los botones, en caso de que haya opciones
        this.añadir_botones();

        let personaje_x = this.cuadro_dialogo.x - this.cuadro_dialogo.width / 4 - 50;
        let personaje_y = this.cuadro_dialogo.y - this.cuadro_dialogo.height / 2;
        let img_name = this.assets_data.get_personaje_dialogos(this.dialogo_data[this.nombre_dialogo]['npc'], this.dialogo_data[this.nombre_dialogo]['pose']);
        this.personaje = new Personaje(this, personaje_x, personaje_y, img_name);

        // Agrega un evento de clic al objeto input de la escena
        this.input.on('pointerdown', this.on_click, this);
        this.events.on(EVENT_NEXT_TEXTO_DIALOGO, this.on_next_dialogo_text, this);
    }

    // función asíncrona que añade los botones de diálogo
    async añadir_botones() {
        let i = 0;
        let pos_x = this.width - (this.width - this.cuadro_dialogo.width) / 2;
        let pos_y = this.height - this.cuadro_dialogo.height - 83;
        this.botons = [];

        // esperar a que el evento 'EVENT_TEXTO_DIALOGO' ocurra
        if (!this.skip_animation)
            await this.esperar_evento(EVENT_TEXTO_DIALOGO);

        // mientras haya opciones
        while (this.dialogo_data[this.nombre_dialogo]["opciones"] && this.dialogo_data[this.nombre_dialogo]['opcion_' + String(i + 1)] != null) {

            // crear el botón
            this.botons[i] = new BotonDialogo(
                this, pos_x, pos_y, this.assets_data.get_boton_dialogo(), 
                this.dialogo_data[this.nombre_dialogo]['opcion_' + String(i + 1)], 
                this.dialogo_data[this.nombre_dialogo]['texto_' + String(i + 1)],
                this.skip_animation
            );

            i++;
            if (i == 3) break; // máximo de 3 botones

            // actualizar posición
            pos_y -= this.botons[i - 1].height;

            // esperar a que el evento 'EVENT_TEXTO_DIALOGO' ocurra
            if (!this.skip_animation)
                await this.esperar_evento(EVENT_TEXTO_DIALOGO);
        }

        if (this.botons.length == 0) {
            setTimeout(() => {
                this.texto_finalizado = true;
            }, 100);
        } else {
            this.texto_finalizado = true;
        }

        if (!this.skip_animation)
            await this.esperar_evento(EVENT_TEXTO_DIALOGO);

        for (let i = 0; i < this.botons.length; i++) {
            this.botons[i].can_be_clicked = true;
        }
    }
    
    // función que devuelve una Promesa que espera al evento EVENT_TEXTO_DIALOGO
    esperar_evento(evento) {
        return new Promise(resolve => {
            this.events.once(evento, () => {
                resolve();
            });
        });
    }

    on_click() {
        if (!this.can_be_clicked) return;
        if (this.texto_finalizado && !this.dialogo_data[this.nombre_dialogo]['opciones']) {
            if (this.dialogo_data[this.nombre_dialogo]['opcion_1'] == "FIN") {
                this.scene.get(SCENE_MANAGER).events.emit(EVENT_START_PANTALLA, this.dialogo_data[this.nombre_dialogo]['texto_1']);
                return;
            }
            this.events.emit(EVENT_NEXT_TEXTO_DIALOGO, this.dialogo_data[this.nombre_dialogo]['opcion_1']);
        } else if (!this.cuadro_dialogo.texto_finnished) {
            this.skip_animation = true;
            this.events.emit(EVENT_SKIP_TEXTO_DIALOGO);
        } else if (this.botons.length > 0 && !this.botons[this.botons.length - 1].texto_finnished) {
            this.botons[this.botons.length - 1].texto_finnished = true;
            this.skip_animation = true;
            this.events.emit(EVENT_SKIP_TEXTO_DIALOGO);
        }
    }

    // al cambiar de diálogo
    on_next_dialogo_text(name) {
        for (let i = 0; i < this.botons.length; i++) {
            this.botons[i].destroy();
        }

        this.skip_animation = false;
        this.nombre_dialogo = name;
        this.texto_finalizado = false;
        
        this.background.change_texture(this.assets_data.get_background_dialogos(this.dialogo_data[this.nombre_dialogo]['fondo']));


        this.cuadro_dialogo.actualizar_texto(this.dialogo_data[this.nombre_dialogo]['texto']);

         // añade los botones, en caso de que haya opciones
        this.añadir_botones();

        let img_name = this.assets_data.get_personaje_dialogos(this.dialogo_data[this.nombre_dialogo]['npc'], this.dialogo_data[this.nombre_dialogo]['pose']);
        this.personaje.change_texture(img_name);
    }
}

export default Dialogo;