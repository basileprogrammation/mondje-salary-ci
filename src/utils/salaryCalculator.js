/**
 * MONDJE Salary Calculator - Version Robuste (2025)
 * Compatible JSON:
 * - grillesPubliques.grilles_salariales[categorie].grades[grade]
 * - salairesPrives.secteur_prive.secteurs[secteurActivite].sous_domaines[sousDomaine].metiers[metier].niveaux[niveau]
 */

import grillesPubliques from '../data/grilles-salaires.json';
import salairesPrives from '../data/salaires-secteur-prive.json';
import corpsMetiers from '../data/corps-metiers.json';

/**
 * Calcule le salaire pour le SECTEUR PUBLIC
 * @param {string} categorie - 'categorie_A', 'categorie_B', ...
 * @param {string} grade - 'A1', 'A2', ...
 * @param {string} metier - optionnel
 */
export function calculerSalairePublic(categorie, grade, metier = '') {
  const categorieData = grillesPubliques?.grilles_salariales?.[categorie];
  const grille = categorieData?.grades?.[grade];

  if (!grille) {
    console.warn(`Grille non trouvée pour ${categorie} - ${grade}`);
    return {
      min: 200000,
      max: 500000,
      avg: 350000,
      min_avec_primes: 240000,
      max_avec_primes: 650000,
      avg_avec_primes: 445000,

      // ✅ champs standards
      categorie: categorie || 'categorie_B',
      grade: grade || 'B1',
      sector: 'public',

      grille: null,
      categorieData: categorieData || null,
      metier,
      secteur: 'public',
      source: 'fallback'
    };
  }

  const minSalaire = Number(grille.salaire_base_min ?? 0);
  const maxSalaire = Number(grille.salaire_base_max ?? 0);
  const avgSalaire = Math.round((minSalaire + maxSalaire) / 2);

  const minAvecPrimes = Number(grille.salaire_avec_primes_min ?? Math.round(minSalaire * 1.2));
  const maxAvecPrimes = Number(grille.salaire_avec_primes_max ?? Math.round(maxSalaire * 1.3));

  return {
    min: minSalaire,
    max: maxSalaire,
    avg: avgSalaire,
    min_avec_primes: minAvecPrimes,
    max_avec_primes: maxAvecPrimes,
    avg_avec_primes: Math.round((minAvecPrimes + maxAvecPrimes) / 2),

    // ✅ champs standards
    categorie,
    grade,
    sector: 'public',

    grille,
    categorieData,
    metier,
    secteur: 'public',
    source: 'grilles_officielles'
  };
}

/**
 * Calcule le salaire pour le SECTEUR PRIVÉ (STRUCTURE À 4 NIVEAUX)
 * @param {string} secteurActivite - 'accueil_services', 'achats_supply_chain', ...
 * @param {string} sousDomaine - 'fonctions_de_services', 'buying_procurement', ...
 * @param {string} metier - 'operateur_de_saisie', 'acheteur_btp', ...
 * @param {string} niveau - 'junior'|'confirme'|'senior'
 */
export function calculerSalairePrive(secteurActivite, sousDomaine, metier, niveau) {
  console.log('🔍 calculerSalairePrive appelée avec:', {
    secteurActivite,
    sousDomaine,
    metier,
    niveau
  });

  const secteur = salairesPrives?.secteur_prive?.secteurs?.[secteurActivite];
  
  if (!secteur) {
    console.warn(`❌ Secteur non trouvé: ${secteurActivite}`);
    return getFallbackSalairePrive(secteurActivite, sousDomaine, metier, niveau);
  }

  // ✅ Navigation à 4 niveaux
  const sousDomainData = secteur?.sous_domaines?.[sousDomaine];
  
  if (!sousDomainData) {
    console.warn(`❌ Sous-domaine non trouvé: ${sousDomaine} dans ${secteurActivite}`);
    console.log('🔑 Sous-domaines disponibles:', Object.keys(secteur?.sous_domaines || {}));
    return getFallbackSalairePrive(secteurActivite, sousDomaine, metier, niveau, secteur);
  }

  const metierData = sousDomainData?.metiers?.[metier];
  
  if (!metierData) {
    console.warn(`❌ Métier non trouvé: ${metier} dans ${sousDomaine}`);
    console.log('🔑 Métiers disponibles:', Object.keys(sousDomainData?.metiers || {}));
    return getFallbackSalairePrive(secteurActivite, sousDomaine, metier, niveau, secteur, sousDomainData);
  }

  const niveauData = metierData?.niveaux?.[niveau];

  if (!niveauData) {
    console.warn(`❌ Niveau non trouvé: ${niveau} pour le métier ${metier}`);
    console.log('🔑 Niveaux disponibles:', Object.keys(metierData?.niveaux || {}));
    return getFallbackSalairePrive(secteurActivite, sousDomaine, metier, niveau, secteur, sousDomainData, metierData);
  }

  console.log('✅ Données trouvées:', niveauData);

  return {
    min: Number(niveauData.salaire_bas ?? 0),
    max: Number(niveauData.salaire_haut ?? 0),
    avg: Number(niveauData.salaire_moyen ?? Math.round((niveauData.salaire_bas + niveauData.salaire_haut) / 2)),

    // ✅ champs standards (IMPORTANT)
    categorie: 'categorie_B',     // fallback pour usages "concours"
    grade: niveau,                // on met le niveau ici pour affichage
    sector: 'private',

    secteur_activite: secteurActivite,
    secteur_nom: secteur?.nom || 'Secteur privé',
    sous_domaine: sousDomaine,
    sous_domaine_nom: sousDomainData?.nom || 'Sous-domaine',
    metier,
    metier_titre: metierData?.titre || 'Métier',
    niveau,
    niveau_titre: getNiveauTitre(niveau),
    experience: niveauData.experience,
    note: niveauData.note || null,
    secteur: 'private',
    source: 'grilles_marche'
  };
}

/**
 * Fallback en cas de données manquantes
 */
function getFallbackSalairePrive(secteurActivite, sousDomaine, metier, niveau, secteur = null, sousDomainData = null, metierData = null) {
  console.warn('⚠️ Utilisation des données fallback');
  
  return {
    min: 300000,
    max: 700000,
    avg: 500000,

    // ✅ champs standards (pour éviter les undefined dans Results)
    categorie: 'categorie_B', // fallback utile
    grade: niveau || 'confirme',
    sector: 'private',

    secteur_activite: secteurActivite,
    secteur_nom: secteur?.nom || 'Secteur privé',
    sous_domaine: sousDomaine,
    sous_domaine_nom: sousDomainData?.nom || 'Sous-domaine',
    metier,
    metier_titre: metierData?.titre || 'Métier',
    niveau,
    niveau_titre: getNiveauTitre(niveau),
    experience: null,
    note: null,
    secteur: 'private',
    source: 'fallback'
  };
}

/**
 * Point d'entrée unique
 * - public: {sector:'public', categorie, grade, metier}
 * - private:{sector:'private', secteur_activite, sous_domaine, metier, niveau}
 * - ancien: {job, experience, sector}
 */
export function calculerSalaire(params) {
  if (!params || typeof params !== 'object') {
    console.error('❌ Params manquants:', params);
    return { 
      min: 200000, 
      max: 600000, 
      avg: 400000, 
      source: 'error_params_missing', 
      categorie: 'categorie_B', 
      grade: 'B1', 
      sector: 'public' 
    };
  }

  // ✅ SECTEUR PUBLIC
  if (params.sector === 'public' && params.categorie && params.grade) {
    console.log('✅ Calcul secteur public');
    return calculerSalairePublic(params.categorie, params.grade, params.metier || '');
  }

  // ✅ SECTEUR PRIVÉ (4 NIVEAUX)
  if (params.sector === 'private' && params.secteur_activite && params.sous_domaine && params.metier && params.niveau) {
    console.log('✅ Calcul secteur privé (4 niveaux)');
    return calculerSalairePrive(params.secteur_activite, params.sous_domaine, params.metier, params.niveau);
  }

  // ⚠️ ANCIEN FORMAT (compatibilité)
  if (params.job && params.experience && params.sector) {
    console.warn('⚠️ Utilisation de l\'ancien format');
    return calculerSalaireAncienFormat(params.job, params.experience, params.sector);
  }

  console.error('❌ Format invalide:', params);
  return { 
    min: 200000, 
    max: 600000, 
    avg: 400000, 
    source: 'error_invalid_format', 
    categorie: 'categorie_B', 
    grade: 'B1', 
    sector: 'public' 
  };
}

/**
 * Ancien format
 */
function calculerSalaireAncienFormat(metier, experience, secteur) {
  const categorie = trouverCategorie(metier);
  const grade = determinerGrade(experience, categorie);

  const result = calculerSalairePublic(categorie, grade, metier);

  if (secteur === 'private') {
    const facteur = 1.3;
    return {
      ...result,
      min: Math.round(result.min * facteur),
      max: Math.round(result.max * facteur),
      avg: Math.round(result.avg * facteur),
      sector: 'private',
      secteur: 'private',
      categorie: 'categorie_B',
      grade: 'confirme',
      source: 'estimation'
    };
  }

  return result;
}

/**
 * Trouve catégorie public par métier
 */
function trouverCategorie(metier) {
  const metierLower = String(metier || '').toLowerCase();

  for (const [catKey, categorie] of Object.entries(corpsMetiers?.categories || {})) {
    for (const domaine of categorie?.corps_metiers || []) {
      for (const m of domaine?.metiers || []) {
        if (m.toLowerCase().includes(metierLower) || metierLower.includes(m.toLowerCase())) {
          return catKey;
        }
      }
    }
  }

  const keywordsCategories = {
    categorie_A: ['ingénieur', 'professeur', 'médecin', 'administrateur', 'inspecteur'],
    categorie_B: ['technicien', 'infirmier', 'contrôleur', 'secrétaire', 'instituteur'],
    categorie_C: ['agent', 'aide', 'surveillant', 'gardien'],
    categorie_D: ['garde', 'chauffeur', 'planton', 'ouvrier']
  };

  for (const [cat, keywords] of Object.entries(keywordsCategories)) {
    for (const keyword of keywords) {
      if (metierLower.includes(keyword)) return cat;
    }
  }

  return 'categorie_B';
}

/**
 * Grade selon expérience (ancien format)
 * experience: '0-2','3-5','6-10','10+'
 */
function determinerGrade(experience, categorie) {
  const mappingGrades = {
    '0-2': { categorie_A: 'A3', categorie_B: 'B1', categorie_C: 'C1', categorie_D: 'D1' },
    '3-5': { categorie_A: 'A3', categorie_B: 'B2', categorie_C: 'C2', categorie_D: 'D2' },
    '6-10': { categorie_A: 'A2', categorie_B: 'B3', categorie_C: 'C3', categorie_D: 'D3' },
    '10+': { categorie_A: 'A1', categorie_B: 'B3', categorie_C: 'C3', categorie_D: 'D3' }
  };
  return mappingGrades?.[experience]?.[categorie] || 'B1';
}

/**
 * Titre du niveau
 */
function getNiveauTitre(niveau) {
  const titres = { junior: 'Junior', confirme: 'Confirmé', senior: 'Senior / Expert' };
  return titres[niveau] || niveau;
}

/**
 * Avantages secteur
 */
export function getAvantagesSecteur(secteur) {
  if (secteur === 'public') {
    return [
      "Stabilité de l'emploi",
      "Retraite garantie",
      "Couverture santé complète",
      "Congés réglementaires",
      "Évolution par ancienneté"
    ];
  }
  return [
    "Salaires plus élevés",
    "Primes de performance",
    "Évolution rapide",
    "Formation continue",
    "Environnement dynamique"
  ];
}

const salaryCalculator = {
  calculerSalaire,
  calculerSalairePublic,
  calculerSalairePrive,
  getAvantagesSecteur
};

export default salaryCalculator;