class OvejaGame extends Phaser.Scene {
    constructor() {
        super({ key: 'OvejaGame' });
    }

    preload() {
        this.load.image('oveja', '../assets/img/minijuegos/mini_oveja/oveja.png');
        this.load.image('fondo', '../assets/img/minijuegos/mini_oveja/fondo.png');
        this.load.image('valla', '../assets/img/minijuegos/mini_oveja/valla.png');
    }

    create() {
        this.ground = this.add.tileSprite(400, 300, 800, 20, 'fondo');
        this.oveja = this.physics.add.sprite(100, 260, 'oveja').setCollideWorldBounds(true);
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
        let valla = this.valla.create(850, 260, 'valla');
        valla.setVelocityX(-200);
    }

    gameOver() {
        this.scene.restart();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 300,
    physics: { default: 'arcade', arcade: { gravity: { y: 600 }, debug: false } },
    scene: OvejaGame
};

const game = new Phaser.Game(config);