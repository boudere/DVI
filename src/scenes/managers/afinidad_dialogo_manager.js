import Managers from "/src/scenes/managers";
import { AFINIDAD_DIALOGO_MANAGER, DIALOGO_MANAGER, DATA_INFO } from "/src/data/scene_data.js";

// esta escena de momento solo lanza la escena de dialogo
class AfinidadDialogoManager extends Managers {
    constructor() {
        super({ key: AFINIDAD_DIALOGO_MANAGER });

        this.VARIABLE_DIALOGO = 'variables_dialogo';
    }

    _reset_data() {
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)
        this.variables_data = this.data_info_scene.get_json(this.VARIABLE_DIALOGO);
    }

    _load_dialogo(dialogo) {
    }

    exit() {
        super.exit();
    }

    enter(scene_data) {
        this.variable_data = this.variables_data.var_id;
        this.datos_usuario = this.data_info_scene.get_datos_usaurio();

        if (scene_data.actualizar_datos) {
            this.actualizar_datos();
        } else {
            this.elegir_dialogo(scene_data.dialogo);
        }
    }

    elegir_dialogo() {

    }

    actualizar_datos() {

    }

    _update() {
        super.update();
    }

    pause(){
        super.pause();
    }

    unpause(){
        super.unpause();
    }
}

export default AfinidadDialogoManager;
    