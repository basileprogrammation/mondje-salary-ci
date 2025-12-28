import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, Building2, X, Sparkles, TrendingUp, Info, GraduationCap, ChevronDown } from 'lucide-react';
import { incrementStat } from '../utils/mondjeStats';

import CustomSelect from '../components/Customselect.js';
import salairesPriveData from '../data/salaires-secteur-prive.json';
import corpsMetiersData from '../data/corps-metiers.json';

// Composant d'explication des grades (inchangé)
const GradeExplanation = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    {
      id: 'D',
      nom: 'Catégorie D',
      color: 'purple',
      description: 'Fonctions d\'exécution',
      grades: 'D1 → D3',
      diplome: 'CEPE ou sans diplôme',
      salaire: '170K - 280K FCFA',
      exemples: ['Agent de bureau', 'Chauffeur', 'Planton', 'Gardien'],
      details: 'Personnel d\'exécution de base. Postes accessibles sans diplôme ou avec le certificat d\'études primaires.',
    },
    {
      id: 'C',
      nom: 'Catégorie C',
      color: 'blue',
      description: 'Application et soutien',
      grades: 'C1 → C3',
      diplome: 'BEPC, CAP, BEP',
      salaire: '180K - 330K FCFA',
      exemples: ['Agent administratif', 'Aide-soignant', 'Secrétaire', 'Technicien'],
      details: 'Agents d\'application qualifiés. Accessible avec un diplôme du collège ou une formation technique de base.',
    },
    {
      id: 'B',
      nom: 'Catégorie B',
      color: 'amber',
      description: 'Encadrement intermédiaire',
      grades: 'B1 → B3',
      diplome: 'BAC à BAC+2 (BTS, DUT)',
      salaire: '200K - 420K FCFA',
      exemples: ['Instituteur (CAFOP)', 'Infirmier', 'Technicien supérieur', 'Contrôleur'],
      details: 'Agents de maîtrise et d\'encadrement intermédiaire. Niveau BAC ou formations spécialisées (CAFOP, INFAS).',
    },
    {
      id: 'A',
      nom: 'Catégorie A',
      color: 'emerald',
      description: 'Cadres supérieurs',
      grades: 'A1 → A7',
      diplome: 'BAC+3 minimum (Master, Doctorat)',
      salaire: '247K - 750K FCFA',
      exemples: ['Professeur de lycée', 'Médecin', 'Ingénieur', 'Magistrat'],
      details: 'Cadres de conception et de direction. Fonctions supérieures nécessitant un niveau universitaire avancé.',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        hoverBorder: 'hover:border-purple-400',
        text: 'text-purple-700',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-700',
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600',
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        hoverBorder: 'hover:border-blue-400',
        text: 'text-blue-700',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-700',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600',
      },
      amber: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        hoverBorder: 'hover:border-amber-400',
        text: 'text-amber-700',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-700',
        iconBg: 'bg-amber-100',
        iconText: 'text-amber-600',
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        hoverBorder: 'hover:border-emerald-400',
        text: 'text-emerald-700',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-700',
        iconBg: 'bg-emerald-100',
        iconText: 'text-emerald-600',
      },
    };
    return colors[color];
  };

  return (
    <div className="mt-12 bg-white/90 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl border-2 border-blue-100/50 p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
          <Info className="text-white" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
            C'est quoi les grades ?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Comprends le système de la fonction publique
          </p>
        </div>
      </div>

      {/* Explication simple */}
      <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-6 sm:mb-8 border border-blue-200/50">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="text-3xl sm:text-4xl flex-shrink-0">🎓</div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 font-semibold mb-2 text-sm sm:text-base">
              À la fonction publique, <span className="text-emerald-600 font-black">le grade</span> est ton niveau administratif officiel.
            </p>
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
              👉 Ton <span className="font-bold">diplôme</span> détermine ton <span className="font-bold">grade</span> → 
              Ton grade détermine ton <span className="font-bold">indice</span> → 
              Ton indice détermine ton <span className="font-bold">salaire</span>
            </p>
          </div>
        </div>
      </div>

      {/* Formule */}
      <div className="bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap size={24} />
          <h3 className="font-black text-lg sm:text-xl">Formule du salaire</h3>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <p className="text-xl sm:text-2xl font-black mb-2">
            Salaire = Indice × 233,457 FCFA
          </p>
          <p className="text-sm font-medium text-white/90">
            + Primes et indemnités selon le métier
          </p>
        </div>
      </div>

      {/* Les 4 catégories */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const colors = getColorClasses(cat.color);
          const isExpanded = expandedCategory === cat.id;

          return (
            <div
              key={cat.id}
              className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 ${colors.border} ${colors.hoverBorder} hover:shadow-xl transition-all cursor-pointer`}
              onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-xl sm:text-2xl font-black ${colors.iconText}`}>
                      {cat.id}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-gray-900 text-base sm:text-lg leading-tight">
                      {cat.nom}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className={`${colors.badgeBg} ${colors.badgeText} px-2 sm:px-3 py-1 rounded-full text-xs font-bold`}>
                    {cat.grades}
                  </span>
                  <ChevronDown 
                    className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    size={20} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className={`${colors.bg} rounded-xl p-3`}>
                  <p className="text-xs text-gray-600 mb-1 font-medium">📚 Diplôme requis</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">
                    {cat.diplome}
                  </p>
                </div>
                <div className={`${colors.bg} rounded-xl p-3`}>
                  <p className="text-xs text-gray-600 mb-1 font-medium">💰 Salaire estimé</p>
                  <p className={`font-bold ${colors.text} text-xs sm:text-sm`}>
                    {cat.salaire}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-2">
                  Exemples de métiers :
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.exemples.map((metier, idx) => (
                    <span
                      key={idx}
                      className={`text-xs ${colors.badgeBg} ${colors.badgeText} px-3 py-1 rounded-full font-semibold`}
                    >
                      {metier}
                    </span>
                  ))}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-in">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {cat.details}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200">
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          <span className="font-bold text-gray-900">💡 Bon à savoir :</span> Plus le grade est élevé, 
          plus l'indice et le salaire sont élevés. L'évolution se fait par ancienneté (échelons) 
          ou par concours interne (changement de grade).
        </p>
      </div>
    </div>
  );
};

export default function EstimatorPage() {
  const navigate = useNavigate();

  // États communs
  const [sector, setSector] = useState('');

  // États PUBLIC (recherche + sélection)
  const [searchMetierPublic, setSearchMetierPublic] = useState('');
  const [categoriePublic, setCategoriePublic] = useState('');
  const [gradePublic, setGradePublic] = useState('');
  const [showSuggestionsPublic, setShowSuggestionsPublic] = useState(false);

  // États PRIVÉ (CustomSelect - structure à 4 niveaux)
  const [selectedSecteurPrive, setSelectedSecteurPrive] = useState('');
  const [selectedSousDomaine, setSelectedSousDomaine] = useState('');
  const [selectedMetierPrive, setSelectedMetierPrive] = useState('');
  const [selectedNiveauPrive, setSelectedNiveauPrive] = useState('');

  useEffect(() => {
    const onClick = () => {
      setShowSuggestionsPublic(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  // ========== SECTEUR PUBLIC ==========
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
    return corpsMetiersData?.categories?.[categoriePublic]?.grades || [];
  }, [categoriePublic]);

  // ========== SECTEUR PRIVÉ (STRUCTURE À 4 NIVEAUX) ==========
  
  // Niveau 1: Liste des secteurs
  const secteursPriveList = useMemo(() => {
    const secteurs = salairesPriveData?.secteur_prive?.secteurs || {};
    const list = Object.entries(secteurs)
      .map(([key, data]) => ({
        key,
        nom: data.nom
      }))
      .sort((a, b) => a.nom.localeCompare(b.nom));
    
    console.log('🔵 Secteurs disponibles:', list.length, list.map(s => s.nom));
    return list;
  }, []);

  // Niveau 2: Liste des sous-domaines (filtrée par secteur sélectionné)
  const sousDomainesPriveList = useMemo(() => {
    if (!selectedSecteurPrive) return [];
    
    const secteur = salairesPriveData?.secteur_prive?.secteurs?.[selectedSecteurPrive];
    console.log('🔍 Secteur sélectionné:', selectedSecteurPrive);
    console.log('📦 Données du secteur:', secteur);
    
    if (!secteur?.sous_domaines) {
      console.warn('❌ Pas de sous_domaines trouvés pour le secteur:', selectedSecteurPrive);
      console.log('🔑 Clés disponibles dans secteur:', Object.keys(secteur || {}));
      return [];
    }
    
    const sousDomaines = Object.entries(secteur.sous_domaines)
      .map(([key, data]) => ({
        key,
        nom: data.nom
      }))
      .sort((a, b) => a.nom.localeCompare(b.nom));
    
    console.log('✅ Sous-domaines trouvés:', sousDomaines.length, sousDomaines);
    return sousDomaines;
  }, [selectedSecteurPrive]);

  // Niveau 3: Liste des métiers (filtrée par secteur + sous-domaine)
  const metiersPriveList = useMemo(() => {
    if (!selectedSecteurPrive || !selectedSousDomaine) return [];
    
    const sousDomaine = salairesPriveData?.secteur_prive?.secteurs?.[selectedSecteurPrive]?.sous_domaines?.[selectedSousDomaine];
    console.log('🔍 Sous-domaine sélectionné:', selectedSousDomaine);
    console.log('📦 Données du sous-domaine:', sousDomaine);
    
    if (!sousDomaine?.metiers) {
      console.warn('❌ Pas de métiers trouvés');
      console.log('🔑 Clés disponibles dans sous-domaine:', Object.keys(sousDomaine || {}));
      return [];
    }
    
    const metiers = Object.entries(sousDomaine.metiers)
      .map(([key, data]) => ({
        key,
        titre: data.titre
      }))
      .sort((a, b) => a.titre.localeCompare(b.titre));
    
    console.log('✅ Métiers trouvés:', metiers.length, metiers.map(m => m.titre));
    return metiers;
  }, [selectedSecteurPrive, selectedSousDomaine]);

  // Niveau 4: Liste des niveaux (filtrée par secteur + sous-domaine + métier)
  const niveauxPriveList = useMemo(() => {
    if (!selectedSecteurPrive || !selectedSousDomaine || !selectedMetierPrive) return [];
    
    const metier = salairesPriveData?.secteur_prive?.secteurs?.[selectedSecteurPrive]?.sous_domaines?.[selectedSousDomaine]?.metiers?.[selectedMetierPrive];
    
    if (!metier?.niveaux) {
      console.warn('❌ Pas de niveaux trouvés');
      return [];
    }
    
    const niveaux = Object.entries(metier.niveaux).map(([key, data]) => ({
      key,
      experience: data.experience
    }));
    
    console.log('✅ Niveaux trouvés:', niveaux);
    return niveaux;
  }, [selectedSecteurPrive, selectedSousDomaine, selectedMetierPrive]);

  // ✅ Préparer les options pour CustomSelect
  const secteursOptions = useMemo(() => {
    return secteursPriveList.map(secteur => ({
      value: secteur.key,
      label: secteur.nom
    }));
  }, [secteursPriveList]);

  const sousDomainesOptions = useMemo(() => {
    return sousDomainesPriveList.map(sd => ({
      value: sd.key,
      label: sd.nom
    }));
  }, [sousDomainesPriveList]);

  const metiersOptions = useMemo(() => {
    return metiersPriveList.map(metier => ({
      value: metier.key,
      label: metier.titre
    }));
  }, [metiersPriveList]);

  // Gestion du reset en cascade pour le secteur privé
  const handleSecteurPriveChange = (value) => {
    console.log('📌 Secteur sélectionné:', value);
    setSelectedSecteurPrive(value);
    setSelectedSousDomaine('');
    setSelectedMetierPrive('');
    setSelectedNiveauPrive('');
  };

  const handleSousDomaineChange = (value) => {
    console.log('📌 Sous-domaine sélectionné:', value);
    setSelectedSousDomaine(value);
    setSelectedMetierPrive('');
    setSelectedNiveauPrive('');
  };

  const handleMetierPriveChange = (value) => {
    console.log('📌 Métier sélectionné:', value);
    setSelectedMetierPrive(value);
    setSelectedNiveauPrive('');
  };

  const handleResetSector = () => {
    setSector('');
    // Reset PUBLIC
    setSearchMetierPublic('');
    setCategoriePublic('');
    setGradePublic('');
    setShowSuggestionsPublic(false);
    // Reset PRIVÉ
    setSelectedSecteurPrive('');
    setSelectedSousDomaine('');
    setSelectedMetierPrive('');
    setSelectedNiveauPrive('');
  };

  const handleSelectMetierPublic = (metier) => {
    setSearchMetierPublic(metier.nom);
    setCategoriePublic(metier.categorieKey);
    setShowSuggestionsPublic(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    incrementStat('estimations').catch((error) => {
      console.error('❌ Erreur incrémentation estimations:', error);
    });

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
      
      console.log('🚀 Navigation vers /results avec:', {
        sector: 'private',
        secteur_activite: selectedSecteurPrive,
        sous_domaine: selectedSousDomaine,
        metier: selectedMetierPrive,
        niveau: selectedNiveauPrive
      });
      
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-400/20 to-amber-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-xl shadow-sm border-b border-emerald-100/50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <img 
                src="/monlogo.png" 
                alt="Mondje - Estimation Salariale"
                className="h-12 sm:h-10 w-auto cursor-pointer hover:opacity-90 transition"
                onClick={() => navigate("/")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16 overflow-x-hidden">
        <div className="w-full max-w-4xl overflow-x-hidden">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 space-y-4 sm:space-y-6 animate-fade-in">
            <div className="sm:hidden inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200/50 rounded-full mx-auto">
              <Sparkles className="text-emerald-600" size={14} />
              <span className="text-xs font-semibold text-emerald-700">Propulsé par l'IA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
              Découvrez votre{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-600 bg-clip-text text-transparent">
                  potentiel
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-emerald-200 to-amber-200 -z-0 transform -rotate-1"></span>
              </span>
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Estimez votre salaire en Côte d'Ivoire 🇨🇮 en quelques clics et comparez-vous au marché
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100">
                <TrendingUp className="text-emerald-600" size={16} />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Gratuit</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">🔒 100% Anonyme</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">⚡ Instantané</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl border border-emerald-100/50 p-4 sm:p-6 lg:p-12 space-y-6 sm:space-y-8 lg:space-y-10 transform hover:shadow-3xl transition-shadow duration-500 overflow-x-hidden"
          >
            {/* Choix secteur */}
            {!sector && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Choisissez votre secteur
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Public ou privé ? Commencez par là
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Fonction Publique */}
                  <button
                    type="button"
                    onClick={() => setSector('public')}
                    className="group relative overflow-hidden flex flex-col items-center gap-5 p-8 sm:p-10 border-2 border-emerald-200/50 rounded-3xl transition-all hover:border-emerald-400 hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-emerald-50/50 to-white active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative text-6xl sm:text-7xl transform group-hover:scale-110 transition-transform">
                      🏛️
                    </div>
                    
                    <div className="relative text-center space-y-2">
                      <p className="font-black text-xl sm:text-2xl text-gray-900">
                        Fonction Publique
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        État, Collectivités,<br/>Établissements publics
                      </p>
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <ChevronDown className="text-white rotate-[-90deg]" size={16} />
                      </div>
                    </div>
                  </button>

                  {/* Secteur Privé */}
                  <button
                    type="button"
                    onClick={() => setSector('private')}
                    className="group relative overflow-hidden flex flex-col items-center gap-5 p-8 sm:p-10 border-2 border-amber-200/50 rounded-3xl transition-all hover:border-amber-400 hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-amber-50/50 to-white active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative text-6xl sm:text-7xl transform group-hover:scale-110 transition-transform">
                      🏢
                    </div>
                    
                    <div className="relative text-center space-y-2">
                      <p className="font-black text-xl sm:text-2xl text-gray-900">
                        Secteur Privé
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Entreprises, ONG,<br/>Organisations
                      </p>
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                        <ChevronDown className="text-white rotate-[-90deg]" size={16} />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* PUBLIC (inchangé) */}
            {sector === 'public' && (
              <div className="space-y-6 sm:space-y-8 animate-slide-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetSector}
                    className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 rounded-xl hover:shadow-md transition-all border border-emerald-200/50"
                  >
                    <Building2 size={18} className="group-hover:rotate-12 transition-transform" />
                    <span className="font-bold text-sm">Fonction Publique</span>
                    <X size={16} className="opacity-60 group-hover:opacity-100" />
                  </button>
                </div>

                <div className="relative space-y-3">
                  <label className="block">
                    <span className="inline-flex items-center gap-3 text-gray-900 font-bold text-base sm:text-lg mb-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-black shadow-lg">
                        1
                      </span>
                      Recherchez votre métier
                    </span>
                  </label>

                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors z-10" size={20} />
                    
                    <input
                      type="text"
                      value={searchMetierPublic}
                      onChange={(e) => {
                        setSearchMetierPublic(e.target.value);
                        setShowSuggestionsPublic(true);
                      }}
                      onFocus={() => setShowSuggestionsPublic(true)}
                      placeholder="Ex: Ingénieur, Professeur, Infirmier..."
                      className="w-full pl-14 pr-6 py-4 sm:py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-base sm:text-lg bg-white/80 backdrop-blur-sm placeholder:text-gray-400"
                    />

                    {showSuggestionsPublic && suggestionsMetiersPublic.length > 0 && (
                      <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-xl border-2 border-emerald-100 rounded-2xl shadow-2xl max-h-80 overflow-y-auto animate-slide-down">
                        {suggestionsMetiersPublic.map((metier, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectMetierPublic(metier)}
                            className="w-full px-5 py-4 text-left hover:bg-emerald-50 border-b border-gray-100 last:border-b-0 transition-all group"
                          >
                            <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                              {metier.nom}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {metier.domaine} • {metier.categorie}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {categoriePublic && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl w-fit">
                      <span className="text-emerald-600 font-black text-sm">✓</span>
                      <span className="text-sm font-semibold text-emerald-700">
                        {corpsMetiersData?.categories?.[categoriePublic]?.nom}
                      </span>
                    </div>
                  )}
                </div>

                {categoriePublic && (
                  <div className="space-y-3 animate-slide-in">
                    <label className="block">
                      <span className="inline-flex items-center gap-3 text-gray-900 font-bold text-base sm:text-lg mb-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl text-sm font-black shadow-lg">
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
                        className="w-full px-6 py-4 sm:py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 appearance-none bg-white/80 backdrop-blur-sm transition-all text-base sm:text-lg font-medium cursor-pointer"
                      >
                        <option value="">Choisissez votre grade...</option>
                        {gradesPublic.map((g) => (
                          <option key={g} value={g}>Grade {g}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PRIVÉ - VERSION CUSTOMSELECT ✅ */}
            {sector === 'private' && (
              <div className="space-y-6 sm:space-y-8 animate-slide-in">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetSector}
                    className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 rounded-xl hover:shadow-md transition-all border border-amber-200/50"
                  >
                    <Briefcase size={18} className="group-hover:rotate-12 transition-transform" />
                    <span className="font-bold text-sm">Secteur Privé</span>
                    <X size={16} className="opacity-60 group-hover:opacity-100" />
                  </button>
                </div>

                {/* 1. Secteur - CustomSelect */}
                <CustomSelect
                  value={selectedSecteurPrive}
                  onChange={handleSecteurPriveChange}
                  options={secteursOptions}
                  placeholder="Choisissez un secteur..."
                  label="Secteur d'activité"
                  badgeNumber="1"
                  badgeColor="amber"
                />

                {/* 2. Sous-domaine - CustomSelect */}
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

                {/* 3. Métier - CustomSelect */}
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

                {/* 4. Niveau d'expérience - Radio Buttons (INCHANGÉ) */}
                {selectedMetierPrive && niveauxPriveList.length > 0 && (
                  <div className="space-y-4 animate-slide-in">
                    <label className="block">
                      <span className="inline-flex items-center gap-2 sm:gap-3 text-gray-900 font-bold text-sm sm:text-base lg:text-lg mb-4">
                        <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg flex-shrink-0">
                          4
                        </span>
                        <span className="leading-tight">Niveau d'expérience</span>
                      </span>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                      {niveauxPriveList.map((niv) => {
                        const isSelected = selectedNiveauPrive === niv.key;

                        return (
                          <label
                            key={niv.key}
                            className={`relative flex flex-col items-center p-4 sm:p-5 lg:p-6 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all group ${
                              isSelected
                                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl scale-105'
                                : 'border-gray-200 bg-white/80 hover:border-purple-300 hover:shadow-lg hover:scale-102'
                            }`}
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
                            
                            <p className={`font-black text-sm sm:text-base lg:text-lg capitalize mb-1 ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>
                              {niv.key}
                            </p>
                            
                            <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                              {niv.experience}
                            </p>

                            {isSelected && (
                              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
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

                {/* Message si pas de sous-domaines */}
                {selectedSecteurPrive && sousDomainesOptions.length === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center animate-slide-in">
                    <p className="text-amber-700 font-semibold text-sm sm:text-base">
                      ⚠️ Aucun sous-domaine disponible
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Vérifiez la structure de vos données
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            {sector && (
              <div className="space-y-4 pt-4 animate-slide-in">
                <button
                  type="submit"
                  disabled={
                    (sector === 'public' && (!categoriePublic || !gradePublic)) ||
                    (sector === 'private' && (!selectedSecteurPrive || !selectedSousDomaine || !selectedMetierPrive || !selectedNiveauPrive))
                  }
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-600 text-white font-black py-4 sm:py-5 lg:py-6 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  
                  <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                    {(sector === 'public' && (!categoriePublic || !gradePublic)) ? (
                      <span className="text-center">⏳ Sélectionnez métier et grade</span>
                    ) : (sector === 'private' && (!selectedSecteurPrive || !selectedSousDomaine || !selectedMetierPrive || !selectedNiveauPrive)) ? (
                      <span className="text-center">⏳ Complétez tous les champs</span>
                    ) : (
                      <>
                        <Sparkles size={18} className="animate-pulse flex-shrink-0" />
                        <span className="truncate">Découvrir mon salaire</span>
                        <ChevronDown className="rotate-[-90deg] group-hover:translate-x-1 transition-transform flex-shrink-0" size={18} />
                      </>
                    )}
                  </span>
                </button>

                <p className="text-xs sm:text-sm text-center text-gray-500 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></span>
                  <span>100% gratuit et anonyme • Résultat instantané</span>
                </p>
              </div>
            )}
          </form>

          <GradeExplanation />
        </div>
      </div>

      {/* Footer */}
      <div className="relative bg-white/80 backdrop-blur-xl border-t border-emerald-100/50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3">
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              © 2025 Mondje • Côte d'Ivoire 🇨🇮
            </p>
            <p className="text-xs text-gray-500">
              Données actualisées • Estimation basée sur le marché ivoirien
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce-small {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-bounce-small {
          animation: bounce-small 1s ease-in-out infinite;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}