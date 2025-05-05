import PantallaDefault from "/src/minijuegos/pantalla_default.js";
import TextRanking from "/src/minijuegos/juego_oveja/pantallas/final/pantalla_1/text.js";

import { DATA_INFO } from "/src/data/scene_data.js";

class PantallaRanking extends PantallaDefault {
    constructor(scene, x, y) {
        let TEXTURE = 'violete_juego_oveja';
        super(scene, x, y, TEXTURE);

        this.data_info_scene = this.scene.scene.get(DATA_INFO);

        this.has_entered = false;;
        this.next_scene = null;

        this.setDepth(0);
    }

    enter(value = null) {
        super.enter(value);
        this.ranking_info = this.data_info_scene.get_ranking(value);
        this.texts = []
        this.has_entered = true;
        this.ranking();
    }

    _before_destroy() {
        super._before_destroy();

        this.texts.forEach(text => {
            text.destroy();
        });
    }

    _update(time, delta) {
        if (!this.has_entered) {
            return;
        }
        super._update(time, delta);
    }

    ranking() {
        for (let i = 0; i < this.ranking_info.length; i++) {
            let info = this.ranking_info[i];
            let x = this.width / 2;
            let y = this.height * (0.3 + i * 0.05);
            let delay = i * 100;
            let opciones_entrada = {
                fontSize: '64px',
                color: '#000000',
                fontFamily: 'Impact' 
            };
    
            // Usa la propiedad correcta del JSON
            let texto = `${info.Nombre}: ${info.Puntuacion}`;
            this.add_text(texto, x, y, delay, opciones_entrada);
        }

        let rest = 10 - this.ranking_info.length;

        for (let i = 0; i < rest; i++) {
            let x = this.width / 2;
            let y = this.height * (0.28 + (this.ranking_info.length + i) * 0.05);
            let delay = (this.ranking_info.length + i) * 100;
            let opciones_entrada = {
                fontSize: '64px',
                color: '#000000',
                fontFamily: 'Impact' 
            };
    
            // Usa la propiedad correcta del JSON
            let texto = `...`;
            this.add_text(texto, x, y, delay, opciones_entrada);
        }
    }
    

    add_text(texto, x, y, delay, opciones_entrada = {}) {
        let text = new TextRanking(this.scene, x, y, this, this.width, texto, delay, opciones_entrada);
        this.texts.push(text);
    }
}

export default PantallaRanking;