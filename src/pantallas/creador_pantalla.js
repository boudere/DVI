import { DATA_INFO, PANTALLA_MANAGER } from "/src/data/scene_data.js";
import PantallaPuertas from "/src/pantallas/game_objects/pantalla_puertas";
import PantallaObjetos from "/src/pantallas/game_objects/pantalla_objetos";

class CreadorPantalla {
    constructor(scene, pantalla_info) {
        this.PANTALLA_INFO = "pantalla_info";

        this.scene = scene;
        this.extra_info = pantalla_info;

        this.data_info_scene = this.scene.scene.get(DATA_INFO);
        let pantallas_data = this.data_info_scene.get_json(this.PANTALLA_INFO);
        this.selected_pantalla_info = pantallas_data[this.extra_info.pantalla.nombre];
    }

    cargar_fondo() {
        let img = this.data_info_scene.get_img(PANTALLA_MANAGER, this.selected_pantalla_info.background);
        let background = this.scene.add.image(0, 0, img).setOrigin(0, 0);
        return background;
    }

    cargar_puertas() {
        return this.cargar_elementos("puertas", PantallaPuertas);
    }
    
    cargar_objetos() {
        return this.cargar_elementos("objetos", PantallaObjetos);
    }
    

    cargar_elementos(tipo, ClaseElemento) {
        let data_elementos = this.selected_pantalla_info[tipo] || {};
        let extra_data_elementos = (this.extra_info.pantalla[tipo] || {});
    
        let elementos = [];
        Object.keys(data_elementos).forEach((key) => {
            let default_info = data_elementos[key];
            let override_info = extra_data_elementos[key] || {};
    
            // Crear una copia combinada, sobrescribiendo incluso si el valor es null
            let final_info = { ...default_info, ...override_info };
    
            let { nombre, pos_x, pos_y, on_click } = final_info;
            let img = this.data_info_scene.get_img(PANTALLA_MANAGER, key);
    
            let elemento = new ClaseElemento(this.scene, pos_x, pos_y, img, on_click, nombre);
            elementos.push(elemento);
        });
    
        return elementos;
    }
}

export default CreadorPantalla;