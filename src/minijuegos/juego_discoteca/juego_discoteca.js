import { JUEGO_DISCOTECA, DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';
import Game from '/src/minijuegos/games.js';
import Persona from '/src/minijuegos/juego_discoteca/game_objects/sprites/persona.js';
import Obstaculo from '/src/minijuegos/juego_discoteca/game_objects/sprites/obstaculo.js';

class JuegoDiscoteca extends Game {
    constructor(sprites) {
        super({ key: JUEGO_DISCOTECA });

        sprites = {
            PERSONA_IMG: 'persona',
            OBSTACULO_IMG: 'obstaculo',
            FONDO_IMG: 'fondodisco'
        }

        this.PERSONA_IMG = sprites.PERSONA_IMG;
        this.OBSTACULO_IMG = sprites.OBSTACULO_IMG;
        this.FONDO_IMG = sprites.FONDO_IMG;

        this.DISCOTECA_MUSICA = 'discoteca';

        this.started = false;
    }


    create() {
        this.obstaculossaltados = 0;

        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.contadorTexto = this.add.text(
            this.SCREEN_WIDTH - 50, 50,
            `Salvados: ${this.obstaculossaltados}`,
            {
                fontSize: '40px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(1, 0); // Alineado a la esquina superior derecha


        this.data_info_scene = this.scene.get(DATA_INFO);
        /*this.musica = this.sound.add(this.data_info_scene.get_musica(this.OVEJITA_MUSICA), {
            loop: true,
            volume: 1.0
        });
        this.musica.play();*/

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

        this._crearPersona(); 

        // Asegurar colisión entre la persona y el suelo
        this.physics.add.collider(this.persona, suelo);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.obstaculos = []; 
        this.scheduleNextObstaculo();

        this.game_created(); // Llamar a la función de escena creada
    }

    enter() {
        super.enter();
        this.oveja.enter();

        this.started = true; // Iniciar el juego
    }

    _crearPersona() {
        let x = 175;
        let y = this.SCREEN_HEIGHT * 0.75 - 100;
        this.persona = new Persona(this, x, y, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PERSONA__IMG), 200 / 626, 200 / 569);
    }

    scheduleNextObstaculo() {
        const delay = Phaser.Math.Between(1500, 3000); // entre 2 y 5 segundos
        this.time.delayedCall(delay, () => {
            this.spawnObstaculo();
            this.scheduleNextObstaculo(); // se vuelve a llamar recursivamente
        });
    }
    

    spawnObstaculo() {
        this.obstaculo = this.physics.add.sprite(
            this.SCREEN_WIDTH,
            1000,
            this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OBSTACULO_IMG)
        );
        this.obstaculo.setScale(350 / 626, 350 / 358);
        this.obstaculo.setVelocityX(-500);
        this.obstaculo.setGravityY(-600);
        this.obstaculo.contado = false;

        this.obstaculo.body.setSize(
            this.obstaculo.width * 0.8, // 60% del ancho visual
            this.obstaculo.height * 0.8 // 80% del alto visual
        );
        
        this.obstaculo.body.setOffset(
            this.obstaculo.width * 0.1, // 10% del ancho visual
            this.obstaculo.height * 0.1 // 10% del alto visual
        );

        // Añadir colisión entre persona y obstaculo
        this.physics.add.collider(this.persona, this.obstaculo, () => {
            this.persona.setTint(0xff0000);

            // Detener física y temporizadores
            this.physics.pause();            // Detiene la física
            this.time.removeAllEvents();    // Elimina todos los timers (como spawn de vallas)
            //this.musica.stop();             // Para la música (opcional)

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


        this.obstaculos.push(this.obstaculo);
    }


    _update() {
        if (!this.started) { return; } // Evitar que se ejecute antes de iniciar el juego
        if (this.persona.body.blocked.down) {
            this.persona.setVelocityY(0);
        }

        if (this.cursors.space.isDown && this.persona.body.onFloor()) {
            this.persona.setVelocityY(-1100); // Salto
        }

        this.obstaculos.forEach((obstaculo) => {
            if (obstaculo && obstaculo.x < this.persona.x && !obstaculo.contado) {
                this.obstaculossaltados++;
                this.contadorTexto.setText(`Salvados: ${this.obstaculossaltados}`);
                obstaculo.contado = true;
            }

            if (obstaculo && obstaculo.x < -50) {
                obstaculo.destroy();
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

export default JuegoDiscoteca;