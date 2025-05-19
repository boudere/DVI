import { DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';
import Games from '/src/minijuegos/games.js';
// Assuming these classes from 'juego_discoteca' are generic enough:
import Cafex from '/src/minijuegos/juego_fruit/game_objects/sprites/cafex.js';
import Croasanx from '/src/minijuegos/juego_fruit/game_objects/sprites/croasanx.js';
import Alitax from '/src/minijuegos/juego_fruit/game_objects/sprites/alitax.js';
import Croquetax from '/src/minijuegos/juego_fruit/game_objects/sprites/croquetax.js';
import Hamburguesax from '/src/minijuegos/juego_fruit/game_objects/sprites/hamburguesax.js';
import Heladox from '/src/minijuegos/juego_fruit/game_objects/sprites/heladox.js';
import Huevox from '/src/minijuegos/juego_fruit/game_objects/sprites/huevox.js';
import Kebabx from '/src/minijuegos/juego_fruit/game_objects/sprites/kebabx.js';
import Perritox from '/src/minijuegos/juego_fruit/game_objects/sprites/perritox.js';
import Tortillax from '/src/minijuegos/juego_fruit/game_objects/sprites/tortillax.js';
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
    }

    create() {
        this.obstaculossaltados = 0;
        this.losing = false;
        this.gravityStarted = false;
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);

        this.obstaculos = [];
        this._crear_fondo();
        this._crear_persona();
        this._crear_marcador();
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();
        this._crear_boton_perder();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.jumpHandler = () => {
            if (!this.persona || this.losing) return;

            // El juego "comienza" oficialmente con el primer clic si no ha comenzado
            // Esto es importante para que los obstáculos y la puntuación solo avancen después.
            if (!this.started) {
                // No es necesario llamar a this.start_game() aquí si la pantalla de inicio ya lo hizo.
                // Si estamos directamente en el juego sin pantalla de inicio, this.start_game() ya se habrá llamado.
                // Lo importante es que this.started se vuelva true.
                // Si la pantalla de inicio está activa, ella llamará a start_game() que pondrá this.started = true.
                // Si no hay pantalla de inicio, this.start_game() se llama desde enter().
                // Forzamos 'started' aquí si no lo está, para asegurar que el juego se active.
                if (!this.pantalla_inicio || (this.pantalla_inicio && !this.pantalla_inicio.visible)) {
                     // Solo si la pantalla de inicio no está o ya se cerró.
                     // this.start_game(); // Podría ser redundante si ya se llamó
                     this.started = true; // Asegurar que el juego está "activo" para obstáculos etc.
                     this._next_obstaculo(); // Iniciar obstáculos si no se han iniciado
                }

            }


            if (!this.gravityStarted) { // Solo activar gravedad una vez
                this.gravityStarted = true;
                if (this.persona.body) {
                    this.persona.body.setAllowGravity(true);
                }
            }

            if (this.persona.body) { // Salto normal
                this.persona.setVelocityY(-450);
            }
        };
        this.input.on('pointerdown', this.jumpHandler);

        this.mouseMoveHandler = (pointer) => {
            // Mover al jugador horizontalmente con el ratón SIEMPRE que exista y no esté perdiendo
            if (this.persona && !this.losing) {
                this.persona.x = pointer.x;
                this.persona.x = Phaser.Math.Clamp(this.persona.x, this.persona.displayWidth / 2, this.SCREEN_WIDTH - this.persona.displayWidth / 2);
            }
        };
        this.input.on('pointermove', this.mouseMoveHandler);

        this.game_created();
    }

    enter() {
        super.enter();
        this.losing = false;
        this.gravityStarted = false;
        this.obstaculossaltados = 0;
        if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);

        this._clear_obstacles();

        if (this.persona) {
            // Posicionar en la X actual del ratón si está disponible, sino centro.
            // La Y es fija inicialmente.
            const initialX = this.input.mousePointer.x !== 0 ? this.input.mousePointer.x : this.SCREEN_WIDTH / 2;
            this.persona.setPosition(initialX, this.SCREEN_HEIGHT * 0.5);
            this.persona.setVelocity(0,0);
            this.persona.clearTint();
            this.persona.setActive(true).setVisible(true);
            if (this.persona.body) {
                 this.persona.body.setAllowGravity(false);
            }
        }
        // No reanudar la física aquí, se hará en start_game o cuando la gravedad inicie
        // this.physics.resume(); // Comentado

        if (this.loseButton) this.loseButton.setVisible(true).setActive(true);

        if (this.pantalla_inicio && typeof this.pantalla_inicio.enter === 'function') {
            this.pantalla_inicio.enter();
            // this.started sigue false hasta que pantalla_inicio llame a start_game
        } else {
            console.warn("Pantalla de inicio no disponible para JuegoFruitFlap");
            this.start_game(); // Si no hay pantalla de inicio, el juego comienza inmediatamente
        }
    }

    start_game() {
        super.start_game();
        this.losing = false;
        this.gravityStarted = false; // Gravedad NO inicia aquí, sino con el primer clic
        this.obstaculossaltados = 0;
        if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);

        if (this.pantalla_inicio && typeof this.pantalla_inicio.exit === 'function' && this.pantalla_inicio.visible) {
            this.pantalla_inicio.exit();
        }

        if(this.fondo && typeof this.fondo.enter === 'function') this.fondo.enter();
        if(this.persona) {
             const initialX = this.input.mousePointer.x !== 0 ? this.input.mousePointer.x : this.SCREEN_WIDTH / 2;
            this.persona.setPosition(initialX, this.SCREEN_HEIGHT * 0.5);
            this.persona.setVelocity(0,0);
            this.persona.clearTint();
            this.persona.setActive(true).setVisible(true);
            if (this.persona.body) {
                 this.persona.body.setAllowGravity(false); // Gravedad sigue desactivada
            }
            if (typeof this.persona.enter === 'function') this.persona.enter();
        }

        this._clear_obstacles();
        // NO iniciar _next_obstaculo aquí. Se iniciará con el primer clic que también activa la gravedad.
        // this._next_obstaculo();
        this.started = true; // Marca que el "juego" (interacción principal) ha comenzado
                            // pero los obstáculos y gravedad esperan el primer clic.
        this.physics.resume(); // Necesario para que el jugador colisione con bordes si se mueve con ratón

        if (this.loseButton) this.loseButton.setVisible(true).setActive(true);
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

    _crear_persona() {
        let x = this.SCREEN_WIDTH / 2;
        let y = this.SCREEN_HEIGHT * 0.5;
        const targetPlayerDisplaySize = 80;
        let scale = targetPlayerDisplaySize / Math.max(this.playerFruitWidth, this.playerFruitHeight);

        this.persona = new Cafex(this, x, y, scale, scale);
        if (this.persona.body) {
            this.persona.setCollideWorldBounds(true);
            this.persona.body.setAllowGravity(false);
            this.persona.body.gravity.y = 800;
            this.persona.setVelocityX(0);
        } else {
            console.warn("Persona body not immediately available. Ensure Cafex/player class is a physics sprite.");
        }
    }

    _crear_pantalla_inicio() {
        let x = 0;
        let y = 0;
        let imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_INICIO_KEY);

        if (imgData && imgData.key) {
            this.pantalla_inicio = new PantallaInicio(this, x, y, imgData);
             // La pantalla de inicio ahora es responsable de llamar a this.start_game()
        } else {
            console.warn(`[${this.sys.settings.key}] Imagen para pantalla de inicio con clave lógica '${this.PANTALLA_INICIO_KEY}' no encontrada.`);
            this.pantalla_inicio = { enter: () => this.start_game(), exit: () => {}, destroy: () => {} };
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
            this.pantalla_final = { enter: () => this.finnish_game(), exit: () => {}, destroy: () => {} };
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
            if (this.started && !this.losing) { // Solo si el juego está activo (después del primer clic)
                this._game_over('boton');
            }
        });

        this.loseButton.setVisible(false).setActive(false);
    }


    _next_obstaculo() {
        // Esta función solo se llamará si this.started es true Y this.gravityStarted es true
        if (this.losing || !this.started || !this.gravityStarted) return;
        const delay = Phaser.Math.Between(1500, 2500);
        this.timerEvent = this.time.delayedCall(delay, () => {
            this._spawn_obstaculo();
            this._next_obstaculo(); // Schedule next one only if conditions still met
        });
    }

    _spawn_obstaculo() {
        if (this.losing || !this.started || !this.gravityStarted) return;

        const gapHeight = 250;
        const obstaclePipeWidth = 120;

        const x_pos = this.SCREEN_WIDTH + obstaclePipeWidth / 2;
        const minGapY = 100;
        const maxGapY = this.SCREEN_HEIGHT - 100 - gapHeight;
        const gapTopY = Phaser.Math.Between(minGapY, maxGapY);

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

        if (this.persona) {
            this.physics.add.collider(this.persona, tuboInferior, () => this._game_over('colision'), null, this);
            this.physics.add.collider(this.persona, tuboSuperior, () => this._game_over('colision'), null, this);
        }

        this.obstaculos.push({ superior: tuboSuperior, inferior: tuboInferior, contado: false });
    }

    _game_over(causa = 'colision') {
        if (this.losing) return;
        this.losing = true;
        this.started = false; // Detiene la lógica de obstáculos en update y _next_obstaculo
        // this.gravityStarted = false; // Resetear para el próximo reinicio

        if (this.loseButton) this.loseButton.setVisible(false).setActive(false);

        if (this.persona) {
            this.persona.setTint(0xff0000);
            this.persona.setVelocityX(0);
        }
        this.physics.pause();
        if (this.timerEvent) this.timerEvent.remove(false);

        let mensajeGameOver = '¡FRUTA APLASTADA!';
        if (causa === 'boton') {
            mensajeGameOver = 'Se terminó la partida';
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
                 this.pantalla_final.enter({ score: this.obstaculossaltados });
            } else {
                this.finnish_game();
            }
        });
    }

    update(time, delta) {
        // El movimiento X del jugador es manejado por 'pointermove'.
        // La gravedad se activa con el primer clic.
        // Los obstáculos se mueven y se cuenta la puntuación solo si el juego ha "comenzado de verdad"
        // (es decir, this.started es true Y this.gravityStarted es true).

        if (this.losing || !this.persona) return; // Si se está perdiendo o no hay persona, no hacer nada

        // Lógica de juego principal (obstáculos, puntuación) solo si started Y gravityStarted
        if (this.started && this.gravityStarted) {
            // Game over si choca con el techo (si la gravedad está activa y se impulsa mucho)
            if (this.persona.y <= (0 + this.persona.displayHeight / 2)) {
                if (this.persona.body && this.persona.body.blocked.up) {
                    this._game_over('colision');
                    return;
                }
            }

            // Actualizar puntuación y limpiar obstáculos
            for (let i = this.obstaculos.length - 1; i >= 0; i--) {
                const obstaculoPair = this.obstaculos[i];
                const tubo = obstaculoPair.inferior; // Usar tubo inferior para la lógica

                if (tubo.x < this.persona.x - this.persona.displayWidth / 2 && !obstaculoPair.contado) {
                    this.obstaculossaltados++;
                    this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);
                    obstaculoPair.contado = true;
                }

                if (tubo.x < -tubo.displayWidth) {
                    obstaculoPair.superior.destroy();
                    obstaculoPair.inferior.destroy();
                    this.obstaculos.splice(i, 1);
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

        this._clear_obstacles();

        if (this.pantalla_inicio && typeof this.pantalla_inicio.destroy === 'function') this.pantalla_inicio.destroy();
        if (this.pantalla_final && typeof this.pantalla_final.destroy === 'function') this.pantalla_final.destroy();
        this.pantalla_inicio = null;
        this.pantalla_final = null;

        this.started = false;
        this.losing = false;
        this.gravityStarted = false;
    }

    shutdown() {
        this._clean_up();
        if (this.physics.world) {
            this.physics.pause();
        }
    }
}

export default JuegoFruit;