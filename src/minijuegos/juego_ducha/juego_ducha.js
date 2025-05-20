import { JUEGO_DUCHA, DATA_INFO, MINIJUEGO_MANAGER, SCENE_MANAGER } from '/src/data/scene_data.js';
import Game from "/src/minijuegos/games.js";
import Mampara from "/src/minijuegos/juego_ducha/game_objects/mampara.js"
import Burbuja from "/src/minijuegos/juego_ducha/game_objects/burbuja.js";
import Gota from "/src/minijuegos/juego_ducha/game_objects/gota.js";
import Barra from "/src/minijuegos/juego_ducha/game_objects/barra.js";
import PantallaInicio from '/src/minijuegos/juego_ducha/pantallas/pantalla_inicio.js';
import PantallaFinal from '/src/minijuegos/juego_ducha/pantallas/pantalla_final.js';


class JuegoDucha extends Game {
    constructor(sprites) {
        super({ key: JUEGO_DUCHA });

        sprites = {
            GOTA_IMG: 'gota',
            BARRA_IMG: 'barra',
            BURBUJA_IMG: 'burbuja',
            MAMPARA_IMG: 'mampara',
            PANTALLA_INICIO: 'pantalla_inicio_ducha',
            PANTALLA_FINAL: 'pantalla_final_ducha'
        };

        this.GOTA_IMG = sprites.GOTA_IMG;
        this.BARRA_IMG = sprites.BARRA_IMG;
        this.BURBUJA_IMG = sprites.BURBUJA_IMG;
        this.PANTALLA_INICIO = sprites.PANTALLA_INICIO;
        this.PANTALLA_FINAL = sprites.PANTALLA_FINAL;

        this.mamparawidth = 1536;
        this.mamparaheight = 1024;
        this.SCORE = 0;
        this.started = false;
    }

    create() {

        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;
        this.data_info_scene = this.scene.get(DATA_INFO);
        //this.physics.world.setBoundsCollision(true, true, true, false); //ni idea

        this._crear_mampara();
        this._crear_barra();
        this._crear_gota();
        this._crear_marcador();
        this._crear_burbujas();
        this._crear_pantalla_inicio();
        this._crear_pantalla_final();
       
        this.burbujas = [];

        this.physics.add.collider(this.gota, this.barra, this._rebote_barra, null, this);
        this.physics.add.collider(this.gota, this.burbujas, this._romper_burbuja, null, this);

        this.physics.world.on('worldbounds', (body, up, down) => {
            if (body.gameObject === this.gota && down) {
                this._reset_gota();
            }
        });

        this.started = true;
        this.game_created();
        
    }

    enter() {
        super.enter();
        this.pantalla_inicio.enter();
    }

    start_game() {
        this.pantalla_inicio.exit();
        this.mampara.enter();
        this.burbujas.forEach(b => b.enter());
        this.barra.enter();
        this.gota.enter();

        this._setup_input();         
        this.started = true;
    }

    _crear_mampara() {
        const x = 0;
        const y = 0;
        const scale_x = this.SCREEN_WIDTH / this.mamparawidth; // o reemplaza con el ancho real de la imagen
        const scale_y = this.SCREEN_HEIGHT / this.mamparaheight; // o reemplaza con el alto real de la imagen

        this.mampara = new Mampara(this, x, y, scale_x, scale_y).setOrigin(0, 0);
    }

    _crear_barra() {
        this.barra = new Barra(this, this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT - 50, 1.5, 1.5);
        //this.physics.add.existing(this.barra);//.setCollideWorldBounds(true);
        this.barra.body.allowGravity = false;
    }

    _crear_gota() {
        this.gota = new Gota(this, this.barra.x, this.barra.y - 30, 0.2, 0.2);
        this.physics.add.existing(this.gota);
        this.gota.body.setMaxVelocity(700, 800); // Limita velocidad horizontal y vertical
        this.gota.setBounce(5);
        this.gota.setCollideWorldBounds(true);
        this.gota.body.onWorldBounds = true;
        this.gota.setData('onBarra', true);
        this.gota.body.allowGravity = false;
    }

    _crear_marcador() {
        this.scoreText = this.add.text(20, 20, 'Puntos: 0', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Impact'
        });
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

    _crear_burbujas() {
    this.burbujas = this.physics.add.staticGroup();

    const rows = 5;
    const cols = 7;
    const spacingX = 120;
    const spacingY = 100;
    const scale = 60 / 256;

    // Centrado en pantalla (más arriba del centro)
    const totalWidth = (cols - 1) * spacingX;
    const totalHeight = (rows - 1) * spacingY;
    const startX = (this.SCREEN_WIDTH - totalWidth) / 2;
    const startY = this.SCREEN_HEIGHT * 0.1;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;
            const burbuja = new Burbuja(this, x, y, scale, scale, this.BURBUJA_IMG);
            this.burbujas.add(burbuja);
        }
    }
}



    _setup_input() {
        this.input.on('pointermove', pointer => {
            this.barra.x = Phaser.Math.Clamp(pointer.x, 52, this.SCREEN_WIDTH - 52);
            if (this.gota.getData('onBarra')) {
                this.gota.x = this.barra.x;

            }
        });

        this.input.on('pointerup', () => {
            if (this.gota.getData('onBarra')) {
                this.gota.setVelocity(-75, -300);
                this.gota.setData('onBarra', false);
            }
        });
    }

    _rebote_barra(gota, barra) {
        let diff = 0;

        if (gota.x < barra.x) {
            diff = barra.x - gota.x;
            gota.setVelocityX(-10 * diff);
        } else if (gota.x > barra.x) {
            diff = gota.x - barra.x;
            gota.setVelocityX(10 * diff);
        } else {
            gota.setVelocityX(2 + Math.random() * 8);
        }
    }

    _romper_burbuja(gota, burbuja) {
        burbuja.disableBody(true, true);
        this.SCORE += 5;
        this.scoreText.setText('Puntos: ' + this.SCORE);
        if (this.burbujas.countActive() === 0) {
            this._mostrar_victoria();
        }
    }
        
    _mostrar_victoria() {
        const texto = this.add.text(
            this.SCREEN_WIDTH / 2,
            this.SCREEN_HEIGHT / 2,
            '¡Enhorabuena, has ganado!',
            {
                fontSize: '64px',
                color: '#00ffcc',
                fontFamily: 'Impact'
            }
        ).setOrigin(0.5);

        this.physics.pause(); //?
        this.time.delayedCall(3000, () => {
            this.scene.get(MINIJUEGO_MANAGER).return_to_dialogo();
        });
    }


    finish_game() {
        this.pantalla_final.exit();
        this._clean_up();
        this.scene.get(MINIJUEGO_MANAGER).return_to_dialogo();
    }

    _update() {
        if (!this.started) return;

        if (this.gota.y > this.SCREEN_HEIGHT) {
            this._reset_gota();
        }
        /*this.barra._update();
        this.gota._update();
        this.burbujas.forEach(b => b._update());*/
    }

    _reset_gota() {
        this.gota.setVelocity(0);
        this.gota.setPosition(this.barra.x, this.barra.y - 120);
        this.gota.setData('onBarra', true);
    }

    _clean_up() {
        this.physics.pause();
        if (this.gota) this.gota.destroy();
        if (this.barra) this.barra.destroy();
        if (this.mampara) this.mampara.destroy();
        this.burbujas.clear(true, true);
    }

    exit() {
        super.exit();
        if (this.gota) this.gota.destroy();
        if (this.barra) this.barra.destroy();
        if (this.scoreText) this.scoreText.destroy();
        this.burbujas.forEach(b => b.destroy());
        this.burbujas = [];
    }
}

export default JuegoDucha;
