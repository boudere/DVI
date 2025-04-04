import Phaser from 'phaser';

class GameObjectsSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, nombre_img, size_x, size_y, on_click) {
        super(scene, x, y, nombre_img);
        this._reset_varaibles();

        this.setScale(size_x, size_y);
        
        // si se peude hacer click
        if (on_click) {
            this._set_events();
            this.on_click = on_click;
        }
        
        this.on('destroy', this.before_destroy, this);
    }

    _reset_varaibles() {          
        this.isPause = false;
        this.mouse_over = false;
        
        this.game_object_data =  {}
    }

    _add_sprite(animation) {
        this.scene.add.existing(this);
        if (animation) {
            this.start_animation(animation);
        } else {
            this.finish_animation();
        }
    }

    async start_animation(animation) {
        this.scene.starting_animation();
        
        let animation_data = this.animation.get_animation_data(animation, this.game_object_data);
    
        // para cada grupo de animaciones, se ejecutan en paralelo
        for (const [key, value] of Object.entries(animation_data)) {
            const animation_tweens = value.map((val) => this.run_tween(val));
    
            await Promise.all(animation_tweens); // espera a que todos terminen antes de pasar al siguiente grupo
        }

        this.finish_animation();
    }
    

    run_tween(animation_data) {
        // Asignar valores iniciales si están definidos
        if ('alpha_start' in animation_data) this.alpha = animation_data.alpha_start;
        if ('scaleX_start' in animation_data) this.scale = animation_data.scaleX_start;
        if ('scaleY_start' in animation_data) this.scale = animation_data.scaleY_start;
        if ('pos_x_start' in animation_data) this.x = animation_data.pos_x_start;
        if ('pos_y_start' in animation_data) this.y = animation_data.pos_y_start;
    
        // Construir objeto con solo las props de destino que estén definidas
        const tweenProps = {};
        if ('alpha_end' in animation_data) tweenProps.alpha = animation_data.alpha_end;
        if ('scaleX_end' in animation_data) tweenProps.scale = animation_data.scaleX_end;
        if ('scaleY_end' in animation_data) tweenProps.scale = animation_data.scaleY_end;
        if ('pos_x_end' in animation_data) tweenProps.x = animation_data.pos_x_end;
        if ('pos_y_end' in animation_data) tweenProps.y = animation_data.pos_y_end;
    
        // Aplicar tween
        return new Promise((resolve) => {
            this.scene.tweens.add({
                targets: this,
                duration: animation_data.duration || 500,
                ease: animation_data.ease || 'Power2',
                ...tweenProps,
                onComplete: () => resolve()
            });
        });
    }

    finish_animation() {}

    // se ejecuta al salir de la escena
    exit() { 
        this.visible = false; 
        this._remove_events(); // eliminar eventos al salir de la escena
    }

    // se ejecuta al entrar en la escena
    enter() { this.visible = true; }

    // se ejecuta al actualizar la escena
    _update() { return !this.isPause; }

    // se ejecuta al pausar la escena
    pause() {
        if (this.mouse_over) {
            this._mouse_out();
        }
        this.disableInteractive();
    }

    // se ejecuta al despausar la escena
    unpause() {
        this.setInteractive();
    }

    _start_animation() {}

    _stop_animation() {}

    _set_events() {
        this.on('pointerenter', this._mouse_enter, this);
        this.on('pointerover', this._mouse_over, this);
        this.on('pointerout', this._mouse_out, this);
        this.on('pointerupoutside', this._mouse_out, this);
        this.on('pointerdown', this._mouse_down, this);
        this.on('pointerup', this._mouse_up, this);
        this.on('pointermove', this._mouse_move, this);
    }

    _remove_events() {
        this.off('pointerenter', this._mouse_enter, this);
        this.off('pointerover', this._mouse_over, this);
        this.off('pointerout', this._mouse_out, this);
        this.off('pointerupoutside', this._mouse_out, this);
        this.off('pointerdown', this._mouse_down, this);
        this.off('pointerup', this._mouse_up, this);
        this.off('pointermove', this._mouse_move, this);
    }

    _mouse_enter() { return !this.isPause; }

    _mouse_over() {
        if (this.isPause) return false;
        this.mouse_over = true;
        this.setTint(0xdce8ff);
        if (this.nombre) this.scene.cursor_entered(this.nombre);
        return true;
    }

    _mouse_out() {
        if (this.isPause) return false;
        this.mouse_over = false;
        this.clearTint();
        if (this.nombre) this.scene.cursor_exited(this.nombre);
        return true;
    }

    _mouse_down() { return !this.isPause; }

    _mouse_up() { return !this.isPause; }

    _mouse_move() { return !this.isPause; }

    before_destroy() {}
}

export default GameObjectsSprite;