// src/minijuegos/fruit_merge/game_objects/fruit.js
import { MINIJUEGO_MANAGER, DATA_INFO } from "/src/data/scene_data.js";
import GamesGameObjects from "/src/minijuegos/games_game_objects.js";
import { FRUIT_TYPES } from "/src/minijuegos/fruit_merge/fruit_merge.js"; // Asegúrate que la ruta es correcta

class Fruit extends GamesGameObjects {
    constructor(scene, x, y, fruitTypeIndex) {
        const fruitData = FRUIT_TYPES[fruitTypeIndex];
        // GamesGameObjects espera el nombre de la imagen (clave para DATA_INFO)
        super(scene, x, y, fruitData.key);

        this.fruitTypeIndex = fruitTypeIndex;
        this.fruitData = fruitData; // Contiene radius_factor, points, etc.
        this.isMerging = false;

        // La configuración del cuerpo y la escala se harán en _add_img
        // porque necesitamos que la textura esté cargada y el objeto en la escena.
    }

    _add_img() {
        super._add_img(); // Llama al método original (añade a escena y física)

        if (this.body) {
            // 1. Establecer la escala visual del sprite
            // Puedes decidir si quieres que todas las imágenes originales tengan un tamaño base
            // y luego las escalas, o si las imágenes ya tienen tamaños relativos correctos.
            // Por ejemplo, si todas tus imágenes de frutas tienen un ancho de 100px y quieres
            // que la cereza (radius_factor 0.25) sea visualmente más pequeña que el melón (radius_factor 0.45),
            // podrías aplicar una escala basada en el radius_factor también a la visualización.
            // Si tus imágenes ya están pre-escaladas para su tamaño visual, no necesitas esto.
            // Ejemplo: escalar visualmente basado en radius_factor (ajusta el '100' a tu base)
            // const visualScale = (this.fruitData.radius_factor * 2 * 100) / this.width;
            // this.setScale(visualScale);
            // O, si quieres un control de escala más directo:
            // this.setScale(this.fruitData.visual_scale || 1); // Añade visual_scale a FRUIT_TYPES

            // 2. Configurar el cuerpo físico circular
            // El radio del cuerpo físico se basa en el 'width' del sprite DESPUÉS de cualquier escalado visual.
            // O, si prefieres, en el 'width' original de la textura.
            // Es importante ser consistente.
            // Si usas el this.width actual (que puede estar escalado), el radius_factor
            // se aplica sobre ese tamaño escalado.
            const physicalRadius = this.displayWidth * this.fruitData.radius_factor;
            // O si prefieres basarlo en la textura original (antes de this.setScale()):
            // const physicalRadius = this.texture.getSourceImage().width * this.fruitData.radius_factor;

            this.body.setCircle(
                physicalRadius,
                // El offset X e Y para el círculo dentro del sprite.
                // Si el origen del sprite es (0.5, 0.5) y la imagen es cuadrada,
                // el centro del círculo debe coincidir con el centro del sprite.
                // El offset se calcula desde la esquina superior izquierda del frame del sprite.
                (this.width / 2) - physicalRadius,  // Offset X
                (this.height / 2) - physicalRadius // Offset Y
            );

            // Asegúrate de que el tamaño del display y el cuerpo físico sean coherentes.
            // Si el sprite es más grande que el círculo, el usuario verá fruta "flotando"
            // sobre un cuerpo invisible más pequeño, o partes que no colisionan.
            // Si el círculo es más grande, habrá colisiones "invisibles".

            // Otras propiedades físicas
            this.body.setCollideWorldBounds(true);
            this.body.setBounce(0.2);
            this.body.setFriction(0.5, 0.1);
            // this.body.setMass(this.fruitTypeIndex + 1); // Opcional: frutas más grandes más pesadas
        } else {
            console.error("Fruit body not available in _add_img for", this.fruitData.key);
        }
    }

    // Este método de GamesGameObjects configura un colisionador rectangular.
    // Como estamos usando un círculo, no necesitamos su lógica por defecto.
    _set_colliders(size_x = 0.8, size_y = 0.8) {
        // No llamar a super._set_colliders()
        // La configuración del círculo se hace en _add_img.
    }

    enter() {
        super.enter();
        this.setActive(true);
        if (this.body) {
            this.body.setEnable(true);
        }
        this.isMerging = false;
    }

    exit() {
        super.exit();
    }
}

export default Fruit;