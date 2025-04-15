// src/database/save-data.js

import { db } from './firebase-config.js';
import {
  doc,
  setDoc,
  getDoc,
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
