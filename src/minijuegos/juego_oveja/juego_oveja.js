import { OVEJA_GAME, DATA_INFO, MINIJUEGO_MANAGER } from '/src/data/scene_data.js';

class OvejaGame extends Phaser.Scene {
    constructor() {
        super({ key: OVEJA_GAME });

        this.OVEJA_IMG = 'oveja';
        this.VALLA_IMG = 'valla';
        this.FONDO_IMG = 'fondo';
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO);
        this.ground = this.add.tileSprite(400, 300, 800, 20, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.FONDO_IMG));
        this.oveja = this.physics.add.sprite(100, 260, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.OVEJA_IMG )).setCollideWorldBounds(true);
        this.oveja.setGravityY(600);
        
        this.valla = this.physics.add.group();
        this.time.addEvent({ delay: 1500, callback: this.spawnOveja, callbackScope: this, loop: true });

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
        let valla = this.valla.create(850, 260, this.data_info_scene.get_img(MINIJUEGO_MANAGER, this.VALLA_IMG ));
        valla.setVelocityX(-200);
    }

    gameOver() {
        this.scene.restart();
    }
}

export default OvejaGame;
