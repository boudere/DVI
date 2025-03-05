// Es el botón que se muestra en el diálogo
class BackgroundPantallas extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, img_name) {
        super(scene, x, y, "");

        this.add_personaje(scene, img_name);
    }

    change_texture(img_name) {
        this.setTexture(img_name);
    }

    add_personaje(scene, img_name) {
        this.change_texture(img_name);
        this.setOrigin(0.5, 0.5);
        scene.add.existing(this);
    }
}

export default BackgroundPantallas;