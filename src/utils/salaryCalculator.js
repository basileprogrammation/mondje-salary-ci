// src/utils/salaryCalculator.js

/**
 * Calcule le salaire basé sur les données du formulaire et les données Firestore
 * @param {Object} formData - Données du formulaire
 * @param {Object} corpsMetiersData - Données publiques depuis Firestore
 * @param {Object} salairesPriveData - Données privées depuis Firestore
 * @returns {Object} Résultat du calcul avec salaire, grade, etc.
 */
export function calculateSalary(formData, corpsMetiersData, salairesPriveData) {
  console.log('🧮 Calcul du salaire avec données Firestore');
  console.log('📝 FormData reçu:', formData);

  // ========== SECTEUR PUBLIC ==========
  if (formData.sector === 'public') {
    const { categoriePublic, gradePublic, metierNom } = formData;
    
    console.log('📊 Recherche catégorie:', categoriePublic);
    console.log('📊 Recherche grade:', gradePublic);
    
    if (!corpsMetiersData?.categories?.[categoriePublic]) {
      console.error('❌ Catégorie non trouvée:', categoriePublic);
      console.log('Catégories disponibles:', Object.keys(corpsMetiersData?.categories || {}));
      return {
        sector: 'public',
        error: 'Catégorie introuvable',
        salaireBrut: 300000,
        salaireNet: 234000,
        metier: metierNom || 'Métier',
        grade: gradePublic,
        categorieKey: categoriePublic
      };
    }

    const categorieData = corpsMetiersData.categories[categoriePublic];
    console.log('✅ Catégorie trouvée:', categorieData.nom);
    
    // ✅ CORRECTION: grille_salariale est un objet avec les grades comme clés
    const grilleSalariale = categorieData.grille_salariale || {};
    const salaireGrade = grilleSalariale[gradePublic];
    
    if (!salaireGrade) {
      console.error('❌ Grade non trouvé dans grille salariale:', gradePublic);
      console.log('Grades disponibles:', Object.keys(grilleSalariale));
      return {
        sector: 'public',
        error: 'Grade introuvable',
        salaireBrut: 300000,
        salaireNet: 234000,
        metier: metierNom || 'Métier',
        grade: gradePublic,
        categorieKey: categoriePublic,
        categorie: categorieData.nom
      };
    }

    // ✅ Récupérer le salaire de l'échelon 1
    const salaireBrut = salaireGrade.echelon_1 || salaireGrade.min || 300000;
    const salaireNet = Math.round(salaireBrut * 0.78); // 22% de charges

    console.log('✅ Salaire calculé (Public):', { salaireBrut, salaireNet });

    return {
      sector: 'public',
      categorie: categorieData.nom,
      categorieKey: categoriePublic,
      grade: gradePublic,
      metier: metierNom || 'Métier',
      salaireBrut: Number(salaireBrut),
      salaireNet: Number(salaireNet),
      echelons: salaireGrade,
      diplomeRequis: categorieData.diplome_requis || '',
      evolutions: categorieData.grades || []
    };
  }

  // ========== SECTEUR PRIVÉ ==========
  if (formData.sector === 'prive') {
    const { selectedSecteurPrive, selectedSousDomaine, selectedMetierPrive, selectedNiveauPrive } = formData;

    console.log('📊 Secteur PRIVÉ:', { 
      selectedSecteurPrive, 
      selectedSousDomaine, 
      selectedMetierPrive, 
      selectedNiveauPrive 
    });

    // ✅ Vérifier secteur
    if (!salairesPriveData?.secteur_prive?.secteurs?.[selectedSecteurPrive]) {
      console.error('❌ Secteur non trouvé:', selectedSecteurPrive);
      console.log('Secteurs disponibles:', Object.keys(salairesPriveData?.secteur_prive?.secteurs || {}));
      return {
        sector: 'prive',
        error: 'Secteur introuvable',
        salaireBrut: 400000,
        salaireNet: 312000,
        metierTitre: 'Métier',
        niveau: selectedNiveauPrive,
        secteurNom: 'Secteur privé'
      };
    }

    const secteur = salairesPriveData.secteur_prive.secteurs[selectedSecteurPrive];
    console.log('✅ Secteur trouvé:', secteur.nom);

    // ✅ Vérifier sous-domaine
    const sousDomaine = secteur.sous_domaines?.[selectedSousDomaine];
    
    if (!sousDomaine) {
      console.error('❌ Sous-domaine non trouvé:', selectedSousDomaine);
      console.log('Sous-domaines disponibles:', Object.keys(secteur.sous_domaines || {}));
      return {
        sector: 'prive',
        error: 'Sous-domaine introuvable',
        salaireBrut: 400000,
        salaireNet: 312000,
        secteurNom: secteur.nom,
        metierTitre: 'Métier',
        niveau: selectedNiveauPrive
      };
    }

    console.log('✅ Sous-domaine trouvé:', sousDomaine.nom);

    // ✅ Vérifier métier
    const metier = sousDomaine.metiers?.[selectedMetierPrive];
    
    if (!metier) {
      console.error('❌ Métier non trouvé:', selectedMetierPrive);
      console.log('Métiers disponibles:', Object.keys(sousDomaine.metiers || {}));
      return {
        sector: 'prive',
        error: 'Métier introuvable',
        salaireBrut: 400000,
        salaireNet: 312000,
        secteurNom: secteur.nom,
        sousDomaineNom: sousDomaine.nom,
        metierTitre: 'Métier',
        niveau: selectedNiveauPrive
      };
    }

    console.log('✅ Métier trouvé:', metier.titre);

    // ✅ Vérifier niveau
    const niveauData = metier.niveaux?.[selectedNiveauPrive];
    
    if (!niveauData) {
      console.error('❌ Niveau non trouvé:', selectedNiveauPrive);
      console.log('Niveaux disponibles:', Object.keys(metier.niveaux || {}));
      return {
        sector: 'prive',
        error: 'Niveau introuvable',
        salaireBrut: 400000,
        salaireNet: 312000,
        secteurNom: secteur.nom,
        sousDomaineNom: sousDomaine.nom,
        metierTitre: metier.titre,
        niveau: selectedNiveauPrive
      };
    }

    console.log('✅ Niveau trouvé:', niveauData);

    // ✅ Calcul du salaire
    const salaireBrut = niveauData.salaire_brut || 400000;
    const salaireNet = Math.round(salaireBrut * 0.78);

    console.log('✅ Salaire calculé (Privé):', { salaireBrut, salaireNet });

    return {
      sector: 'prive',
      secteurNom: secteur.nom,
      sousDomaineNom: sousDomaine.nom,
      metierTitre: metier.titre,
      metierDescription: metier.description || '',
      niveau: selectedNiveauPrive,
      salaireBrut: Number(salaireBrut),
      salaireNet: Number(salaireNet),
      primes: niveauData.primes || [],
      avantages: niveauData.avantages || [],
      experience: niveauData.experience_requise || '',
      perspectives: metier.perspectives_evolution || []
    };
  }

  console.error('❌ Secteur invalide:', formData.sector);
  return {
    error: 'Secteur invalide',
    salaireBrut: 300000,
    salaireNet: 234000,
    sector: formData.sector
  };
}

/**
 * Formatte un nombre en tant que salaire (avec espaces)
 * @param {number} amount - Montant
 * @returns {string} Montant formatté
 */
export function formatSalary(amount) {
  if (!amount) return '0';
  return Number(amount).toLocaleString('fr-FR');
}

/**
 * Calcule le grade équivalent entre secteurs
 * @param {string} grade - Grade actuel
 * @param {string} fromSector - Secteur d'origine
 * @param {string} toSector - Secteur de destination
 * @returns {string} Grade équivalent
 */
export function calculateEquivalentGrade(grade, fromSector, toSector) {
  const gradeMapping = {
    'public_to_prive': {
      'A1': 'senior',
      'A2': 'confirme',
      'B1': 'confirme',
      'B2': 'junior',
      'C1': 'junior',
      'C2': 'junior',
      'D1': 'junior'
    },
    'prive_to_public': {
      'senior': 'A1',
      'confirme': 'B1',
      'junior': 'C1'
    }
  };

  const mappingKey = `${fromSector}_to_${toSector}`;
  return gradeMapping[mappingKey]?.[grade] || grade;
}