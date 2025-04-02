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

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO);
        this.musica = this.sound.add(this.data_info_scene.get_musica(this.OVEJITA_MUSICA), {
            loop: true,
            volume: 1.0
        });
        this.musica.play();
        //this.animations();
        
        var suelo = this.physics.add.sprite(this.SCREEN_WIDTH/2, this.SCREEN_LENGTH, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.FONDO_IMG));
        suelo.setScale(this.SCREEN_WIDTH / 450, 700 / 338); 
        this.addObstacle(suelo);
        suelo.body.setSize(this.SCREEN_WIDTH, this.SCREEN_LENGTH); 

        var oveja = this.physics.add.sprite(175, 1000, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OVEJA_IMG));
        oveja.setScale(350/626, 350/569); 
        this.addObstacle(oveja);
        oveja.body.setSize(350/626, 350/569);

        this.vallas = []; //this.physics.add.group();
        this.time.addEvent({
            delay: 1000, // Cada 2 segundos
            callback: this.spawnValla,
            callbackScope: this,
            loop: true
        });

    }

    spawnValla() {
        this.valla = this.physics.add.sprite(this.SCREEN_WIDTH, 1000, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.VALLA_IMG));
        this.valla.setScale(350/626, 350/358); 
        this.valla.setVelocityX(-200); // Se mueve hacia la izquierda
        this.valla.setGravityY(-600);
        
        // this.valla.setImmovable(true); // No lo afecta la oveja
        this.vallas.push(this.valla);
    }

    update() {
        // this.vallas.children.iterate((valla) => {
        this.vallas.forEach((valla) => {
            // valla.setGravityY(0);
            // valla.setVelocityY(0);

            if (valla && valla.x < -50) {
                valla.destroy(); // Elimina la valla si sale de la pantalla
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
