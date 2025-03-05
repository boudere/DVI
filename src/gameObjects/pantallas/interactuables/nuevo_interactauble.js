import InteractuableDefault from "/src/gameObjects/pantallas/interactuable_default.js";
import { EVENT_START_DIALOGO } from "/src/data/events_data.ts";

class NuevoInteractuable extends InteractuableDefault {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);

        this.can_be_clicked = true; 
    }

    // Puedes sobrescribir métodos de la clase padre si es necesario
    set_events() {
        super.set_events(); // Llama al método de la clase padre

        // Agrega eventos adicionales o modifica los existentes
        this.on("pointerdown", () => {
            if (!this.can_be_clicked)
                return;
            this.scene.events.emit(EVENT_START_DIALOGO, "dialogo_1");
        });
    }
}

export default NuevoInteractuable;