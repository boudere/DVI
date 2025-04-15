import { auth, provider, signInWithPopup } from '../firebase-config.js';

export async function loginGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("✅ Sesión iniciada:", user.displayName);
    return user;
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    return null;
  }
}
