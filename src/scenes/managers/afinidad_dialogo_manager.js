import Managers from "/src/scenes/managers";
import { AFINIDAD_DIALOGO_MANAGER, DATA_INFO, SCENE_MANAGER } from "/src/data/scene_data.js";

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

        this.datos_actualizados = false;
    }

    _load_dialogo(dialogo) {
    }

    exit() {
        if (this.datos_actualizados) {
            this.data_info_scene.guardar_progreso(this.datos_usuario);
        }
        super.exit();
    }

    enter(scene_data) {
        this.datos_actualizados = false;
        this.datos_usuario = this.data_info_scene.get_datos_usaurio();
        this.variable_data = this.variables_data[scene_data.var_id];
        this.next_scene_id = scene_data.name;

        if (this._get_length() == 1) {
            this.actualizar_datos();
        } else {
            this.elegir_dialogo();
        }
    }

    _get_length() {
        let max = Object.keys(this.variable_data).length / 2;
        let length = 0;
        for (let i = 1; i <= max; i++) {
            let val = this.variable_data["var_" + i];
            if (val) {
                length++;
            }
        }
        return length;
    }

    elegir_dialogo() {
        let val_prefix = "val_"
        let var_prefix = "var_";
        let max = this._get_length();
        let usuario_afinidad = this.datos_usuario.Afinidad;

        for (let i = 1; i <= max; i++) {
            let name = this.variable_data[var_prefix + i];
            let val = this.variable_data[val_prefix + i];

            if (!usuario_afinidad[name]) {
                this.inicializar_datos(name);
                continue;
            }
            if (usuario_afinidad[name] >= val) {
                this.enviar_dialogo(i);
                return;
            }
        }
        console.error("No se ha encontrado un dialogo para la variable: " + this.variable_data.name);
        this.enviar_dialogo(1);
    }

    actualizar_datos() {
        this.datos_usuario.Afinidad[this.variable_data.var_1] += this.variable_data.val_1;
        this.datos_actualizados = true;
        this.enviar_dialogo(-1);
    }

    inicializar_datos(variable) {
        this.datos_usuario.Afinidad[variable] = 0;
        if (variable == 'afinidad_maria') {
            this.datos_usuario.Afinidad[variable] = 40;
        }

        this.datos_actualizados = true;
    }

    enviar_dialogo(num) {
        let on_click = {
            scene: 'dialogo',
            name: this.next_scene_id + this._numero_a_letra(num),
            var_id: null
        };
        this.scene.get(SCENE_MANAGER).signal_click(on_click);
    }

    _numero_a_letra(n) {
        if (n == -1) { return '';}
        return String.fromCharCode(64 + n);
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
    