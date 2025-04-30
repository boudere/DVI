import GameObjectsSprite from '/src/game_objects_sprite';
import DialogoMainText from "/src/dialogos/game_objects/text/dialogo_main_text.js";

// agrega el nombre de lo q se está seleccionando
class CursorBackground extends GameObjectsSprite {
    constructor(scene, x, y, nombre_img) {
        super(scene, x, y, nombre_img, 1, 1);

        this.scene.add.existing(this);
        this.create();
    }

    create() {
        this.name_text = new DialogoMainText(this.scene, this.x, this.y, this, this.width, " ", 0, false, {
            fontSize: "24px",
            align: "center"
        }).setOrigin(0.5, 0.5);

        
        this.exit();
    }

    exit() { 
        super.exit(); 
        
        this.visible = false;
        this.name_text.visible = false;
        this.clearTint();
    }

    enter(text, on_click) { 
        super.enter(); 

        this.visible = true;
        this.name_text.visible = true;
        this.name_text.setText(text);

        if (!on_click) {
            this.setTint(0x888888);
        }
    }

    _update() { super.update(); }

    pause() { super.pause(); }

    unpause() { super.unpause(); }

    finish_animation() {}

    move(x, y) {
        y += this.height * 2;
        this.x = x;
        this.y = y;
        this.name_text.x = x;
        this.name_text.y = y;
    }
}

export default CursorBackground;