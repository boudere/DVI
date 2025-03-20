import { EVENT_DATOS_CARAGDOS } from "/src/data/events_data.ts";
import Phaser from "phaser";

// ------------------------------------------------------------- //
//   esta función se encarga de cargar los datos de los assets   //
// ------------------------------------------------------------- //
class AssetsData {
    constructor(scene) {
        this.scene = scene;

        // estos parametros corresponden a los nombres de las keys en el json
        this.ASSETS = "Assets";

        this.PATH = "Path";
        this.PREFIX = "Prefix";
        this.EXTENSION = "Extension";

        this.IMAGES = "Images";
        this.JSON = "Json";

        this.COLLIDER = "Collider";
        this.DIALOGOS = "Dialogos";
        this.PANTALLAS = "Pantallas";
        this.CURSOR = "Cursor";

        this.PERSONAJES = "Personajes";
        this.POSES = "Poses";

        this.BACKGROUNDS = "Backgrounds";

        // prefijos y formatos
        this.JSON_PREFIX = "json_";
        this.FORMATO_JSON = ".json";

        // el path principal para descargar el json
        this.JSON_PATH = "/DVI/assets/json/";

        this.inicializar_constantes_datos();
    }
    
    // ------------------------------------------------------------- //
    //                             JSON                              //
    // ------------------------------------------------------------- //

    // ------------------------------------------------------------- //
    //                            DATOS                              //
    // ------------------------------------------------------------- //

    inicializar_constantes_datos() {
        // datos
        this.JSON_DATO = "data";
        this.JSON_DATO_PATH =  this.JSON_PATH + this.JSON_DATO + this.FORMATO_JSON;
    }

    // carga los datos (json)
    cargar_datos() {
        this.scene.load.json(this.JSON_PREFIX + this.JSON_DATO, this.JSON_DATO_PATH)
        console.log(this.JSON_PREFIX + this.JSON_DATO, this.JSON_DATO_PATH);
        
        // Agrega un evento 'filecomplete' para el JSON
        this.scene.load.once(`filecomplete-json-${this.JSON_PREFIX + this.JSON_DATO}`, () => {
            this.datos = this.scene.cache.json.get(this.JSON_PREFIX + this.JSON_DATO);
            this.datos_assets = this.datos.Assets;

            this.scene.events.emit(EVENT_DATOS_CARAGDOS);
        });

        // Inicia la carga de los datos
        this.scene.load.start();
    }

    // vuelve a hacer load del dato
    recargar_datos() {
        this.datos = this.scene.cache.json.get(this.JSON_PREFIX + this.JSON_DATO);
        console.log(this.JSON_PREFIX + this.JSON_DATO);
        if (this.datos) {
            this.datos_assets = this.datos.Assets;
            console.log("Datos recargados");
        }
    }
    
    get_json_dato() {
        return this.JSON_PREFIX + this.JSON_DATO;
    }

    // ------------------------------------------------------------- //
    //                           DIALOGOS                            //
    // ------------------------------------------------------------- //

    // carga los dialogos (json)
    cargar_dialogos() {
        let prefix = this.datos_assets[this.JSON][this.PREFIX];
        
        this.json_dialogo = prefix + this.datos_assets[this.JSON][this.DIALOGOS]

        this.json_dialogo_path = this.datos_assets[this.JSON][this.PATH] + this.datos_assets[this.JSON][this.DIALOGOS] + this.datos_assets[this.JSON][this.EXTENSION]

        this.scene.load.json(this.json_dialogo, this.json_dialogo_path);
    }

    get_json_dialogo() {
        return this.datos_assets[this.JSON][this.PREFIX] + this.datos_assets[this.JSON][this.DIALOGOS];
    }

    get_json_dialogo_path() {
        this.json_dialogo_path;
    }

    // ------------------------------------------------------------- //
    //                           PANTALLAS                           //
    // ------------------------------------------------------------- //

    // carga los dialogos (json)
    cargar_pantallas() {
        this.json_pantalla = this.datos_assets[this.JSON][this.PREFIX] + this.datos_assets[this.JSON][this.PANTALLAS];

        let json_pantalla_path = this.datos_assets[this.JSON][this.PATH] + this.datos_assets[this.JSON][this.PANTALLAS] + this.datos_assets[this.JSON][this.EXTENSION]

        this.scene.load.json(this.json_pantalla, json_pantalla_path);
    }

    get_json_pantalla() {
        return this.datos_assets[this.JSON][this.PREFIX] + this.datos_assets[this.JSON][this.PANTALLAS];
    }

    // ------------------------------------------------------------- //
    //                           IMAGENES                            //
    // ------------------------------------------------------------- //

    // ------------------------------------------------------------- //
    //                           COLLIDER                            //
    // ------------------------------------------------------------- //

    cargar_img_collider() {
        this.collider = this.datos_assets[this.IMAGES][this.COLLIDER][this.COLLIDER];
        let COLLIDER_PATH = this.datos_assets[this.IMAGES][this.COLLIDER][this.PATH];

        this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + this.collider + "_" + this.COLLIDER, COLLIDER_PATH + this.collider + this.datos_assets[this.IMAGES][this.EXTENSION]);
        this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + this.collider + "_debug" + "_" + this.COLLIDER, COLLIDER_PATH + this.collider  + "_debug" + this.datos_assets[this.IMAGES][this.EXTENSION]);
    }

    get_collider() {
        return this.datos_assets[this.IMAGES][this.PREFIX] + this.datos_assets[this.IMAGES][this.COLLIDER][this.COLLIDER] + "_" + this.COLLIDER;
    }

    get_collider_debug() {
        return this.datos_assets[this.IMAGES][this.PREFIX] + this.datos_assets[this.IMAGES][this.COLLIDER][this.COLLIDER] + "_debug" + "_" + this.COLLIDER;
    }

    // ------------------------------------------------------------- //
    //                            CURSOR                             //
    // ------------------------------------------------------------- //

    cargar_img_cursor() {
        let CURSOR_PATH = this.datos_assets[this.IMAGES][this.CURSOR][this.PATH];

        this.cursor = this.datos_assets[this.IMAGES][this.CURSOR][this.CURSOR];
        this.cursor_selected = this.datos_assets[this.IMAGES][this.CURSOR][this.CURSOR] + "_selected";
        this.cursor_left = this.datos_assets[this.IMAGES][this.CURSOR][this.CURSOR] + "_left";
        this.cursor_right = this.datos_assets[this.IMAGES][this.CURSOR][this.CURSOR] + "_right";
        this.background_cursor = this.datos_assets[this.IMAGES][this.CURSOR]["Background"];


        this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + this.cursor + "_" + this.CURSOR, CURSOR_PATH + this.cursor + this.datos_assets[this.IMAGES][this.EXTENSION]);
        this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + this.cursor + "_selected"+ "_" + this.CURSOR, CURSOR_PATH + this.cursor + "_selected" + this.datos_assets[this.IMAGES][this.EXTENSION]);
        this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + this.cursor + "_left"+ "_" + this.CURSOR, CURSOR_PATH + this.cursor + "_left" + this.datos_assets[this.IMAGES][this.EXTENSION]);
        this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + this.cursor + "_right"+ "_" + this.CURSOR, CURSOR_PATH + this.cursor + "_right" + this.datos_assets[this.IMAGES][this.EXTENSION]);
        this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + this.background_cursor + "_" + this.CURSOR, CURSOR_PATH + this.background_cursor + this.datos_assets[this.IMAGES][this.EXTENSION]);
    }

    get_cursor() {
        return this.datos_assets[this.IMAGES][this.PREFIX] +  this.datos_assets[this.IMAGES][this.CURSOR][this.CURSOR] + "_" + this.CURSOR;
    }

    get_cursor_selected() {
        return this.datos_assets[this.IMAGES][this.PREFIX] +  this.datos_assets[this.IMAGES][this.CURSOR][this.CURSOR] + "_selected" + "_" + this.CURSOR;
    }

    get_cursor_left() {
        return this.datos_assets[this.IMAGES][this.PREFIX] +  this.datos_assets[this.IMAGES][this.CURSOR][this.CURSOR] + "_left" + "_" + this.CURSOR;
    }

    get_cursor_right() {
        return this.datos_assets[this.IMAGES][this.PREFIX] +  this.datos_assets[this.IMAGES][this.CURSOR][this.CURSOR] + "_right" + "_" + this.CURSOR;
    }

    get_background_cursor() {
        return this.datos_assets[this.IMAGES][this.PREFIX] +  this.datos_assets[this.IMAGES][this.CURSOR]["Background"] + "_" + this.CURSOR;
    }

    // ------------------------------------------------------------- //
    //                           DIALOGOS                            //
    // ------------------------------------------------------------- //

    cargar_img_dialogos() {
        // path de los dialogos
        let DIALOGOS_PATH = this.datos_assets[this.IMAGES][this.DIALOGOS][this.DIALOGOS][this.PATH];

        // cuadrado_dialogo
        this.CUADRADO_DIALOGO = this.datos_assets[this.IMAGES][this.DIALOGOS][this.DIALOGOS].CuadradoDialogo;

        // boton_dialogo
        this.BOTON_DIALOGO = this.datos_assets[this.IMAGES][this.DIALOGOS][this.DIALOGOS].BotonDialogo;

        // cargamos los assets
        this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + "_" + this.CUADRADO_DIALOGO, DIALOGOS_PATH + this.CUADRADO_DIALOGO + this.datos_assets[this.IMAGES][this.EXTENSION]);
        this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX]+ "_" + this.BOTON_DIALOGO, DIALOGOS_PATH + this.BOTON_DIALOGO + this.datos_assets[this.IMAGES][this.EXTENSION]);
    }

    get_cuadrado_dialogo() {
        return this.datos_assets[this.IMAGES][this.PREFIX] + "_" + this.CUADRADO_DIALOGO;
    }

    get_boton_dialogo() {
        return this.datos_assets[this.IMAGES][this.PREFIX] + "_" + this.BOTON_DIALOGO;
    }

    // carga los personajes
    cargar_personajes_dialogos() {
        let PERSONAJES_PATH = this.datos_assets[this.IMAGES][this.DIALOGOS][this.PERSONAJES][this.PATH];

      
        let PERSONAJES_POSES = this.datos_assets[this.IMAGES][this.DIALOGOS][this.PERSONAJES][this.POSES];
        let PERSONAJES = this.datos_assets[this.IMAGES][this.DIALOGOS][this.PERSONAJES][this.PERSONAJES];
        
        for (let i = 0; i < PERSONAJES.length; i++) {
            for (let j = 0; j < PERSONAJES_POSES.length; j++) {
                let img_name = PERSONAJES[i] + "_" + PERSONAJES_POSES[j]
                let imagePath = PERSONAJES_PATH + PERSONAJES[i] + "/" + img_name + this.datos_assets[this.IMAGES][this.EXTENSION];
                this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + img_name + "_" + this.DIALOGOS, imagePath);
            }
        }
    }

    get_personaje_dialogos(persoanje, pose) {
        return this.datos_assets[this.IMAGES][this.PREFIX] + persoanje + "_" + pose + "_" + this.DIALOGOS;
    }

    // carga los fondos
    cargar_backgrounds_dialogos() {
        let BACKGROUND_PATH = this.datos_assets[this.IMAGES][this.DIALOGOS][this.BACKGROUNDS][this.PATH];

      
        let BACKGROUNDS = this.datos_assets[this.IMAGES][this.DIALOGOS][this.BACKGROUNDS][this.BACKGROUNDS];
        
        for (let i = 0; i < BACKGROUNDS.length; i++) {
            let imagePath = BACKGROUND_PATH +  BACKGROUNDS[i] + this.datos_assets[this.IMAGES][this.EXTENSION];
            this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + BACKGROUNDS[i] + "_" + this.DIALOGOS, imagePath);
        }
    }

    get_background_dialogos(background) {
        return this.datos_assets[this.IMAGES][this.PREFIX] + background + "_" + this.DIALOGOS;
    }

    // ------------------------------------------------------------- //
    //                          PANTALLAS                            //
    // ------------------------------------------------------------- //

    // carga los fondos
    cargar_backgrounds_pantallas() {
        let BACKGROUND_PATH = this.datos_assets[this.IMAGES][this.PANTALLAS][this.BACKGROUNDS][this.PATH];

      
        let BACKGROUNDS = this.datos_assets[this.IMAGES][this.PANTALLAS][this.BACKGROUNDS][this.BACKGROUNDS];
        
        for (let i = 0; i < BACKGROUNDS.length; i++) {
            let imagePath = BACKGROUND_PATH +  BACKGROUNDS[i] + this.datos_assets[this.IMAGES][this.EXTENSION];
            this._cargar_imagen(this.datos_assets[this.IMAGES][this.PREFIX] + BACKGROUNDS[i] + "_" + this.PANTALLAS, imagePath);
        }
    }

    get_background_pantallas(background) {
        return this.datos_assets[this.IMAGES][this.PREFIX] + background + "_" + this.PANTALLAS;
    }


    _cargar_imagen(key, url) {
        this.scene.load.image(key, url);
    }
}

export default AssetsData;