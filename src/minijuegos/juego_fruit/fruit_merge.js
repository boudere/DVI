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

        this.initialPlayerYFactor = 0.35;
        this.horizontalMouseMoveActive = true;

        // MODIFICACIÓN: this.deathLineY se calculará dinámicamente
        this.deathLineY = 0; // Inicializar, pero se establecerá en _crear_persona
        this.deathLineGraphics = null;
        this.deathLinePadding = 100; // Pequeño espacio entre el personaje y la línea
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
        this._crear_fondo();
        this._crear_persona(); // _crear_linea_muerte se llamará desde aquí ahora
        this._crear_marcador();
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();
        this._crear_boton_perder();

        this.cursors = this.input.keyboard.createCursorKeys();
this.jumpHandler = () => {
    // Solo actuar si el juego no ha comenzado realmente con la gravedad
    // y si el personaje existe y no estamos perdiendo.
    if (!this.gravityStarted && this.persona && !this.losing) {

        // Iniciar el juego si la pantalla de inicio no está visible o no existe
        if (!this.started) {
            if (!this.pantalla_inicio || (this.pantalla_inicio && !this.pantalla_inicio.visible)) {
                this.started = true;
            }
        }

        // Si el juego ha comenzado (lógicamente, por saltar pantalla de inicio o esta no bloquear)
        if (this.started) {
            this.gravityStarted = true; // Activar la bandera de gravedad
            this.horizontalMouseMoveActive = false; // Bloquear movimiento horizontal del ratón

            if (this.persona.body) {
                this.persona.body.setAllowGravity(true); // Activar gravedad en el personaje
                // NO SE APLICA setVelocityY(-450)
            }

            // Iniciar la generación de obstáculos si aún no ha comenzado
            if (this.obstaculos.length === 0 && (!this.timerEvent || this.timerEvent.getProgress() === 1)) {
                this._next_obstaculo();
            }
        }
    }
    // Los clics subsecuentes (cuando gravityStarted ya es true) no harán nada.
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
        this.losing = false;
        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true;
        this.obstaculossaltados = 0;
        if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);

        this._clear_obstacles();

        if (this.persona) {
            const initialX = this.input.mousePointer.x !== 0 ? this.input.mousePointer.x : this.SCREEN_WIDTH / 2;
            const initialY = this.SCREEN_HEIGHT * this.initialPlayerYFactor;
            this.persona.setPosition(initialX, initialY);
            this.persona.setVelocity(0,0);
            this.persona.clearTint();
            this.persona.setActive(true).setVisible(true);
            if (this.persona.body) {
                 this.persona.body.setAllowGravity(false);
            }

            // MODIFICACIÓN: Recalcular y redibujar la línea si la posición inicial del personaje cambia en enter
            // (aunque en este caso _crear_persona ya la establece basada en initialPlayerYFactor)
            // Si la posición Y inicial en enter() fuera diferente a la de _crear_persona,
            // necesitaríamos actualizar this.deathLineY y llamar a _crear_linea_muerte() de nuevo.
            // Por ahora, asumimos que la posición Y inicial es consistente.
            // Si no, descomenta y ajusta:
            // this.deathLineY = initialY - (this.persona.displayHeight / 2) - this.deathLinePadding;
            // this._crear_linea_muerte();
        }


        if (this.loseButton) this.loseButton.setVisible(true).setActive(true);
        if (this.deathLineGraphics) this.deathLineGraphics.setVisible(true);

        if (this.pantalla_inicio && typeof this.pantalla_inicio.enter === 'function') {
            this.pantalla_inicio.enter();
        } else {
            console.warn("Pantalla de inicio no disponible para JuegoFruitFlap");
            this.start_game();
        }
    }

    start_game() {
        super.start_game();
        this.losing = false;
        this.gravityStarted = false;
        this.horizontalMouseMoveActive = true;
        this.obstaculossaltados = 0;
        if (this.contadorTexto) this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);

        if (this.pantalla_inicio && typeof this.pantalla_inicio.exit === 'function' && this.pantalla_inicio.visible) {
            this.pantalla_inicio.exit();
        }

        if(this.fondo && typeof this.fondo.enter === 'function') this.fondo.enter();
        if(this.persona) {
             const initialX = this.input.mousePointer.x !== 0 ? this.input.mousePointer.x : this.SCREEN_WIDTH / 2;
             const initialY = this.SCREEN_HEIGHT * this.initialPlayerYFactor; // Usar la misma lógica
            this.persona.setPosition(initialX, initialY);
            this.persona.setVelocity(0,0);
            this.persona.clearTint();
            this.persona.setActive(true).setVisible(true);
            if (this.persona.body) {
                 this.persona.body.setAllowGravity(false);
            }
            if (typeof this.persona.enter === 'function') this.persona.enter();

            // Similar a enter(), si la posición Y cambia significativamente, recalcular la línea.
            // this.deathLineY = initialY - (this.persona.displayHeight / 2) - this.deathLinePadding;
            // this._crear_linea_muerte();
        }

        this._clear_obstacles();
        this.started = true;
        this.physics.resume();

        if (this.loseButton) this.loseButton.setVisible(true).setActive(true);
        if (this.deathLineGraphics) this.deathLineGraphics.setVisible(true);
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
        let y_inicial_persona = this.SCREEN_HEIGHT * this.initialPlayerYFactor; // Posición Y inicial del centro del personaje
        const targetPlayerDisplaySize = 80;
        let scale = targetPlayerDisplaySize / Math.max(this.playerFruitWidth, this.playerFruitHeight);

        this.persona = new Cafex(this, x, y_inicial_persona, scale, scale);

        // Asegurarse de que displayHeight esté establecido.
        // Si Cafex no lo hace al escalar, puedes forzarlo:
        // this.persona.setDisplaySize(targetPlayerDisplaySize, targetPlayerDisplaySize);
        // O si Cafex lo hace, simplemente usa this.persona.displayHeight

        if (this.persona.body) {
            this.persona.setCollideWorldBounds(true);
            this.persona.body.setAllowGravity(false);
            this.persona.body.gravity.y = 800;
            this.persona.setVelocityX(0);
        } else {
            console.warn("Persona body not immediately available. Ensure Cafex/player class is a physics sprite.");
        }

        // MODIFICACIÓN: Calcular this.deathLineY y crear la línea aquí
        // this.persona.displayHeight debería estar disponible ahora
        // El origen (0.5, 0.5) significa que y_inicial_persona es el centro.
        // El borde superior del personaje es y_inicial_persona - (this.persona.displayHeight / 2)
        this.deathLineY = y_inicial_persona - (this.persona.displayHeight / 2) - this.deathLinePadding;

        // Asegurarse de que la línea no esté fuera de la pantalla (por si acaso)
        this.deathLineY = Math.max(this.deathLineY, 0); // No puede ser menor que 0

        this._crear_linea_muerte(); // Llamar a crear la línea después de calcular su Y
    }

    _crear_pantalla_inicio() {
        let x = 0;
        let y = 0;
        let imgData = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_INICIO_KEY);

        if (imgData && imgData.key) {
            this.pantalla_inicio = new PantallaInicio(this, x, y, imgData);
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
        const minGapY = 100; // Asegurar que el hueco no esté demasiado cerca del borde superior
        // Ajustar maxGapY para que el hueco no esté demasiado cerca de la línea de muerte (opcional pero bueno)
        const maxGapYConsiderandoDeathLine = Math.min(this.SCREEN_HEIGHT - 100 - gapHeight, this.deathLineY - gapHeight - 50); // 50 es un margen adicional
        const finalMaxGapY = Math.max(minGapY, maxGapYConsiderandoDeathLine); // El hueco no puede estar por debajo de minGapY

        const gapTopY = Phaser.Math.Between(minGapY, finalMaxGapY > minGapY ? finalMaxGapY : minGapY + gapHeight); // Asegurar que haya un rango válido

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
            this.physics.add.collider(this.persona, tuboInferior, () => this._game_over('colision_obstaculo'), null, this);
            this.physics.add.collider(this.persona, tuboSuperior, () => this._game_over('colision_obstaculo'), null, this);
        }

        this.obstaculos.push({ superior: tuboSuperior, inferior: tuboInferior, contado: false });
    }

    _game_over(causa = 'colision') {
        if (this.losing) return;
        this.losing = true;
        this.started = false;

        if (this.loseButton) this.loseButton.setVisible(false).setActive(false);
        if (this.deathLineGraphics) this.deathLineGraphics.setVisible(false);

        if (this.persona) {
            this.persona.setTint(0xff0000);
            this.persona.setVelocityX(0);
        }
        this.physics.pause();
        if (this.timerEvent) this.timerEvent.remove(false);

        let mensajeGameOver = '¡FRUTA APLASTADA!';
        if (causa === 'boton') {
            mensajeGameOver = 'Se terminó la partida';
        } else if (causa === 'colision_techo') {
            mensajeGameOver = '¡DEMASIADO ALTO!';
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
        if (this.losing || !this.persona) return;

        if (this.started && this.gravityStarted) {
            if ((this.persona.y - this.persona.displayHeight / 2) <= this.deathLineY) {
                this._game_over('colision_techo');
                return;
            }

            for (let i = this.obstaculos.length - 1; i >= 0; i--) {
                const obstaculoPair = this.obstaculos[i];
                const tubo = obstaculoPair.inferior;

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
    }

    shutdown() {
        this._clean_up();
        if (this.physics.world) {
            this.physics.pause();
        }
    }
}

export default JuegoFruit;