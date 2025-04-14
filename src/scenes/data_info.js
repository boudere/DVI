import Phaser from "phaser";
import { DATA_INFO, SCENE_MANAGER, PANTALLA_MANAGER, DIALOGO_MANAGER, MINIJUEGO_MANAGER, CURSOR_MANAGER } from "/src/data/scene_data.js";

class DataInfo extends Phaser.Scene {
    constructor() {
        super({ key: DATA_INFO, active: true });

        // PATHS
        this.ROOT = '/DVI/';
        this.ASSETS_PATH = this.ROOT + 'assets/';

        this.JSON_PATH = this.ASSETS_PATH + 'json/';
        this.IMG_PATH = this.ASSETS_PATH + 'img/';

        this.json_data = 'json_data';
        this.data_name = 'data.json';

        this.asdasd = 0;
    }

    ///////////////////////////////////////////////////////////////////////////////
    //                            EIECUTAR EL COMANDO:                           //
    //                   node ./src/utils/generateFoldersJson.js                 //
    //                           AL AÑADIR NUEVO ASSET                           //
    ///////////////////////////////////////////////////////////////////////////////

    preload() {
        this.load.json(this.json_data, this.JSON_PATH + this.data_name);
    }

    create() {
        // carga el data json
        this.data = this.cache.json.get(this.json_data).Assets;
        this.data_json = this.data.Json;
        this.data_imgs = this.data.Imgs;
        this.data_musica = this.data.Musica;

        // carga los paths de los img y json
        this.ROOT = this.data.Root;
        this.ASSETS_PATH = this.ROOT + this.data.Path;
        this.JSON_PATH = this.ASSETS_PATH + this.data_json.Path;
        this.IMG_PATH = this.ASSETS_PATH + this.data_imgs.Path;
        this.MUSICA_PATH = this.ASSETS_PATH + this.data_musica.Path;

        // carga los prefijos de los assets y json
        this.json_prefix = this.data_json.Prefix;
        this.img_prefix = this.data_imgs.Prefix;
        this.musica_prefix = this.data_musica.Prefix;


        let folders = this.data_json.Folders;

        this.load.on("filecomplete", () => {
            if (this.loaded)
                return;
            this.loaded = true;
            this.crear_laoding_screen();
            this.get_number_assets();
            this.load_assets();
        });

        this.load.json(this.json_prefix + folders, this.JSON_PATH + folders + this.data_json.Suffix);

        this.load.start();
    }

    // crea la barra y caja de carga
    crear_laoding_screen() {
        const { width, height } = this.scale;

        // crear caja de fondo de la barra
        this.loading_box = this.add.graphics();
        this.loading_box.fillStyle(0x222222, 0.8);
        this.loading_box.fillRect(width / 2 - width / 4, height / 2 - 20, width / 2, 200);

        // crear barra de progreso (vacía al principio)
        this.loading_bar = this.add.graphics();

        // guardar posición base
        this.bar_x = width / 2 - width / 4 + 10;
        this.bar_y = height / 2 - 10;
        this.bar_width = width / 2 - 20;
        this.bar_height = 180;
    }

    // obtiene el nuemro de assets que tiene que cargar
    get_number_assets() {
        const json_folder = this.cache.json.get(this.json_prefix + this.data_json.Folders);

        this.number_assets = this.get_number_assets_recursive(json_folder);
        this.loaded_assets = 0;
    }

    // obtiene el numero de assets de forma recursiva, apoya a get_number_assets
    get_number_assets_recursive(folder) {
        let number_assets = 0;

        folder.folders.forEach((subfolder) => {
            number_assets += this.get_number_assets_recursive(subfolder);
        });

        number_assets += folder.files.length;

        return number_assets;
    }

    // actualiza la barra de carga
    update_loading_bar(progress) {
        this.loading_bar.clear();
        this.loading_bar.fillStyle(0xffffff, 1);
        this.loading_bar.fillRect(
            this.bar_x,
            this.bar_y,
            this.bar_width * progress,
            this.bar_height
        );
    }

    // carga los assets
    load_assets() {
        this.load.on("progress", (value) => {
            this.update_loading_bar(value);
        });

        this.load.on("complete", () => {
            setTimeout(() => {
                this.scene.start(SCENE_MANAGER);
            }, 100);
        });

        this.load_jsons();
        this.load_imgs();
        this.load_musicas();

        this.load.start();
    }

    load_jsons() {
        const jsons = this.data_json.Jsons;
        jsons.forEach((name) => {
            this.load_json(name);
        });
    }

    load_json(name) {
        const json_suffix = this.data_json.Suffix;
        this.load.json(this.json_prefix + name, this.JSON_PATH + name + json_suffix);
    }

    get_data_json() {
        return this.cache.json.get(this.json_data).Assets;
    }

    get_json(name) {
        let name2 = name
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join("");
        return this.cache.json.get(this.json_prefix + name)[name2];
    }

    load_imgs() {
        const clases_img = this.data_imgs.Clases;

        clases_img.forEach((clases) => {
            let clases_img2 = this.data_imgs[clases].Clases;
            clases_img2.forEach((clases2) => {
                let imgs = this.data_imgs[clases][clases2][clases2];
                imgs.forEach((name) => {
                    this.laod_img(clases, clases2, name);
                })
            });
        });
    }

    //////////////////////////////////////////////////////////////////////////////
    //                    AGREGAR PARA NUEVO TIPO DE IMAGEN                     //
    //////////////////////////////////////////////////////////////////////////////

    laod_img(clase, clase2, name) {
        let path = '';
        switch (clase2) {
            case "Backgrounds":
                path = this.data_imgs[clase].Path + this.data_imgs[clase][clase2].Path + name + "/";
                this.load_img2(clase, name, path);
                break;
            case "Personajes":
                let poses = this.data_imgs[clase][clase2].Poses;
                poses.forEach((pose) => {
                    path = this.data_imgs[clase].Path + this.data_imgs[clase][clase2].Path + name + "/";
                    this.load_img2(clase, name + "_" + pose, path);
                });
                break;
            case "JuegoOveja":
            case "JuegoDiscoteca":
            case "Dialogos":
            case "Cursors":
                path = this.data_imgs[clase].Path + this.data_imgs[clase][clase2].Path;
                this.load_img2(clase, name, path);
                break;
            case "Puertas":
                let lados = this.data_imgs[clase][clase2].Lados;
                lados.forEach((lado) => {
                    path = this.data_imgs[clase].Path + this.data_imgs[clase][clase2].Path + name + "/";
                    this.load_img2(clase, name + "_" + lado, path);
                });
                break;
            case "Objetos":
                path = this.data_imgs[clase].Path + this.data_imgs[clase][clase2].Path;
                this.load_img2(clase, name, path);
                break;
            default:
                console.log("Clase no encontrada", clase, clase2, name);
                break;
        }
    }

    load_img2(scene, name, path) {
        const img_suffix = this.data_imgs.Suffix;
        this.load.image(this.img_prefix + scene + "_" + name, this.IMG_PATH + path + name + img_suffix);
    }

    load_musicas() {
        const musicas = this.data_musica.Musicas;
        musicas.forEach((name) => {
            this.load_musica(name);
        });
    }

    load_musica(name) {
        const musica_suffix = this.data_musica.Suffix;
        this.load.audio(this.musica_prefix + name, this.MUSICA_PATH + name + musica_suffix);
    }

    get_musica(name) {
        return this.musica_prefix + name;
    }


    //////////////////////////////////////////////////////////////////////////////
    //                        AGREFAR PARA NUEVO MANAGER                        //
    //////////////////////////////////////////////////////////////////////////////

    get_img(scene, name) {
        let scene_name = ""
        switch (scene) {
            case PANTALLA_MANAGER:
            case "Pantallas":
                scene_name = "Pantallas";
                break;
            case DIALOGO_MANAGER:
            case "Dialogos":
                scene_name = "Dialogos";
                break;
            case MINIJUEGO_MANAGER:
            case "Minijuegos":
                scene_name = "Minijuegos";
                break;
            case CURSOR_MANAGER:
            case "Cursors":
                scene_name = "Cursors";
                break;
            default:
                break;
        }

        return this.img_prefix + scene_name + "_" + name;
    }

    // dentro de tu escena en Phaser (por ejemplo, después de preload)
    gaurdar_puntuacion(nombre_juego, nueva_puntuacion) {
        let SAVES = 'saves'
        // 1. Obtener json desde la caché
        let data = this.get_json(SAVES);
        console.log("JSON en caché:", data);

        if (!data) {
            console.warn("❌ No se encontró el JSON en caché o está mal formado.");
            return;
        }

        // 2. Asegurar estructura
        if (!data.Minijuegos[nombre_juego]) {
            data.Minijuegos[nombre_juego] = {};
        }

        // 3. Actualizar puntuación
        data.Minijuegos[nombre_juego].RecordPuntuacion = nueva_puntuacion;

        // 4. Guardar en disco usando Node.js (modo desarrollo con acceso a fs)
        const fs = require('fs');

        try {
            fs.writeFileSync('public/assets/saves.json', JSON.stringify(data, null, 2));
            console.log("✅ JSON actualizado y guardado correctamente");
        } catch (err) {
            console.error("❌ Error al guardar el JSON:", err);
        }

        // 5. Opcional: volver a ponerlo en caché
        this.cache.json.remove(SAVES);
        this.load_json(SAVES)
    }
}



export default DataInfo;