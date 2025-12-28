// src/utils/mondjeStats.js
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const statsRef = doc(db, "stats", "global");

async function initIfNeeded() {
  try {
    const snap = await getDoc(statsRef);
    if (!snap.exists()) {
      console.log("📊 Initialisation des stats globales...");
      await setDoc(statsRef, { visits: 0, estimations: 0, viralCards: 0 });
      console.log("✅ Stats initialisées avec succès");
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des stats:", error);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    throw error; // Propager l'erreur pour la gérer en amont
  }
}

export async function incrementStat(field) {
  try {
    console.log(`📈 Incrémentation de ${field}...`);
    await initIfNeeded();
    await updateDoc(statsRef, { [field]: increment(1) });
    console.log(`✅ ${field} incrémenté avec succès`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'incrémentation de ${field}:`, error);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    
    // Afficher un message plus clair selon l'erreur
    if (error.code === "permission-denied") {
      console.error("🚫 PERMISSION REFUSÉE - Vérifiez vos règles Firestore!");
      console.error("Les règles Firestore bloquent probablement l'écriture.");
    } else if (error.code === "unavailable") {
      console.error("📡 Firestore est indisponible - vérifiez votre connexion internet");
    }
    
    throw error;
  }
}

export async function getStats() {
  try {
    console.log("📊 Récupération des stats...");
    await initIfNeeded();
    const snap = await getDoc(statsRef);
    const data = snap.data() || { visits: 0, estimations: 0, viralCards: 0 };
    console.log("✅ Stats récupérées:", data);
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des stats:", error);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    
    // Retourner des valeurs par défaut en cas d'erreur
    return { visits: 0, estimations: 0, viralCards: 0 };
  }
}