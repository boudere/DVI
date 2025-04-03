import { JUEGO_OVEJA, DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';

class JuegoOveja extends Phaser.Scene {
    constructor() {
        super({ key: JUEGO_OVEJA });

        this.OVEJA_IMG = 'oveja';
        this.VALLA_IMG = 'valla';
        this.FONDO_IMG = 'fondo';
        this.SCREEN_WIDTH = 1820;
        this.SCREEN_LENGTH = 1358;
        this.OVEJITA_MUSICA = 'ovejitas';
    }

    preload() {
        this.canvas = this.sys.game.canvas;
        const { width, height } = this.canvas;
    }


    create() {
        this.vallasSaltadas = 0;

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
            this.SCREEN_LENGTH * 0.95,  // 🔽 Ahora está bien colocado
            this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.FONDO_IMG)
        );
        suelo.setScale(this.SCREEN_WIDTH / 450, (this.SCREEN_LENGTH * 0.3) / 338);
        suelo.setImmovable(true);
        suelo.body.setAllowGravity(false);

        // 📌 Crear la oveja justo sobre el suelo
        this.oveja = this.physics.add.sprite(
            175,
            this.SCREEN_LENGTH * 0.75 - 100,  // 🔼 Aparece encima del suelo
            this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OVEJA_IMG)
        );
        this.oveja.setScale(200 / 626, 200 / 569);
        this.oveja.setGravityY(800);
        this.oveja.setBounce(0);
        this.oveja.setCollideWorldBounds(true);

        this.oveja.body.setSize(
            this.oveja.width * 0.8,
            this.oveja.height * 0.8
        );
        this.oveja.body.setOffset(
            this.oveja.width * 0.1,
            this.oveja.height * 0.1
        );

        // 📌 Asegurar colisión entre la oveja y el suelo
        this.physics.add.collider(this.oveja, suelo);



        /*  let suelo = this.physics.add.sprite(this.SCREEN_WIDTH/2, this.SCREEN_LENGTH, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.FONDO_IMG));
          suelo.setScale(this.SCREEN_WIDTH / 450, 200 / 338); 
          this.addObstacle(suelo);
          suelo.body.setSize(this.SCREEN_WIDTH, this.SCREEN_LENGTH); 
          suelo.setImmovable(true);
          suelo.body.setAllowGravity(false);
  
          this.oveja = this.physics.add.sprite(175, 1000, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OVEJA_IMG));
          this.oveja.setCollideWorldBounds(true);
          this.oveja.setBounce(0.4);
          this.oveja.setGravityY(800); 
          
          this.oveja.setScale(200/626, 200/569); 
          this.addObstacle(this.oveja);
          this.oveja.body.setSize(350/626, 350/569);
          
          this.physics.add.collider(this.oveja, suelo); //para q haya colision con el suelo */

        this.cursors = this.input.keyboard.createCursorKeys();

        this.vallas = []; //this.physics.add.group();
        this.scheduleNextValla();
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
            console.log("💥 ¡Colisión!");
            this.oveja.setTint(0xff0000);

            // 🛑 Detener física y temporizadores
            this.physics.pause();            // Detiene la física
            this.time.removeAllEvents();    // Elimina todos los timers (como spawn de vallas)
            this.musica.stop();             // Para la música (opcional)

            // Opcional: mostrar "Perdiste" en pantalla
            const textoGameOver = this.add.text(
                this.SCREEN_WIDTH / 2,
                this.SCREEN_LENGTH / 2,
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


    update() {
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


/*
animations(){

    this.anims.create({
        key: 'ovejaSalto',
        frames: this.anims.generateFrameNumbers(this.OVEJA_IMG, { start: 4, end: 4 }),
        frameRate: 5,
        repeat: 0
    });

    this.anims.create({
        key: 'ovejaMuere',
        frames: this.anims.generateFrameNumbers(this.OVEJA_IMG, { start: 4, end: 4 }),
        frameRate: 5,
        repeat: 0
    });

    this.anims.create({
        key: 'spawnValla',
        frames: this.anims.generateFrameNumbers(this.VALLA_IMG, { start: 2, end: 2 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'moverValla',
        frames: this.anims.generateFrameNumbers(this.VALLA_IMG, { start: 1, end: 2 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'eliminarValla',
        frames: this.anims.generateFrameNumbers(this.VALLA_IMG, { start: 3, end: 3 }),
        frameRate: 5,
        repeat: -1
    });
}*/