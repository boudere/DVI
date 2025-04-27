import { JUEGO_DISCOTECA, DATA_INFO, MINIJUEGO_MANAGER, SCENE_MANAGER } from '/src/data/scene_data.js';
import Game from '/src/minijuegos/games.js';
import Persona from '/src/minijuegos/juego_discoteca/game_objects/sprites/persona.js';
import Fondo from '/src/minijuegos/juego_discoteca/game_objects/sprites/fondo.js';
import PantallaInicio from '/src/minijuegos/juego_discoteca/pantallas/pantalla_inicio.js';
import PantallaFinal from '/src/minijuegos/juego_discoteca/pantallas/pantalla_final.js';

class JuegoDiscoteca extends Game {
    constructor(sprites) {
        super({ key: JUEGO_DISCOTECA });

        sprites = {
            PERSONA_IMG: 'persona',
            OBSTACULO_IMG: 'obstaculo',
            FONDO_IMG: 'fondodisco',
            PANTALLA_INICIO: 'pantalla_inicio',
            PANTALLA_FINAL: 'pantalla_final'
        };

        this.PERSONA_IMG = sprites.PERSONA_IMG;
        this.OBSTACULO_IMG = sprites.OBSTACULO_IMG;
        this.FONDO_IMG = sprites.FONDO_IMG;
        this.PANTALLA_INICIO = sprites.PANTALLA_INICIO;
        this.PANTALLA_FINAL = sprites.PANTALLA_FINAL;

        this.DISCOTECA_MUSICA = 'disco';

        this.personawidth = 1024;
        this.personaheight = 1024;
        this.obstaculowidth = 1024;
        this.obstaculoheight = 1024;
        this.fondowidth = 612;
        this.fondoheight = 408;

        this.started = false;
    }

    create() {
        this.obstaculossaltados = 0;
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);
        this.scene.get(MINIJUEGO_MANAGER).play_music(this.DISCOTECA_MUSICA);

        this.obstaculos = [];
        this._crear_fondo();
        this._crear_persona();
        this._crear_marcador();
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.pointerDownEvent = this.input.on('pointerdown', () => {
            if (!this.started || !this.persona) return;
            this.persona.setVelocityY(-600);
        });

        this.game_created();
    }

    enter() {
        super.enter();
        this.pantalla_inicio.enter();
    }

    start_game() {
        this.pantalla_inicio.exit();
        this.fondo.enter();
        this.persona.enter();
        this._next_obstaculo();
        this.started = true;
    }

    finnish_game() {
        this.pantalla_final.exit();
        this._clean_up();

        // Volver al dialogo después del juego
        this.scene.get(MINIJUEGO_MANAGER).return_to_dialogo();
    }

    _crear_marcador() {
        this.contadorTexto = this.add.text(
            this.SCREEN_WIDTH - 50, 50,
            `Puntuación: ${this.obstaculossaltados}`,
            {
                fontSize: '40px',
                fill: '#ffffff',
                fontFamily: 'Impact'
            }
        ).setOrigin(1, 0).setDepth(1);
    }

    _crear_fondo() {
        let x = 0;
        let y = 0;
        let scale_x = this.SCREEN_WIDTH / this.fondowidth;
        let scale_y = this.SCREEN_HEIGHT / this.fondoheight;

        this.fondo = new Fondo(this, x, y, scale_x, scale_y).setOrigin(0, 0);
    }

    _crear_persona() {
        let x = 175;
        let y = this.SCREEN_HEIGHT * 0.5;
        this.persona = new Persona(this, x, y, 200 / this.personawidth, 200 / this.personaheight);
    }

    _crear_pantalla_inicio() {
        let x = 0;
        let y = 0;
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_INICIO);

        this.pantalla_inicio = new PantallaInicio(this, x, y, img);
    }

    _crear_pantalla_final() {
        let x = 0;
        let y = 0;
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_FINAL);

        this.pantalla_final = new PantallaFinal(this, x, y, img);
    }

    _next_obstaculo() {
        const delay = Phaser.Math.Between(1500, 3000);
        this.timerEvent = this.time.delayedCall(delay, () => {
            this._spawn_obstaculo();
            this._next_obstaculo();
        });
    }

    _spawn_obstaculo() {
        let hueco = 300;
        let ancho = 350;
        let x = this.SCREEN_WIDTH + 100;
        let minTuboY = 100;
        let maxTuboY = this.SCREEN_HEIGHT - hueco - 100;
        let yHueco = Phaser.Math.Between(minTuboY, maxTuboY);

        let alturaSuperior = yHueco - hueco / 2;
        let alturaInferior = this.SCREEN_HEIGHT - (yHueco + hueco / 2);

        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OBSTACULO_IMG);

        // Tubo superior
        this.tuboSuperior = this.physics.add.sprite(
            x,
            alturaSuperior / 2,
            img
        ).setScale(ancho / this.obstaculowidth, alturaSuperior / this.obstaculoheight);
        this.tuboSuperior.setFlipY(true);

        // Tubo inferior
        this.tuboInferior = this.physics.add.sprite(
            x,
            yHueco + hueco / 2 + alturaInferior / 2,
            img
        ).setScale(ancho / this.obstaculowidth, alturaInferior / this.obstaculoheight);

        // Físicas
        [this.tuboSuperior, this.tuboInferior].forEach(tubo => {
            tubo.setVelocityX(-500);
            tubo.setGravityY(-600);
            tubo.body.setSize(tubo.width * 0.8, tubo.height * 0.8);
            tubo.body.setOffset(tubo.width * 0.1, tubo.height * 0.1);
        });

        this.physics.add.collider(this.persona, this.tuboInferior, this._game_over, null, this);
        this.physics.add.collider(this.persona, this.tuboSuperior, this._game_over, null, this);

        this.obstaculos.push({ superior: this.tuboSuperior, inferior: this.tuboInferior, contado: false });
    }

    _game_over() {
        if (this.losing) return;
        this.losing = true;

        this.persona.setTint(0xff0000);
        this.physics.pause();
        this.time.removeAllEvents();
        this.scene.get(MINIJUEGO_MANAGER).stop_music(this.DISCOTECA_MUSICA);

        const textoGameOver = this.add.text(
            this.SCREEN_WIDTH / 2,
            this.SCREEN_HEIGHT / 2,
            '¡Perdiste!',
            {
                fontSize: '96px',
                color: '#ff0000',
                fontFamily: 'Impact'
            }
        ).setOrigin(0.5).setDepth(1);

        setTimeout(() => {
            this.pantalla_final.enter();
            textoGameOver.destroy();
        }, 2000);
    }

    _update() {
        if (!this.started || !this.persona) return;

        if (this.persona.body && this.persona.body.blocked.down) {
            this.persona.setVelocityY(0);
        }

        this.obstaculos.forEach((obstaculo) => {
            const tubo = obstaculo.inferior;

            if (tubo.x < this.persona.x && !obstaculo.contado) {
                this.obstaculossaltados++;
                this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);
                obstaculo.contado = true;
            }

            if (tubo.x < -tubo.width) {
                obstaculo.superior.destroy();
                obstaculo.inferior.destroy();
            }
        });
    }

    _clean_up() {
        if (this.pointerDownEvent) {
            this.input.off('pointerdown');
        }
        this.time.removeAllEvents();
        this.physics.pause();
        if (this.persona) this.persona.destroy();
        if (this.fondo) this.fondo.destroy();
        if (this.contadorTexto) this.contadorTexto.destroy();
        this.obstaculos.forEach((obstaculo) => {
            if (obstaculo.superior) obstaculo.superior.destroy();
            if (obstaculo.inferior) obstaculo.inferior.destroy();
        });
        this.obstaculos = [];
    }
}

export default JuegoDiscoteca;
