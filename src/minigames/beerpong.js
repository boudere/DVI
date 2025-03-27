import Phaser from "phaser";

class BeerPongScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BeerPongScene' });
    }

    preload() {
        // Aquí puedes cargar imágenes si las usas
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Físicas para la pelota
        this.ball = this.physics.add.circle(width / 2, height * 2 / 3, 10, 0xffa500);
        this.ball.setBounce(0.8);
        this.ball.setCollideWorldBounds(true);

        // Cup
        this.cup = this.add.rectangle(7 * width / 8, 6.5 * height / 8, 50, 80, 0xffff00);

        // Control del input
        this.input.on('pointerdown', (pointer) => {
            this.startX = pointer.x;
            this.startY = pointer.y;
        });

        this.input.on('pointerup', (pointer) => {
            const vx = (this.startX - pointer.x) / 3;
            const vy = (pointer.y - this.startY) / 3;
            this.ball.setVelocity(vx, -vy);
        });
    }

    update() {
        // Aquí puedes agregar lógica para detectar colisiones con la copa y condiciones de victoria
    }
}

// Configuración del juego Phaser
const config = {
    // Tamaño del canvas
        width: 1820,
        height: 1358,
        
        // Contenedor del canvas (donde queremos poner el juego en el html)
        parent: 'juego',
    
        // Físicas del juego
        physics: {
            default: 'arcade',
        },
    
        // Escenas del juego
        scene: [
            Bootloader,
            ScenePlay,
            Dialogo,
            Pantallas,
            SceneManager
        ],
    
        scale: {
            mode: Phaser.Scale.EXACT_FIT,  // Ajusta el canvas al contenedor sin distorsión
            autoCenter: Phaser.Scale.CENTER_BOTH  // Centra el juego en la pantalla
        }
};

// Inicializa Phaser
new Phaser.Game(config);
