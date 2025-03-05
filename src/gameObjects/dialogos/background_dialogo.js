// Es el fondo que se muestra en el diálogo
class BackgroundDialogo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, img_name) {
        super(scene, x, y, "");

        this.add_background(scene, img_name);
    }

    change_texture(img_name) {
        this.setTexture(img_name);
    }

    add_background(scene, img_name) {
        this.change_texture(img_name);
        this.setOrigin(0, 0);
        scene.add.existing(this);
    }
}

export default BackgroundDialogo;