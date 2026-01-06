// src/pages/EstimatorPage.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, Building2, X, Sparkles, TrendingUp, ChevronDown } from 'lucide-react';
import { incrementStat } from '../utils/mondjeStats';

import CustomSelect from '../components/Customselect.js';
import salairesPriveData from '../data/salaires-secteur-prive.json';
import corpsMetiersData from '../data/corps-metiers.json';
import BAHNPromoSection from '../components/BAHNPromoSection';
import GradeExplanationModal from '../components/GradeExplanationModal';

// ========== PALETTE DE COULEURS BAHN ==========
const COLORS = {
  // Couleurs principales BAHN
  teal: {
    primary: '#3D9B9B',
    dark: '#2D7A7A',
    darker: '#1F5555',
    light: '#E6F5F5',
    medium: '#B3E0E0',
  },
  gold: {
    primary: '#F4C430',
    dark: '#C29D26',
    light: '#FEF9E6',
  },
  // Couleurs d'état
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    600: '#4B5563',
    700: '#374151',
    900: '#111827',
  },
};

export default function EstimatorPage() {
  const navigate = useNavigate();

  // ========== ÉTATS ==========
  const [sector, setSector] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);
  
  // États PUBLIC
  const [searchMetierPublic, setSearchMetierPublic] = useState('');
  const [categoriePublic, setCategoriePublic] = useState('');
  const [gradePublic, setGradePublic] = useState('');
  const [showSuggestionsPublic, setShowSuggestionsPublic] = useState(false);
  const [gradeEntreeMetier, setGradeEntreeMetier] = useState('');
  // États PRIVÉ
  const [selectedSecteurPrive, setSelectedSecteurPrive] = useState('');
  const [selectedSousDomaine, setSelectedSousDomaine] = useState('');
  const [selectedMetierPrive, setSelectedMetierPrive] = useState('');
  const [selectedNiveauPrive, setSelectedNiveauPrive] = useState('');

  // ========== EFFECTS ==========
  useEffect(() => {
    const onClick = () => setShowSuggestionsPublic(false);
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  // ========== DONNÉES SECTEUR PUBLIC ==========
  const metiersPublicList = useMemo(() => {
    const metiers = [];
    const categories = corpsMetiersData?.categories || {};
    Object.entries(categories).forEach(([catKey, categorie]) => {
      (categorie?.corps_metiers || []).forEach((domaine) => {
        (domaine?.metiers || []).forEach((metier) => {
          const nomMetier = typeof metier === 'string' ? metier : metier?.nom;
          if (nomMetier) {
            metiers.push({
              nom: nomMetier,
              domaine: domaine.domaine,
              categorie: categorie.nom,
              categorieKey: catKey,
              grade_entree: metier?.grade_entree_estime,
              salaire_brut_debut: metier?.salaire_brut_debut_estime,
              mots_cles: metier?.mots_cles || []
            });
          }
        });
      });
    });
    return metiers;
  }, []);

  const suggestionsMetiersPublic = useMemo(() => {
    if (!searchMetierPublic || searchMetierPublic.length < 2) return [];
    const search = searchMetierPublic.toLowerCase();
    return metiersPublicList
      .filter((m) => {
        if (m.nom.toLowerCase().includes(search)) return true;
        if (m.mots_cles && Array.isArray(m.mots_cles)) {
          return m.mots_cles.some(mc => mc.toLowerCase().includes(search));
        }
        return false;
      })
      .slice(0, 8);
  }, [searchMetierPublic, metiersPublicList]);

const gradesPublic = useMemo(() => {
  if (!categoriePublic) return [];
  
  const grades = corpsMetiersData?.categories?.[categoriePublic]?.grades || [];
  
  // ✅ Masquer les grades non accessibles par concours
  const gradesAccessiblesConcours = {
    'categorie_A': ['A7', 'A6', 'A5', 'A4', 'A3'], // Sans A1, A2
    'categorie_B': ['B3', 'B2', 'B1'],
    'categorie_C': ['C3', 'C2', 'C1'],
    'categorie_D': ['D2', 'D1'], // Sans D3
    'hauts_responsables': ['ministre', 'depute']
  };
  
  const gradesAutorises = gradesAccessiblesConcours[categoriePublic];
  let gradesFiltres = gradesAutorises ? grades.filter(g => gradesAutorises.includes(g)) : grades;
  
  // ✅ NOUVEAU : Filtrer selon grade_entree (progression A3→A7)
  if (gradeEntreeMetier && categoriePublic !== 'hauts_responsables') {
    // Ordre de progression : du plus BAS (A3) au plus HAUT (A7)
    const ordreProgression = {
      'categorie_A': ['A3', 'A4', 'A5', 'A6', 'A7', 'A2', 'A1'],
      'categorie_B': ['B1', 'B2', 'B3'],
      'categorie_C': ['C1', 'C2', 'C3'],
      'categorie_D': ['D1', 'D2']
    };
    
    const ordre = ordreProgression[categoriePublic] || [];
    const indexGradeEntree = ordre.indexOf(gradeEntreeMetier);
    
    if (indexGradeEntree !== -1) {
      // Garder seulement les grades >= grade_entree (progression ascendante)
      gradesFiltres = gradesFiltres.filter(g => {
        const indexG = ordre.indexOf(g);
        return indexG >= indexGradeEntree;
      });
    }
  }
  
  return gradesFiltres;
}, [categoriePublic, gradeEntreeMetier]); 

  // ========== DONNÉES SECTEUR PRIVÉ ==========
  const secteursPriveList = useMemo(() => {
    const secteurs = salairesPriveData?.secteur_prive?.secteurs || {};
    return Object.entries(secteurs)
      .map(([key, data]) => ({ key, nom: data.nom }))
      .sort((a, b) => a.nom.localeCompare(b.nom));
  }, []);

  const sousDomainesPriveList = useMemo(() => {
    if (!selectedSecteurPrive) return [];
    const secteur = salairesPriveData?.secteur_prive?.secteurs?.[selectedSecteurPrive];
    if (!secteur?.sous_domaines) return [];
    return Object.entries(secteur.sous_domaines)
      .map(([key, data]) => ({ key, nom: data.nom }))
      .sort((a, b) => a.nom.localeCompare(b.nom));
  }, [selectedSecteurPrive]);

  const metiersPriveList = useMemo(() => {
    if (!selectedSecteurPrive || !selectedSousDomaine) return [];
    const sousDomaine = salairesPriveData?.secteur_prive?.secteurs?.[selectedSecteurPrive]?.sous_domaines?.[selectedSousDomaine];
    if (!sousDomaine?.metiers) return [];
    return Object.entries(sousDomaine.metiers)
      .map(([key, data]) => ({ key, titre: data.titre }))
      .sort((a, b) => a.titre.localeCompare(b.titre));
  }, [selectedSecteurPrive, selectedSousDomaine]);

  const niveauxPriveList = useMemo(() => {
    if (!selectedSecteurPrive || !selectedSousDomaine || !selectedMetierPrive) return [];
    const metier = salairesPriveData?.secteur_prive?.secteurs?.[selectedSecteurPrive]?.sous_domaines?.[selectedSousDomaine]?.metiers?.[selectedMetierPrive];
    if (!metier?.niveaux) return [];
    return Object.entries(metier.niveaux).map(([key, data]) => ({ key, experience: data.experience }));
  }, [selectedSecteurPrive, selectedSousDomaine, selectedMetierPrive]);

  // Options pour CustomSelect
  const secteursOptions = useMemo(() => secteursPriveList.map(s => ({ value: s.key, label: s.nom })), [secteursPriveList]);
  const sousDomainesOptions = useMemo(() => sousDomainesPriveList.map(sd => ({ value: sd.key, label: sd.nom })), [sousDomainesPriveList]);
  const metiersOptions = useMemo(() => metiersPriveList.map(m => ({ value: m.key, label: m.titre })), [metiersPriveList]);

  // ========== HANDLERS ==========
  const handleSecteurPriveChange = (value) => {
    setSelectedSecteurPrive(value);
    setSelectedSousDomaine('');
    setSelectedMetierPrive('');
    setSelectedNiveauPrive('');
  };

  const handleSousDomaineChange = (value) => {
    setSelectedSousDomaine(value);
    setSelectedMetierPrive('');
    setSelectedNiveauPrive('');
  };

  const handleMetierPriveChange = (value) => {
    setSelectedMetierPrive(value);
    setSelectedNiveauPrive('');
  };

  const handleResetSector = () => {
    setSector('');
    setSearchMetierPublic('');
    setCategoriePublic('');
    setGradePublic('');
    setGradeEntreeMetier('');
    setShowSuggestionsPublic(false);
    setSelectedSecteurPrive('');
    setSelectedSousDomaine('');
    setSelectedMetierPrive('');
    setSelectedNiveauPrive('');
  };

const handleSelectMetierPublic = (metier) => {
  setSearchMetierPublic(metier.nom);
  setCategoriePublic(metier.categorieKey);
  setGradeEntreeMetier(metier.grade_entree || ''); // ✅ NOUVEAU : Sauvegarder grade d'entrée
  setShowSuggestionsPublic(false);
  
  // ✅ Si c'est un haut responsable, mettre le grade automatiquement
  if (metier.categorieKey === 'hauts_responsables') {
    const gradeAuto = metier.nom.toLowerCase() === 'ministre' ? 'ministre' : 'depute';
    setGradePublic(gradeAuto);
  } else {
    setGradePublic(''); // Réinitialiser le grade
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    incrementStat('estimations').catch(console.error);

    if (sector === 'public') {
      if (!categoriePublic || !gradePublic) return;
      navigate('/results', {
        state: {
          sector: 'public',
          metier: searchMetierPublic,
          categorie: categoriePublic,
          grade: gradePublic
        }
      });
      return;
    }

    if (sector === 'private') {
      if (!selectedSecteurPrive || !selectedSousDomaine || !selectedMetierPrive || !selectedNiveauPrive) return;
      navigate('/results', {
        state: {
          sector: 'private',
          secteur_activite: selectedSecteurPrive,
          sous_domaine: selectedSousDomaine,
          metier: selectedMetierPrive,
          niveau: selectedNiveauPrive
        }
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-50 via-white to-amber-50">
      {/* Blobs décoratifs */}
      <div 
        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-96 h-96 blur-3xl"
        style={{ background: `linear-gradient(135deg, ${COLORS.teal.primary}20, ${COLORS.teal.medium}20)` }}
      />
      <div 
        className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 rounded-full w-96 h-96 blur-3xl"
        style={{ background: `linear-gradient(135deg, ${COLORS.gold.primary}20, ${COLORS.gold.dark}20)` }}
      />
      
      {/* ========== HEADER BAHN ========== */}
      <header className="relative bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-5">
          <div className="flex items-center justify-between">
            {/* Logo BAHN */}
            <div 
              className="flex items-center gap-2 cursor-pointer sm:gap-3 group"
              onClick={() => window.location.href = 'https://www.mondje.bahn-edu.com'}
            >
              {/* Badge B */}
              <div 
                className="flex items-center justify-center w-10 h-10 transition-transform shadow-lg sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl group-hover:scale-110"
                style={{ backgroundColor: COLORS.gold.primary }}
              >
                <span 
                  className="text-xl font-black sm:text-2xl"
                  style={{ color: COLORS.teal.dark }}
                >
                  B
                </span>
              </div>
              
              {/* Texte BAHN */}
              <div className="flex items-center gap-2">
  <div 
    className="text-xl font-black sm:text-2xl md:text-3xl"
    style={{ color: COLORS.teal.dark }}
  >
    BAHN
  </div>
 <span className="text-base sm:text-lg">💰</span>
</div>
            </div>

            {/* Lien Découvrir BAHN */}
            <a 
              href="https://bahn-edu.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs font-semibold transition sm:text-sm sm:block hover:opacity-80"
              style={{ color: COLORS.teal.dark }}
            >
              Découvrir BAHN →
            </a>
          </div>
        </div>
      </header>

      {/* ========== CONTENU PRINCIPAL ========== */}
      <main className="relative flex items-center justify-center flex-1 px-4 py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-4xl">
          
          {/* Section Hero */}
          <div className="mb-8 space-y-4 text-center sm:mb-12 sm:space-y-6 animate-fade-in">
            {/* Badge Nouveauté */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 border-2 rounded-full"
              style={{ 
                background: `linear-gradient(to right, ${COLORS.gold.light}, ${COLORS.gold.primary}30)`,
                borderColor: COLORS.gold.primary 
              }}
            >
              <Sparkles style={{ color: COLORS.gold.primary }} size={16} />
              <span 
                className="text-sm font-black"
                style={{ color: COLORS.teal.dark }}
              >
                ✨ NOUVEAUTÉ SUR BAHN
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="text-3xl font-black leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
              Es-tu bien{' '}
              <span className="relative inline-block">
                <span 
                  className="relative z-10 text-transparent bg-clip-text"
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${COLORS.teal.primary}, ${COLORS.gold.primary})` 
                  }}
                >
                  payé ?
                </span>
                <span 
                  className="absolute left-0 right-0 h-3 transform bottom-1 -z-0 -rotate-1"
                  style={{ 
                    background: `linear-gradient(to right, ${COLORS.teal.light}, ${COLORS.gold.light})` 
                  }}
                />
              </span>
            </h1>
            
            {/* Sous-titre */}
            <p className="max-w-2xl mx-auto text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
              Découvre ton salaire estimé en Côte d'Ivoire 🇨🇮 en 2 minutes
            </p>

            {/* Badges avantages */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 sm:gap-4">
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-full shadow-sm bg-white/80 backdrop-blur-sm">
                <TrendingUp style={{ color: COLORS.teal.primary }} size={16} />
                <span className="text-xs font-semibold text-gray-700 sm:text-sm">Gratuit</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-full shadow-sm bg-white/80 backdrop-blur-sm">
                <span className="text-xs font-semibold text-gray-700 sm:text-sm">🔒 100% Anonyme</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-full shadow-sm bg-white/80 backdrop-blur-sm">
                <span className="text-xs font-semibold text-gray-700 sm:text-sm">⚡ Instantané</span>
              </div>
               <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-full shadow-sm bg-white/80 backdrop-blur-sm">
    <span className="text-xs font-semibold text-gray-700 sm:text-sm">✓ + 80 Sources fiables</span>
  </div>
            </div>
          </div>

          {/* Bouton comprendre les grades */}
          <div className="mb-6 text-center animate-fade-in">
            <button
              type="button"
              onClick={() => setShowGradeModal(true)}
              className="inline-flex items-center px-6 py-3 space-x-2 font-bold transition-all border-2 shadow-lg bg-white/90 backdrop-blur-xl hover:bg-white rounded-2xl hover:shadow-xl hover:scale-105"
              style={{ 
                color: COLORS.teal.dark,
                borderColor: COLORS.teal.light 
              }}
            >
              <span className="text-xl">📚</span>
              <span>Comprendre les grades de la fonction publique</span>
            </button>
          </div>

          {/* ========== FORMULAIRE ========== */}
          <form
            onSubmit={handleSubmit}
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl border p-4 sm:p-6 lg:p-12 space-y-6 sm:space-y-8 lg:space-y-10 transform hover:shadow-3xl transition-shadow duration-500"
            style={{ borderColor: COLORS.teal.light }}
          >
            {/* Choix du secteur */}
            {!sector && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Choisissez votre secteur
                  </h2>
                  <p className="text-sm text-gray-600 sm:text-base">
                    Public ou privé ? Commencez par là
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
                  {/* Fonction Publique */}
                  <button
                    type="button"
                    onClick={() => setSector('public')}
                    className="group relative overflow-hidden flex flex-col items-center gap-5 p-8 sm:p-10 border-2 rounded-3xl transition-all hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 active:scale-[0.98]"
                    style={{ 
                      borderColor: COLORS.teal.light,
                      '--hover-border': COLORS.teal.primary 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.teal.primary}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.teal.light}
                  >
                    <div 
                      className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100"
                      style={{ background: `linear-gradient(135deg, ${COLORS.teal.primary}05, transparent)` }}
                    />
                    <div className="relative text-6xl transition-transform transform sm:text-7xl group-hover:scale-110">
                      🏛️
                    </div>
                    <div className="relative space-y-2 text-center">
                      <p className="text-xl font-black text-gray-900 sm:text-2xl">
                        Fonction Publique
                      </p>
                      <p className="text-sm leading-relaxed text-gray-600">
                        État, Collectivités,<br/>Établissements publics
                      </p>
                    </div>
                    <div className="absolute transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100">
                      <div 
                        className="flex items-center justify-center w-8 h-8 rounded-full"
                        style={{ backgroundColor: COLORS.teal.primary }}
                      >
                        <ChevronDown className="text-white rotate-[-90deg]" size={16} />
                      </div>
                    </div>
                  </button>

                  {/* Secteur Privé */}
                  <button
                    type="button"
                    onClick={() => setSector('private')}
                    className="group relative overflow-hidden flex flex-col items-center gap-5 p-8 sm:p-10 border-2 rounded-3xl transition-all hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 active:scale-[0.98]"
                    style={{ borderColor: COLORS.gold.light }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.gold.primary}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.gold.light}
                  >
                    <div 
                      className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100"
                      style={{ background: `linear-gradient(135deg, ${COLORS.gold.primary}05, transparent)` }}
                    />
                    <div className="relative text-6xl transition-transform transform sm:text-7xl group-hover:scale-110">
                      🏢
                    </div>
                    <div className="relative space-y-2 text-center">
                      <p className="text-xl font-black text-gray-900 sm:text-2xl">
                        Secteur Privé
                      </p>
                      <p className="text-sm leading-relaxed text-gray-600">
                        Entreprises, ONG,<br/>Organisations
                      </p>
                    </div>
                    <div className="absolute transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100">
                      <div 
                        className="flex items-center justify-center w-8 h-8 rounded-full"
                        style={{ backgroundColor: COLORS.gold.primary }}
                      >
                        <ChevronDown className="text-white rotate-[-90deg]" size={16} />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ========== SECTEUR PUBLIC ========== */}
            {sector === 'public' && (
              <div className="space-y-6 sm:space-y-8 animate-slide-in" onClick={(e) => e.stopPropagation()}>
                {/* Bouton reset */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetSector}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl hover:shadow-md transition-all border"
                    style={{ 
                      background: `linear-gradient(to right, ${COLORS.teal.light}, ${COLORS.teal.light})`,
                      color: COLORS.teal.dark,
                      borderColor: COLORS.teal.medium 
                    }}
                  >
                    <Building2 size={18} className="transition-transform group-hover:rotate-12" />
                    <span className="text-sm font-bold">Fonction Publique</span>
                    <X size={16} className="opacity-60 group-hover:opacity-100" />
                  </button>
                </div>

                {/* Recherche métier */}
                <div className="relative space-y-3">
                  <label className="block">
                    <span className="inline-flex items-center gap-3 mb-3 text-base font-bold text-gray-900 sm:text-lg">
                      <span 
                        className="flex items-center justify-center w-8 h-8 text-sm font-black text-white shadow-lg rounded-xl"
                        style={{ background: `linear-gradient(135deg, ${COLORS.teal.primary}, ${COLORS.teal.dark})` }}
                      >
                        1
                      </span>
                      Recherchez votre métier
                    </span>
                  </label>

                  <div className="relative group">
                    <Search 
                      className="absolute z-10 text-gray-400 -translate-y-1/2 left-5 top-1/2 group-focus-within:transition-colors" 
                      style={{ '--focus-color': COLORS.teal.primary }}
                      size={20} 
                    />
                    <input
                      type="text"
                      value={searchMetierPublic}
                      onChange={(e) => {
                        setSearchMetierPublic(e.target.value);
                        setShowSuggestionsPublic(true);
                      }}
                      onFocus={() => setShowSuggestionsPublic(true)}
                      placeholder="Ex: Ingénieur, Professeur, Infirmier..."
                      className="w-full py-4 pr-6 text-base transition-all border-2 border-gray-200 pl-14 sm:py-5 rounded-2xl focus:ring-4 sm:text-lg bg-white/80 backdrop-blur-sm placeholder:text-gray-400"
                      style={{ 
                        '--focus-ring-color': `${COLORS.teal.primary}33`,
                        '--focus-border-color': COLORS.teal.primary 
                      }}
                      onFocusCapture={(e) => {
                        e.currentTarget.style.borderColor = COLORS.teal.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 4px ${COLORS.teal.primary}33`;
                      }}
                      onBlurCapture={(e) => {
                        e.currentTarget.style.borderColor = COLORS.gray[200];
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />

                    {/* Suggestions */}
                    {showSuggestionsPublic && suggestionsMetiersPublic.length > 0 && (
                      <div 
                        className="absolute z-20 w-full mt-2 overflow-y-auto border-2 shadow-2xl bg-white/95 backdrop-blur-xl rounded-2xl max-h-80 animate-slide-down"
                        style={{ borderColor: COLORS.teal.light }}
                      >
                        {suggestionsMetiersPublic.map((metier, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectMetierPublic(metier)}
                            className="w-full px-5 py-4 text-left transition-all border-b border-gray-100 last:border-b-0 group"
                            style={{ '--hover-bg': COLORS.teal.light }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.teal.light}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <p 
                              className="font-bold text-gray-900 group-hover:transition-colors"
                              style={{ '--hover-color': COLORS.teal.primary }}
                            >
                              {metier.nom}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {metier.domaine} • {metier.categorie}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Catégorie sélectionnée */}
                  {categoriePublic && (
                    <div 
                      className="flex items-center gap-2 px-4 py-2 border rounded-xl w-fit"
                      style={{ 
                        backgroundColor: COLORS.teal.light,
                        borderColor: COLORS.teal.medium 
                      }}
                    >
                      <span 
                        className="text-sm font-black"
                        style={{ color: COLORS.teal.primary }}
                      >
                        ✓
                      </span>
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: COLORS.teal.dark }}
                      >
                        {corpsMetiersData?.categories?.[categoriePublic]?.nom}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sélection grade */}
{/* Sélection grade - CATÉGORIES NORMALES (A, B, C, D) */}
{categoriePublic && categoriePublic !== 'hauts_responsables' && (
  <div className="space-y-3 animate-slide-in">
    <label className="block">
      <span className="inline-flex items-center gap-3 mb-3 text-base font-bold text-gray-900 sm:text-lg">
        <span 
          className="flex items-center justify-center w-8 h-8 text-sm font-black text-white shadow-lg rounded-xl"
          style={{ background: `linear-gradient(135deg, ${COLORS.gold.primary}, ${COLORS.gold.dark})` }}
        >
          2
        </span>
        Sélectionnez votre grade
      </span>
    </label>

    <div className="relative">
      <select
        value={gradePublic}
        onChange={(e) => setGradePublic(e.target.value)}
        required
        className="w-full px-6 py-4 text-base font-medium transition-all border-2 border-gray-200 appearance-none cursor-pointer sm:py-5 rounded-2xl focus:ring-4 bg-white/80 backdrop-blur-sm sm:text-lg"
        style={{
          '--focus-ring-color': `${COLORS.gold.primary}33`,
          '--focus-border-color': COLORS.gold.primary
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.borderColor = COLORS.gold.primary;
          e.currentTarget.style.boxShadow = `0 0 0 4px ${COLORS.gold.primary}33`;
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderColor = COLORS.gray[200];
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <option value="">Choisissez votre grade...</option>
        {gradesPublic.map((g) => (
          <option key={g} value={g}>Grade {g}</option>
        ))}
      </select>
      <ChevronDown className="absolute text-gray-400 -translate-y-1/2 pointer-events-none right-5 top-1/2" size={20} />
    </div>
    {gradeEntreeMetier && (
      <div 
        className="flex items-start gap-3 p-4 border-l-4 rounded-lg animate-slide-in"
        style={{ 
          backgroundColor: COLORS.teal.light,
          borderColor: COLORS.teal.primary 
        }}
      >
        <span className="text-xl">ℹ️</span>
        <div className="space-y-1">
          <p 
            className="text-sm font-bold"
            style={{ color: COLORS.teal.dark }}
          >
            Grade d'entrée par concours : {gradeEntreeMetier}
          </p>
          <p className="text-xs leading-relaxed text-gray-600">
            Vous entrez comme <strong>{gradeEntreeMetier}</strong> et pouvez progresser par avancement jusqu'à{' '}
            {categoriePublic === 'categorie_A' ? 'A1' : 
             categoriePublic === 'categorie_B' ? 'B1' : 
             categoriePublic === 'categorie_C' ? 'C1' : 'D1'}.
            {' '}La descente de grade n'existe pas dans la fonction publique.
          </p>
        </div>
      </div>
    )}
  </div>
)}

{/* ✅ NOUVEAU : Confirmation pour Hauts Responsables (Ministre/Député) */}
{categoriePublic === 'hauts_responsables' && (
  <div className="space-y-4 animate-slide-in">
    {/* Badge de confirmation */}
    <div 
      className="flex items-center gap-3 p-5 border-2 rounded-2xl"
      style={{ 
        backgroundColor: COLORS.gold.light,
        borderColor: COLORS.gold.primary 
      }}
    >
      <span className="text-3xl">✓</span>
      <div>
        <p 
          className="text-lg font-bold"
          style={{ color: COLORS.teal.dark }}
        >
          Poste sélectionné : {searchMetierPublic}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Gouvernement et Assemblée Nationale
        </p>
      </div>
    </div>

    {/* Disclaimer avec sources */}
    <div className="p-4 border-l-4 border-blue-400 rounded-lg bg-blue-50">
      <p className="text-xs leading-relaxed text-blue-800">
        ℹ️ <strong>Sources vérifiées :</strong> Les salaires sont basés sur des publications officielles et médias ivoiriens (Jeune Afrique 2018, Informateur.ci 2025, ABIDJANAIS 2015). Les avantages en nature (véhicules, logements, personnel) ne sont pas inclus dans ces montants.
      </p>
    </div>
  </div>
)}
              </div>
            )}

            {/* ========== SECTEUR PRIVÉ ========== */}
            {sector === 'private' && (
              <div className="space-y-6 sm:space-y-8 animate-slide-in">
                {/* Bouton reset */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetSector}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl hover:shadow-md transition-all border"
                    style={{
                      background: `linear-gradient(to right, ${COLORS.gold.light}, ${COLORS.gold.light})`,
                      color: COLORS.gold.dark,
                      borderColor: COLORS.gold.primary
                    }}
                  >
                    <Briefcase size={18} className="transition-transform group-hover:rotate-12" />
                    <span className="text-sm font-bold">Secteur Privé</span>
                    <X size={16} className="opacity-60 group-hover:opacity-100" />
                  </button>
                </div>

                {/* CustomSelects */}
                <CustomSelect
                  value={selectedSecteurPrive}
                  onChange={handleSecteurPriveChange}
                  options={secteursOptions}
                  placeholder="Choisissez un secteur..."
                  label="Secteur d'activité"
                  badgeNumber="1"
                  badgeColor="amber"
                />

                {selectedSecteurPrive && sousDomainesOptions.length > 0 && (
                  <CustomSelect
                    value={selectedSousDomaine}
                    onChange={handleSousDomaineChange}
                    options={sousDomainesOptions}
                    placeholder="Choisissez un sous-domaine..."
                    label="Sous-domaine"
                    badgeNumber="2"
                    badgeColor="emerald"
                  />
                )}

                {selectedSousDomaine && metiersOptions.length > 0 && (
                  <CustomSelect
                    value={selectedMetierPrive}
                    onChange={handleMetierPriveChange}
                    options={metiersOptions}
                    placeholder="Choisissez votre métier..."
                    label="Votre métier"
                    badgeNumber="3"
                    badgeColor="blue"
                  />
                )}

                {/* Niveaux d'expérience */}
                {selectedMetierPrive && niveauxPriveList.length > 0 && (
                  <div className="space-y-4 animate-slide-in">
                    <label className="block">
                      <span className="inline-flex items-center gap-2 mb-4 text-sm font-bold text-gray-900 sm:gap-3 sm:text-base lg:text-lg">
                        <span 
                          className="flex items-center justify-center flex-shrink-0 text-xs font-black text-white shadow-lg w-7 h-7 sm:w-8 sm:h-8 rounded-xl sm:text-sm"
                          style={{ background: `linear-gradient(135deg, ${COLORS.teal.dark}, ${COLORS.teal.darker})` }}
                        >
                          4
                        </span>
                        <span className="leading-tight">Niveau d'expérience</span>
                      </span>
                    </label>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 sm:gap-4">
                      {niveauxPriveList.map((niv) => {
                        const isSelected = selectedNiveauPrive === niv.key;
                        return (
                          <label
                            key={niv.key}
                            className={`relative flex flex-col items-center p-4 sm:p-5 lg:p-6 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all group ${
                              isSelected ? 'shadow-xl scale-105' : 'bg-white/80 hover:shadow-lg hover:scale-102'
                            }`}
                            style={{
                              borderColor: isSelected ? COLORS.teal.primary : COLORS.gray[200],
                              background: isSelected ? `linear-gradient(135deg, ${COLORS.teal.light}, ${COLORS.teal.medium}30)` : undefined
                            }}
                          >
                            <input
                              type="radio"
                              name="niveau"
                              value={niv.key}
                              checked={isSelected}
                              onChange={(e) => setSelectedNiveauPrive(e.target.value)}
                              className="sr-only"
                            />
                            <div className={`text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform ${isSelected ? 'animate-bounce-small' : ''}`}>
                              {niv.key === 'junior' ? '🌱' : niv.key === 'confirme' ? '💼' : '⭐'}
                            </div>
                            <p 
                              className="mb-1 text-sm font-black capitalize sm:text-base lg:text-lg"
                              style={{ color: isSelected ? COLORS.teal.dark : COLORS.gray[900] }}
                            >
                              {niv.key}
                            </p>
                            <p className="text-xs leading-relaxed text-center text-gray-600 sm:text-sm">
                              {niv.experience}
                            </p>
                            {isSelected && (
                              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                                <div 
                                  className="flex items-center justify-center w-5 h-5 rounded-full sm:w-6 sm:h-6"
                                  style={{ backgroundColor: COLORS.teal.primary }}
                                >
                                  <svg className="w-3 h-3 text-white sm:w-4 sm:h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                </div>
                              </div>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Message aucun sous-domaine */}
                {selectedSecteurPrive && sousDomainesOptions.length === 0 && (
                  <div 
                    className="p-3 text-center border rounded-xl sm:rounded-2xl sm:p-4 animate-slide-in"
                    style={{ 
                      backgroundColor: COLORS.gold.light,
                      borderColor: COLORS.gold.primary 
                    }}
                  >
                    <p 
                      className="text-sm font-semibold sm:text-base"
                      style={{ color: COLORS.gold.dark }}
                    >
                      ⚠️ Aucun sous-domaine disponible
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ========== BOUTON SUBMIT ========== */}
            {sector && (
              <div className="pt-4 space-y-4 animate-slide-in">
                <button
                  type="submit"
                  disabled={
                    (sector === 'public' && (!categoriePublic || !gradePublic)) ||
                    (sector === 'private' && (!selectedSecteurPrive || !selectedSousDomaine || !selectedMetierPrive || !selectedNiveauPrive))
                  }
                  className="group relative w-full overflow-hidden text-white font-black py-4 sm:py-5 lg:py-6 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(to right, ${COLORS.teal.primary}, ${COLORS.teal.dark}, ${COLORS.gold.primary})`
                  }}
                >
                  <div 
                    className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-20"
                    style={{ background: `linear-gradient(to right, ${COLORS.teal.light}, ${COLORS.gold.light})` }}
                  />
                  <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                    {(sector === 'public' && (!categoriePublic || !gradePublic)) ? (
                      <span className="text-center">⏳ Sélectionnez métier et grade</span>
                    ) : (sector === 'private' && (!selectedSecteurPrive || !selectedSousDomaine || !selectedMetierPrive || !selectedNiveauPrive)) ? (
                      <span className="text-center">⏳ Complétez tous les champs</span>
                    ) : (
                      <>
                        <Sparkles size={18} className="flex-shrink-0 animate-pulse" />
                        <span className="truncate">Découvrir mon salaire</span>
                        <ChevronDown className="rotate-[-90deg] group-hover:translate-x-1 transition-transform flex-shrink-0" size={18} />
                      </>
                    )}
                  </span>
                </button>

                <p className="flex flex-wrap items-center justify-center gap-1 text-xs text-center text-gray-500 sm:text-sm sm:gap-2">
                  <span 
                    className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                    style={{ backgroundColor: COLORS.teal.primary }}
                  />
                  <span>100% gratuit et anonyme • Résultat instantané</span>
                </p>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Sections BAHN */}
      <BAHNPromoSection />

      {/* Modal Grades */}
      <GradeExplanationModal 
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
      />

      {/* ========== FOOTER ========== */}
      <footer className="relative py-6 border-t bg-white/80 backdrop-blur-xl sm:py-8" style={{ borderColor: COLORS.teal.light }}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-3 text-center">
            <p className="text-sm font-medium text-gray-600 sm:text-base">
              © 2025 BAHN • Côte d'Ivoire 🇨🇮
            </p>
            <p className="text-xs text-gray-500">
              Ton conseiller IA pour toute ta carrière
            </p>
          </div>
        </div>
      </footer>

      {/* ========== ANIMATIONS CSS ========== */}
      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce-small {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-slide-in { animation: slide-in 0.5s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-bounce-small { animation: bounce-small 1s ease-in-out infinite; }
        .hover\\:scale-102:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
}