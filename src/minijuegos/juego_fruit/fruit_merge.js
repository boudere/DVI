import { DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js'; // SCENE_MANAGER might not be needed directly
import Games from '/src/minijuegos/games.js'; // Corrected 'Game' to 'Games' to match your FruitMerge
// Assuming these classes from 'juego_discoteca' are generic enough:
import Persona from '/src/minijuegos/juego_fruit/game_objects/sprites/cafex.js';
import Fondo from '/src/minijuegos/juego_fruit/game_objects/sprites/fondo.js';
import PantallaInicio from '/src/minijuegos/juego_fruit/pantallas/pantalla_inicio.js';
import PantallaFinal from '/src/minijuegos/juego_fruit/pantallas/pantalla_final.js';

// You would need to add this new key to your scene_data.js or constants file
export const JUEGO_FRUIT = 'JuegoFruit';

class JuegoFruit extends Games {
    constructor() {
        super({ key: JUEGO_FRUIT });

        // Define logical image keys for this game.
        // These keys MUST be configured in your DATA_INFO setup to point to actual image assets.
        const sprites = {
            PLAYER_FRUIT_IMG: 'cafex',        // Logical key for the player fruit (e.g., the 'cafex' image)
            OBSTACLE_FRUIT_IMG: 'quesadillax',// Logical key for the obstacle fruit (e.g., 'quesadillax')
            FONDO_IMG: 'fondoFruit',          // Logical key for the background from FruitMerge
            PANTALLA_INICIO: 'pantalla_inicio_fruit', // New logical key
            PANTALLA_FINAL: 'pantalla_final_fruit'    // New logical key
        };

        this.PLAYER_FRUIT_IMG = sprites.PLAYER_FRUIT_IMG;
        this.OBSTACLE_FRUIT_IMG = sprites.OBSTACLE_FRUIT_IMG;
        this.FONDO_IMG = sprites.FONDO_IMG;
        this.PANTALLA_INICIO_KEY = sprites.PANTALLA_INICIO; // Store the key
        this.PANTALLA_FINAL_KEY = sprites.PANTALLA_FINAL;   // Store the key

        // --- IMPORTANT: Adjust these dimensions based on your actual fruit sprite assets ---
        // Dimensions for the 'cafex' sprite (or whatever you choose for the player)
        this.playerFruitWidth = 100; // Example: intrinsic width of cafex.png
        this.playerFruitHeight = 100; // Example: intrinsic height of cafex.png

        // Dimensions for the 'quesadillax' sprite (or obstacle sprite)
        this.obstacleFruitWidth = 200; // Example: intrinsic width of quesadillax.png
        this.obstacleFruitHeight = 200; // Example: intrinsic height of quesadillax.png

        // Dimensions for the 'fondoFruit' sprite
        this.fondoWidth = 1536; // Example: intrinsic width of fondoFruit.png
        this.fondoHeight = 1024; // Example: intrinsic height of fondoFruit.png
        // --- END OF DIMENSION ADJUSTMENTS ---

        this.started = false;
        this.losing = false; // Initialize losing flag
    }

    create() {
        this.obstaculossaltados = 0;
        this.losing = false; // Reset on create/restart
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);
        // this.scene.get(MINIJUEGO_MANAGER).play_music(this.DISCOTECA_MUSICA); // Music removed/changed

        this.obstaculos = [];
        this._crear_fondo();
        this._crear_persona(); // This will now create a fruit player
        this._crear_marcador();
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();

        this.cursors = this.input.keyboard.createCursorKeys(); // Keep for potential keyboard input

        this.pointerDownEvent = this.input.on('pointerdown', () => {
            if (!this.started || !this.persona || this.losing) return;
            this.persona.setVelocityY(-450); // Adjusted velocity for potentially different feel
        });

        this.game_created();
    }

    enter() {
        super.enter();
        this.losing = false; // Reset losing state when entering
        this.obstaculossaltados = 0; // Reset score
        if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);

        // Clear old obstacles if any
        this._clear_obstacles();

        if (this.persona) {
            this.persona.setPosition(175, this.SCREEN_HEIGHT * 0.5);
            this.persona.setVelocity(0,0);
            this.persona.clearTint();
            this.persona.setActive(true).setVisible(true);
        }
        this.physics.resume();


        if (this.pantalla_inicio) this.pantalla_inicio.enter();
        else {
            console.warn("Pantalla de inicio no disponible para JuegoFruitFlap");
            this.start_game(); // Directly start if no screen
        }
    }

    start_game() {
        super.start_game(); // Call super if it does anything
        this.losing = false;
        this.obstaculossaltados = 0;
        if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);


        if (this.pantalla_inicio && typeof this.pantalla_inicio.exit === 'function') {
            this.pantalla_inicio.exit();
        }

        if(this.fondo && typeof this.fondo.enter === 'function') this.fondo.enter();
        if(this.persona && typeof this.persona.enter === 'function') {
            this.persona.setPosition(175, this.SCREEN_HEIGHT * 0.5); // Reset position
            this.persona.setVelocity(0,0); // Reset velocity
            this.persona.clearTint();
            this.persona.setActive(true).setVisible(true);
            this.persona.enter();
        }


        this._clear_obstacles(); // Clear any existing obstacles before starting
        this._next_obstaculo();
        this.started = true;
        this.physics.resume(); // Ensure physics is running
    }

    finnish_game() { // Name kept from original
        if (this.pantalla_final && typeof this.pantalla_final.exit === 'function') {
            this.pantalla_final.exit();
        }
        this._clean_up(); // Calls physics.pause()

        this.scene.get(MINIJUEGO_MANAGER).return_to_dialogo();
    }

    _clear_obstacles() {
        this.obstaculos.forEach(obstaculo => {
            if (obstaculo.superior) obstaculo.superior.destroy();
            if (obstaculo.inferior) obstaculo.inferior.destroy();
        });
        this.obstaculos = [];
    }

    _crear_marcador() {
        this.contadorTexto = this.add.text(
            this.SCREEN_WIDTH - 50, 50,
            `Puntuación: ${this.obstaculossaltados}`,
            {
                fontSize: '40px',
                fill: '#ffffff', // White text, good for most backgrounds
                fontFamily: 'Arial, sans-serif', // More generic font
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(1, 0).setDepth(100); // Ensure it's on top
    }

    _crear_fondo() {
        let x = 0;
        let y = 0;
        // Calculate scale to fit the screen, preserving aspect ratio or stretching
        // This assumes you want to stretch. If not, you'd use Math.max or cover logic.
        let scale_x = this.SCREEN_WIDTH / this.fondoWidth;
        let scale_y = this.SCREEN_HEIGHT / this.fondoHeight;

        // The Fondo class is from 'juego_discoteca', it needs this.FONDO_IMG to be set.
        // It will internally use data_info_scene.get_img(MINIJUEGO_MANAGER, this.FONDO_IMG)
        // For this to work, Fondo's constructor or creation method must be adapted to use `scene.FONDO_IMG`
        // or receive the logical key directly.
        // Let's assume Fondo's constructor has been updated to: new Fondo(scene, x, y, scale_x, scale_y, logicalImageKey)
        // OR, more likely, that the `Fondo` class uses `scene.FONDO_IMG` if `scene` is `this` (the game scene).
        this.fondo = new Fondo(this, x, y, scale_x, scale_y); // Pass `this` as scene
        this.fondo.setOrigin(0, 0);
    }

    _crear_persona() {
        let x = 175;
        let y = this.SCREEN_HEIGHT * 0.5;
        // Target display size for the player fruit
        const targetPlayerDisplaySize = 80; // pixels (e.g., diameter if somewhat circular)
        let scale = targetPlayerDisplaySize / Math.max(this.playerFruitWidth, this.playerFruitHeight); // Maintain aspect ratio

        // The Persona class from 'juego_discoteca' needs this.PERSONA_IMG to be set.
        // It will internally use data_info_scene.get_img(MINIJUEGO_MANAGER, this.PERSONA_IMG)
        // For this to work, Persona's constructor must be adapted like Fondo.
        // We pass 'this' as the scene. The Persona class will need to use `scene.PLAYER_FRUIT_IMG`
        this.persona = new Persona(this, x, y, scale, scale); // Assuming Persona takes scene, x, y, scaleX, scaleY
        // If Persona takes specific width/height for scaling factor calculation:
        // this.persona = new Persona(this, x, y, targetPlayerDisplaySize / this.playerFruitWidth, targetPlayerDisplaySize / this.playerFruitHeight);
    }

    _crear_pantalla_inicio() {
        let x = 0; // Centered by the PantallaInicio class usually
        let y = 0;
        let imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_INICIO_KEY);

        if (imgData && imgData.key) {
            this.pantalla_inicio = new PantallaInicio(this, x, y, imgData); // Pass full imgData
        } else {
            console.warn(`[${this.sys.settings.key}] Imagen para pantalla de inicio con clave lógica '${this.PANTALLA_INICIO_KEY}' no encontrada.`);
            // Fallback: create a mock object if PantallaInicio expects a texture key
             this.pantalla_inicio = { enter: () => this.start_game(), exit: () => {}, destroy: () => {} };
        }
    }

    _crear_pantalla_final() {
        let x = 0;
        let y = 0;
        let imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_FINAL_KEY);

        if (imgData && imgData.key) {
            this.pantalla_final = new PantallaFinal(this, x, y, imgData); // Pass full imgData
        } else {
            console.warn(`[${this.sys.settings.key}] Imagen para pantalla final con clave lógica '${this.PANTALLA_FINAL_KEY}' no encontrada.`);
            this.pantalla_final = { enter: () => this.finnish_game(), exit: () => {}, destroy: () => {} };
        }
    }

    _next_obstaculo() {
        if (this.losing || !this.started) return; // Don't spawn if game over or not started
        const delay = Phaser.Math.Between(1500, 2500); // Time between obstacle spawns
        this.timerEvent = this.time.delayedCall(delay, () => {
            this._spawn_obstaculo();
            this._next_obstaculo(); // Schedule next one
        });
    }

    _spawn_obstaculo() {
        if (this.losing || !this.started) return;

        const gapHeight = 250; // Height of the gap for the player to fly through
        const obstaclePipeWidth = 120; // Visual width of the "pipe" sections

        const x = this.SCREEN_WIDTH + obstaclePipeWidth / 2; // Start off-screen to the right
        const minGapY = 100; // Minimum Y for the top of the gap
        const maxGapY = this.SCREEN_HEIGHT - 100 - gapHeight; // Maximum Y for the top of the gap
        const gapTopY = Phaser.Math.Between(minGapY, maxGapY);

        // Get the actual texture key for the obstacle fruit
        const imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OBSTACLE_FRUIT_IMG);
        if (!imgData || !imgData.key) {
            console.warn(`[${this.sys.settings.key}] Obstacle image '${this.OBSTACLE_FRUIT_IMG}' not found.`);
            return; // Can't spawn obstacle
        }
        const obstacleTextureKey = imgData.key;

        // Top obstacle part
        const topObstacleHeight = gapTopY;
        const tuboSuperior = this.physics.add.sprite(x, gapTopY / 2, obstacleTextureKey)
            .setOrigin(0.5, 0.5);
        tuboSuperior.displayWidth = obstaclePipeWidth;
        tuboSuperior.displayHeight = topObstacleHeight;
        // tuboSuperior.setFlipY(true); // Optional: flip if the sprite looks better as a bottom part

        // Bottom obstacle part
        const bottomObstacleY = gapTopY + gapHeight;
        const bottomObstacleHeight = this.SCREEN_HEIGHT - bottomObstacleY;
        const tuboInferior = this.physics.add.sprite(x, bottomObstacleY + bottomObstacleHeight / 2, obstacleTextureKey)
            .setOrigin(0.5, 0.5);
        tuboInferior.displayWidth = obstaclePipeWidth;
        tuboInferior.displayHeight = bottomObstacleHeight;

        // Physics for obstacles
        [tuboSuperior, tuboInferior].forEach(tubo => {
            tubo.setVelocityX(-200); // Speed at which obstacles move left
            tubo.setImmovable(true); // Obstacles should not be moved by player collision
            tubo.body.setAllowGravity(false); // Obstacles are not affected by gravity
            tubo.refreshBody(); // Apply changes to physics body
        });

        // Add colliders
        if (this.persona) {
            this.physics.add.collider(this.persona, tuboInferior, this._game_over, null, this);
            this.physics.add.collider(this.persona, tuboSuperior, this._game_over, null, this);
        }

        this.obstaculos.push({ superior: tuboSuperior, inferior: tuboInferior, contado: false });
    }

    _game_over() {
        if (this.losing) return;
        this.losing = true;
        this.started = false; // Stop new obstacles from spawning via _next_obstaculo checks

        if (this.persona) {
            this.persona.setTint(0xff0000); // Tint player red
            this.persona.setVelocityX(0); // Stop horizontal movement if any
        }
        this.physics.pause(); // Pause all physics
        if (this.timerEvent) this.timerEvent.remove(false); // Stop spawning new obstacles

        // Stop music if any:
        // this.scene.get(MINIJUEGO_MANAGER).stop_music(this.CURRENT_MUSIC_KEY);

        const textoGameOver = this.add.text(
            this.SCREEN_WIDTH / 2,
            this.SCREEN_HEIGHT / 2 - 50, // Slightly above center
            '¡FRUTA APLASTADA!', // Themed game over text
            {
                fontSize: '56px', // Adjusted size
                fill: '#ff6347', // Tomato color
                fontFamily: 'Arial Black, Gadget, sans-serif', // Impactful font
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(200); // Ensure it's on top

        this.time.delayedCall(2000, () => { // Use delayedCall for scene context
            textoGameOver.destroy();
            if (this.pantalla_final && typeof this.pantalla_final.enter === 'function') {
                 this.pantalla_final.enter({ score: this.obstaculossaltados }); // Pass score
            } else {
                this.finnish_game();
            }
        });
    }

    update(time, delta) { // Renamed from _update
        if (!this.started || this.losing || !this.persona) return;

        // Keep player upright (optional, Flappy Bird usually rotates)
        // this.persona.setAngle(0);

        // If player hits top or bottom of screen
        if (this.persona.y < 0 + this.persona.displayHeight / 2 || this.persona.y > this.SCREEN_HEIGHT - this.persona.displayHeight / 2) {
            if (this.persona.body && (this.persona.body.blocked.up || this.persona.body.blocked.down)) {
                 this._game_over();
                 return; // Important to return after game over
            }
        }


        // Score and obstacle cleanup
        for (let i = this.obstaculos.length - 1; i >= 0; i--) {
            const obstaculoPair = this.obstaculos[i];
            const tubo = obstaculoPair.inferior; // Use one of the pipes for X position check

            if (tubo.x < this.persona.x - this.persona.displayWidth/2 && !obstaculoPair.contado) {
                this.obstaculossaltados++;
                this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);
                obstaculoPair.contado = true;
            }

            // Remove obstacles that have passed off screen
            if (tubo.x < -tubo.displayWidth) {
                obstaculoPair.superior.destroy();
                obstaculoPair.inferior.destroy();
                this.obstaculos.splice(i, 1);
            }
        }
    }

    _clean_up() {
        super._clean_up && super._clean_up(); // If Games has a _clean_up

        if (this.pointerDownEvent) {
            this.input.off('pointerdown', this.pointerDownEvent.callback, this.pointerDownEvent.context);
            this.pointerDownEvent = null; // Clear the reference
        }
        if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }
        this.time.removeAllEvents(); // Clear any other delayed calls
        this.physics.pause(); // Pause physics

        if (this.persona) {
            this.persona.destroy();
            this.persona = null;
        }
        if (this.fondo) {
            this.fondo.destroy();
            this.fondo = null;
        }
        if (this.contadorTexto) {
            this.contadorTexto.destroy();
            this.contadorTexto = null;
        }

        this._clear_obstacles(); // Ensure all obstacle sprites are destroyed

        // Destroy screens if they have a destroy method
        if (this.pantalla_inicio && typeof this.pantalla_inicio.destroy === 'function') this.pantalla_inicio.destroy();
        if (this.pantalla_final && typeof this.pantalla_final.destroy === 'function') this.pantalla_final.destroy();
        this.pantalla_inicio = null;
        this.pantalla_final = null;

        this.started = false;
        this.losing = false;
    }

    shutdown() { // Phaser's scene lifecycle method
        this._clean_up();
    }
}

export default JuegoFruit;