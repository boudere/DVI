import { JUEGO_OVEJA, DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';
import Game from '/src/minijuegos/games.js';
import Oveja from '/src/minijuegos/juego_oveja/game_objects/sprites/ovejas.js';

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
    }


    create() {
        this.vallasSaltadas = 0;

        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.contadorTexto = this.add.text(
            this.SCREEN_WIDTH - 50, 50,
            `Saltadas: ${this.vallasSaltadas}`,
            {
                fontSize: '40px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(1, 0); // Alineado a la esquina superior derecha


        this.data_info_scene = this.scene.get(DATA_INFO);
        this.musica = this.sound.add(this.data_info_scene.get_musica(this.OVEJITA_MUSICA), {
            loop: true,
            volume: 1.0
        });
        this.musica.play();
        //this.animations();

        //CHATGPT, PONERLO BIEN PORFA 
        // 📌 Crear el suelo en el cuarto inferior de la pantalla
        let suelo = this.physics.add.sprite(
            this.SCREEN_WIDTH / 2,
            this.SCREEN_HEIGHT * 0.95,  // 🔽 Ahora está bien colocado
            this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.FONDO_IMG)
        );
        suelo.setScale(this.SCREEN_WIDTH / 450, (this.SCREEN_HEIGHT * 0.3) / 338);
        suelo.setImmovable(true);
        suelo.body.setAllowGravity(false);

        this._crearOveja(); 

        // 📌 Asegurar colisión entre la oveja y el suelo
        this.physics.add.collider(this.oveja, suelo);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.vallas = []; //this.physics.add.group();
        this.scheduleNextValla();

        this.game_created(); // Llamar a la función de escena creada
    }

    enter() {
        super.enter();
        this.oveja.enter();

        this.started = true; // Iniciar el juego
    }

    _crearOveja() {
        let x = 175;
        let y = this.SCREEN_HEIGHT * 0.75 - 100;
        this.oveja = new Oveja(this, x, y, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OVEJA_IMG), 200 / 626, 200 / 569);
    }

    scheduleNextValla() {
        const delay = Phaser.Math.Between(1500, 3000); // entre 2 y 5 segundos
        this.time.delayedCall(delay, () => {
            this.spawnValla();
            this.scheduleNextValla(); // se vuelve a llamar recursivamente
        });
    }
    

    spawnValla() {
        this.valla = this.physics.add.sprite(
            this.SCREEN_WIDTH,
            1000,
            this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.VALLA_IMG)
        );
        this.valla.setScale(350 / 626, 350 / 358);
        this.valla.setVelocityX(-500);
        this.valla.setGravityY(-600);
        this.valla.contada = false;

        this.valla.body.setSize(
            this.valla.width * 0.8, // 60% del ancho visual
            this.valla.height * 0.8 // 80% del alto visual
        );
        
        this.valla.body.setOffset(
            this.valla.width * 0.1, // 10% del ancho visual
            this.valla.height * 0.1 // 10% del alto visual
        );

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


    addObstacle(obstacle) {
        this.physics.world.enable(obstacle);
        obstacle.body.setAllowGravity(false);
        obstacle.body.setImmovable(true);
        this.physics.add.collider(obstacle, this.floor);
    }
}

export default JuegoOveja;