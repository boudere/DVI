import { JUEGO_OVEJA, DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';

class JuegoOveja extends Phaser.Scene {
    constructor() {
        super({ key: JUEGO_OVEJA });

        this.OVEJA_IMG = 'oveja';
        this.VALLA_IMG = 'valla';
        this.FONDO_IMG = 'fondo';
        this.SCREEN_WIDTH = 1820; 
    }

    create() {
        this.cameras.main.setBackgroundColor('#ADD8E6'); 
        this.data_info_scene = this.scene.get(DATA_INFO);
        this.ground = this.add.tileSprite(910, 1358, 1820, 130, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.FONDO_IMG));
        
        this.oveja = this.physics.add.sprite(100, 1358, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OVEJA_IMG )).setCollideWorldBounds(true);
        this.oveja.setGravityY(600);
        
        this.valla = this.physics.add.group();
        this.time.addEvent({ delay: 1500, callback: this.spawnValla, callbackScope: this, loop: true });

        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.oveja.body.touching.down) {
                this.oveja.setVelocityY(-400);
            }
        });

        this.physics.add.collider(this.oveja, this.valla, this.gameOver, null, this);
    }

    update() {
        this.ground.tilePositionX += 5;
        this.valla.children.iterate((valla) => {
            if (valla && valla.x < -50) valla.destroy();
        });
    }

    spawnValla() {
        const randomY = 1000; 
        let valla = this.valla.create(this.SCREEN_WIDTH, randomY, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.VALLA_IMG));
        if (!valla) {
            console.error("Error: La valla no se generó correctamente.");
        }

        valla.setGravityY(0); 
        valla.setVelocityX(-200);

        valla.setCollideWorldBounds(false); 
    }

    gameOver() {
        this.scene.restart();
    }
}

export default JuegoOveja;
