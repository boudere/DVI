import GameObjectsText from '/src/game_objects_text.js';
import { DATA_INFO } from '/src/data/scene_data.js';

class DialogoGameObjectsText extends GameObjectsText {
    constructor(scene, x, y, container, container_width, texto_data, delay, animation=false, opciones_entrada = {}) {
        super(scene, x, y, container, container_width, texto_data, delay, animation, opciones_entrada);
    }

    apply_effects(type, name, index) {
        switch(type) {
            case 'sound':
                this.scene.play_sfx(name);
                break;
            case 'sprite':
                this.scene.change_personaje(name);
                break;
            case 'variable':
                return this.add_variable_to_text(name, index);
                break;
        }
    }

    add_variable_to_text(name, index) {
        const value = this.scene.scene.get(DATA_INFO).get_dialogo_data_usuario(name);
    
        // Divide el texto: antes y después del índice
        const before = this.texto.slice(0, index + 1); // +1 para incluir el '@'
        const after = this.texto.slice(index + 1);
    
        // Inserta el valor manteniendo el '@'
        let texto = before + " " + value + after;
        return texto;
    }
}

export default DialogoGameObjectsText;