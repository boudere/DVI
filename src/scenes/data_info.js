import { DATA_INFO, SCENE_MANAGER, PANTALLA_MANAGER, DIALOGO_MANAGER, MINIJUEGO_MANAGER, CURSOR_MANAGER } from "/src/data/scene_data.js";
import { cargarProgresoCompleto, guardarProgresoCompleto, cargarRanking, guardarRecordRanking } from '/src/database/save-data.js';

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
    //                            EJECUTAR EL COMANDO:                           //
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

    get_saves() {
        return this.cache.json.get(this.json_prefix + 'saves');
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
            case "JuegoDucha":
            case "JuegoFruit":
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
        console.info( this.img_prefix + scene + "_" + name, this.IMG_PATH + path + name + img_suffix);
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
    //                        AGREGAR PARA NUEVO MANAGER                        //
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

    save_firestore_data(data) {
        this.userId = data.userId;
        this.userName = data.displayName;
        this.progreso = data.progreso;

        this.cargar_datos_usuario();
        this.cargar_rankings();
    }

    guardar_progreso(progreso) {
        if (!this.userId) {
            console.error("⚠️ No hay sesión activa.");
            return;
        }

        this.progresos = { Save: { progreso } };
        guardarProgresoCompleto(this.userId, this.progreso);
    }

    guardar_puntuacion(nombre_juego, nueva_puntuacion) {     
        if (!this.userId || !this.progreso) {
          console.error("⚠️ No hay sesión activa o progreso cargado.");
          return;
        }
        
        // Crear estructura si no existe
        if (!this.progreso.Saves) this.progreso.Saves = {};
        if (!this.progreso.Saves.Minijuegos) this.progreso.Saves.Minijuegos = {};
        if (!this.progreso.Saves.Minijuegos[nombre_juego]) {
          this.progreso.Saves.Minijuegos[nombre_juego] = {
            RecortdPuntuacion: nueva_puntuacion
          };
          return
        }

        // Solo guarda si la nueva puntuación es mejor
        const anterior = this.progreso.Saves.Minijuegos[nombre_juego].RecortdPuntuacion;
        if (nueva_puntuacion <= anterior) { return; }

        this.progreso.Saves.Minijuegos[nombre_juego].RecortdPuntuacion = nueva_puntuacion;
        guardarProgresoCompleto(this.userId, this.progreso);
        this.actualizar_ranking(nombre_juego, nueva_puntuacion);
    }

    cargar_datos_usuario() {
        if (!this.userId) {
            console.error("⚠️ No hay sesión activa.");
            return;
        }

        cargarProgresoCompleto(this.userId).then((progreso) => {
            if (progreso) {
                this.progreso = progreso;
            } else {
                console.error("⚠️ No se encontraron datos para el usuario.");
            }
        }).catch((error) => {
            console.error("❌ Error al cargar datos:", error);
        });
    }

    cargar_rankings() {
        if (!this.userId) {
            console.error("⚠️ No hay sesión activa.");
            return;
        }

        cargarRanking().then((ranking) => {
            if (ranking) {
                this.ranking = ranking;
                ("✅ Rankings cargados:", this.ranking);
            } else {
                console.error("⚠️ No se encontraron rankings para el usuario.");
            }
        }).catch((error) => {
            console.error("❌ Error al cargar rankings:", error);
        });
    }

    get_datos_usaurio() {
        console.log("asdas:2", this.progreso);
        return this.progreso.Saves;
    }

    get_ranking(game_bame) {
        return this.ranking[game_bame] || null;
    }

    async actualizar_ranking(nombre_juego, nueva_puntuacion) {
        if (!this.userId || !this.ranking) {
            console.error("⚠️ No hay sesión activa o ranking cargado.");
            return;
        }
    
        // Crear array si no existe
        if (!this.ranking[nombre_juego]) {
            console.log("⚠️ No existía ranking para", nombre_juego);
            this.ranking[nombre_juego] = [];
        }
    
        let rankingActual = this.ranking[nombre_juego];
    
        // Eliminar entradas del mismo jugador
        rankingActual = rankingActual.filter(entry => entry.Nombre !== this.userName);
    
        // Añadir nueva puntuación
        rankingActual.push({ Nombre: this.userName, Puntuacion: nueva_puntuacion });
    
        // Ordenar de mayor a menor
        rankingActual.sort((a, b) => b.Puntuacion - a.Puntuacion);
    
        // Limitar a top 10
        const nuevoRanking = rankingActual.slice(0, 10);
    
        // Comparar si ha cambiado
        const jsonAntiguo = JSON.stringify(this.ranking[nombre_juego]);
        const jsonNuevo = JSON.stringify(nuevoRanking);
    
        if (jsonAntiguo === jsonNuevo) {
            return;
        }
    
        // Actualizar local y guardar en Firestore
        this.ranking[nombre_juego] = nuevoRanking;
        await guardarRecordRanking(nombre_juego, nuevoRanking);
    }
    
}



export default DataInfo;