// src/utils/mondjeStats.js
import { db } from "../config/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const statsRef = doc(db, "stats", "global");

// ========== GESTION DES VISITEURS UNIQUES ==========

const VISITOR_KEY = 'bahn_visitor_id';
const LAST_VISIT_KEY = 'bahn_last_visit';

/**
 * Génère ou récupère l'ID unique du visiteur
 */
function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_KEY);
  
  if (!visitorId) {
    // Générer un ID unique
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(VISITOR_KEY, visitorId);
    console.log('🆕 Nouveau visiteur créé:', visitorId);
  }
  
  return visitorId;
}

/**
 * Vérifie si c'est la première visite du jour
 * @returns {boolean} true si première visite aujourd'hui
 */
function isFirstVisitToday() {
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  const today = new Date().toDateString(); // "Wed Dec 31 2025"
  
  if (lastVisit !== today) {
    localStorage.setItem(LAST_VISIT_KEY, today);
    console.log('✅ Première visite du jour');
    return true;
  }
  
  console.log('♻️ Visite déjà comptée aujourd\'hui');
  return false;
}

// ========== FIRESTORE ==========

async function initIfNeeded() {
  try {
    const snap = await getDoc(statsRef);
    if (!snap.exists()) {
      console.log("📊 Initialisation des stats globales...");
      await setDoc(statsRef, { 
        visits: 0, 
        uniqueVisitors: 0, // ✅ NOUVEAU CHAMP
        estimations: 0, 
        viralCards: 0 
      });
      console.log("✅ Stats initialisées avec succès");
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des stats:", error);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    throw error;
  }
}

export async function incrementStat(field) {
  try {
    console.log(`📈 Incrémentation de ${field}...`);
    await initIfNeeded();
    
    // ✅ TRAITEMENT SPÉCIAL POUR LES VISITES
    if (field === 'visits') {
      // Générer ou récupérer l'ID visiteur (pour tracking futur)
      getVisitorId();
      
      // Vérifier si c'est la première visite du jour
      const isUniqueToday = isFirstVisitToday();
      
      if (isUniqueToday) {
        // ✅ Incrémenter visits ET uniqueVisitors
        await updateDoc(statsRef, { 
          visits: increment(1),
          uniqueVisitors: increment(1)
        });
        console.log(`✅ Visite UNIQUE comptée`);
      } else {
        // ✅ Incrémenter seulement visits
        await updateDoc(statsRef, { 
          visits: increment(1)
        });
        console.log(`✅ Visite comptée (non unique)`);
      }
    } else {
      // Pour les autres stats (estimations, viralCards)
      await updateDoc(statsRef, { [field]: increment(1) });
      console.log(`✅ ${field} incrémenté avec succès`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors de l'incrémentation de ${field}:`, error);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    
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
    const data = snap.data() || { 
      visits: 0, 
      uniqueVisitors: 0, // ✅ NOUVEAU CHAMP
      estimations: 0, 
      viralCards: 0 
    };
    console.log("✅ Stats récupérées:", data);
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des stats:", error);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    
    // Retourner des valeurs par défaut en cas d'erreur
    return { 
      visits: 0, 
      uniqueVisitors: 0, 
      estimations: 0, 
      viralCards: 0 
    };
  }
}