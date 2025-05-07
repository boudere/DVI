import GameObjectsText from '/src/game_objects_text.js';
import { DATA_INFO } from '/src/data/scene_data.js';

class TextRanking extends GameObjectsText {
    constructor(scene, x, y, container, container_width, texto, delay, opciones_entrada = {}) {
        super(scene, x, y, container, container_width, texto, delay, false, opciones_entrada);

        this.setOrigin(0.5, 0.5);
    }
    
}

export default TextRanking;