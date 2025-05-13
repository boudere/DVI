import { DATA_INFO } from '/src/data/scene_data.js';

class AudioManager {
    constructor(scene) {
        this.scene = scene;

        // Música actual (solo puede haber una a la vez)
        this.currentMusic = null;

        // Volúmenes
        this.musicVolume = 0.10;
        this.sfxVolume = 0.3;

        // Lista de efectos de sonido activos
        this.activesfx = [];

        this.data_info_scene = scene.scene.get(DATA_INFO);
    }

    // Música de fondo
    play_music(key, config = {}) {
        const newKey = this.data_info_scene.get_musica(key);

        // Si ya está sonando la misma música, no hacer nada
        //if (this.currentMusic) console.log("play_music", key, newKey, this.currentMusic.key, this.currentMusic.isPlaying, config);
        if (this.currentMusic && this.currentMusic.key === newKey && this.currentMusic.isPlaying) {
            return;
        }

        // Detener la música anterior si existe
        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        // Configuración con valores por defecto
        const musicConfig = {
            loop: true,
            volume: this.musicVolume,
            ...config
        };

        // Crear y reproducir nueva música
        this.currentMusic = this.scene.sound.add(newKey, musicConfig);
        this.currentMusic.play();
    }


    stop_music() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    set_music_volume(volume) {
        this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
        if (this.currentMusic) {
            this.currentMusic.setVolume(this.musicVolume);
        }
    }

    // Efectos de sonido
    play_sfx(key, config = {}) {
        const sfxConfig = {
            volume: this.sfxVolume,
            ...config
        };

        const sfx = this.scene.sound.add(this.data_info_scene.get_musica(key), sfxConfig);
        sfx.play();

        this.activesfx.push(sfx);

        // Eliminar de la lista cuando termine
        sfx.once('complete', () => {
            this.activesfx = this.activesfx.filter(s => s !== sfx);
            sfx.destroy();
        });

        return sfx;
    }

    stop_all_sfx() {
        this.activesfx.forEach(sfx => {
            sfx.stop();
            sfx.destroy();
        });
        this.activesfx = [];
    }

    set_sfx_volume(volume) {
        this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
        this.activesfx.forEach(sfx => {
            sfx.setVolume(this.sfxVolume);
        });
    }
}

export default AudioManager;
