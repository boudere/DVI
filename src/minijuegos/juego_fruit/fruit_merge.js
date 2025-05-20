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

        this.playerFruitWidth = 100; // Original width of cafex.png
        this.playerFruitHeight = 100; // Original height of cafex.png
        this.obstacleFruitWidth = 100; // Original width of croasanx.png
        this.obstacleFruitHeight = 100; // Original height of croasanx.png
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
        this.croasanxScaleFactor = 0.8; 
    }


    create() {
        this.puntuacion = 0;
        this.losing = false;
        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true;
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);

        this.fallenPersonas = [];

        this._crear_fondo();
        this._crear_marcador();
        this._initial_player_and_deathline_setup();
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();
        this._crear_boton_perder();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpHandler = () => {
            if (!this.gravityStarted && this.cafe && !this.losing) {
                if (!this.started) {
                    if (!this.pantalla_inicio || (this.pantalla_inicio && !this.pantalla_inicio.visible)) {
                        this.started = true;
                    }
                }
                if (this.started) {
                    this.gravityStarted = true;
                    this.horizontalMouseMoveActive = false;

                    if (this.cafe.body) {
                        this.cafe.body.setAllowGravity(true);
                    }
                }
            }
        };
        this.input.on('pointerdown', this.jumpHandler);

        this.mouseMoveHandler = (pointer) => {
            if (this.horizontalMouseMoveActive && this.cafe && !this.losing) {
                this.cafe.x = pointer.x;
                this.cafe.x = Phaser.Math.Clamp(this.cafe.x, this.cafe.displayWidth / 2, this.SCREEN_WIDTH - this.cafe.displayWidth / 2);
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
        this.deathLineGraphics.lineStyle(4, 0xff0000, 1);
        this.deathLineGraphics.beginPath();
        this.deathLineGraphics.moveTo(0, this.deathLineY);
        this.deathLineGraphics.lineTo(this.SCREEN_WIDTH, this.deathLineY);
        this.deathLineGraphics.closePath();
        this.deathLineGraphics.strokePath();
        this.deathLineGraphics.setDepth(150);
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
        if (this.fondo && typeof this.fondo.enter === 'function') this.fondo.enter();

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

        if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }

        this.fallenPersonas.forEach(p => { if (p && p.destroy) p.destroy(); });
        this.fallenPersonas = [];

        if (this.cafe) {
            this.cafe.destroy();
            this.cafe = null;
        }

        this._setup_new_cafex();
    }

    _setup_new_cafex() {
        const x = this.SCREEN_WIDTH / 2;
        const y_inicial_cafe = this.SCREEN_HEIGHT * this.initialPlayerYFactor;
        const targetPlayerDisplaySize = 80;
        const scale = targetPlayerDisplaySize / Math.max(this.playerFruitWidth, this.playerFruitHeight);

        this.cafe = new Cafex(this, x, y_inicial_cafe, scale, scale);
        this.cafe.setDepth(10);

        if (this.cafe.body) {
            this.cafe.setCollideWorldBounds(true);
            this.cafe.body.setAllowGravity(false);
            this.cafe.body.gravity.y = 800;
            this.cafe.setVelocity(0, 0);
            this.cafe.clearTint();
            this.cafe.setAlpha(1);
            this.cafe.setActive(true).setVisible(true);
            this.cafe.body.setEnable(true);

            this.fallenPersonas.forEach(fallen => {
                if (fallen && fallen.active && fallen.body && fallen.body.enable) {
                    this.physics.add.collider(this.cafe, fallen, (collidedPersona, collidedFallen) => {
                        if (this.losing) return;

                        const isLandingOnTop = collidedPersona.body.touching.down && collidedFallen.body.touching.up;
                        const isActiveFalling = this.gravityStarted;

                        if (isLandingOnTop && isActiveFalling) {
                            if (collidedPersona.objectType === 'cafex' && collidedFallen.objectType === 'cafex') {
                                const croasanxX = collidedFallen.x;
                                const croasanxY = collidedFallen.y;
                                const targetCroasanxDisplaySize = targetPlayerDisplaySize * this.croasanxScaleFactor;
                                const croasanxScale = targetCroasanxDisplaySize / Math.max(this.obstacleFruitWidth, this.obstacleFruitHeight);

                                const newCroasanx = new Croasanx(this, croasanxX, croasanxY, croasanxScale, croasanxScale);
                                newCroasanx.setDepth(collidedFallen.depth);
                                if (newCroasanx.body) {
                                    newCroasanx.body.setImmovable(true);
                                    newCroasanx.body.setAllowGravity(false);
                                    newCroasanx.setCollideWorldBounds(true);
                                    newCroasanx.refreshBody();
                                }
                                
                                const fallenIndex = this.fallenPersonas.indexOf(collidedFallen);
                                if (fallenIndex > -1) {
                                    this.fallenPersonas.splice(fallenIndex, 1);
                                }
                                collidedFallen.destroy();

                                collidedPersona.destroy();
                                this.cafe = null; 

                                this.fallenPersonas.push(newCroasanx);
                                
                                this.puntuacion += 5;
                                if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.puntuacion}`);

                                this.gravityStarted = false;
                                this.horizontalMouseMoveActive = true;
                                if (this.timerEvent) {
                                    this.timerEvent.remove(false);
                                    this.timerEvent = null;
                                }
                                this._setup_new_cafex(); 
                                return; 
                            }

                            const activePlayerTopY = collidedPersona.y - (collidedPersona.displayHeight / 2);
                            const isAtOrAboveDeathLine = activePlayerTopY <= this.deathLineY + this.deathLinePadding;

                            if (isAtOrAboveDeathLine) {
                                const horizontalOverlap = Math.abs(collidedPersona.x - collidedFallen.x) < (collidedPersona.displayWidth / 2 + collidedFallen.displayWidth / 2) * 0.9;
                                const isPersonaPhysicallyAboveFallen = collidedPersona.y < collidedFallen.y;

                                if (horizontalOverlap && isPersonaPhysicallyAboveFallen) {
                                    this._game_over('apilado_demasiado_alto_directo');
                                } else {
                                     this._handle_successful_landing(); 
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
            console.warn("New cafe body not immediately available during _setup_new_cafex. Colliders with fallen might be missed for this instance.");
        }

        this.puntuacion += 10;
        if (this.contadorTexto) {
            this.contadorTexto.setText(`Puntuación: ${this.puntuacion}`);
        }
    }

    _handle_successful_landing() {
        if (this.losing || !this.cafe || !this.cafe.body || !this.gravityStarted) return;

        if (this.cafe && this.cafe.body) {
            this.cafe.body.setVelocity(0, 0);
            this.cafe.body.setAllowGravity(false);
            this.cafe.body.setImmovable(true);

            const currentPlayerTopY = this.cafe.y - (this.cafe.displayHeight / 2);
            if (currentPlayerTopY <= this.deathLineY + this.deathLinePadding) { 
                this.cafe.setTint(0xff0000);
                this._game_over('apilado_demasiado_alto_en_handle');
                return;
            }

            this.cafe.setAlpha(1);
            this.cafe.setDepth(1);
        }

        this.fallenPersonas.push(this.cafe);

        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true;

        if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }

        this._setup_new_cafex();
    }


    finnish_game() {
        if (this.pantalla_final && typeof this.pantalla_final.exit === 'function') {
            this.pantalla_final.exit();
        }
        this._clean_up();
        this.scene.get(MINIJUEGO_MANAGER).return_to_dialogo();
    }

    _crear_marcador() {
        this.contadorTexto = this.add.text(
            this.SCREEN_WIDTH - 50, 50,
            `Puntuación: ${this.puntuacion}`,
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
                    if (!this.started) this.start_game_logic();
                },
                exit: () => { },
                destroy: () => { },
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
            this.pantalla_final = { enter: (data) => this.finnish_game(), exit: () => { }, destroy: () => { } };
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

    _game_over(causa = 'colision') {
        if (this.losing) return;
        this.losing = true;
        this.horizontalMouseMoveActive = false;

        if (this.loseButton) this.loseButton.setVisible(false).setActive(false);
        if (this.deathLineGraphics) this.deathLineGraphics.setVisible(false);

        let mensajeGameOver = '¡FRUTA APLASTADA!';

        if (this.cafe && this.cafe.body) { 
            this.cafe.setTint(0xff0000);
            this.cafe.body.setAllowGravity(false);
            this.cafe.body.setVelocity(0, 0);
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
        } else if (causa.startsWith('apilado_demasiado_alto')) {
            mensajeGameOver = '¡TORRE MUY ALTA!';
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
        if (this.losing || !this.cafe || !this.cafe.body || !this.cafe.active) {
            return;
        }

        if (this.started && this.gravityStarted && this.cafe) {
            if (this.cafe.y + this.cafe.displayHeight / 2 >= this.SCREEN_HEIGHT) {
                if (!this.losing && this.fallenPersonas.length === 0) { 
                    this._handle_successful_landing();
                } else if (!this.losing) {
                    if (this.cafe.body.onFloor()) {
                         this._handle_successful_landing();
                    }
                }
                return;
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
            this.fallenPersonas.forEach(p => { if (p && typeof p.destroy === 'function') p.destroy(); });
            this.fallenPersonas = [];
        }

        if (this.cafe && typeof this.cafe.destroy === 'function') {
            this.cafe.destroy();
            this.cafe = null;
        }
        if (this.fondo && typeof this.fondo.destroy === 'function') {
            this.fondo.destroy();
            this.fondo = null;
        }
        if (this.contadorTexto && typeof this.contadorTexto.destroy === 'function') {
            this.contadorTexto.destroy();
            this.contadorTexto = null;
        }

        if (this.loseButton && typeof this.loseButton.destroy === 'function') {
            this.loseButton.destroy();
            this.loseButton = null;
        }

        if (this.deathLineGraphics && typeof this.deathLineGraphics.destroy === 'function') {
            this.deathLineGraphics.destroy();
            this.deathLineGraphics = null;
        }



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