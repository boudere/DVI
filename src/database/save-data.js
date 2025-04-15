import { db } from '/src/firebase-config.js';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

/**
 * Guarda el progreso completo del usuario (estructura libre).
 * @param {string} userId - UID del usuario autenticado
 * @param {Object} progreso - Objeto con la información que se desea guardar
 */
export async function guardarProgresoCompleto(userId, progreso) {
  try {
    await setDoc(doc(db, "progresos", userId), {
      ...progreso,
      actualizado: serverTimestamp()
    });
    console.log("✅ Progreso guardado correctamente");
  } catch (err) {
    console.error("❌ Error al guardar:", err);
  }
}

/**
 * Carga el progreso guardado del usuario.
 * @param {string} userId - UID del usuario autenticado
 * @returns {Object|null} - Datos del progreso o null si no hay nada
 */
export async function cargarProgresoCompleto(userId) {
  try {
    const docRef = doc(db, "progresos", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("✅ Progreso cargado correctamente");
      return docSnap.data();
    } else {
      console.log("⚠️ No hay progreso guardado aún.");
      return null;
    }
  } catch (err) {
    console.error("❌ Error al cargar:", err);
    return null;
  }
}

/**
 * Guarda un ranking completo (top 10) de un minijuego específico en la estructura Minijuegos.{juegoId}
 * @param {string} juegoId - Nombre del juego (por ejemplo: "JuegoOveja")
 * @param {Array} ranking - Array de objetos { Nombre: string, Puntuacion: number }
 */
export async function guardarRecordRanking(juegoId, ranking) {
  const docRef = doc(db, "rankings", "record_minijuegos");

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Actualizar el campo correspondiente sin sobreescribir los demás juegos
      await updateDoc(docRef, {
        [juegoId]: ranking
      });
      console.log(`✅ Ranking actualizado para ${juegoId}`);
    } else {
      // Si no existe el documento, crearlo con el campo correcto
      await setDoc(docRef, {
        Minijuegos: {
          [juegoId]: ranking
        }
      });
      console.log(`📄 Documento creado con ranking para ${juegoId}`);
    }
  } catch (err) {
    console.error("❌ Error al guardar ranking:", err);
  }
}


/**
 * Carga el ranking (top 10) de un minijuego específico.
 * @returns {Array} - Array de { Nombre, Puntuacion }
 */
export async function cargarRanking() {
  try {
    const docRef = doc(db, "rankings", "record_minijuegos");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("✅ Ranking cargado correctamente");
      return docSnap.data() || null;
    } else {
      console.log("⚠️ No hay ranking guardado aún.");
      return null;
    }
  } catch (err) {
    console.error("❌ Error al cargar ranking:", err);
    return null;
  }
}

