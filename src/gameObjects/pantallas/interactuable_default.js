import AnimationData from "/src/data/animation_data.js";
import { EVENT_ANIMATION_INTRERACTUABLE_FINNISHED } from "/src/data/events_data.ts";
import { SCENE_MANAGER } from '/src/data/scene_data.ts';

// Es el botón que se muestra en el diálogo
class InteractuableDefault extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, size_x, size_y, delay, on_click, animation, nombre) {
        super(scene, x, y, type);

        this.name = type;
        this.nombre = nombre;

        // lo hacemos interactuable
        this.setInteractive();

        if (on_click) {
            this.set_events();
            this.on_click = on_click;
        }

        this.setScale(size_x, size_y);

        let info_data = {
            alpha: this.alpha,
            scale: this.scale,
            pos_x: this.x,
            pos_y: this.y
        };
        this.animation_data = new AnimationData(info_data);

        setTimeout(() => {
            this.scene.add.existing(this);
            if (animation) {
                this.start_animation(animation);
            } else {
                this.scene.events.emit(EVENT_ANIMATION_INTRERACTUABLE_FINNISHED, this);
            }
        }, delay);

        // cuadno se elimina el boton
        this.on('destroy', this.beforeDestroy, this);
    }

    start_animation(animation) {
        let animation_info = this.animation_data.get_animation_data(animation, this.info_data);

        this.alpha = animation_info.alpha_original;
        this.scale = animation_info.scale_original;
        this.x = animation_info.pos_x_original;
        this.y = animation_info.pos_y_original;

        this.scene.tweens.add({
            targets: this,
            duration: animation_info.duration,
            alpha: animation_info.alpha,
            scale: animation_info.scale,
            x: animation_info.pos_x,
            y: animation_info.pos_y,
            ease: 'Power2',
            onComplete: () => {
                this.scene.events.emit(EVENT_ANIMATION_INTRERACTUABLE_FINNISHED, this);
            }
        });
    }
    

    // añade los eventos al botón
    set_events() {
        // al pasar el ratón por encima
        this.on("pointerover", () => {
            this.mouse_entered();
        });

        // al sacar el raton del boton
        this.on("pointerout", () => {
            this.mouse_exited();
        });
    }

    mouse_entered() {
        if (!this.can_be_clicked)
            return;
        this.setTint(0xdce8ff);

        let scene_manager = this.scene.scene.get(SCENE_MANAGER);
        scene_manager.change_cursor("selected");
        scene_manager.show_background_cursor(true, this.nombre);
    }

    mouse_exited() {
        this.clearTint();

        let scene_manager = this.scene.scene.get(SCENE_MANAGER);
        scene_manager.change_cursor("normal");
        scene_manager.show_background_cursor(false);
}

    // Función que se ejecuta antes de destruirse
    beforeDestroy() {
        // this.texto.destroy();
    }
}

export default InteractuableDefault;