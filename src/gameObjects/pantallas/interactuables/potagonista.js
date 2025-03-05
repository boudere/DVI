import InteractuableDefault from "/src/gameObjects/pantallas/interactuable_default.js";
import { EVENT_START_DIALOGO, EVENT_START_PANTALLA } from "/src/data/events_data.ts";
import { SCENE_MANAGER } from '/src/data/scene_data.ts';

class Protagonista extends InteractuableDefault {
    constructor(scene, x, y, type, size, delay, on_click, animation, nombre) {
        super(scene, x, y, type, size, size, delay, on_click, animation, nombre);

        this.can_be_clicked = true;
    }

    // Puedes sobrescribir métodos de la clase padre si es necesario
    set_events() {
        super.set_events(); // Llama al método de la clase padre

        // Agrega eventos adicionales o modifica los existentes
        this.on("pointerdown", () => {
            if (!this.can_be_clicked)
                return;
            let scene = EVENT_START_DIALOGO;
            if (this.on_click.scene === "pantalla") {
                scene = EVENT_START_PANTALLA;
            }

            this.scene.scene.get(SCENE_MANAGER).events.emit(scene, this.on_click.name);
        });
    }
}

export default Protagonista;