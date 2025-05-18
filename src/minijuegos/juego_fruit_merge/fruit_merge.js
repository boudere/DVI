import { MINIJUEGO_MANAGER, DATA_INFO, SCENE_MANAGER } from '/src/data/scene_data.js';
import Games from '/src/minijuegos/games.js';
import Fruit from '/src/minijuegos/juego_fruit_merge/game_objects/sprites/fruit.js';
import PantallaInicioDefault from "/src/minijuegos/juego_fruit_merge/pantallas/pantalla_inicio"; 
import PantallaFinalDefault from "/src/minijuegos/juego_fruit_merge/pantallas/pantalla_final"; 

// Define tus tipos de fruta. Necesitarás las imágenes correspondientes.
// El 'next' indica el índice de la fruta a la que se transforma al fusionarse. 'null' para la más grande.
// El 'radius_factor' es un multiplicador para el radio del cuerpo físico respecto al ancho de la imagen.
export const FRUIT_TYPES = [
    { key: 'fruta_cereza_img', radius_factor: 0.45, points: 10, next: 1, color: 0xff0000 },   // 0: Cereza
    { key: 'fruta_fresa_img', radius_factor: 0.45, points: 20, next: 2, color: 0xff69b4 },    // 1: Fresa
    { key: 'fruta_uva_img', radius_factor: 0.45, points: 30, next: 3, color: 0x800080 },      // 2: Uva
    { key: 'fruta_naranja_img', radius_factor: 0.45, points: 40, next: 4, color: 0xffa500 },   // 3: Naranja
    { key: 'fruta_manzana_img', radius_factor: 0.45, points: 50, next: 5, color: 0x00ff00 },   // 4: Manzana
    { key: 'fruta_melon_img', radius_factor: 0.45, points: 100, next: null, color: 0x90ee90 } // 5: Melón (más grande)
];

const JUEGO_FRUIT = 'JuegoFruit'; 

class JuegoFruitMerge extends Games {
    constructor() {
        super({ key: JUEGO_FRUIT });

        // Nombres de imágenes para pantallas (debes tener estas imágenes)
        this.PANTALLA_INICIO_IMG = 'pantalla_inicio';
        this.PANTALLA_FINAL_IMG = 'pantalla_final';
        this.FONDO_IMG = 'fondoFruit'; // Imagen de fondo para el juego

        this.FRUIT_DROP_Y = 100; // Altura desde donde cae la fruta
        this.GAME_OVER_LINE_Y = 150; // Altura de la línea de game over

        this.currentFruit = null;
        this.nextFruitPreview = null;
        this.canDrop = false;
        this.score = 0;
        this.fruitsGroup = null;
        this.isGameOver = false;
    }

    preload() {
        // Si DATA_INFO no precarga, puedes hacerlo aquí
        // Por ejemplo: FRUIT_TYPES.forEach(ft => this.load.image(ft.key, `path/to/${ft.key}.png`));
        // this.load.image(this.PANTALLA_INICIO_IMG, `path/to/${this.PANTALLA_INICIO_IMG}.png`);
        // this.load.image(this.PANTALLA_FINAL_IMG, `path/to/${this.PANTALLA_FINAL_IMG}.png`);
        // this.load.image(this.FONDO_IMG, `path/to/${this.FONDO_IMG}.png`);
    }

    create() {
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;
        this.data_info_scene = this.scene.get(DATA_INFO);

        // 1. Fondo
        const fondoImgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.FONDO_IMG);
        if (fondoImgData && fondoImgData.key) {
            this.add.image(this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2, fondoImgData.key)
                .setDisplaySize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        } else {
            console.warn(`Imagen de fondo ${this.FONDO_IMG} no encontrada.`);
            this.cameras.main.setBackgroundColor('#abcdef'); // Color de fondo por defecto
        }


        // 2. Límites del juego (contenedor)
        const wallThickness = 20;
        const containerWidth = this.SCREEN_WIDTH * 0.6; // Ancho del área de juego
        const containerHeight = this.SCREEN_HEIGHT * 0.8;
        const containerX = (this.SCREEN_WIDTH - containerWidth) / 2;
        const containerY = this.SCREEN_HEIGHT - containerHeight - 50; // Un poco arriba del fondo

        // Visualización del contenedor (opcional)
        this.add.graphics()
            .fillStyle(0x000000, 0.2)
            .fillRect(containerX, containerY, containerWidth, containerHeight)
            .lineStyle(2, 0xffffff)
            .strokeRect(containerX, containerY, containerWidth, containerHeight);


        this.physics.world.setBounds(containerX, containerY, containerWidth, containerHeight);
        
        // Ajustar gravedad si es necesario
        this.physics.world.gravity.y = 300;

        // 3. Línea de Game Over
        this.gameOverLine = this.add.graphics({ lineStyle: { width: 4, color: 0xff0000, alpha: 0.5 } });
        this.gameOverLine.strokeLineShape(new Phaser.Geom.Line(
            containerX, 
            containerY + this.GAME_OVER_LINE_Y, 
            containerX + containerWidth, 
            containerY + this.GAME_OVER_LINE_Y
        ));
        this.gameOverLine.setDepth(1000); // Asegurar que esté visible

        // 4. Grupo para las frutas con física
        this.fruitsGroup = this.physics.add.group();

        // Colisión entre frutas
        this.physics.add.collider(this.fruitsGroup, this.fruitsGroup, this.handleFruitCollision, null, this);
        
        // Colisión con los límites del mundo (ya configurado por setBounds en el grupo, pero individualmente también)
        // this.physics.add.collider(this.fruitsGroup, this.leftWall); // Si crearas paredes individuales
        // this.physics.add.collider(this.fruitsGroup, this.rightWall);
        // this.physics.add.collider(this.fruitsGroup, this.floor);


        // 5. Puntuación
        this.scoreText = this.add.text(containerX + containerWidth - 20, containerY + 20, `Puntos: 0`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(1, 0).setDepth(1001);

        // 6. Lógica de control
        this.input.on('pointerdown', this.dropFruit, this);
        this.input.on('pointermove', this.movePreviewFruit, this);

        // 7. Pantallas
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();

        this.game_created(); // Notifica al manager que el juego está listo
    }

    _crear_pantalla_inicio() {
        let imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_INICIO_IMG);
        if (!imgData || !imgData.key) {
            console.warn(`Imagen ${this.PANTALLA_INICIO_IMG} no encontrada para pantalla de inicio.`);
            // Usar un color o texto por defecto si la imagen no está
            this.pantalla_inicio = { enter: () => this.start_game(), exit: () => {} }; // Mock object
            return;
        }
        this.pantalla_inicio = new PantallaInicioDefault(this, 0, 0, imgData.key);
    }

    _crear_pantalla_final() {
        let imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_FINAL_IMG);
         if (!imgData || !imgData.key) {
            console.warn(`Imagen ${this.PANTALLA_FINAL_IMG} no encontrada para pantalla final.`);
            this.pantalla_final = { enter: () => this.finnish_game(), exit: () => {} }; // Mock object
            return;
        }
        this.pantalla_final = new PantallaFinalDefault(this, 0, 0, imgData.key);
    }

    enter() {
        super.enter();
        this.isGameOver = false;
        this.score = 0;
        this.updateScoreDisplay();
        if (this.fruitsGroup) this.fruitsGroup.clear(true, true); // Limpiar frutas de partidas anteriores
        
        // Asegurarse de que las pantallas existan antes de llamar a enter
        if (this.pantalla_inicio && typeof this.pantalla_inicio.enter === 'function') {
            this.pantalla_inicio.enter();
        } else {
            // Si no hay pantalla de inicio, iniciar el juego directamente
            console.warn("Pantalla de inicio no definida, iniciando juego directamente.");
            this.start_game();
        }
    }

    start_game() {
        super.start_game();
        if (this.pantalla_inicio && typeof this.pantalla_inicio.exit === 'function') {
            this.pantalla_inicio.exit();
        }
        this.canDrop = true;
        this.isGameOver = false;
        this.spawnNextFruitPreview();
        this.scene.get(MINIJUEGO_MANAGER).play_music('fruit_merge_music'); // Asume que tienes una música
    }

    spawnNextFruitPreview() {
        if (this.nextFruitPreview) {
            this.nextFruitPreview.destroy();
        }
        if (this.isGameOver) return;

        const fruitTypeIndex = Phaser.Math.Between(0, Math.min(2, FRUIT_TYPES.length - 1)); // Suelta solo los primeros 3 tipos de frutas
        const fruitData = FRUIT_TYPES[fruitTypeIndex];
        
        // Usamos GamesGameObjects para la preview para poder reusar la lógica de carga de textura
        // pero no la añadimos al grupo de físicas principal aún.
        const previewImgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, fruitData.key);
        
        if (!previewImgData || !previewImgData.key) {
            console.error(`Imagen ${fruitData.key} no encontrada para preview.`);
            // Intentar con un placeholder si la imagen no carga
            this.nextFruitPreview = this.add.circle(this.input.x, this.FRUIT_DROP_Y, 20, fruitData.color || 0xcccccc).setAlpha(0.7);
            this.nextFruitPreview.fruitTypeIndex = fruitTypeIndex; // Guardar el tipo para cuando se suelte
            this.nextFruitPreview.isPlaceholder = true;
        } else {
            this.nextFruitPreview = this.add.sprite(this.input.x, this.FRUIT_DROP_Y, previewImgData.key).setAlpha(0.7);
            const scale = (fruitData.radius_factor * 2 * 100) / this.nextFruitPreview.width; // Asumimos un radio base de 100px para el factor
            this.nextFruitPreview.setScale(scale * 0.8); // Un poco más pequeño para preview
            this.nextFruitPreview.fruitTypeIndex = fruitTypeIndex;
            this.nextFruitPreview.isPlaceholder = false;
        }
        this.nextFruitPreview.setDepth(100); // Encima de otras frutas pero debajo de UI
        this.movePreviewFruit(this.input.activePointer); // Posicionar inmediatamente
    }
    
    movePreviewFruit(pointer) {
        if (!this.nextFruitPreview || !this.canDrop || this.isGameOver) return;
        
        const containerX = (this.SCREEN_WIDTH - (this.SCREEN_WIDTH * 0.6)) / 2;
        const containerWidth = this.SCREEN_WIDTH * 0.6;
        let previewRadius = 20; // default
        if(this.nextFruitPreview && !this.nextFruitPreview.isPlaceholder) {
            previewRadius = (this.nextFruitPreview.displayWidth / 2);
        } else if (this.nextFruitPreview && this.nextFruitPreview.isPlaceholder) {
            previewRadius = this.nextFruitPreview.radius; // Para el círculo de placeholder
        }

        this.nextFruitPreview.x = Phaser.Math.Clamp(
            pointer.x,
            containerX + previewRadius,
            containerX + containerWidth - previewRadius
        );
        this.nextFruitPreview.y = this.FRUIT_DROP_Y;
    }

    dropFruit(pointer) {
        if (!this.canDrop || !this.nextFruitPreview || this.isGameOver) return;

        this.canDrop = false; // Prevenir drops múltiples rápidos

        const fruitX = this.nextFruitPreview.x;
        const fruitTypeIndex = this.nextFruitPreview.fruitTypeIndex;
        
        this.nextFruitPreview.destroy();
        this.nextFruitPreview = null;

        const newFruit = new Fruit(this, fruitX, this.FRUIT_DROP_Y, fruitTypeIndex);
        this.fruitsGroup.add(newFruit);
        newFruit.enter(); // Para hacerlo visible y activar físicas si es necesario

        // Retraso antes de poder soltar la siguiente y generar la preview
        this.time.delayedCall(700, () => { // Aumentar delay si es necesario para que la fruta caiga
            if (!this.isGameOver) {
                 this.spawnNextFruitPreview();
                 this.canDrop = true;
            }
        });
    }

    handleFruitCollision(fruitA, fruitB) {
        if (fruitA.isMerging || fruitB.isMerging || this.isGameOver) return;
        if (fruitA.fruitTypeIndex === fruitB.fruitTypeIndex) {
            
            const currentTypeData = FRUIT_TYPES[fruitA.fruitTypeIndex];
            if (currentTypeData.next === null) return; // Ya es la fruta más grande

            fruitA.isMerging = true;
            fruitB.isMerging = true;

            const nextFruitTypeIndex = currentTypeData.next;
            const mergeX = (fruitA.x + fruitB.x) / 2;
            const mergeY = (fruitA.y + fruitB.y) / 2;

            // Efecto visual simple de merge
            this.tweens.add({
                targets: [fruitA, fruitB],
                alpha: 0,
                scale: 0,
                duration: 150,
                onComplete: () => {
                    fruitA.exit(); // Llama a destroy internamente
                    fruitB.exit();

                    if (this.isGameOver) return;

                    const mergedFruit = new Fruit(this, mergeX, mergeY, nextFruitTypeIndex);
                    this.fruitsGroup.add(mergedFruit);
                    mergedFruit.enter();
                    
                    // Pequeño impulso hacia arriba al fusionar
                    mergedFruit.setVelocityY(Phaser.Math.Between(-50, -100));


                    this.score += currentTypeData.points * 2; // Puntos por la fruta fusionada
                    this.updateScoreDisplay();
                }
            });
        }
    }
    
    updateScoreDisplay() {
        this.scoreText.setText(`Puntos: ${this.score}`);
    }

    _update(time, delta) { // Phaser llama a update, no _update
        super._update(time, delta);
        if (this.isGameOver || !this.canDrop) return;

        // Lógica de Game Over
        let highestFruitY = this.SCREEN_HEIGHT;
        let triggerGameOver = false;

        this.fruitsGroup.getChildren().forEach(fruit => {
            if (!fruit.body || !fruit.active) return;

            // Si una fruta está por encima de la línea Y DEL CONTENEDOR + LINEA DE GAME OVER
            // y está casi quieta (para evitar game over mientras caen)
            const containerY = this.SCREEN_HEIGHT - (this.SCREEN_HEIGHT * 0.8) - 50;
            const fruitTopY = fruit.y - fruit.body.halfHeight; // Usa el radio del cuerpo si es círculo

            if (fruitTopY < (containerY + this.GAME_OVER_LINE_Y) && Math.abs(fruit.body.velocity.y) < 1 && fruit.body.touching.down) {
                 // Verificar si ha estado quieta por un tiempo
                 if (!fruit.quietTimer) {
                    fruit.quietTimer = time;
                } else if (time - fruit.quietTimer > 1000) { // 1 segundo quieta arriba
                    triggerGameOver = true;
                }
            } else {
                fruit.quietTimer = null; // Resetear si se mueve o cae
            }
        });

        if (triggerGameOver) {
            this.gameOver();
        }
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.canDrop = false;
        
        if(this.nextFruitPreview) {
            this.nextFruitPreview.destroy();
            this.nextFruitPreview = null;
        }

        this.scene.get(MINIJUEGO_MANAGER).stop_music('fruit_merge_music');
        console.log("GAME OVER");

        const gameOverText = this.add.text(this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2, '¡FIN DEL JUEGO!', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'Arial Black',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(2000);

        // Guardar puntuación (si tienes un sistema para ello)
        // this.scene.get(MINIJUEGO_MANAGER).save_score(this.score);

        this.time.delayedCall(3000, () => {
            gameOverText.destroy();
            if (this.pantalla_final && typeof this.pantalla_final.enter === 'function') {
                 this.pantalla_final.enter({ score: this.score }); // Pasar puntuación a la pantalla final si es necesario
            } else {
                this.finnish_game(); // Salir directamente si no hay pantalla final
            }
        });
    }

    finnish_game() { // Corregido de 'finnish_game' a 'finish_game' si es un typo, o mantener si es intencional
        super.finnish_game(); // O 'finish_game'
        if (this.pantalla_final && typeof this.pantalla_final.exit === 'function') {
            this.pantalla_final.exit();
        }
        
        this.fruitsGroup.clear(true, true);
        this.isGameOver = false;
        this.canDrop = false;
        this.score = 0;
        this.updateScoreDisplay();

        // Volver al diálogo o escena principal
        this.scene.get(MINIJUEGO_MANAGER).return_to_dialogo();
    }

    _clean_up() { // Método de limpieza si es necesario al salir de la escena completamente
        super._clean_up && super._clean_up(); // Si existe en la clase Games
        this.input.off('pointerdown', this.dropFruit, this);
        this.input.off('pointermove', this.movePreviewFruit, this);
        if (this.fruitsGroup) {
            this.fruitsGroup.destroy(true); // Destruir el grupo y sus hijos
            this.fruitsGroup = null;
        }
        if (this.nextFruitPreview) {
            this.nextFruitPreview.destroy();
            this.nextFruitPreview = null;
        }
        if (this.scoreText) {
            this.scoreText.destroy();
            this.scoreText = null;
        }
        if (this.gameOverLine) {
            this.gameOverLine.destroy();
            this.gameOverLine = null;
        }
         if (this.pantalla_inicio && typeof this.pantalla_inicio.destroy === 'function') this.pantalla_inicio.destroy();
         if (this.pantalla_final && typeof this.pantalla_final.destroy === 'function') this.pantalla_final.destroy();

        this.time.removeAllEvents();
    }

    // Sobrescribir si es necesario
    exit() {
        this._clean_up(); // Llama a la limpieza personalizada
        super.exit(); // Llama al exit de la clase base (que en tu ejemplo está vacío)
    }
}

export default JuegoFruitMerge;