import { JUEGO_OVEJA, DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';
import Game from '/src/minijuegos/games.js';
import Oveja from '/src/minijuegos/juego_oveja/game_objects/sprites/oveja.js';
import Valla from '/src/minijuegos/juego_oveja/game_objects/sprites/valla.js';
import Suelo from '/src/minijuegos/juego_oveja/game_objects/sprites/suelo.js';
import Cielo from '/src/minijuegos/juego_oveja/game_objects/sprites/cielo.js';
import Prota from '/src/minijuegos/juego_oveja/game_objects/sprites/prota.js';
import PantallaInicio from '/src/minijuegos/juego_oveja/pantallas/pantalla_inicio.js';
import PantallaFinal from '/src/minijuegos/juego_oveja/pantallas/pantalla_final.js';

class JuegoOveja extends Game {
    constructor(sprites) {  
        super({ key: JUEGO_OVEJA });

        sprites = {
            PANTALLA_INICIO: 'pantalla_inicio',
            PANTALLA_FINAL: 'pantalla_final'
        }

        this.OVEJA_IMG = sprites.OVEJA_IMG;
        this.VALLA_IMG = sprites.VALLA_IMG;
        this.FONDO_IMG = sprites.FONDO_IMG;
        this.CIELO_IMG = sprites.CIELO_IMG;
        this.PANTALLA_INICIO = sprites.PANTALLA_INICIO;
        this.PANTALLA_FINAL = sprites.PANTALLA_FINAL;

        this.OVEJITA_MUSICA = 'ovejitas';

        this.started = false;
        this.ovejas_contadas = 0;
        this.oveja_contada = [];
    }


    create() {
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);

        this.persoanl_best = this.data_info_scene.get_json('saves').Minijuegos.JuegoOveja.RecortdPuntuacion;

        this.datos_usuario = this.data_info_scene.get_datos_usaurio().Minijuegos.JuegoOveja;
        this.persoanl_best = this.datos_usuario.RecortdPuntuacion;
        
        this.scene.get(MINIJUEGO_MANAGER).play_music(this.OVEJITA_MUSICA);

        this.ovejas = [];

        this._crear_cielo();
        this._crear_suelo();
        this._crear_prota();
        this._crear_valla();
        this._crear_marcador();
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.ovejaGroup = this.physics.add.group(); // Grupo de ovejas con física

        this.physics.add.collider(this.ovejaGroup, this.suelo);
        this.physics.add.collider(this.ovejaGroup, this.valla, (valla, oveja) => {
            this.choque_function(oveja);
        });

        this.input.on('pointerdown', () => {
            if (!this.started) return;
        
            for (let i = 0; i < this.ovejas.length; i++) {
                const oveja = this.ovejas[i];
                if (oveja && oveja.body && oveja.body.onFloor()) {
                    oveja.setVelocityY(-1000); // Salto
                    break; // solo salta una
                }
            }
        });
        

        this.game_created(); // Llamar a la función de escena creada
    }

    enter() {
        super.enter();
        this.pantalla_inicio.enter();
    }

    start_game() {
        this.pantalla_inicio.exit();
        this.cielo.enter();
        this.suelo.enter();
        this.prota.enter();
        this.valla.enter();
        this._crear_oveja();

        this.schedule_next_oveja(); // Comenzar a crear vallas
        this.started = true; // Iniciar el juego
    }

    finnish_game() {
        this.pantalla_final.exit();
        
        if (this.persoanl_best <this.ovejas_contadas) {
            this.data_info_scene.guardar_puntuacion(this.scene.key,this.ovejas_contadas);
        }

        this.exit();
    }

    _crear_cielo() {
        let x = 0;
        let y = 0;
        let scale_x = 1;
        let scale_y = 1;

        this.cielo = new Cielo(this, x, y, scale_x, scale_y).setOrigin(0,0);
    }

    _crear_suelo() {
        let x = this.SCREEN_WIDTH / 2;
        let y = this.SCREEN_HEIGHT * 0.95;
        let scale_x = this.SCREEN_WIDTH / 450;
        let scale_y = (this.SCREEN_HEIGHT * 0.3) / 338;

        this.suelo = new Suelo(this, x, y, scale_x, scale_y);
    }

    _crear_oveja() {
        let x = this.SCREEN_WIDTH + 100;
        let y = this.SCREEN_HEIGHT * 0.78;

        let oveja = new Oveja(this, x, y);
        oveja.enter();
        this.ovejas.push(oveja);
        this.ovejaGroup.add(oveja);
    }

    _crear_prota() {
        let x = 650;
        let y = this.SCREEN_HEIGHT * 0.65;

        this.prota = new Prota(this, x, y);
    }
    
    _crear_valla() {
        let x = 500;
        let y = this.SCREEN_HEIGHT * 0.88 - 100;
        this.valla = new Valla(this, x, y);
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

    _crear_marcador() {
        this.contadorTexto = this.add.text(
            this.SCREEN_WIDTH - 50, 50,
            `Ovejas: ${this.ovejas_contadas}`,
            {
                fontSize: '40px',
                fill: '#ffffff',
                fontFamily: 'Impact'
            }).setOrigin(1, 0).setDepth(1); // Alineado a la esquina superior derecha
    }

    schedule_next_oveja() {
        let min = 100;
        let max = 300;

        min = Math.max(500, 1000 -this.ovejas_contadas * 10);  
        max = Math.max(1000, 1500 -this.ovejas_contadas * 20); 

        const delay = Phaser.Math.Between(min, max);

        this.time.delayedCall(delay, () => {
            if (!this.started) { return; }
            this._crear_oveja();
            this.schedule_next_oveja();
        });
    }


    _update() {
        if (!this.started) { return; }

        this.ovejas.forEach((oveja) => {
            if (oveja && oveja.x < this.valla.x && !oveja.contada) {
                oveja.contada = true;
                this.oveja_contada.push(this.ovejas.shift());
            }
        });

        for (let i = this.oveja_contada.length - 1; i >= 0; i--) {
            const oveja = this.oveja_contada[i];
        
            if (oveja.x < -50) {
                oveja.exit();
                oveja.destroy();
                this.oveja_contada.splice(i, 1); // eliminar del array
                continue;
            }
        
            if (oveja.body && this.valla.x - this.valla.displayWidth && !oveja._yaSumada) {
                oveja._yaSumada = true;
                this.ovejas_contadas++;
                this.contadorTexto.setText(`Ovejas: ${this.ovejas_contadas}`);
                this.prota.oveja_contada(this.ovejas_contadas);
            }
        }
    }

    choque_function(oveja) {
        this.started = false;
        oveja.setTint(0xff0000);

        // Detener física y temporizadores
        this.physics.pause();           
        this.time.removeAllEvents();    
        this.scene.get(MINIJUEGO_MANAGER).stop_music(this.OVEJITA_MUSICA);             

        
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

            this.prota.exit();
            this.valla.exit();
            this.cielo.destroy()
            this.ovejas.forEach((oveja) => {
                oveja.exit();
            });
            this.oveja_contada.forEach((oveja) => {
                oveja.exit();
            });
            this.ovejaGroup.clear(true, true); // Limpiar el grupo de ovejas
            this.suelo.exit();
            this.contadorTexto.destroy();
            textoGameOver.destroy();
        }, 2000);
    }
}

export default JuegoOveja;