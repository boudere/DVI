import PantallaGameObjects from '/src/pantallas/pantalla_game_objects.js';

import { DATA_INFO, PANTALLA_MANAGER } from '/src/data/scene_data.js';

class PantallaPersonajes extends PantallaGameObjects {
    constructor(scene, datos, datos_default) {
        const personajeKey = datos.nombre;
        const baseData = datos_default[personajeKey];

        // Fusionar con cuidado: usar null explícito si se indica
        const merged = {
            nombre: baseData.nombre,
            nombre_img: datos.nombre_img ?? baseData.img,
            pose: datos.pose ?? baseData.pose,
            x: datos.pos_x ?? baseData.pos_x,
            y: datos.pos_y ?? baseData.pos_y,
            size: datos.size ?? baseData.size,
            delay: datos.delay ?? baseData.delay,
            animation: (datos.hasOwnProperty('animation')) ? datos.animation : baseData.animation,
            on_click: (datos.hasOwnProperty('on_click')) ? datos.on_click : baseData.on_click
        };

        merged.nombre_img = scene.scene.get(DATA_INFO).get_img(PANTALLA_MANAGER, merged.nombre_img + "_" + merged.pose);

        super(scene, merged.x, merged.y, merged.nombre_img, merged.size, merged.size, merged.delay,
            merged.animation, merged.on_click, merged.nombre);
    }
}

export default PantallaPersonajes;