import { JUEGO_OVEJA, DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';
import Game from '/src/minijuegos/games.js';
import Oveja from '/src/minijuegos/juego_oveja/game_objects/sprites/oveja.js';
import Valla from '/src/minijuegos/juego_oveja/game_objects/sprites/valla.js';
import Suelo from '/src/minijuegos/juego_oveja/game_objects/sprites/suelo.js';
import Cielo from '/src/minijuegos/juego_oveja/game_objects/sprites/cielo.js';
import Nube from '/src/minijuegos/juego_oveja/game_objects/sprites/nube.js';
import Prota from '/src/minijuegos/juego_oveja/game_objects/sprites/prota.js';
import PantallaIncio from '/src/minijuegos/juego_oveja/pantallas/inicio/pantalla_1/pantalla_inicio.js';
import PantallaFinal from '/src/minijuegos/juego_oveja/pantallas/final/pantalla_1/pantalla_final.js';

class JuegoOveja extends Game {
    constructor(sprites) {  
        super({ key: JUEGO_OVEJA });

        sprites = {
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
        this.ovejas_contadas = 0;
        this.oveja_contada = [];
    }


    create() {
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.data_info_scene = this.scene.get(DATA_INFO);

        this.datos_usuario = this.data_info_scene.get_datos_usaurio().Minijuegos.JuegoOveja;
        this.persoanl_best = this.datos_usuario.RecortdPuntuacion;
        
        this.scene.get(MINIJUEGO_MANAGER).play_music(this.OVEJITA_MUSICA);

        this.ovejas = [];
        this.nubes = {
            'cerca': [],
            'media': [],
            'lejos': [],
        };
        this.nubes_cantidad = {
            'cerca': 0,
            'max_cerca': 2,
            'media': 0,
            'max_media': 1,
            'lejos': 0,
            'max_lejos': 2,
        }

        this._crear_cielo();
        this._crear_nubes_iniciales();  
        this._crear_suelo();
        this._crear_prota();
        this._crear_valla();
        this._crear_pantalla_inicio();

        this.ovejaGroup = this.physics.add.group(); // Grupo de ovejas con física

        this.physics.add.collider(this.ovejaGroup, this.suelo);
        this.physics.add.collider(this.ovejaGroup, this.valla, (valla, oveja) => {
            this.choque_function(oveja);
        });

        this.game_created(); // Llamar a la función de escena creada
    }

    jump() {
        if (!this.started) return;
    
        for (let i = 0; i < this.ovejas.length; i++) {
            const oveja = this.ovejas[i];
            if (oveja && oveja.body && oveja.body.onFloor()) {
                oveja.setVelocityY(-1000); // Salto
                break; // solo salta una
            }
        }
    }

    _set_events() {
        super._set_events(); // Llamar a la función de eventos de la clase padre
        this.input.on('pointerdown', this._mouse_up, this); // Salto al hacer clic
    }

    _remove_events() {
        super._remove_events(); // Llamar a la función de eventos de la clase padre
        this.input.off('pointerdown', this._mouse_up, this); // Eliminar evento de clic
    }

    enter() {
        super.enter();
        this.pantalla_inicio.enter();
    }

    _mouse_up() {
        if (this.started) this.jump();

        if (this.pantalla_inicio) this.pantalla_inicio._mouse_up();
        if (this.pantalla_final) { this.pantalla_final._mouse_up();}        
    }

    start_game() {
        this.pantalla_inicio.exit();
        this.cielo.enter();
        Object.keys(this.nubes).forEach((key) => {
            this.nubes[key].forEach((nube) => {
                nube.enter();
            });
        });
        this.suelo.enter();
        this.prota.enter();
        this.valla.enter();
        this._crear_oveja();

        this.schedule_next_oveja(); // Comenzar a crear vallas
        this.schedule_next_nube(); // Comenzar a crear nubes
        this.started = true; // Iniciar el juego
    }

    finnish_game() {
        this.pantalla_final.exit();

        //this._clean_up();
        // Volver al dialogo después del juego
        this.scene.get(MINIJUEGO_MANAGER).return_to_dialogo();
    }

    _crear_cielo() {
        let x = 0;
        let y = 0;

        this.cielo = new Cielo(this, x, y).setOrigin(0,0);
    }

    _crear_nubes_iniciales() {
        let distancias = ['cerca', 'media', 'lejos'];
    
        this.nubes[distancias[0]].push(this._anadir_nube(distancias[0], 100, 5));
        this.nubes[distancias[0]].push(this._anadir_nube(distancias[0], 1400, 3));
        this.nubes[distancias[1]].push(this._anadir_nube(distancias[1], 1200, 1));
        this.nubes[distancias[2]].push(this._anadir_nube(distancias[2], 250, 2));
        this.nubes[distancias[2]].push(this._anadir_nube(distancias[2], 900, 4));
    }
       

    _crear_nubes() {
        let distancias = ['cerca', 'media', 'lejos'];
    
        distancias = Phaser.Utils.Array.Shuffle(distancias);

        distancias.forEach((distancia) => {
            if (this.nubes[distancia].length < this.nubes_cantidad[`max_${distancia}`]) {
                let nube = this._anadir_nube(distancia);
                nube.enter();
                this.nubes[distancia].push(nube);
                return;
            }
        });
    }

    _anadir_nube(distancia, x=null, num=null) {
        x = x || this.SCREEN_WIDTH;
        let y = this.SCREEN_HEIGHT;
        let nube = new Nube(this, x, y, distancia, num).setOrigin(0,0);
        return nube;
    }

    _crear_suelo() {
        let x = this.SCREEN_WIDTH / 2;
        let y = this.SCREEN_HEIGHT * 0.9;

        this.suelo = new Suelo(this, x, y);
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
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_INCIO);

        this.pantalla_inicio = new PantallaIncio(this, x, y, img);
    }

    _crear_pantalla_final() {
        let x = 0;
        let y = 0;
        let img = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PANTALLA_FINAL);

        this.pantalla_final = new PantallaFinal(this, x, y, img);
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

    schedule_next_nube() {
        let min = 100;
        let max = 300;

        min = Math.max(100, 300 -this.ovejas_contadas * 10);  
        max = Math.max(400, 500 -this.ovejas_contadas * 20); 

        const delay = Phaser.Math.Between(min, max);

        this.time.delayedCall(delay, () => {
            if (!this.started) { return; }
            this._crear_nubes();
            this.schedule_next_nube();
        });
    }


    _update(time, delta) {
        if (this.pantalla_inicio) this.pantalla_inicio._update(time, delta);
        if (this.pantalla_final) this.pantalla_final._update(time, delta);
        if (!this.started) { return; }

        this.ovejas_update()
        this.nubes_update();
    }

    ovejas_update(time, delta) {
        this.ovejaGroup.children.iterate((oveja) => {
            oveja._update(time, delta);
        });

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
                oveja.setDepth(1);
                this.prota.oveja_contada(this.ovejas_contadas);
            }
        }
    }

    nubes_update() {
        Object.keys(this.nubes).forEach((key) => {
            this.nubes[key].forEach((nube) => {
                if (nube.x < -nube.displayWidth) {
                    nube.exit();
                    nube.destroy();
                    this.nubes[key].splice(this.nubes[key].indexOf(nube), 1);
                }
            });
        });
    }

    choque_function(oveja) {
        this._crear_pantalla_final();
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
            if (this.persoanl_best < this.ovejas_contadas) {
                this.data_info_scene.guardar_puntuacion(this.scene.key,this.ovejas_contadas);
            }
            this.pantalla_final.enter({ "ovejas" : this.ovejas_contadas, "previus_record": this.persoanl_best, "record" : this.persoanl_best < this.ovejas_contadas});

            this.prota.exit();
            Object.keys(this.nubes).forEach((key) => {
                this.nubes[key].forEach((nube) => {
                    nube.exit();
                });
            });

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
            textoGameOver.destroy();
        }, 2000);
    }

    pantalla_inicio_animation_complete() {
        this.pantalla_inicio.animacion_complete();
    }
}


export default JuegoOveja;