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

       
        this.initialPlayerYFactor = 0.20; 
       
        this.deathLineYFactor = 0.20; 
      

        this.horizontalMouseMoveActive = true;

        this.deathLineY = 0;
        this.deathLineGraphics = null;
        this.deathLinePadding = 1; 

        this.fallenPersonas = [];
        this.puntuacion = 0; 
    }


    create() {
        this.puntuacion = 0;
        this.losing = false;
        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true;
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);

        this.obstaculos = [];
        this.fallenPersonas = [];

        this._crear_fondo();
        // MODIFICACIÓN: Crear marcador antes de configurar el jugador inicial
        this._crear_marcador(); 
        this._initial_player_and_deathline_setup(); 
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
        if (!this.started) this._full_game_reset();


        if (this.pantalla_inicio && typeof this.pantalla_inicio.exit === 'function' && this.pantalla_inicio.visible) {
            this.pantalla_inicio.exit();
        }
        this.start_game_logic();
    }

    start_game_logic() {
        if(this.fondo && typeof this.fondo.enter === 'function') this.fondo.enter();
        
        this.started = true; 
        this.physics.resume();

        if (this.loseButton) this.loseButton.setVisible(true).setActive(true);
        if (this.deathLineGraphics) this.deathLineGraphics.setVisible(true);
    }


    _full_game_reset() {
        this.losing = false;
        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true;
        this.puntuacion = 0;
        if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.puntuacion}`);


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
        
        this._setup_new_active_player(); // Esto sumará 10 a la puntuación y actualizará el marcador
    }

    _setup_new_active_player() {
        const x = this.SCREEN_WIDTH / 2;
        const y_inicial_persona = this.SCREEN_HEIGHT * this.initialPlayerYFactor; 
        const targetPlayerDisplaySize = 80; 
        const scale = targetPlayerDisplaySize / Math.max(this.playerFruitWidth, this.playerFruitHeight);

        this.persona = new Cafex(this, x, y_inicial_persona, scale, scale);
        this.persona.setDepth(10); 

        if (this.persona.body) {
            this.persona.setCollideWorldBounds(true);
            this.persona.body.setAllowGravity(false); 
            this.persona.body.gravity.y = 800; 
            this.persona.setVelocity(0,0); 
            this.persona.clearTint();
            this.persona.setAlpha(1); 
            this.persona.setActive(true).setVisible(true);
            this.persona.body.setEnable(true); 

            this.fallenPersonas.forEach(fallen => {
                if (fallen && fallen.active && fallen.body && fallen.body.enable) { 
                    this.physics.add.collider(this.persona, fallen, () => {
                        if (this.losing) return; 

                        const isLandingOnTop = this.persona.body.touching.down && fallen.body.touching.up;
                        const isActiveFalling = this.gravityStarted; 

                        if (isLandingOnTop && isActiveFalling) {
                            const activePlayerTopY = this.persona.y - (this.persona.displayHeight / 2);
                            const isAtOrAboveDeathLine = activePlayerTopY <= this.deathLineY;

                            if (isAtOrAboveDeathLine) { 
                                const horizontalOverlap = Math.abs(this.persona.x - fallen.x) < (this.persona.displayWidth / 2 + fallen.displayWidth / 2) * 0.9; 
                                const isPersonaPhysicallyAboveFallen = this.persona.y < fallen.y; 

                                if (horizontalOverlap && isPersonaPhysicallyAboveFallen) {
                                    this._game_over('Colisión');
                                }
                            } else {
                                if (!this.losing) { 
                                    this._handle_successful_landing();
                                }
                            }
                        }
                    }, null, this);
                }
            });

        } else {
            console.warn("New persona body not immediately available during _setup_new_active_player. Colliders with fallen might be missed for this instance.");
        }

        // MODIFICACIÓN: Sumar puntos y actualizar marcador cada vez que se crea un Cafex
        this.puntuacion += 10;
        if (this.contadorTexto) { // Asegurarse que el marcador ya existe
            this.contadorTexto.setText(`Puntuación: ${this.puntuacion}`);
        }
    }

    _handle_successful_landing() {
        if (this.losing || !this.persona || !this.persona.body || !this.gravityStarted) return;

        if (this.persona && this.persona.body) {
            this.persona.body.setVelocity(0, 0); 
            this.persona.body.setAllowGravity(false); 
            this.persona.body.setImmovable(true); 
            
            const currentPlayerTopY = this.persona.y - (this.persona.displayHeight / 2);
            if (currentPlayerTopY <= this.deathLineY) {
                this.persona.setTint(0xff0000); 
                this._game_over('apilado_demasiado_alto');
                return; 
            }
            
            this.persona.setAlpha(1);
            this.persona.setDepth(1);   
        }
        
        this.fallenPersonas.push(this.persona);

        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true; 
        
        // MODIFICACIÓN: Eliminar reinicio de puntuación y actualización del texto aquí
        // this.puntuacion = 0; // ELIMINADO
        // if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.puntuacion}`); // ELIMINADO

        this._clear_obstacles(); 
        if (this.timerEvent) { 
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }

        this._setup_new_active_player(); // Esto se encargará de la puntuación y el marcador
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
            `Puntuación: ${this.puntuacion}`, // Se inicializa con la puntuación actual (0 al principio)
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
        this._setup_new_active_player(); // Esto sumará los primeros 10 puntos y actualizará el marcador

        this.deathLineY = this.SCREEN_HEIGHT * this.deathLineYFactor;
        this.deathLineY = Math.min(this.deathLineY, this.SCREEN_HEIGHT - 4); 
        this.deathLineY = Math.max(this.deathLineY, 0); 
        
        this._crear_linea_muerte(); 
    }

    _crear_pantalla_inicio() {
        let x = 0;
        let y = 0;
        let imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_INICIO_KEY);

        if (imgData && imgData.key) {
            this.pantalla_inicio = new PantallaInicio(this, x, y, imgData);
        } else {
            console.warn(`[${this.sys.settings.key}] Imagen para pantalla de inicio con clave lógica '${this.PANTALLA_INICIO_KEY}' no encontrada.`);
            this.pantalla_inicio = { 
                enter: () => {
                    if(!this.started) this.start_game_logic(); 
                }, 
                exit: () => {}, 
                destroy: () => {},
                visible: false 
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
                backgroundColor: '#ff877e', 
                padding: { x: 10, y: 7 },
                fontFamily: 'Arial, sans-serif'
            }
        )
        .setOrigin(0, 0)
        .setDepth(200) 
        .setInteractive({ useHandCursor: true });

        this.loseButton.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation(); 
            if (this.started && !this.losing) {
                this._game_over('boton');
            }
        });

        this.loseButton.setVisible(false).setActive(false);
    }


    _next_obstaculo() {
        if (this.losing || !this.started || !this.gravityStarted) return; 

        const delay = Phaser.Math.Between(1500, 2500); 
        this.timerEvent = this.time.delayedCall(delay, () => {
            this._spawn_obstaculo();
             if (!this.losing && this.started && this.gravityStarted) { 
                this._next_obstaculo();
            }
        });
    }

    _spawn_obstaculo() {
        if (this.losing || !this.started || !this.gravityStarted) return;

        const gapHeight = 250; 
        const obstaclePipeWidth = 120; 

        const x_pos = this.SCREEN_WIDTH + obstaclePipeWidth / 2; 

        const minGapYScreenPercentage = 0.25; 
        const maxGapYScreenPercentage = 0.75; 
        
        const minPossibleGapCenterY = this.SCREEN_HEIGHT * minGapYScreenPercentage;
        const maxPossibleGapCenterY = this.SCREEN_HEIGHT * maxGapYScreenPercentage;

        const minGapTopY = 50; 
        const maxGapTopY = this.SCREEN_HEIGHT - gapHeight - 50; 

        let gapCenterY = Phaser.Math.Between(minPossibleGapCenterY, maxPossibleGapCenterY);
        
        let gapTopY = gapCenterY - gapHeight / 2;

        gapTopY = Phaser.Math.Clamp(gapTopY, minGapTopY, maxGapTopY);

        const imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OBSTACLE_FRUIT_IMG);
        if (!imgData || !imgData.key) {
            console.warn(`[${this.sys.settings.key}] Obstacle image '${this.OBSTACLE_FRUIT_IMG}' not found.`);
            return; 
        }
        const obstacleTextureKey = imgData.key;

        const topObstacleHeight = gapTopY; 
        const tuboSuperior = this.physics.add.sprite(x_pos, gapTopY / 2, obstacleTextureKey) 
            .setOrigin(0.5, 0.5);
        tuboSuperior.displayWidth = obstaclePipeWidth;
        tuboSuperior.displayHeight = topObstacleHeight; 

        const bottomObstacleY = gapTopY + gapHeight; 
        const bottomObstacleHeight = this.SCREEN_HEIGHT - bottomObstacleY;
        const tuboInferior = this.physics.add.sprite(x_pos, bottomObstacleY + bottomObstacleHeight / 2, obstacleTextureKey)
            .setOrigin(0.5, 0.5);
        tuboInferior.displayWidth = obstaclePipeWidth;
        tuboInferior.displayHeight = bottomObstacleHeight;

        [tuboSuperior, tuboInferior].forEach(tubo => {
            tubo.setVelocityX(-200); 
            tubo.setImmovable(true);
            tubo.body.setAllowGravity(false);
            tubo.refreshBody(); 
        });

        if (this.persona && this.persona.active) {
            this.physics.add.collider(this.persona, tuboInferior, () => this._game_over('colision_obstaculo'), null, this);
            this.physics.add.collider(this.persona, tuboSuperior, () => this._game_over('colision_obstaculo'), null, this);
        }

        this.obstaculos.push({ superior: tuboSuperior, inferior: tuboInferior, contado: false });
    }

    _game_over(causa = 'colision') {
        if (this.losing) return; 
        this.losing = true;

        if (this.loseButton) this.loseButton.setVisible(false).setActive(false);
        if (this.deathLineGraphics) this.deathLineGraphics.setVisible(false); 

        let mensajeGameOver = '¡FRUTA APLASTADA!'; 

        if (this.persona) {
            this.persona.setTint(0xff0000); 
            if (this.persona.body) {
                this.persona.body.setAllowGravity(false);
                this.persona.body.setVelocity(0,0); 
            }
        }
        
        this.physics.pause(); 
        
        if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }

        if (causa === 'boton') {
            mensajeGameOver = 'Se terminó la partida';
        } else if (causa === 'colision_techo') { 
            mensajeGameOver = '¡DEMASIADO ALTO!'; 
        } else if (causa === 'colision_jugador_caido') {
            mensajeGameOver = '¡COLISIÓN DE CAFÉS!';
        } else if (causa === 'apilado_demasiado_alto') { 
            mensajeGameOver = 'Perdiste'; 
        }


        const textoGameOver = this.add.text(
            this.SCREEN_WIDTH / 2,
            this.SCREEN_HEIGHT / 2 - 50, 
            mensajeGameOver,
            {
                fontSize: '56px',
                fill: '#ff6347', 
                fontFamily: 'Arial Black, Gadget, sans-serif',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(200); 

        this.time.delayedCall(2000, () => {
            textoGameOver.destroy();
            if (this.pantalla_final && typeof this.pantalla_final.enter === 'function') {
                 this.pantalla_final.enter({ score: this.puntuacion });
            } else {
                this.finnish_game(); 
            }
        });
    }

    update(time, delta) {
        if (this.losing || !this.persona || !this.persona.body || !this.persona.active) {
            return;
        }

        if (this.started && this.gravityStarted) {
            if (this.persona.body.onFloor()) {
                if (!this.losing) { 
                    this._handle_successful_landing(); 
                }
                return; 
            }

            if (this.gravityStarted && this.persona && this.persona.active && !this.losing) { 
                 for (let i = this.obstaculos.length - 1; i >= 0; i--) {
                    const obstaculoPair = this.obstaculos[i];
                    const tubo = obstaculoPair.inferior; 

                    // MODIFICACIÓN: Eliminar suma de puntos por pasar obstáculos
                    if (tubo && tubo.active && tubo.x < this.persona.x - this.persona.displayWidth / 2 && !obstaculoPair.contado) {
                        // this.puntuacion += 10; // ELIMINADO
                        // this.contadorTexto.setText(`Puntuación: ${this.puntuacion}`); // ELIMINADO
                        obstaculoPair.contado = true; // Se mantiene por si es útil para otra lógica, o para saber si se pasó
                    }

                    if (tubo && tubo.x < -tubo.displayWidth / 2) { 
                        if(obstaculoPair.superior) obstaculoPair.superior.destroy();
                        if(obstaculoPair.inferior) obstaculoPair.inferior.destroy();
                        this.obstaculos.splice(i, 1);
                    }
                }
            }
        }
    }

    _clean_up() {
        super._clean_up && super._clean_up();

        if (this.jumpHandler) {
            this.input.off('pointerdown', this.jumpHandler);
            this.jumpHandler = null;
        }
        if (this.mouseMoveHandler) {
            this.input.off('pointermove', this.mouseMoveHandler);
            this.mouseMoveHandler = null;
        }

        if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }
        this.time.removeAllEvents(); 

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

        this._clear_obstacles(); 

        if (this.pantalla_inicio && typeof this.pantalla_inicio.destroy === 'function') this.pantalla_inicio.destroy();
        if (this.pantalla_final && typeof this.pantalla_final.destroy === 'function') this.pantalla_final.destroy();
        this.pantalla_inicio = null;
        this.pantalla_final = null;

        this.started = false;
        this.losing = false;
        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true;
        this.puntuacion = 0;
    }

    shutdown() {
        this._clean_up();
        if (this.physics.world) {
            this.physics.pause();
        }
    }
}

export default JuegoFruit;