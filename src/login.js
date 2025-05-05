import { auth, provider, signInWithPopup } from './firebase-config.js';

const loginGoogleButton = document.getElementById("login-google-btn");

loginGoogleButton.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // El usuario ha iniciado sesión
      console.log("Usuario logueado", result.user);
      // Redirige a la página principal o guarda la info del usuario aquí
    })
    .catch((error) => {
      // Manejo de errores
      console.error("Error de inicio de sesión: ", error);
    });
});
