/**
 * Bahn Salary Calculator - Version FINALE SANS ERREURS (2025)
 * ✅ CORRECTIONS MAJEURES :
 * 1. UN SEUL coefficient de primes par métier (évite MIN > MAX)
 * 2. Calcul basé uniquement sur les valeurs de DÉBUT
 * 3. Logique simplifiée et robuste
 */

import grillesPubliques from '../data/grilles-salaires.json';
import salairesPrives from '../data/salaires-secteur-prive.json';
import corpsMetiers from '../data/corps-metiers.json';

/**
 * Calcule le salaire pour le SECTEUR PUBLIC
 */
export function calculerSalairePublic(categorie, grade, metier = '', typeSalaire = 'base') {
  const categorieData = grillesPubliques?.grilles_salariales_par_categorie?.[categorie];
  
  if (!categorieData) {
    console.warn(`⚠️ Catégorie non trouvée: ${categorie}`);
    return getFallbackPublic(categorie, grade, metier);
  }

  // Chercher d'abord dans corps_metiers_detailles
  if (metier) {
    const metierSpecifique = chercherMetierSpecifique(categorieData, metier, typeSalaire, grade);
    if (metierSpecifique) {
      console.log('✅ Métier spécifique trouvé:', metier);
      return metierSpecifique;
    }
  }

  // Sinon, utiliser les grilles par grade
  const grille = categorieData?.grilles_par_grade?.[grade];

  if (!grille) {
    console.warn(`⚠️ Grille non trouvée pour ${categorie} - ${grade}`);
    return getFallbackPublic(categorie, grade, metier);
  }

  let minSalaire, maxSalaire;
  
  if (typeSalaire === 'avec_primes') {
    minSalaire = Number(grille.salaire_avec_primes_min ?? grille.salaire_base_min ?? 0);
    maxSalaire = Number(grille.salaire_avec_primes_max ?? grille.salaire_base_max ?? 0);
  } else {
    minSalaire = Number(grille.salaire_base_min ?? 0);
    maxSalaire = Number(grille.salaire_base_max ?? 0);
  }

  const avgSalaire = Math.round((minSalaire + maxSalaire) / 2);

  return {
    min: minSalaire,
    max: maxSalaire,
    avg: avgSalaire,
    categorie,
    grade,
    sector: 'public',
    metier,
    secteur: 'public',
    typeSalaire,
    source: 'grilles_officielles'
  };
}

/**
 * ✅ CORRIGÉ : Calcule UN SEUL coefficient de primes
 * Basé uniquement sur les valeurs de DÉBUT pour éviter MIN > MAX
 */
function calculerCoefficientPrimes(metier) {
  const salaireBaseDebut = Number(metier.salaire_brut_debut || 0);
  const salaireAvecPrimesDebut = Number(metier.salaire_avec_primes_debut || 0);
  
  // Éviter la division par zéro
  if (salaireBaseDebut === 0 || salaireAvecPrimesDebut === 0) {
    return null;
  }
  
  // ✅ UN SEUL coefficient basé sur les valeurs de début
  const coefficient = salaireAvecPrimesDebut / salaireBaseDebut;
  
  console.log('📊 Coefficient calculé:', {
    metier: metier.nom,
    coefficient: coefficient.toFixed(2),
    note: 'Coefficient unique (début) pour éviter MIN > MAX'
  });
  
  // ✅ Retourner le même coefficient pour min et max
  return coefficient;
}

/**
 * ✅ CORRIGÉ : Cherche un métier avec logique simplifiée
 */
function chercherMetierSpecifique(categorieData, metierNom, typeSalaire, grade) {
  console.log('═══════════════════════════════════');
  console.log('🔍 chercherMetierSpecifique');
  console.log('  metier:', metierNom, '| grade:', grade, '| type:', typeSalaire);
  
  const metierLower = metierNom.toLowerCase();
  const corpsMetiersDetailles = categorieData?.corps_metiers_detailles || {};

  // ✅ CAS SPÉCIAL : MAGISTRATS
  if (metierLower.includes('magistrat')) {
    console.log('🎯 MAGISTRAT DÉTECTÉ');
    
    const magistratParGrade = {
      'A7': 'magistrat hors hiérarchie',
      'A6': 'magistrat (1er grade - confirmé)',
      'A5': 'magistrat (2ème grade - débutant)'
    };
    
    const magistratCible = magistratParGrade[grade];
    
    if (magistratCible) {
      for (const [domaineKey, domaineData] of Object.entries(corpsMetiersDetailles)) {
        const metiers = domaineData?.metiers || [];
        const metierTrouve = metiers.find(m => 
          m.nom?.toLowerCase() === magistratCible
        );
        
        if (metierTrouve) {
          console.log('✅ Magistrat trouvé:', metierTrouve.nom);
          return construireResultatMetier(metierTrouve, categorieData, domaineData, typeSalaire);
        }
      }
    }
  }

  // ✅ Recherche normale
  for (const [domaineKey, domaineData] of Object.entries(corpsMetiersDetailles)) {
    const metiers = domaineData?.metiers || [];
    
    const metierTrouve = metiers.find(m => {
      const nomMetier = m.nom?.toLowerCase() || '';
      return nomMetier.includes(metierLower) || metierLower.includes(nomMetier);
    });

    if (metierTrouve) {
      console.log('✅ Métier trouvé:', metierTrouve.nom, '| Grade entrée:', metierTrouve.grade_entree);
      
      // CAS 1 : Grade demandé = Grade d'entrée
      if (grade === metierTrouve.grade_entree) {
        console.log('→ Données directes du JSON');
        return construireResultatMetier(metierTrouve, categorieData, domaineData, typeSalaire);
      }
      
      // CAS 2 : Grade différent → Calcul avec coefficient
      console.log('→ Calcul dynamique pour grade', grade);
      
      const grille = categorieData?.grilles_par_grade?.[grade];
      
      if (!grille) {
        console.warn('⚠️ Grille non trouvée pour', grade);
        return null;
      }
      
      // ✅ Calculer le coefficient (UN SEUL)
      const coefficient = calculerCoefficientPrimes(metierTrouve);
      
      if (!coefficient) {
        console.warn('⚠️ Impossible de calculer le coefficient');
        return null;
      }
      
      // ✅ Appliquer le coefficient aux valeurs de la grille
      const salaireBaseMin = Number(grille.salaire_base_min || 0);
      const salaireBaseMax = Number(grille.salaire_base_max || 0);
      
      // ✅ MÊME coefficient pour min et max (évite MIN > MAX)
      const salaireAvecPrimesMin = Math.round(salaireBaseMin * coefficient);
      const salaireAvecPrimesMax = Math.round(salaireBaseMax * coefficient);
      
      let minSalaire, maxSalaire;
      
      if (typeSalaire === 'avec_primes') {
        minSalaire = salaireAvecPrimesMin;
        maxSalaire = salaireAvecPrimesMax;
      } else {
        minSalaire = salaireBaseMin;
        maxSalaire = salaireBaseMax;
      }
      
      const avgSalaire = Math.round((minSalaire + maxSalaire) / 2);
      
      console.log('✅ Résultat calculé:', {
        min: minSalaire,
        max: maxSalaire,
        avg: avgSalaire,
        coefficient: coefficient.toFixed(2)
      });
      
      return {
        min: minSalaire,
        max: maxSalaire,
        avg: avgSalaire,
        categorie: categorieData?.nom || 'Catégorie',
        grade: grade,
        sector: 'public',
        metier: metierTrouve.nom,
        domaine: domaineData?.domaine || 'Domaine',
        note: metierTrouve.note || null,
        progression_carriere: metierTrouve.progression_carriere || null,
        secteur: 'public',
        typeSalaire,
        source: 'calcul_dynamique',
        coefficient_applique: coefficient.toFixed(2)
      };
    }
  }

  console.log('❌ Métier non trouvé dans corps_metiers_detailles');
  console.log('═══════════════════════════════════');
  return null;
}

/**
 * ✅ Construit le résultat pour un métier trouvé
 */
function construireResultatMetier(metierTrouve, categorieData, domaineData, typeSalaire) {
  let minSalaire, maxSalaire;
  
  if (typeSalaire === 'avec_primes') {
    minSalaire = Number(metierTrouve.salaire_avec_primes_debut ?? metierTrouve.salaire_brut_debut ?? 0);
    maxSalaire = Number(metierTrouve.salaire_avec_primes_max ?? metierTrouve.salaire_brut_max ?? 0);
  } else {
    minSalaire = Number(metierTrouve.salaire_brut_debut ?? 0);
    maxSalaire = Number(metierTrouve.salaire_brut_max ?? 0);
  }

  const avgSalaire = Math.round((minSalaire + maxSalaire) / 2);

  return {
    min: minSalaire,
    max: maxSalaire,
    avg: avgSalaire,
    categorie: categorieData?.nom || 'Catégorie',
    grade: metierTrouve.grade_entree || 'Grade',
    sector: 'public',
    metier: metierTrouve.nom,
    domaine: domaineData?.domaine || 'Domaine',
    note: metierTrouve.note || null,
    progression_carriere: metierTrouve.progression_carriere || null,
    secteur: 'public',
    typeSalaire,
    source: 'metier_specifique'
  };
}

/**
 * Fallback
 */
function getFallbackPublic(categorie, grade, metier) {
  console.warn('⚠️ Fallback utilisé pour:', { categorie, grade, metier });
  return {
    min: 200000,
    max: 500000,
    avg: 350000,
    categorie: categorie || 'categorie_B',
    grade: grade || 'B1',
    sector: 'public',
    metier: metier || '',
    secteur: 'public',
    source: 'fallback'
  };
}

/**
 * SECTEUR PRIVÉ - INCHANGÉ
 */
export function calculerSalairePrive(secteurActivite, sousDomaine, metier, niveau) {
  const secteur = salairesPrives?.secteur_prive?.secteurs?.[secteurActivite];
  
  if (!secteur) {
    return getFallbackSalairePrive(secteurActivite, sousDomaine, metier, niveau);
  }

  const sousDomainData = secteur?.sous_domaines?.[sousDomaine];
  if (!sousDomainData) {
    return getFallbackSalairePrive(secteurActivite, sousDomaine, metier, niveau, secteur);
  }

  const metierData = sousDomainData?.metiers?.[metier];
  if (!metierData) {
    return getFallbackSalairePrive(secteurActivite, sousDomaine, metier, niveau, secteur, sousDomainData);
  }

  const niveauData = metierData?.niveaux?.[niveau];
  if (!niveauData) {
    return getFallbackSalairePrive(secteurActivite, sousDomaine, metier, niveau, secteur, sousDomainData, metierData);
  }

  return {
    min: Number(niveauData.salaire_bas ?? 0),
    max: Number(niveauData.salaire_haut ?? 0),
    avg: Number(niveauData.salaire_moyen ?? Math.round((niveauData.salaire_bas + niveauData.salaire_haut) / 2)),
    categorie: 'categorie_B',
    grade: niveau,
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

function getFallbackSalairePrive(secteurActivite, sousDomaine, metier, niveau, secteur = null, sousDomainData = null, metierData = null) {
  return {
    min: 300000,
    max: 700000,
    avg: 500000,
    categorie: 'categorie_B',
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
 * Point d'entrée
 */
export function calculerSalaire(params) {
  if (!params || typeof params !== 'object') {
    return { 
      min: 200000, 
      max: 600000, 
      avg: 400000, 
      source: 'error', 
      categorie: 'categorie_B', 
      grade: 'B1', 
      sector: 'public' 
    };
  }

  if (params.sector === 'public' && params.categorie && params.grade) {
    const typeSalaire = params.typeSalaire || 'base';
    return calculerSalairePublic(params.categorie, params.grade, params.metier || '', typeSalaire);
  }

  if (params.sector === 'private' && params.secteur_activite && params.sous_domaine && params.metier && params.niveau) {
    return calculerSalairePrive(params.secteur_activite, params.sous_domaine, params.metier, params.niveau);
  }

  if (params.job && params.experience && params.sector) {
    return calculerSalaireAncienFormat(params.job, params.experience, params.sector);
  }

  return { 
    min: 200000, 
    max: 600000, 
    avg: 400000, 
    source: 'error', 
    categorie: 'categorie_B', 
    grade: 'B1', 
    sector: 'public' 
  };
}

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
      source: 'estimation'
    };
  }

  return result;
}

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

function determinerGrade(experience, categorie) {
  const mappingGrades = {
    '0-2': { categorie_A: 'A3', categorie_B: 'B1', categorie_C: 'C1', categorie_D: 'D1', hauts_responsables: 'depute' },
    '3-5': { categorie_A: 'A3', categorie_B: 'B2', categorie_C: 'C2', categorie_D: 'D2', hauts_responsables: 'depute' },
    '6-10': { categorie_A: 'A2', categorie_B: 'B3', categorie_C: 'C3', categorie_D: 'D3', hauts_responsables: 'ministre' },
    '10+': { categorie_A: 'A1', categorie_B: 'B3', categorie_C: 'C3', categorie_D: 'D3', hauts_responsables: 'ministre' }
  };
  return mappingGrades?.[experience]?.[categorie] || 'B1';
}

function getNiveauTitre(niveau) {
  const titres = { junior: 'Junior', confirme: 'Confirmé', senior: 'Senior / Expert' };
  return titres[niveau] || niveau;
}

function detecterDomaine(metier) {
  const metierLower = (metier || '').toLowerCase();
  
  if (metierLower.includes('ministre') || metierLower.includes('député') || metierLower.includes('depute')) {
    return 'hauts_responsables';
  }
  if (metierLower.includes('professeur') || metierLower.includes('instituteur') || metierLower.includes('enseignant')) {
    return 'education';
  }
  if (metierLower.includes('médecin') || metierLower.includes('infirmier') || metierLower.includes('sage-femme')) {
    return 'sante';
  }
  if (metierLower.includes('ingénieur') || metierLower.includes('architecte') || metierLower.includes('informaticien')) {
    return 'technique';
  }
  if (metierLower.includes('police') || metierLower.includes('gendarme') || metierLower.includes('gardien de la paix')) {
    return 'securite';
  }
  if (metierLower.includes('trésor') || metierLower.includes('impôts') || metierLower.includes('finances')) {
    return 'finances';
  }
  return 'administration';
}

export function getAvantagesSecteur(sector, metier = '', grade = '') {
  if (sector === "private") {
    return [
      "Salaires compétitifs",
      "Primes de performance",
      "Assurance santé privée",
      "Formation continue",
      "Évolution rapide",
      "Bonus annuels"
    ];
  }
  
  const domaine = detecterDomaine(metier);
  
  if (domaine === 'hauts_responsables') {
    return [
      "Salaire très élevé (top 1% CI)",
      "Véhicule de fonction (haut de gamme)",
      "Logement de fonction meublé",
      "Personnel (chauffeur, garde, assistants)",
      "Frais de représentation élevés",
      "Passeport diplomatique"
    ];
  }
  
  const avantagesCommuns = [
    "Stabilité de l'emploi (à vie)",
    "Retraite garantie (CGRAE)",
    "Couverture santé complète",
    "30 jours de congés/an",
    "Progression automatique",
    "Allocations familiales (30K max/mois)"
  ];
  
  const avantagesSpecifiques = {
    'education': [
      "Prime pédagogique (20-30%)",
      "Congés scolaires (vacances)",
      "Formation continue pédagogique",
      "Indemnité de rentrée scolaire"
    ],
    'sante': [
      "Indemnités de sujétion (30-40%)",
      "Prime de garde (nuit/weekend)",
      "Équipements fournis",
      "Formation médicale continue",
      "Prime de risque biologique"
    ],
    'technique': [
      "Primes techniques (10-15%)",
      "Équipements informatiques",
      "Formations spécialisées",
      "Revalorisation attractive"
    ],
    'securite': [
      "Prime de risque (15-25%)",
      "Équipements fournis",
      "Logement de fonction possible",
      "Retraite anticipée (55 ans)"
    ],
    'finances': [
      "Primes de rendement",
      "Indemnité de fonction",
      "Formation fiscale continue",
      "Mobilité géographique"
    ],
    'administration': [
      "Primes de fonction",
      "Indemnité de logement (certains)",
      "Mobilité géographique",
      "Double vacation possible"
    ]
  };
  
  const commonSelected = avantagesCommuns.slice(0, 3);
  const specificSelected = avantagesSpecifiques[domaine] || avantagesSpecifiques['administration'];
  
  return [...commonSelected, ...specificSelected.slice(0, 3)];
}

const salaryCalculator = {
  calculerSalaire,
  calculerSalairePublic,
  calculerSalairePrive,
  getAvantagesSecteur
};

export default salaryCalculator;