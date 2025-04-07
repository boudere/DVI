import { JUEGO_OVEJA, DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';
import Game from '/src/minijuegos/games.js';
import Oveja from '/src/minijuegos/juego_oveja/game_objects/sprites/ovejas.js';
import Valla from '/src/minijuegos/juego_oveja/game_objects/sprites/valla.js';
import Suelo from '/src/minijuegos/juego_oveja/game_objects/sprites/suelo.js';

class JuegoOveja extends Game {
    constructor(sprites) {
        super({ key: JUEGO_OVEJA });

        sprites = {
            OVEJA_IMG: 'oveja',
            VALLA_IMG: 'valla',
            FONDO_IMG: 'fondo'
        }

        this.OVEJA_IMG = sprites.OVEJA_IMG;
        this.VALLA_IMG = sprites.VALLA_IMG;
        this.FONDO_IMG = sprites.FONDO_IMG;

        this.OVEJITA_MUSICA = 'ovejitas';

        this.started = false;
        this.vallasSaltadas = 0;
    }


    create() {
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);
        
        this.musica = this.sound.add(this.data_info_scene.get_musica(this.OVEJITA_MUSICA), {
            loop: true,
            volume: 1.0
        });
        this.musica.play();

        this._crear_suelo();
        this._crearOveja(); 
        this._crear_marcador();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.vallas = [];
        this.scheduleNextValla();

        this.game_created(); // Llamar a la función de escena creada
    }

    enter() {
        super.enter();
        this.oveja.enter();
        this.suelo.enter();

        this.physics.add.collider(this.oveja, this.suelo);

        this.started = true; // Iniciar el juego
    }

    _crear_suelo() {
        let x = this.SCREEN_WIDTH / 2;
        let y = this.SCREEN_HEIGHT * 0.95;
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.FONDO_IMG);
        let scale_x = this.SCREEN_WIDTH / 450;
        let scale_y = (this.SCREEN_HEIGHT * 0.3) / 338;

        this.suelo = new Suelo(this, x, y, img, scale_x, scale_y);
    }

    _crearOveja() {
        let x = 175;
        let y = this.SCREEN_HEIGHT * 0.75 - 100;
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OVEJA_IMG);
        let scale_x = 200 / 626;
        let scale_y = 200 / 569;

        this.oveja = new Oveja(this, x, y, img, scale_x, scale_y);
    }

    _crear_marcador() {
        this.contadorTexto = this.add.text(
            this.SCREEN_WIDTH - 50, 50,
            `Saltadas: ${this.vallasSaltadas}`,
            {
                fontSize: '40px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(1, 0); // Alineado a la esquina superior derecha
    }

    scheduleNextValla() {
        const delay = Phaser.Math.Between(1500, 3000); // entre 2 y 5 segundos
        this.time.delayedCall(delay, () => {
            this._crear_valla();
            this.scheduleNextValla(); // se vuelve a llamar recursivamente
        });
    }
    
    _crear_valla() {
        let x = this.SCREEN_WIDTH + 50;
        let y = this.SCREEN_HEIGHT * 0.75 - 100;
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.VALLA_IMG);
        let scale_x = 350 / 626;
        let scale_y = 350 / 358;

        this.valla = new Valla(this, x, y, img, scale_x, scale_y);
        this.valla.enter();

        this.valla.contada = false;

        // ✅ Añadir colisión entre oveja y valla
        this.physics.add.collider(this.oveja, this.valla, () => {
            this.oveja.setTint(0xff0000);

            // 🛑 Detener física y temporizadores
            this.physics.pause();            // Detiene la física
            this.time.removeAllEvents();    // Elimina todos los timers (como spawn de vallas)
            this.musica.stop();             // Para la música (opcional)

            // Opcional: mostrar "Perdiste" en pantalla
            const textoGameOver = this.add.text(
                this.SCREEN_WIDTH / 2,
                this.SCREEN_HEIGHT / 2,
                '¡Perdiste!',
                {
                    fontSize: '96px',
                    color: '#ff0000',
                    fontFamily: 'Arial'
                }
            ).setOrigin(0.5);
        });


        this.vallas.push(this.valla);
    }


    _update() {
        if (!this.started) { return; } // Evitar que se ejecute antes de iniciar el juego
        if (this.oveja.body.blocked.down) {
            this.oveja.setVelocityY(0);
        }

        // ✅ Corregido: usar .onFloor() como función
        if (this.cursors.space.isDown && this.oveja.body.onFloor()) {
            this.oveja.setVelocityY(-1100); // Salto
        }

        this.vallas.forEach((valla) => {
            if (valla && valla.x < this.oveja.x && !valla.contada) {
                this.vallasSaltadas++;
                this.contadorTexto.setText(`Saltadas: ${this.vallasSaltadas}`);
                valla.contada = true;
            }

            if (valla && valla.x < -50) {
                valla.destroy();
            }
        });
    }
}

export default JuegoOveja;