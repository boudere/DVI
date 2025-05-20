import { JUEGO_PAREJAS, DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';
import Game from '/src/minijuegos/games.js';
import Carta from '/src/minijuegos/examen_parejas/game_objects/sprites/carta.js';
// import game_objects sprites


// cambios en : /src/data/scene_data.js, /src/minijuegos/examen_parejas, assets/img/minijuegos/juego_parejas, assets/json: data.json y folders.js
//              /src/config.js, /src/scenes/data_info.js

// TODO: añadir musica juego parejas en data.json, docs/data.json, folders.json, docs/folders.json y assets/musica

class JuegoParejas extends Game {
    constructor(sprites) {
        super({ key: JUEGO_PAREJAS });

        /*sprites = {
            FRONT_IMG: 'cara', // prefijo, no puede ser la misma para todas
            BACK_IMG: 'reverso',
            FONDO_IMG: 'fondo'
        }*/

        this.BACK_IMG = sprites.BACK_IMG;
        this.FONDO_IMG = sprites.FONDO_IMG;

        this.PAREJAS_MUSICA = 'parejas';

        this.started = false;
    }

    create() {
        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;
        this.data_info_scene = this.scene.get(DATA_INFO);
        
        // Configurar fondo
        // Configurar música

        this.cartas = [];
        this.cartasSeleccionadas = [];
        this.parejas = 0;
        this.cartasBloqueadas = false;

        this._definicion_parejas();
        this._crear_cartas();
        this._crear_temporizador();

        this.game_created();
    }

    _definicion_parejas() {
        this.parejas = [
            { id: 1, img1: 'café',  img2: 'cigarro'},
            { id: 2, img1: 'ron', img2: 'cola'},
            { id: 3, img1: 'perro',  img2: 'gata'},
            { id: 4, img1: 'cerveza', img2: 'cerveza'},
            { id: 5, img1: 'montado', img2: 'baguette'}
        ];
    }

    _crear_cartas() {
        const todas = [];
    
        this.parejas.forEach( par => {
            todas.push({ id: par.id, img: par.img1 });
            todas.push({ id: par.id, img: par.img2 });
        });
    
        Phaser.Utils.Array.Shuffle(todas);
    
        const cols = 4;
        const spacingX = 150;
        const spacingY = 180;
        const offsetX = (this.SCREEN_WIDTH - cols * spacingX) / 2 + spacingX / 2;
        const offsetY = 120;
    
        todas.forEach( (data, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = offsetX + col * spacingX;
            const y = offsetY + row * spacingY;
    
            const frontKey = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.CARTA_FRONT_PREFIX + data.img);
            const backKey = this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.BACK_IMG);
    
            const carta = new Carta(this, x, y, frontKey, backKey, data.id);

            carta.setOnClick(() => this._clickCarta(carta));
            this.cartas.push(carta);
        });
    }

    _crear_temporizador() {
        this.tiempoRestante = this.TIEMPO_LIMITE; // dependerá del "nivel" (examen)

        this.temporizadorTexto = this.add.text(50, 50, '', {
            fontSize: '36px',
            color: '#ffffff',
            fontFamily: 'Impact'
        }).setOrigin(0, 0).setDepth(1);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.tiempoRestante -= 1000;
                this._actualizarTemporizador();

                if (this.tiempoRestante <= 0) {
                    this._finJuego(false);
                }
            },
            loop: true
        });

        this._actualizarTemporizador();
    }

    _actualizarTemporizador() {
        const segundos = Math.ceil(this.tiempoRestante / 1000);
        this.temporizadorTexto.setText(`Tiempo: ${segundos}s`);
    }

    _clickCarta(carta) {
        if (this.cartasBloqueadas || carta.revelado) return;
    
        carta.reveal();
        this.cartasSeleccionadas.push(carta);
    
        if (this.cartasSeleccionadas.length === 2) {
            this.cartasBloqueadas = true;
            this.time.delayedCall(800, () => this._evaluarPareja());
        }
    }

    _evaluarPareja() {
        const [c1, c2] = this.cartasSeleccionadas;
    
        if (c1.id === c2.id) {
            this.parejasEncontradas++;
            if (this.parejasEncontradas === this.parejas.length) {
                this._finJuego(true);
            }
        } else {
            c1.hide();
            c2.hide();
        }
    
        this.cartasSeleccionadas = [];
        this.cartasBloqueadas = false;
    }

    _finJuego(gano) {
        this.cartasBloqueadas = true;
        this.timerEvent.remove();

        const mensaje = gano ? '¡Completado!' : '¡Tiempo agotado!';
        const color = gano ? '#00ff00' : '#ff0000';

        this.add.text(this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2, mensaje, {
            fontSize: '72px',
            color,
            fontFamily: 'Impact'
        }).setOrigin(0.5);
    }

    _update() { }
}

export default JuegoParejas;