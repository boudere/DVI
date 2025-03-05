class Cursor extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, assets_data) {
        super(scene, x, y, texture);

        this.assets_data = assets_data;

        this.setOrigin(0.5, 0.5);

        this.alpha = 0;

        this.scene.add.existing(this);

        // Crear el objeto de texto
        this.text = this.scene.add.text(this.x, this.y, '', {
            fontSize: '24px',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        this.text.setVisible(false);

        // Agregar listener para el evento pointermove
        this.scene.input.on('pointermove', this.followPointer, this);
    }

    followPointer(pointer) {
        this.x = pointer.worldX + this.width / 4;
        this.y = pointer.worldY + 100;

        // Actualizar la posición del texto
        this.text.setPosition(this.x, this.y);
    }

    change_cursor(cursor) {
        switch (cursor) {
            case "normal":
                this.change_img_cursor(this.assets_data.get_cursor());
                break;
            case "selected":
                this.change_img_cursor(this.assets_data.get_cursor_selected());
                break;
            case "left":
                this.change_img_cursor(this.assets_data.get_cursor_left());
                break;
            case "right":
                this.change_img_cursor(this.assets_data.get_cursor_right());
                break;
            default:
                console.error("Tipo de cursor no encontrado");
        }
    }

    change_img_cursor(textureKey) {
        const texture = this.scene.textures.get(textureKey);
        if (texture) {
            const url = texture.getSourceImage().src;
            this.scene.input.setDefaultCursor(`url(${url}), pointer`);
        } else {
            console.error(`Textura ${textureKey} no encontrada`);
        }
    }

    show_background_cursor(active, name) {
        if (active) {
            this.alpha = 1;
            this.showText(name);
        } else {
            this.alpha = 0;
            this.hideText();
        }
    }

    // Método para mostrar el texto
    showText(text) {
        this.text.setText(text);
        this.text.setVisible(true);
    }

    // Método para ocultar el texto
    hideText() {
        this.text.setVisible(false);
    }
}

export default Cursor;