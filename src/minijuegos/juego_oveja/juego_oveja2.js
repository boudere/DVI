import { JUEGO_OVEJA, DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';
import Game from '/src/minijuegos/games.js';
import Oveja from '/src/minijuegos/juego_oveja/game_objects/sprites/ovejas.js';
import Valla from '/src/minijuegos/juego_oveja/game_objects/sprites/valla.js';
import Suelo from '/src/minijuegos/juego_oveja/game_objects/sprites/suelo.js';
import Cielo from '/src/minijuegos/juego_oveja/game_objects/sprites/cielo.js';
import PantallaIncio from '/src/minijuegos/juego_oveja/pantallas/pantalla_inicio.js';
import PantallaFinal from '/src/minijuegos/juego_oveja/pantallas/pantalla_final.js';

class JuegoOveja extends Game {
    constructor(sprites) {  
        super({ key: JUEGO_OVEJA });

        sprites = {
            OVEJA_IMG: 'oveja',
            VALLA_IMG: 'valla',
            FONDO_IMG: 'fondo',
            CIELO_IMG: 'cielo',
            PANTALLA_INCIO: 'pantalla_inicio',
            PANTALLA_FINAL: 'pantalla_final'
        }

        this.OVEJA_IMG = sprites.OVEJA_IMG;
        this.VALLA_IMG = sprites.VALLA_IMG;
        this.FONDO_IMG = sprites.FONDO_IMG;
        this.CIELO_IMG = sprites.CIELO_IMG;
        this.PANTALLA_INCIO = sprites.PANTALLA_INCIO;
        this.PANTALLA_FINAL = sprites.PANTALLA_FINAL;

        this.OVEJITA_MUSICA = 'ovejitas';

        this.started = false;
        this.vallasSaltadas = 0;
    }


    create() {
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);

        this.persoanl_best = this.data_info_scene.get_json('saves').Minijuegos.JuegoOveja.RecortdPuntuacion;

        this.datos_usuario = this.data_info_scene.get_datos_usaurio().Minijuegos.JuegoOveja;
        this.persoanl_best = this.datos_usuario.RecortdPuntuacion;
        
        this.musica = this.sound.add(this.data_info_scene.get_musica(this.OVEJITA_MUSICA), {
            loop: true,
            volume: 1.0
        });
        this.musica.play();

        this._crear_cielo();
        this._crear_suelo();
        this._crearOveja(); 
        this._crear_marcador();
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.vallas = [];
        // this.scheduleNextValla();

        this.game_created(); // Llamar a la función de escena creada
    }

    enter() {
        super.enter();
        this.pantalla_inicio.enter();
    }

    start_game() {
        this.pantalla_inicio.exit();
        this.cielo.enter();
        this.oveja.enter();
        this.suelo.enter();

        this.physics.add.collider(this.oveja, this.suelo);

        this.scheduleNextValla(); // Comenzar a crear vallas
        this.started = true; // Iniciar el juego
    }

    finnish_game() {
        this.pantalla_final.exit();
        
        if (this.persoanl_best < this.vallasSaltadas) {
            this.data_info_scene.guardar_puntuacion(this.scene.key, this.vallasSaltadas);
        }

        this.exit();
    }

    _crear_cielo() {
        let x = 0;
        let y = 0;
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.CIELO_IMG);
        let scale_x = this.SCREEN_WIDTH / 768;
        let scale_y = this.SCREEN_HEIGHT/ 432;

        this.cielo = new Cielo(this, x, y, img, scale_x, scale_y).setOrigin(0,0);
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

    _crear_pantalla_inicio() {
        let x = 0;
        let y = 0;
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_INCIO);

        this.pantalla_inicio = new PantallaIncio(this, x, y, img);
    }

    _crear_pantalla_final() {
        let x = 0;
        let y = 0;
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_FINAL);

        this.pantalla_final = new PantallaFinal(this, x, y, img);
    }

    _crear_marcador() {
        this.contadorTexto = this.add.text(
            this.SCREEN_WIDTH - 50, 50,
            `Saltadas: ${this.vallasSaltadas}`,
            {
                fontSize: '40px',
                fill: '#ffffff',
                fontFamily: 'Impact'
            }).setOrigin(1, 0).setDepth(1); // Alineado a la esquina superior derecha
    }

    scheduleNextValla() {
        /* DIFICULTAD CONSTANTE
        const delay = Phaser.Math.Between(1500, 3000); // entre 2 y 5 segundos
        this.time.delayedCall(delay, () => {
            this._crear_valla();
            this.scheduleNextValla(); // se vuelve a llamar recursivamente
        });
        */
        let min = 1500;
        let max = 3000;

        // reduce tiempo de aparición con cada valla saltada
        min = Math.max(600, 1500 - this.vallasSaltadas * 50);  
        max = Math.max(1200, 3000 - this.vallasSaltadas * 60); 

        const delay = Phaser.Math.Between(min, max);

        this.time.delayedCall(delay, () => {
            this._crear_valla();
            this.scheduleNextValla();
        });
    }
    
    _crear_valla() {
        let x = this.SCREEN_WIDTH + 50;
        let y = this.SCREEN_HEIGHT * 0.75 - 50;
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.VALLA_IMG);
        let scale_x = 300 / 626;
        let scale_y = 300 / 358;

        this.valla = new Valla(this, x, y, img, scale_x, scale_y);
        this.valla.enter();

        this.valla.contada = false;

        // Añadir colisión entre oveja y valla
        this.physics.add.collider(this.oveja, this.valla, this.choque_function, null, this);


        this.vallas.push(this.valla);
    }


    _update() {
        if (!this.started) { return; } // Evitar que se ejecute antes de iniciar el juego
        if (this.oveja.body.blocked.down) {
            this.oveja.setVelocityY(0);
        }

        
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
                valla.exit();
            }
        });
    }

    choque_function() {
        this.started = false;
        this.oveja.setTint(0xff0000);

        // Detener física y temporizadores
        this.physics.pause();           
        this.time.removeAllEvents();    
        this.musica.stop();             

        
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
            this.pantalla_final.enter(this.vallasSaltadas);

            this.oveja.exit();
            this.cielo.destroy()
            this.vallas.forEach((valla) => {
                valla.exit();
            });
            this.suelo.exit();
            this.contadorTexto.destroy();
            textoGameOver.destroy();
        }, 2000);
    }
}

export default JuegoOveja;