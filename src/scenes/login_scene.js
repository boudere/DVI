import { use } from 'matter';
import { loginGoogle } from '/src/database/auth.js';
import { cargarProgresoCompleto, guardarProgresoCompleto } from '/src/database/save-data.js';
import { SCENE_MANAGER, LOGIN_SCENE } from "/src/data/scene_data.js";

export class LoginScene extends Phaser.Scene {
  constructor() {
    super(LOGIN_SCENE);
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.text(centerX, centerY - 100, 'Inicia sesión con Google', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const loginButton = this.add.rectangle(centerX, centerY, 300, 60, 0x4285F4)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', async () => {
        const user = await loginGoogle();

        if (user) {
          const userId = user.uid;

          let progreso = await cargarProgresoCompleto(userId);

          // Si es nuevo, le ponemos el JSON por defecto
          if (!progreso) {
            progreso = {
              Saves: {
                Pantalla: "demo_salon_1",
                Dialogo: "tutorial1",
                Minijuegos: {
                  JuegoOveja: {
                    RecortdPuntuacion: -2
                  }
                }
              }
            };
            await guardarProgresoCompleto(userId, progreso);
          }

          // Pasa a la escena principal (ajústala como desees)
          this.scene.get(SCENE_MANAGER).agregar_scenes({
            userId: userId,
            displayName: user.displayName,
            progreso: progreso
          });

        } else {
          this.mostrarError("Inicio de sesión cancelado o fallido");
        }
      });

    this.add.text(centerX, centerY, 'Google Login', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  mostrarError(msg) {
    const centerX = this.cameras.main.centerX;
    this.add.text(centerX, 500, msg, {
      fontSize: '20px',
      color: '#ff5555'
    }).setOrigin(0.5);
  }
}
