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

        this.DISCOTECA_MUSICA = 'disco';

        this.personawidth = 1024;
        this.personaheight = 1024;
        this.obstaculowidth = 1024;
        this.obstaculoheight = 1024;

        this.started = false;
    }


    create() {
        this.obstaculossaltados = 0;

        this.SCREEN_WIDTH = this.sys.game.canvas.width;
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.contadorTexto = this.add.text(
            this.SCREEN_WIDTH - 50, 50,
            `Puntuación: ${this.obstaculossaltados}`,
            {
                fontSize: '40px',
                fill: '#ffffff',
                fontFamily: 'Impact'
            }
        ).setOrigin(1, 0).setDepth(1); 

        this.data_info_scene = this.scene.get(DATA_INFO);
        this.musica = this.sound.add(this.data_info_scene.get_musica(this.DISCOTECA_MUSICA), {
            loop: true,
            volume: 1.0
        });
        this.musica.play();

        let fondo = this.physics.add.sprite(
            0,
            0,
            this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.FONDO_IMG)
        ).setOrigin(0,0);
        fondo.setScale(this.SCREEN_WIDTH / fondo.width, this.SCREEN_HEIGHT/ fondo.height);
        fondo.setImmovable(true);
        fondo.body.setAllowGravity(false);

        this._crearPersona(); 

        this.cursors = this.input.keyboard.createCursorKeys();

        this.obstaculos = []; 
        this.scheduleNextObstaculo();

        this.game_created(); // Llamar a la función de escena creada
    }

    enter() {
        super.enter();
        this.persona.enter();

        this.started = true; // Iniciar el juego
    }

    _crearPersona() {
        let x = 175;
        let y = this.SCREEN_HEIGHT * 0.5;
        this.persona = new Persona(this, x, y, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PERSONA_IMG), 200 / this.personawidth, 200 / this.personaheight);
    }

    scheduleNextObstaculo() {
        const delay = Phaser.Math.Between(1500, 3000); // entre 2 y 5 segundos
        this.time.delayedCall(delay, () => {
            this.spawnObstaculo();
            this.scheduleNextObstaculo(); 
        });
    }
    

    spawnObstaculo() {
        
        let hueco = 300; // tamaño del hueco
        let ancho = 350; // ancho del tubo

        let x = this.SCREEN_WIDTH + 100;

        let minTuboY = 100;
        let maxTuboY = this.SCREEN_HEIGHT - hueco - 100;
        let yHueco = Phaser.Math.Between(minTuboY, maxTuboY);

        // Calcular altura dinámica
        let alturaSuperior = yHueco - hueco / 2;
        let alturaInferior = this.SCREEN_HEIGHT - (yHueco + hueco / 2);

        // Tubo superior
        this.tuboSuperior = this.physics.add.sprite(
            x,
            alturaSuperior / 2, // centro del tubo
            this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OBSTACULO_IMG)
        ).setScale(ancho / this.obstaculowidth, alturaSuperior / this.obstaculoheight);
        this.tuboSuperior.setFlipY(true);

        // Tubo inferior
        this.tuboInferior = this.physics.add.sprite(
            x,
            yHueco + hueco / 2 + alturaInferior / 2, // centro del tubo 
            this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OBSTACULO_IMG)
        ).setScale(ancho / this.obstaculowidth, alturaInferior / this.obstaculoheight);

        
        this.tuboInferior.setVelocityX(-500);
        this.tuboInferior.setGravityY(-600);

        this.tuboSuperior.setVelocityX(-500);
        this.tuboSuperior.setGravityY(-600);

        this.tuboInferior.body.setSize(
            this.tuboInferior.width * 0.8,
            this.tuboInferior.height * 0.8 
        );
        
        this.tuboInferior.body.setOffset(
            this.tuboInferior.width * 0.1, 
            this.tuboInferior.height * 0.1 
        );

        this.tuboSuperior.body.setSize(
            this.tuboSuperior.width * 0.8, 
            this.tuboSuperior.height * 0.8 
        );
        
        this.tuboSuperior.body.setOffset(
            this.tuboSuperior.width * 0.1, 
            this.tuboSuperior.height * 0.1 
        );

        // Añadir colisión entre persona y tubo inferior
        this.physics.add.collider(this.persona, this.tuboInferior,  () => {
            this.persona.setTint(0xff0000);

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
            ).setOrigin(0.5);
        });

        // Añadir colisión entre persona y tubo superior
        this.physics.add.collider(this.persona, this.tuboSuperior,  () => {
            this.persona.setTint(0xff0000);

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
            ).setOrigin(0.5);
        });


        this.obstaculos.push({superior: this.tuboSuperior, inferior: this.tuboInferior, contado: false});
    }


    _update() {
        if (!this.started) { return; } // Evitar que se ejecute antes de iniciar el juego
        if (this.persona.body.blocked.down) {
            this.persona.setVelocityY(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.persona.setVelocityY(-600); 
        }

        this.obstaculos.forEach((obstaculo) => {
            const tubo = obstaculo.inferior; 
        
            // Sumar puntos cuando la persona lo pasa
            if (tubo.x < this.persona.x && !obstaculo.contado) {
                this.obstaculossaltados++;
                this.contadorTexto.setText(`Puntuación: ${this.obstaculossaltados}`);
                obstaculo.contado = true;
            }
        
            // Destruir cuando sale de pantalla
            if (tubo.x < -tubo.width) {
                obstaculo.superior.destroy();
                obstaculo.inferior.destroy();
            }
        });
    }
}

export default JuegoDiscoteca;