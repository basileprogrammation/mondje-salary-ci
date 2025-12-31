import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs
} from 'firebase/firestore';

// ========== CACHE LOCAL ==========
let cachedDataPublic = null;
let cachedDataPrive = null;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
let cacheTimestamp = null;

// ========== VÉRIFIER SI LE CACHE EST VALIDE ==========
function isCacheValid() {
  if (!cacheTimestamp) return false;
  return Date.now() - cacheTimestamp < CACHE_DURATION;
}

// ========== SECTEUR PUBLIC ==========
export async function getSalairesPublic() {
  // Utiliser le cache si valide
  if (cachedDataPublic && isCacheValid()) {
    console.log('📦 Utilisation du cache pour salaires public');
    return cachedDataPublic;
  }

  console.log('🔄 Chargement des salaires public depuis Firestore...');

  try {
    const categories = {};
    const categoriesSnapshot = await getDocs(collection(db, 'salaires_public'));
    
    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      const categoryId = categoryDoc.id;
      
      // Récupérer les métiers
      const metiersSnapshot = await getDocs(
        collection(db, 'salaires_public', categoryId, 'metiers')
      );
      
      const corps_metiers = [];
      const metiersByDomaine = {};

      metiersSnapshot.docs.forEach(metierDoc => {
        const metier = metierDoc.data();
        if (!metiersByDomaine[metier.domaine]) {
          metiersByDomaine[metier.domaine] = [];
        }
        metiersByDomaine[metier.domaine].push(metier);
      });

      // Reconstruire la structure corps_metiers
      Object.entries(metiersByDomaine).forEach(([domaine, metiers]) => {
        corps_metiers.push({ domaine, metiers });
      });

      categories[categoryId] = {
        ...categoryData,
        corps_metiers
      };
    }

    cachedDataPublic = { categories };
    cacheTimestamp = Date.now();
    
    console.log('✅ Salaires public chargés:', Object.keys(categories).length, 'catégories');
    return cachedDataPublic;
  } catch (error) {
    console.error('❌ Erreur récupération salaires public:', error);
    throw error;
  }
}

// ========== SECTEUR PRIVÉ ==========
export async function getSalairesPrive() {
  // Utiliser le cache si valide
  if (cachedDataPrive && isCacheValid()) {
    console.log('📦 Utilisation du cache pour salaires privé');
    return cachedDataPrive;
  }

  console.log('🔄 Chargement des salaires privé depuis Firestore...');

  try {
    const secteurs = {};
    const secteursSnapshot = await getDocs(collection(db, 'salaires_prive'));
    
    for (const secteurDoc of secteursSnapshot.docs) {
      const secteurData = secteurDoc.data();
      const secteurId = secteurDoc.id;
      
      // Récupérer les sous-domaines
      const sousDomainesSnapshot = await getDocs(
        collection(db, 'salaires_prive', secteurId, 'sous_domaines')
      );
      
      const sous_domaines = {};
      
      for (const sousDomaineDoc of sousDomainesSnapshot.docs) {
        const sousDomaineData = sousDomaineDoc.data();
        const sousDomaineId = sousDomaineDoc.id;
        
        // Récupérer les métiers
        const metiersSnapshot = await getDocs(
          collection(db, 'salaires_prive', secteurId, 'sous_domaines', sousDomaineId, 'metiers')
        );
        
        const metiers = {};
        metiersSnapshot.docs.forEach(metierDoc => {
          metiers[metierDoc.id] = metierDoc.data();
        });
        
        sous_domaines[sousDomaineId] = {
          ...sousDomaineData,
          metiers
        };
      }
      
      secteurs[secteurId] = {
        ...secteurData,
        sous_domaines
      };
    }

    cachedDataPrive = { secteur_prive: { secteurs } };
    cacheTimestamp = Date.now();
    
    console.log('✅ Salaires privé chargés:', Object.keys(secteurs).length, 'secteurs');
    return cachedDataPrive;
  } catch (error) {
    console.error('❌ Erreur récupération salaires privé:', error);
    throw error;
  }
}

// ========== RECHERCHE MÉTIER PUBLIC ==========
export async function searchMetierPublic(searchTerm) {
  try {
    const allMetiers = [];
    const categoriesSnapshot = await getDocs(collection(db, 'salaires_public'));
    
    for (const categoryDoc of categoriesSnapshot.docs) {
      const metiersSnapshot = await getDocs(
        collection(db, 'salaires_public', categoryDoc.id, 'metiers')
      );
      
      metiersSnapshot.docs.forEach(metierDoc => {
        const metier = metierDoc.data();
        allMetiers.push({
          ...metier,
          categorieKey: categoryDoc.id,
          categorie: categoryDoc.data().nom
        });
      });
    }

    // Filtrer localement
    const search = searchTerm.toLowerCase();
    return allMetiers.filter(m => {
      if (m.nom.toLowerCase().includes(search)) return true;
      if (m.mots_cles && Array.isArray(m.mots_cles)) {
        return m.mots_cles.some(mc => mc.toLowerCase().includes(search));
      }
      return false;
    }).slice(0, 8);
  } catch (error) {
    console.error('❌ Erreur recherche métier:', error);
    throw error;
  }
}

// ========== CLEAR CACHE ==========
export function clearCache() {
  cachedDataPublic = null;
  cachedDataPrive = null;
  cacheTimestamp = null;
  console.log('🗑️ Cache vidé');
}

// ========== PRÉCHARGER LES DONNÉES ==========
export async function preloadData() {
  try {
    await Promise.all([
      getSalairesPublic(),
      getSalairesPrive()
    ]);
    console.log('✅ Données préchargées avec succès');
  } catch (error) {
    console.error('❌ Erreur préchargement:', error);
  }
}