import Phaser from "phaser";
import { DATA_INFO, SCENE_MANAGER, PANTALLA_MANAGER, DIALOGO_MANAGER, MINIJUEGO_MANAGER } from "/src/data/scene_data.js";

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
    }

    preload() {
        // ejecutar antes el comando:
        //  node ./src/utils/generateFoldersJson.js 
        // para actualizar el archivo folders.json
        this.load.json(this.json_data, this.JSON_PATH + this.data_name);
    }

    create() {
        // carga el data json
        this.data = this.cache.json.get(this.json_data).Assets;
        this.data_json = this.data.Json;
        this.data_imgs = this.data.Imgs;

        // carga los paths de los img y json
        this.ROOT = this.data.Root;
        this.ASSETS_PATH = this.ROOT + this.data.Path;
        this.JSON_PATH = this.ASSETS_PATH + this.data_json.Path;
        this.IMG_PATH = this.ASSETS_PATH + this.data_imgs.Path;

        // carga los prefijos de los assets y json
        this.json_prefix = this.data_json.Prefix;
        this.img_prefix = this.data_imgs.Prefix;


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
    update_loading_bar() {
        this.loaded_assets++;
        const progress = this.loaded_assets / this.number_assets;

        this.loading_bar.clear();
        this.loading_bar.fillStyle(0xffffff, 1);
        this.loading_bar.fillRect(
            this.bar_x,
            this.bar_y,
            this.bar_width * progress,
            this.bar_height
        );

        if (progress === 1) {
            setTimeout(() => {
                this.scene.start(SCENE_MANAGER);
            }, 100);
        }
    }

    // carga los assets
    load_assets() {
        this.loaded_assets = 0;

        this.load.on("filecomplete", () => {
            this.update_loading_bar();
        });

        this.load_jsons();
        this.load_imgs();

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
            case "Dialogos":
                path = this.data_imgs[clase].Path + this.data_imgs[clase][clase2].Path;
                this.load_img2(clase, name, path);
                break;
            default:
                console.log("Clase no encontrada");
                break;
        }
    }

    load_img2(scene, name, path){
        const img_suffix = this.data_imgs.Suffix;
        this.load.image(this.img_prefix + scene + "_" + name, this.IMG_PATH + path + name + img_suffix);
}

    get_img(scene, name) {
        let scene_name = ""
        switch (scene) {
            case PANTALLA_MANAGER:
                scene_name = "Pantallas";
                break;
            case DIALOGO_MANAGER:
                scene_name = "Dialogos";
                break;
            case MINIJUEGO_MANAGER:
                scene_name = "Minijuegos";
                break;
            default:
                break;
        }

        return this.img_prefix + scene_name + "_" + name;
    }
}

export default DataInfo;