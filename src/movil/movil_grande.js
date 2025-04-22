import { MOVIL_GRANDE, DATA_INFO, MOVIL_MANAGER } from '/src/data/scene_data.js';
/*import Game from '/src/minijuegos/games.js';
import Oveja from '/src/minijuegos/juego_oveja/game_objects/sprites/ovejas.js';
import Valla from '/src/minijuegos/juego_oveja/game_objects/sprites/valla.js';
import Suelo from '/src/minijuegos/juego_oveja/game_objects/sprites/suelo.js';
import Cielo from '/src/minijuegos/juego_oveja/game_objects/sprites/movil.js';*/
import PantallaIncio from '/src/minijuegos/juego_oveja/pantallas/pantalla_inicio.js';
import PantallaFinal from '/src/minijuegos/juego_oveja/pantallas/pantalla_final.js';

class MovilGrande extends Game {
    constructor(sprites) {  
        super({ key: MOVIL_GRANDE });

        sprites = {
            MOVIL_IMG: 'movil',
            /*VALLA_IMG: 'valla',
            FONDO_IMG: 'fondo',
            MOVIL_IMG: 'movil',*/
            PANTALLA_INCIO: 'pantalla_inicio',
            PANTALLA_FINAL: 'pantalla_final'
        }

        this.MOVIL_IMG = sprites.MOVIL_IMG;
       /* this.VALLA_IMG = sprites.VALLA_IMG;
        this.FONDO_IMG = sprites.FONDO_IMG;
        this.MOVIL_IMG = sprites.MOVIL_IMG;*/
        this.PANTALLA_INCIO = sprites.PANTALLA_INCIO;
        this.PANTALLA_FINAL = sprites.PANTALLA_FINAL;

        //this.OVEJITA_MUSICA = 'ovejitas';

        this.started = false;
    }


    create() {
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);
        
       /* this.musica = this.sound.add(this.data_info_scene.get_musica(this.OVEJITA_MUSICA), {
            loop: true,
            volume: 1.0
        });
        this.musica.play();*/

        this._crear_movil();
       /* this._crear_suelo();
        this._crearOveja(); 
        this._crear_marcador();*/
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();

        //this.cursors = this.input.keyboard.createCursorKeys();

        this.game_created(); // Llamar a la función de escena creada
    }

    enter() {
        super.enter();
        this.pantalla_inicio.enter();
    }

    start_game() {
        this.pantalla_inicio.exit();
        this.movil.enter();
        /*this.oveja.enter();
        this.suelo.enter();

        this.physics.add.collider(this.oveja, this.suelo);*/

        this.started = true; // Iniciar el juego
    }

    finish_game() { //NO SE LE LLAMA EN NINGUN SITIO 
        this.pantalla_final.exit();
        
        if (this.personal_best < this.vallasSaltadas) {
            this.data_info_scene.guardar_puntuacion(this.scene.key, this.vallasSaltadas);
        }

        this.exit();
    }

    _crear_movil() {
        let x = 0;
        let y = 0;
        let img = this.data_info_scene.get_img(MOVIL_MANAGER, this.MOVIL_IMG);
        let scale_x = this.SCREEN_WIDTH / 768;
        let scale_y = this.SCREEN_HEIGHT/ 432;

        this.movil = new Movil(this, x, y, img, scale_x, scale_y).setOrigin(0,0);
    }

    /*_crear_suelo() {
        let x = this.SCREEN_WIDTH / 2;
        let y = this.SCREEN_HEIGHT * 0.95;
        let img = this.data_info_scene.get_img(MOVIL_MANAGER, this.FONDO_IMG);
        let scale_x = this.SCREEN_WIDTH / 450;
        let scale_y = (this.SCREEN_HEIGHT * 0.3) / 338;

        this.suelo = new Suelo(this, x, y, img, scale_x, scale_y);
    }

    _crearOveja() {
        let x = 175;
        let y = this.SCREEN_HEIGHT * 0.75 - 100;
        let img = this.data_info_scene.get_img(MOVIL_MANAGER, this.MOVIL_IMG);
        let scale_x = 200 / 626;
        let scale_y = 200 / 569;

        this.oveja = new Oveja(this, x, y, img, scale_x, scale_y);
    }*/

    _crear_pantalla_inicio() {
        let x = 0;
        let y = 0;
        let img = this.data_info_scene.get_img(MOVIL_MANAGER, this.PANTALLA_INCIO);

        this.pantalla_inicio = new PantallaIncio(this, x, y, img);
    }

    _crear_pantalla_final() {
        let x = 0;
        let y = 0;
        let img = this.data_info_scene.get_img(MOVIL_MANAGER, this.PANTALLA_FINAL);

        this.pantalla_final = new PantallaFinal(this, x, y, img);
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
            this.movil.destroy()
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