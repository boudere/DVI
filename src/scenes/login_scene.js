import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { loginGoogle } from '/src/database/auth.js';
import { cargarProgresoCompleto, guardarProgresoCompleto } from '/src/database/save-data.js';
import { SCENE_MANAGER, LOGIN_SCENE } from "/src/data/scene_data.js";

class LoginScene extends Phaser.Scene {
  constructor() {
    super(LOGIN_SCENE);
  }

  async create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.texto1 = this.add.text(centerX, centerY - 100, 'Inicia sesión con Google', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.loginButton = this.add.rectangle(centerX, centerY, 300, 60, 0x4285F4)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', async () => this.iniciarSesion());

    this.texto2 = this.add.text(centerX, centerY, 'Google Login', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // ✅ Comprobar si ya hay sesión activa
    getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log("🔐 Sesión ya iniciada como:", user.displayName);
        await this.cargarProgresoYEntrar(user);
      }
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  async iniciarSesion() {
    const user = await loginGoogle();
    if (user) {
      await this.cargarProgresoYEntrar(user);
    } else {
      this.mostrarError("Inicio de sesión cancelado o fallido");
    }
  }

  async cargarProgresoYEntrar(user) {
    const userId = user.uid;
    let progreso = await cargarProgresoCompleto(userId);

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

    this.scene.get(SCENE_MANAGER).agregar_scenes({
      userId: userId,
      displayName: user.displayName,
      progreso: progreso
    });
  }

  mostrarError(msg) {
    const centerX = this.cameras.main.centerX;
    this.texto3 = this.add.text(centerX, 500, msg, {
      fontSize: '20px',
      color: '#ff5555'
    }).setOrigin(0.5);
  }

  shutdown() {
    this.texto1.destroy();
    this.texto2.destroy();
    if (this.texto3) {
      this.texto3.destroy();
    }
    this.loginButton.removeAllListeners('pointerdown');
    this.loginButton.destroy();

    console.log("✅ LoginScene destroyed");
  }
}

export default LoginScene;


// import { loginGoogle } from '/src/database/auth.js';
// import { cargarProgresoCompleto, guardarProgresoCompleto } from '/src/database/save-data.js';
// import { SCENE_MANAGER, LOGIN_SCENE } from "/src/data/scene_data.js";

// class LoginScene extends Phaser.Scene {
//   constructor() {
//     super(LOGIN_SCENE);
//   }

//   create() {
//     const centerX = this.cameras.main.centerX;
//     const centerY = this.cameras.main.centerY;

//     this.texto1 = this.add.text(centerX, centerY - 100, 'Inicia sesión con Google', {
//       fontSize: '32px',
//       color: '#ffffff'
//     }).setOrigin(0.5);

//     this.loginButton = this.add.rectangle(centerX, centerY, 300, 60, 0x4285F4)
//       .setInteractive({ useHandCursor: true })
//       .on('pointerdown', async () => {
//         const user = await loginGoogle(); // Esto solo se lanza si el usuario hace click ✅

//         if (user) {
//           const userId = user.uid;

//           let progreso = await cargarProgresoCompleto(userId);

//           if (!progreso) {
//             progreso = {
//               Saves: {
//                 Pantalla: "demo_salon_1",
//                 Dialogo: "tutorial1",
//                 Minijuegos: {
//                   JuegoOveja: {
//                     RecortdPuntuacion: -2
//                   }
//                 }
//               }
//             };
//             await guardarProgresoCompleto(userId, progreso);
//           }

//           // Cambiar a escena principal o manejar datos
//           this.scene.get(SCENE_MANAGER).agregar_scenes({
//             userId: userId,
//             displayName: user.displayName,
//             progreso: progreso
//           });

//         } else {
//           this.mostrarError("Inicio de sesión cancelado o fallido");
//         }
//       });

//     this.texto2 = this.add.text(centerX, centerY, 'Google Login', {
//       fontSize: '24px',
//       color: '#ffffff'
//     }).setOrigin(0.5);
//   }

//   mostrarError(msg) {
//     const centerX = this.cameras.main.centerX;
//     this.texto3 = this.add.text(centerX, 500, msg, {
//       fontSize: '20px',
//       color: '#ff5555'
//     }).setOrigin(0.5);
//   }

//   shutdown() {
//     this.texto1.destroy();
//     this.texto2.destroy();
//     if (this.texto3) {
//       this.texto3.destroy();
//     }
//     this.loginButton.removeAllListeners('pointerdown');
//     this.loginButton.destroy();

//     console.log("LoginScene destroyed");
//   }
// }

// export default LoginScene;
