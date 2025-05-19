import { DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';
import Games from '/src/minijuegos/games.js';
// Assuming these classes from 'juego_discoteca' are generic enough:
import Cafex from '/src/minijuegos/juego_fruit/game_objects/sprites/cafex.js';
import Croasanx from '/src/minijuegos/juego_fruit/game_objects/sprites/croasanx.js';
// ... (other sprite imports remain the same)
import Fondo from '/src/minijuegos/juego_fruit/game_objects/sprites/fondo.js';
import PantallaInicio from '/src/minijuegos/juego_fruit/pantallas/pantalla_inicio.js';
import PantallaFinal from '/src/minijuegos/juego_fruit/pantallas/pantalla_final.js';

export const JUEGO_FRUIT = 'JuegoFruit';

class JuegoFruit extends Games {
    constructor() {
        super({ key: JUEGO_FRUIT });

        const sprites = {
            CAFEX_IMG: 'cafex',
            CROASANX_IMG: 'croasanx',
            FONDO_IMG: 'fondoFruit',
            PANTALLA_INICIO: 'pantalla_inicio_fruit',
            PANTALLA_FINAL: 'pantalla_final_fruit'
        };

        this.PLAYER_FRUIT_IMG = sprites.CAFEX_IMG;
        this.OBSTACLE_FRUIT_IMG = sprites.CROASANX_IMG;
        this.FONDO_IMG = sprites.FONDO_IMG;
        this.PANTALLA_INICIO_KEY = sprites.PANTALLA_INICIO;
        this.PANTALLA_FINAL_KEY = sprites.PANTALLA_FINAL;

        this.playerFruitWidth = 100;
        this.playerFruitHeight = 100;
        this.obstacleFruitWidth = 100;
        this.obstacleFruitHeight = 100;
        this.fondoWidth = 1536;
        this.fondoHeight = 1024;

        this.started = false;
        this.losing = false;
        this.gravityStarted = false;
        this.jumpHandler = null;
        this.loseButton = null;
        this.mouseMoveHandler = null;

        this.initialPlayerYFactor = 0.35; // This determines the initial height and thus the deathLine
        this.horizontalMouseMoveActive = true;

        this.deathLineY = 0;
        this.deathLineGraphics = null;
        this.deathLinePadding = 1; // Small padding to ensure the line is just above the player's head

        this.fallenPersonas = [];
    }

    create() {
        this.obstaculossaltados = 0;
        this.losing = false;
        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true;
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);

        this.obstaculos = [];
        this.fallenPersonas = [];

        this._crear_fondo();
        this._initial_player_and_deathline_setup(); // Sets up player and deathline based on player
        this._crear_marcador();
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();
        this._crear_boton_perder();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpHandler = () => {
            if (!this.gravityStarted && this.persona && !this.losing) {
                if (!this.started) {
                    if (!this.pantalla_inicio || (this.pantalla_inicio && !this.pantalla_inicio.visible)) {
                        this.started = true;
                    }
                }
                if (this.started) {
                    this.gravityStarted = true;
                    this.horizontalMouseMoveActive = false;

                    if (this.persona.body) {
                        this.persona.body.setAllowGravity(true);
                    }
                    if (this.obstaculos.length === 0 && (!this.timerEvent || this.timerEvent.getProgress() === 1)) {
                        this._next_obstaculo();
                    }
                }
            }
        };
        this.input.on('pointerdown', this.jumpHandler);

        this.mouseMoveHandler = (pointer) => {
            if (this.horizontalMouseMoveActive && this.persona && !this.losing) {
                this.persona.x = pointer.x;
                this.persona.x = Phaser.Math.Clamp(this.persona.x, this.persona.displayWidth / 2, this.SCREEN_WIDTH - this.persona.displayWidth / 2);
            }
        };
        this.input.on('pointermove', this.mouseMoveHandler);

        this.game_created();
    }

    _crear_linea_muerte() {
        if (this.deathLineGraphics) {
            this.deathLineGraphics.destroy();
        }
        this.deathLineGraphics = this.add.graphics();
        this.deathLineGraphics.lineStyle(4, 0xff0000, 1); // Red line
        this.deathLineGraphics.beginPath();
        this.deathLineGraphics.moveTo(0, this.deathLineY);
        this.deathLineGraphics.lineTo(this.SCREEN_WIDTH, this.deathLineY);
        this.deathLineGraphics.closePath();
        this.deathLineGraphics.strokePath();
        this.deathLineGraphics.setDepth(150); // Ensure it's visible
    }

    enter() {
        super.enter();
        this._full_game_reset();

        if (this.loseButton) this.loseButton.setVisible(true).setActive(true);
        if (this.deathLineGraphics) this.deathLineGraphics.setVisible(true);

        if (this.pantalla_inicio && typeof this.pantalla_inicio.enter === 'function') {
            this.pantalla_inicio.enter();
        } else {
            console.warn("Pantalla de inicio no disponible para JuegoFruit");
            this.start_game_logic();
        }
    }

    start_game() {
        super.start_game();
        // _full_game_reset is called by enter, which is usually called before start_game
        // but if start_game is called directly, ensure reset happens.
        if (!this.started) this._full_game_reset();


        if (this.pantalla_inicio && typeof this.pantalla_inicio.exit === 'function' && this.pantalla_inicio.visible) {
            this.pantalla_inicio.exit();
        }
        this.start_game_logic();
    }

    start_game_logic() {
        if(this.fondo && typeof this.fondo.enter === 'function') this.fondo.enter();
        
        this.started = true; // Crucial: ensure game is marked as started
        this.physics.resume();

        if (this.loseButton) this.loseButton.setVisible(true).setActive(true);
        if (this.deathLineGraphics) this.deathLineGraphics.setVisible(true);
        // If no obstacles and gravity isn't started, the jump handler will kick off _next_obstaculo.
        // If gravity IS started (e.g. after a respawn), we might need to kick it off here if appropriate.
        // However, current logic has _next_obstaculo tied to gravityStarted being true.
    }


    _full_game_reset() {
        this.losing = false;
        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true;
        this.obstaculossaltados = 0;
        if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);

        this._clear_obstacles();
        if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }

        this.fallenPersonas.forEach(p => { if (p && p.destroy) p.destroy(); });
        this.fallenPersonas = [];

        if (this.persona) {
            this.persona.destroy();
            this.persona = null;
        }
        
        this._setup_new_active_player(); // This will also setup colliders with any (now empty) fallenPersonas
    }

    _setup_new_active_player() {
        const x = this.SCREEN_WIDTH / 2;
        const y_inicial_persona = this.SCREEN_HEIGHT * this.initialPlayerYFactor; // Use the factor
        const targetPlayerDisplaySize = 80; // Desired visual size
        const scale = targetPlayerDisplaySize / Math.max(this.playerFruitWidth, this.playerFruitHeight);

        this.persona = new Cafex(this, x, y_inicial_persona, scale, scale);
        this.persona.setDepth(10); // Active player on top

        if (this.persona.body) {
            this.persona.setCollideWorldBounds(true);
            this.persona.body.setAllowGravity(false); // Gravity off initially
            this.persona.body.gravity.y = 800; // Set standard gravity for when it's enabled
            this.persona.setVelocity(0,0); // Reset velocity
            this.persona.clearTint();
            this.persona.setAlpha(1);
            this.persona.setActive(true).setVisible(true);
            this.persona.body.setEnable(true); // Ensure physics body is enabled

            // Add colliders between the new active persona and all existing fallen personas
            this.fallenPersonas.forEach(fallen => {
                if (fallen && fallen.active && fallen.body && fallen.body.enable) { // Check if fallen still exists and is collidable
                    this.physics.add.collider(this.persona, fallen, () => {
                        if (this.losing) return; // Evitar múltiples game overs

                        // Conditions for game over:
                        // 1. Active player is actually falling (gravity started for it)
                        // 2. Active player is landing on top of a fallen player
                        // 3. The top of the active player is at or above the deathLineY
                        const isLandingOnTop = this.persona.body.touching.down && fallen.body.touching.up;
                        const isActiveFalling = this.gravityStarted; // Was gravity initiated for this jump/fall?

                        if (isLandingOnTop && isActiveFalling) {
                            const activePlayerTopY = this.persona.y - (this.persona.displayHeight / 2);
                            const isAtOrAboveDeathLine = activePlayerTopY <= this.deathLineY;

                            if (isAtOrAboveDeathLine) {
                                // Additional check: ensure they are reasonably overlapped horizontally
                                // and that the active player is indeed physically above the fallen one,
                                // as `touching` can sometimes be sensitive at edges.
                                const horizontalOverlap = Math.abs(this.persona.x - fallen.x) < (this.persona.displayWidth / 2 + fallen.displayWidth / 2) * 0.9; // 90% overlap needed
                                const isPersonaPhysicallyAboveFallen = this.persona.y < fallen.y; // Check vertical position

                                if (horizontalOverlap && isPersonaPhysicallyAboveFallen) {
                                    this._game_over('colision_jugador_caido');
                                }
                            }
                            // If not at or above death line, it's a normal landing on a fallen player.
                            // The player might just sit there, or if the fallen player is sloped, might slide.
                            // Current logic will treat this as "hitting the ground" via onFloor() eventually if it rests.
                        }
                    }, null, this);
                }
            });

        } else {
            // This can happen if the sprite's body isn't created in the same frame.
            // Phaser usually handles this, but good to be aware.
            console.warn("New persona body not immediately available during _setup_new_active_player. Colliders with fallen might be missed for this instance.");
        }
    }

    _handle_ground_hit_and_respawn() {
        if (this.losing || !this.persona || !this.persona.body || !this.gravityStarted) return;

        // Current persona becomes a "fallen" one
        if (this.persona && this.persona.body) {
            this.persona.body.setVelocity(0, 0); // Stop it
            this.persona.body.setAllowGravity(false); // Stop further gravity effects
            this.persona.body.setImmovable(true); // Make it a static platform
            
            // Visual cue for fallen persona
            this.persona.setAlpha(0.4); // Make it somewhat transparent
            this.persona.setDepth(1);   // Send it to a lower depth
        }
        this.fallenPersonas.push(this.persona);

        // Reset for the new "life" or attempt
        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true; // Allow mouse movement for new persona
        this.obstaculossaltados = 0; // Reset score for this "life"
        if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);

        this._clear_obstacles(); // Clear existing pipes
        if (this.timerEvent) { // Stop any pending obstacle spawns
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }

        // Setup the new active player
        this._setup_new_active_player();
        // Note: _next_obstaculo will be triggered by the next jumpHandler event
    }


    finnish_game() {
        if (this.pantalla_final && typeof this.pantalla_final.exit === 'function') {
            this.pantalla_final.exit();
        }
        this._clean_up();
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
                fill: '#ffffff',
                fontFamily: 'Arial, sans-serif',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(1, 0).setDepth(100);
    }

    _crear_fondo() {
        let x = 0;
        let y = 0;
        let scale_x = this.SCREEN_WIDTH / this.fondoWidth;
        let scale_y = this.SCREEN_HEIGHT / this.fondoHeight;
        this.fondo = new Fondo(this, x, y, scale_x, scale_y);
        this.fondo.setOrigin(0, 0);
    }

    _initial_player_and_deathline_setup() {
        // First, create the player to get its dimensions
        this._setup_new_active_player(); 

        // Then, set up the death line based on the player's initial position and height
        if (this.persona && this.persona.displayHeight > 0) {
            const y_inicial_persona = this.SCREEN_HEIGHT * this.initialPlayerYFactor;
            // The death line is slightly above the initial resting position of the player's head
            this.deathLineY = y_inicial_persona - (this.persona.displayHeight / 2) - this.deathLinePadding;
            this.deathLineY = Math.max(this.deathLineY, 0); // Ensure it's not off-screen (top)
            this._crear_linea_muerte();
        } else {
            console.error("Cannot create deathline accurately, persona not fully initialized or displayHeight is zero.");
            // Fallback deathline if player isn't ready (should ideally not happen with current flow)
            this.deathLineY = this.SCREEN_HEIGHT * 0.1; // Default to 10% from top
            this._crear_linea_muerte();
        }
    }

    _crear_pantalla_inicio() {
        let x = 0;
        let y = 0;
        let imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_INICIO_KEY);

        if (imgData && imgData.key) {
            this.pantalla_inicio = new PantallaInicio(this, x, y, imgData);
        } else {
            console.warn(`[${this.sys.settings.key}] Imagen para pantalla de inicio con clave lógica '${this.PANTALLA_INICIO_KEY}' no encontrada.`);
            // Create a dummy object so the game doesn't crash if it's missing
            this.pantalla_inicio = { 
                enter: () => {
                    // If no start screen, start game logic directly if not already started
                    if(!this.started) this.start_game_logic(); 
                }, 
                exit: () => {}, 
                destroy: () => {},
                visible: false // Assume not visible if dummy
            };
        }
    }

    _crear_pantalla_final() {
        let x = 0;
        let y = 0;
        let imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_FINAL_KEY);

        if (imgData && imgData.key) {
            this.pantalla_final = new PantallaFinal(this, x, y, imgData);
        } else {
            console.warn(`[${this.sys.settings.key}] Imagen para pantalla final con clave lógica '${this.PANTALLA_FINAL_KEY}' no encontrada.`);
            this.pantalla_final = { enter: (data) => this.finnish_game(), exit: () => {}, destroy: () => {} };
        }
    }

     _crear_boton_perder() {
        const padding = 50;

        this.loseButton = this.add.text(
            padding,
            padding,
            'Abandonar Partida',
            {
                fontSize: '40px',
                fill: '#000000',
                backgroundColor: '#ff877e', // A reddish color
                padding: { x: 10, y: 7 },
                fontFamily: 'Arial, sans-serif'
            }
        )
        .setOrigin(0, 0)
        .setDepth(200) // High depth to be on top
        .setInteractive({ useHandCursor: true });

        this.loseButton.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation(); // Prevent click from triggering jumpHandler
            if (this.started && !this.losing) {
                this._game_over('boton');
            }
        });

        // Initially hidden, shown when game starts
        this.loseButton.setVisible(false).setActive(false);
    }


    _next_obstaculo() {
        if (this.losing || !this.started || !this.gravityStarted) return; // Only spawn if game is active and player is falling

        const delay = Phaser.Math.Between(1500, 2500); // Time between obstacle sets
        this.timerEvent = this.time.delayedCall(delay, () => {
            this._spawn_obstaculo();
            // Schedule the next one only if the game is still running
             if (!this.losing && this.started && this.gravityStarted) { // Check again before scheduling next
                this._next_obstaculo();
            }
        });
    }

    _spawn_obstaculo() {
        if (this.losing || !this.started || !this.gravityStarted) return;

        const gapHeight = 250; // Vertical space for player to pass through
        const obstaclePipeWidth = 120; // Width of the pipes

        const x_pos = this.SCREEN_WIDTH + obstaclePipeWidth / 2; // Spawn off-screen to the right

        // Determine vertical position of the gap
        // Gap should not be too close to the top or bottom, and also consider deathLineY
        const minGapY = 100; // Minimum y for the top of the gap (from screen top)
        // Max Y for the top of the gap, ensuring space for gap and bottom pipe,
        // and also ensuring the gap isn't *entirely* above a very high deathLine.
        // The gap's top should be below the death line or just slightly above it to allow passage.
        // Let's try to keep the gap's top (gapTopY) at least a bit below the deathLine if possible,
        // or allow it to be slightly above if deathLine is very low.
        // The player needs to pass through, so the gap itself must be below the deathLine.
        // We want `gapTopY > deathLineY` to be possible.
        // The player's center will be at `gapTopY + gapHeight / 2`.
        // The player's top will be at `gapTopY + gapHeight / 2 - playerHeight / 2`.
        // This must be `< deathLineY`.  No, this is wrong.
        // The *top of the gap opening* (gapTopY) must be below deathLineY, or player can't enter it from above.
        // The *bottom of the gap opening* (gapTopY + gapHeight) must be above the floor.

        // Let's make sure the gap is mostly below the death line to be passable
        // Max y for the *top of the gap*.
        const maxGapYConsiderandoDeathLine = Math.min(
            this.SCREEN_HEIGHT - gapHeight - 100, // Ensure room for bottom pipe and some margin
            this.deathLineY + 50 // Allow gap to start a bit above deathline if needed for player to pass
        );
        
        let finalMaxGapY = maxGapYConsiderandoDeathLine;
        if (finalMaxGapY <= minGapY) { // Safety if deathLine is very high or screen very small
            // Fallback: prioritize screen boundaries if deathline constraint is too tight
            finalMaxGapY = this.SCREEN_HEIGHT - gapHeight - 100;
            // If still problematic, adjust minGapY too
            if (finalMaxGapY <= minGapY) {
                // This case means screen is extremely constrained.
                // Try to ensure gap can exist at all.
                minGapY = Math.max(this.deathLineY + 10, 50); // Gap must start below deathline + player clearance
                finalMaxGapY = minGapY + gapHeight; // Make gap just barely possible
                 if (finalMaxGapY >= this.SCREEN_HEIGHT - 100) { // If this pushes it too low
                    finalMaxGapY = this.SCREEN_HEIGHT - 100 -1;
                    minGapY = finalMaxGapY - gapHeight;
                    if (minGapY < 0) minGapY = 0;
                 }
            }
        }
        
        // The Y position for the *top edge of the gap*
        const gapTopY = Phaser.Math.Between(Math.max(minGapY, this.deathLineY + 10), finalMaxGapY);


        const imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OBSTACLE_FRUIT_IMG);
        if (!imgData || !imgData.key) {
            console.warn(`[${this.sys.settings.key}] Obstacle image '${this.OBSTACLE_FRUIT_IMG}' not found.`);
            return; // Cannot spawn obstacle
        }
        const obstacleTextureKey = imgData.key;

        // Create top pipe
        const topObstacleHeight = gapTopY; // Height of the pipe itself
        const tuboSuperior = this.physics.add.sprite(x_pos, gapTopY / 2, obstacleTextureKey) // Positioned by its center
            .setOrigin(0.5, 0.5);
        tuboSuperior.displayWidth = obstaclePipeWidth;
        tuboSuperior.displayHeight = topObstacleHeight; // Stretch to fill space

        // Create bottom pipe
        const bottomObstacleY = gapTopY + gapHeight; // Y where the bottom pipe starts
        const bottomObstacleHeight = this.SCREEN_HEIGHT - bottomObstacleY;
        const tuboInferior = this.physics.add.sprite(x_pos, bottomObstacleY + bottomObstacleHeight / 2, obstacleTextureKey)
            .setOrigin(0.5, 0.5);
        tuboInferior.displayWidth = obstaclePipeWidth;
        tuboInferior.displayHeight = bottomObstacleHeight;

        // Common properties for pipes
        [tuboSuperior, tuboInferior].forEach(tubo => {
            tubo.setVelocityX(-200); // Move left
            tubo.setImmovable(true);
            tubo.body.setAllowGravity(false);
            tubo.refreshBody(); // Important after changing display size
        });

        // Add colliders if persona is valid
        if (this.persona && this.persona.active) {
            this.physics.add.collider(this.persona, tuboInferior, () => this._game_over('colision_obstaculo'), null, this);
            this.physics.add.collider(this.persona, tuboSuperior, () => this._game_over('colision_obstaculo'), null, this);
        }

        this.obstaculos.push({ superior: tuboSuperior, inferior: tuboInferior, contado: false });
    }

    _game_over(causa = 'colision') {
        if (this.losing) return; // Already losing
        this.losing = true;

        if (this.loseButton) this.loseButton.setVisible(false).setActive(false);
        if (this.deathLineGraphics) this.deathLineGraphics.setVisible(false); // Hide death line on game over screen

        let mensajeGameOver = '¡FRUTA APLASTADA!'; // Default message

        // Stop player
        if (this.persona) {
            // If game over by hitting ceiling, ensure player sprite doesn't go above line visually
            if (causa === 'colision_techo' && this.persona.body) {
                // Reposition slightly below the death line
                this.persona.y = this.deathLineY + (this.persona.displayHeight / 2);
            }

            this.persona.setTint(0xff0000); // Tint red
            if (this.persona.body) {
                this.persona.body.setAllowGravity(false);
                this.persona.body.setVelocity(0,0); // Stop all movement
            }
        }
        
        this.physics.pause(); // Pause all physics interactions
        
        // Stop spawning new obstacles
        if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }

        // Customize message based on cause
        if (causa === 'boton') {
            mensajeGameOver = 'Se terminó la partida';
        } else if (causa === 'colision_techo') {
            mensajeGameOver = '¡DEMASIADO ALTO!';
        } else if (causa === 'colision_jugador_caido') {
            mensajeGameOver = '¡COLISIÓN DE CAFÉS!';
        }


        const textoGameOver = this.add.text(
            this.SCREEN_WIDTH / 2,
            this.SCREEN_HEIGHT / 2 - 50, // Slightly above center
            mensajeGameOver,
            {
                fontSize: '56px',
                fill: '#ff6347', // Tomato color
                fontFamily: 'Arial Black, Gadget, sans-serif',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(200); // Ensure it's on top

        // Transition to final screen after a delay
        this.time.delayedCall(2000, () => {
            textoGameOver.destroy();
            if (this.pantalla_final && typeof this.pantalla_final.enter === 'function') {
                 this.pantalla_final.enter({ score: this.obstaculossaltados });
            } else {
                this.finnish_game(); // Fallback if no final screen
            }
        });
    }

    update(time, delta) {
        if (this.losing || !this.persona || !this.persona.body || !this.persona.active) {
            // If losing, or no player, or player has no body, or player is inactive, do nothing.
            return;
        }

        // Game logic when player is actively falling/jumping
        if (this.started && this.gravityStarted) {
            // Check for hitting the "ceiling" (deathLineY)
            // Player's top edge: this.persona.y - this.persona.displayHeight / 2
            if ((this.persona.y - this.persona.displayHeight / 2) <= this.deathLineY) {
                // If already losing due to another collision in the same frame (e.g., with a fallen player at this height),
                // don't trigger another game over.
                if (!this.losing) {
                    this._game_over('colision_techo');
                }
                return; // Stop further updates for this frame if game over
            }

            // Check for hitting the "ground" (bottom of the world)
            if (this.persona.body.onFloor()) {
                if (!this.losing) { // Avoid respawn if already lost (e.g. hit techo then floor in quick succession)
                    this._handle_ground_hit_and_respawn();
                }
                return; // Stop further updates for this frame after respawn logic
            }

            // Obstacle scoring and cleanup
            if (this.gravityStarted && this.persona && this.persona.active && !this.losing) { // Redundant checks, but safe
                 for (let i = this.obstaculos.length - 1; i >= 0; i--) {
                    const obstaculoPair = this.obstaculos[i];
                    // Use either pipe for x-check, inferior is fine. Check if it exists.
                    const tubo = obstaculoPair.inferior; 

                    // Score point if player passed the obstacle
                    if (tubo && tubo.active && tubo.x < this.persona.x - this.persona.displayWidth / 2 && !obstaculoPair.contado) {
                        this.obstaculossaltados++;
                        this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);
                        obstaculoPair.contado = true;
                    }

                    // Remove obstacles that are off-screen
                    if (tubo && tubo.x < -tubo.displayWidth / 2) { // Check if fully off-screen
                        if(obstaculoPair.superior) obstaculoPair.superior.destroy();
                        if(obstaculoPair.inferior) obstaculoPair.inferior.destroy();
                        this.obstaculos.splice(i, 1);
                    }
                }
            }
        }
        // Horizontal movement is handled by pointermove event when horizontalMouseMoveActive is true
    }

    _clean_up() {
        // Call super's cleanup if it exists
        super._clean_up && super._clean_up();

        // Remove event listeners
        if (this.jumpHandler) {
            this.input.off('pointerdown', this.jumpHandler);
            this.jumpHandler = null;
        }
        if (this.mouseMoveHandler) {
            this.input.off('pointermove', this.mouseMoveHandler);
            this.mouseMoveHandler = null;
        }

        // Stop timers
        if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }
        this.time.removeAllEvents(); // Clear any other delayed calls

        // Destroy game objects
        if (this.fallenPersonas) {
            this.fallenPersonas.forEach(p => { if (p && p.destroy) p.destroy(); });
            this.fallenPersonas = [];
        }

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

        if (this.loseButton) {
            this.loseButton.destroy();
            this.loseButton = null;
        }

        if (this.deathLineGraphics) {
            this.deathLineGraphics.destroy();
            this.deathLineGraphics = null;
        }

        this._clear_obstacles(); // Ensures all obstacle sprites are destroyed

        // Destroy screens
        if (this.pantalla_inicio && typeof this.pantalla_inicio.destroy === 'function') this.pantalla_inicio.destroy();
        if (this.pantalla_final && typeof this.pantalla_final.destroy === 'function') this.pantalla_final.destroy();
        this.pantalla_inicio = null;
        this.pantalla_final = null;

        // Reset state flags
        this.started = false;
        this.losing = false;
        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true;
    }

    shutdown() {
        this._clean_up();
        // Phaser's shutdown will handle pausing physics world, but good practice:
        if (this.physics.world) {
            this.physics.pause();
            // this.physics.world.colliders.destroy(); // More aggressive cleanup if needed
        }
        // super.shutdown() if Games class has one
    }
}

export default JuegoFruit;