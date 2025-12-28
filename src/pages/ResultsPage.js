import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { incrementStat, getStats } from "../utils/mondjeStats";
import {
  TrendingUp,
  Building2,
  Landmark,
  CheckCircle2,
  Star,
  Sparkles,
  MessageCircle,
  Home,
  Share2,
} from "lucide-react";

import { calculerSalaire, getAvantagesSecteur } from "../utils/salaryCalculator";
import concours from "../data/concours.json";
import salairesPrives from "../data/salaires-secteur-prive.json";

import ViralCardModal from "../components/ViralCard";

function formatFCFA(n) {
  const v = Number(n) || 0;
  return v.toLocaleString("fr-FR") + " FCFA";
}

/** ✅ Messages selon niveau de salaire */
function getRandomMessageBySalary(avg) {
  const low = [
    "On va faire comme si on n'a rien vu 😭💸",
    "C'est pas un salaire, c'est un encouragement 😅",
    "Je vais négocier avec la foi seulement 🙏",
    "Même mon chargeur coûte plus cher 😭🔌",
    "Le transport va finir ça en 2 jours 🚶‍♂️💨",
    "On appelle ça salaire ou bien c'est mon argent de poche ? 🤔",
    "C'est pour mon loyer ou bien c'est pour acheter pain ? 🥖",
    "Seigneur, multiplie ça comme les pains et les poissons 🐟",
    "Mon banquier a supprimé mon numéro 📵😭",
    "Je vais manger à la maison jusqu'en 2028 🏠🍚",
    "Le riz gras sans viande est mon meilleur ami 🥘",
    "À ce prix-là, je travaille en mode avion ✈️",
    "Mon CV vaut mieux que ça, mais le ventre a faim 😫",
    "C'est un salaire de stagiaire qui a duré 😭",
    "Je vais demander crédit avant même de commencer 💳",
    "Même le mendiant va me donner jeton 🪙"
  ];

  const mid = [
    "Ça monte doucement… on pousse un peu la négociation 😎",
    "Là ça commence à respirer 😌",
    "Garba + jus… on tient le mois 😄",
    "Je peux au moins dire 'ça va' sans mentir 😅",
    "Le proprio ne va plus me chasser ce mois-ci 🏠🔑",
    "On quitte dans le bas de gamme, on arrive au milieu 📈",
    "Je peux enfin commander Alloco avec poisson 🐟",
    "Mon compte en banque a retrouvé le sourire 😊",
    "On n'est pas riche, mais on n'est plus maudit 🙏",
    "Je peux sortir au moins un samedi soir sans stresser 🕺",
    "C'est le début de la gloire, on continue de bosser 💼",
    "Le banquier a commencé à répondre à mes messages 📱",
    "Ça paye les factures et il reste un peu pour le 'au cas où' 💸",
    "On peut enfin parler de 'projets' 🏗️",
    "Je vais changer ma photo de profil, je brille un peu ✨",
    "C'est propre, mais on vise le sommet 🏔️",
    "On est dans le game maintenant 🎮"
  ];

  const high = [
    "Mon banquier me respecte maintenant 😭🔥",
    "À ce niveau, même le DG dit bonjour 😎",
    "C'est moi qui vais recruter maintenant 😂",
    "Je vais mettre 'Disponible' en mode 'Cher' 😤💼",
    "Le virement fait un bruit de moteur de Ferrari 🏎️💨",
    "Ma carte bancaire est devenue lourde dans ma poche 💳💎",
    "Je ne regarde plus le prix à gauche sur le menu 🥩🍷",
    "C'est le salaire de quelqu'un qui a déjà fini de souffrir 🥂",
    "Même mes ex reviennent me demander pardon 😭",
    "On appelle ça 'Argent de retraités heureux' 🏝️",
    "Le fisc commence à me surveiller, c'est bon signe 👮‍♂️",
    "Je vais acheter le quartier, restez là 🏗️🏢",
    "Mon nom est devenu doux dans l'oreille des gens 🎶",
    "Je ne marche plus, je plane ☁️🚀",
    "C'est le niveau où on paye la dot sans réfléchir 💍",
    "Le succès ne fait plus de bruit, il fait des virements 💰",
    "Si je travaille encore, c'est par passion hein ! 👑"
  ];

  if ((Number(avg) || 0) < 300000) return low[Math.floor(Math.random() * low.length)];
  if ((Number(avg) || 0) < 900000) return mid[Math.floor(Math.random() * mid.length)];
  return high[Math.floor(Math.random() * high.length)];
}

/** ✅ Données de parcours de carrière */
const parcoursCarriereData = {
  "inspecteur_impots": {
    formation_requise: {
      niveau: "BAC+5",
      diplomes: ["Master en Finance", "Master en Fiscalité", "Master en Comptabilité"],
      domaines: ["Finance", "Fiscalité", "Comptabilité"],
      ecoles_recommandees: [
        { nom: "ENSEA", ville: "Abidjan", type: "Publique", filiere: "Économie & Statistique" },
        { nom: "Université Félix Houphouët-Boigny", ville: "Abidjan", type: "Publique", filiere: "Sciences Économiques" },
        { nom: "PIGIER CI", ville: "Abidjan", type: "Privée", filiere: "Finance & Comptabilité" }
      ]
    },
    concours_acces: [{
      nom: "Concours ENSEA - Inspecteurs des Impôts",
      type: "Direct",
      periodicite: "Annuel",
      postes_moyens: 15,
      taux_reussite: "5%",
      epreuves: ["Économie", "Fiscalité", "Droit", "Culture générale"],
      preparation: ["Classes préparatoires ENSEA", "Révisions personnelles", "Stages pratiques"]
    }],
    evolution_carriere: {
      debut: { grade: "A1", salaire_moyen: 450000, annees_experience: "0-3 ans" },
      senior: { grade: "A4", salaire_moyen: 900000, annees_experience: "10+ ans" }
    },
    competences_requises: ["Fiscalité avancée", "Audit fiscal", "Droit des affaires", "Contrôle de gestion"]
  },
  "professeur": {
    formation_requise: {
      niveau: "BAC+5",
      diplomes: ["Master en Lettres", "Master en Mathématiques", "Master en Sciences"],
      domaines: ["Lettres", "Sciences", "Mathématiques"],
      ecoles_recommandees: [
        { nom: "ENS Abidjan", ville: "Abidjan", type: "Publique", filiere: "Formation enseignants" },
        { nom: "Université FHB", ville: "Abidjan", type: "Publique", filiere: "Lettres & Sciences" }
      ]
    },
    concours_acces: [{
      nom: "CAEM (Certificat d'Aptitude à l'Enseignement Moyen)",
      type: "Direct",
      periodicite: "Annuel",
      postes_moyens: 200,
      taux_reussite: "15%",
      epreuves: ["Discipline d'enseignement", "Pédagogie", "Culture générale"]
    }],
    evolution_carriere: {
      debut: { salaire_moyen: 400000, annees_experience: "0-5 ans" },
      senior: { salaire_moyen: 750000, annees_experience: "15+ ans" }
    },
    competences_requises: ["Maîtrise de la discipline", "Pédagogie", "Gestion de classe"]
  },
  "secretaire": {
    formation_requise: {
      niveau: "BAC+2 / BAC+3",
      diplomes: ["BTS Gestion", "DUT GEA", "Licence Pro Administration"],
      domaines: ["Gestion", "Administration", "Secrétariat"],
      ecoles_recommandees: [
        { nom: "ISTC Polytechnique", ville: "Abidjan", type: "Privée", filiere: "Secrétariat" },
        { nom: "INP-HB", ville: "Yamoussoukro", type: "Publique", filiere: "Génie Administratif" }
      ]
    },
    concours_acces: [{
      nom: "Concours Fonction Publique - Catégorie B",
      type: "Direct",
      periodicite: "Tous les 2 ans",
      postes_moyens: 50,
      taux_reussite: "12%",
      epreuves: ["Bureautique", "Correspondance", "Culture générale"]
    }],
    evolution_carriere: {
      debut: { salaire_moyen: 200000, annees_experience: "0-3 ans" },
      senior: { salaire_moyen: 450000, annees_experience: "10+ ans" }
    },
    competences_requises: ["Bureautique", "Correspondance", "Organisation", "Communication"]
  },
  "infirmier": {
    formation_requise: {
      niveau: "BAC+3",
      diplomes: ["Diplôme d'État d'Infirmier", "Licence Sciences Infirmières"],
      domaines: ["Santé", "Sciences Infirmières"],
      ecoles_recommandees: [
        { nom: "INFAS", ville: "Abidjan, Bouaké", type: "Publique", filiere: "Formation Infirmier" },
        { nom: "UFR Sciences Médicales", ville: "Abidjan", type: "Publique", filiere: "Sciences Infirmières" }
      ]
    },
    concours_acces: [{
      nom: "Concours d'entrée INFAS",
      type: "Formation initiale",
      periodicite: "Annuel",
      postes_moyens: 300,
      taux_reussite: "8%",
      epreuves: ["Biologie", "Mathématiques", "Culture générale", "Tests psychotechniques"]
    }],
    evolution_carriere: {
      debut: { salaire_moyen: 250000, annees_experience: "0-3 ans" },
      senior: { salaire_moyen: 550000, annees_experience: "10+ ans" }
    },
    competences_requises: ["Soins infirmiers", "Urgences", "Pharmacologie", "Empathie"]
  }
};

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const sector = state.sector;

  // ========== SECTEUR PUBLIC (INCHANGÉ) ==========
  const metierPublic = state.metier;
  const categoriePublic = state.categorie;
  const gradePublic = state.grade;

  // ========== SECTEUR PRIVÉ (CORRIGÉ POUR 4 NIVEAUX) ==========
  const secteurActivite = state.secteur_activite;  // ✅ Niveau 1
  const sousDomaine = state.sous_domaine;          // ✅ Niveau 2 (ajouté)
  const metierPriveKey = state.metier;             // ✅ Niveau 3
  const niveau = state.niveau;                     // ✅ Niveau 4

  const [animateStats, setAnimateStats] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);

  const [viralOpen, setViralOpen] = useState(false);
  const [viralMessage, setViralMessage] = useState("😄");

  const isPublic = sector === "public";
  const [globalStats, setGlobalStats] = useState({ visits: 0, estimations: 0, viralCards: 0 });

  // Validation et redirection
  useEffect(() => {
    if (!sector) return navigate("/", { replace: true });

    if (sector === "public" && (!categoriePublic || !gradePublic)) {
      return navigate("/", { replace: true });
    }

    if (sector === "private" && (!secteurActivite || !sousDomaine || !metierPriveKey || !niveau)) {
      console.warn('❌ Données manquantes pour le secteur privé:', {
        secteurActivite,
        sousDomaine,
        metierPriveKey,
        niveau
      });
      return navigate("/", { replace: true });
    }
  }, [sector, categoriePublic, gradePublic, secteurActivite, sousDomaine, metierPriveKey, niveau, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setAnimateStats(true), 300);
    
    incrementStat('visits').catch((error) => {
      console.error('❌ Impossible d\'incrémenter les visites:', error);
    });
    
    getStats().then(setGlobalStats).catch((error) => {
      console.error('❌ Impossible de récupérer les stats:', error);
    });
    
    return () => clearTimeout(t);
  }, []);

  // Animation d'analyse (INCHANGÉE)
  useEffect(() => {
    if (!isAnalyzing) return;

    const steps = [
      { duration: 600, message: "Analyse du secteur..." },
      { duration: 800, message: "Calcul des grilles salariales..." },
      { duration: 700, message: "Comparaison avec le marché..." },
      { duration: 600, message: "Génération des recommandations..." },
    ];

    let currentStep = 0;
    let progress = 0;

    const interval = setInterval(() => {
      progress += 2;
      setAnalysisProgress(progress);

      const stepIndex = Math.floor((progress / 100) * steps.length);
      if (stepIndex !== currentStep && stepIndex < steps.length) {
        currentStep = stepIndex;
        setAnalysisStep(stepIndex);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // ✅ Récupération du label du métier privé (CORRIGÉ pour 4 niveaux)
  const metierPriveLabel = useMemo(() => {
    if (sector !== 'private') return null;
    
    console.log('🔍 Récupération du métier privé:', {
      secteurActivite,
      sousDomaine,
      metierPriveKey
    });
    
    const titre = salairesPrives?.secteur_prive?.secteurs?.[secteurActivite]?.sous_domaines?.[sousDomaine]?.metiers?.[metierPriveKey]?.titre;
    
    if (!titre) {
      console.warn('❌ Métier non trouvé dans la structure JSON');
    }
    
    return titre || "Métier";
  }, [sector, secteurActivite, sousDomaine, metierPriveKey]);

  // ✅ Récupération du label du secteur (CORRIGÉ)
  const secteurLabel = useMemo(() => {
    if (sector !== 'private') return null;
    return salairesPrives?.secteur_prive?.secteurs?.[secteurActivite]?.nom || "Secteur privé";
  }, [sector, secteurActivite]);

  // Label du métier (public ou privé)
  const jobLabel = isPublic ? (metierPublic || "Métier") : metierPriveLabel;

  // ✅ Calcul du salaire (CORRIGÉ pour passer sous_domaine)
  const salaryResult = useMemo(() => {
    if (sector === "public") {
      return calculerSalaire({
        sector: "public",
        metier: metierPublic || "",
        categorie: categoriePublic,
        grade: gradePublic,
      });
    }

    if (sector === "private") {
      console.log('💰 Calcul du salaire pour:', {
        sector: "private",
        secteur_activite: secteurActivite,
        sous_domaine: sousDomaine,
        metier: metierPriveKey,
        niveau
      });
      
      return calculerSalaire({
        sector: "private",
        secteur_activite: secteurActivite,
        sous_domaine: sousDomaine,  // ✅ Ajouté
        metier: metierPriveKey,
        niveau,
      });
    }

    return { min: 200000, max: 600000, avg: 400000, categorie: "categorie_B", grade: "B1" };
  }, [sector, metierPublic, categoriePublic, gradePublic, secteurActivite, sousDomaine, metierPriveKey, niveau]);

  const minSalary = Number(salaryResult?.min) || 0;
  const maxSalary = Number(salaryResult?.max) || 0;
  const avgSalary = Number(salaryResult?.avg) || 0;

  const categorieInfo = String(salaryResult?.categorie || "categorie_B");
  const gradeInfo = String(salaryResult?.grade || (isPublic ? gradePublic : niveau));
  const grilleDetails = salaryResult?.grille || null;

  // Concours (INCHANGÉ)
  const competitions = useMemo(() => {
    const cat = categorieInfo.replace("categorie_", "");
    const key = `categorie_${cat.toUpperCase()}`;

    let listeConcours = concours?.concours_par_categorie?.[key] || [];
    const jobLower = String(jobLabel || "").toLowerCase();

    if (jobLower.includes("enseignant") || jobLower.includes("professeur") || jobLower.includes("instituteur")) {
      const concoursEduc = concours?.concours_education?.concours || [];
      listeConcours = [...listeConcours, ...concoursEduc.slice(0, 2)];
    }

    if (jobLower.includes("infirmier") || jobLower.includes("santé") || jobLower.includes("médecin")) {
      const concoursSante = concours?.concours_sante?.concours || [];
      listeConcours = [...listeConcours, ...concoursSante.slice(0, 2)];
    }

    return (listeConcours || []).slice(0, 6).map((c) => ({
      title: c.intitule || c.title || "Concours",
      deadline: c.deadline || "À venir",
      type: c.type || (sector === "public" ? "Fonction Publique" : "Secteur Privé"),
      positions: c.nombre_postes ? `${c.nombre_postes} postes` : (c.positions || "—"),
      level: c.diplome_requis || c.level || "Selon diplôme",
      icon: sector === "public" ? Landmark : Building2,
      description: c.description || `Concours ${c.intitule || c.title || ""}`,
      link: c.link || "#",
      status: c.status || "Inscriptions ouvertes",
    }));
  }, [categorieInfo, jobLabel, sector]);

  const benefits = useMemo(() => getAvantagesSecteur(sector), [sector]);

  const careerData = useMemo(() => {
    const metierLower = (jobLabel || "").toLowerCase();
    
    if (metierLower.includes("inspecteur") || metierLower.includes("impôts")) {
      return parcoursCarriereData.inspecteur_impots;
    }
    if (metierLower.includes("professeur") || metierLower.includes("enseignant")) {
      return parcoursCarriereData.professeur;
    }
    if (metierLower.includes("secrétaire") || metierLower.includes("secretaire")) {
      return parcoursCarriereData.secretaire;
    }
    if (metierLower.includes("infirmier")) {
      return parcoursCarriereData.infirmier;
    }
    
    return null;
  }, [jobLabel]);

  const AnimatedNumber = ({ value, duration = 1500, shouldAnimate }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!shouldAnimate) {
        setCount(0);
        return;
      }

      let start = 0;
      const end = Number(value) || 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value, duration, shouldAnimate]);

    return <span>{Number(count).toLocaleString("fr-FR")}</span>;
  };

  const openViral = () => {
    setViralMessage(getRandomMessageBySalary(avgSalary));
    setViralOpen(true);
    incrementStat("viralCards").catch((error) => {
      console.error("❌ Impossible d'incrémenter viralCards:", error);
    });
  };

  const addAnonymousSalary = () => {
    const raw = prompt("Quel est ton salaire réel mensuel ? (FCFA)");
    if (!raw) return;

    const cleaned = String(raw).replace(/[^\d]/g, "");
    const value = Number(cleaned);

    if (!value || value < 10000) {
      alert("Entre un montant valide en FCFA 🙏");
      return;
    }

    alert("Merci 🙏 Ton salaire a été ajouté anonymement (demo).");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 relative overflow-hidden">
      {/* Blobs décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-400/20 to-amber-500/20 rounded-full blur-3xl"></div>

      {/* 🔄 Écran d'analyse moderne (INCHANGÉ) */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 backdrop-blur-xl">
          <div className="max-w-md w-full px-6">
            {/* Logo Mondje animé */}
            <div className="flex justify-center mb-8">
  <div className="relative group">
    <div className="absolute inset-0  from-emerald-500 to-amber-500 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
    <div className="relative  rounded-3xl flex items-center justify-center  overflow-hidden px-16 py-10">
      <img 
        src="/monlogo.png" 
        alt="Mondje Logo" 
        className="h-24 w-auto object-contain"
      />
    </div>
  </div>
</div>

            {/* Titre */}
            <h2 className="text-3xl font-black text-center bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent mb-3">
              Analyse en cours
            </h2>
            <p className="text-center text-gray-600 mb-8 font-medium">
              {jobLabel} • {isPublic ? "Fonction Publique" : secteurLabel}
            </p>

            {/* Messages d'étapes */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl mb-6 border border-emerald-100/50">
              <div className="space-y-3">
                {[
                  { icon: "🔍", text: "Analyse du secteur..." },
                  { icon: "💰", text: "Calcul des grilles salariales..." },
                  { icon: "📊", text: "Comparaison avec le marché..." },
                  { icon: "✨", text: "Génération des recommandations..." },
                ].map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 transition-all duration-300 ${
                      index <= analysisStep
                        ? "opacity-100 scale-100"
                        : "opacity-40 scale-95"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        index < analysisStep
                          ? "bg-emerald-100 scale-100"
                          : index === analysisStep
                          ? "bg-gradient-to-br from-emerald-500 to-amber-500 scale-110"
                          : "bg-gray-100"
                      }`}
                    >
                      {index < analysisStep ? (
                        <span className="text-emerald-600 text-xl font-bold">✓</span>
                      ) : (
                        <span className="text-xl">{step.icon}</span>
                      )}
                    </div>
                    <p
                      className={`font-semibold transition-colors ${
                        index === analysisStep
                          ? "text-gray-900"
                          : index < analysisStep
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Barre de progression */}
            <div className="relative">
              <div className="h-3 bg-gray-200/80 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300 ease-out rounded-full relative"
                  style={{ width: `${analysisProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-3 font-bold">
                {analysisProgress}%
              </p>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">
              Préparation de ton estimation personnalisée...
            </p>
          </div>
        </div>
      )}

      {/* Header moderne (INCHANGÉ) */}
      <div className="relative bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-40 border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
               <img 
                src="/monlogo.png" 
                alt="Mondje - Estimation Salariale"
                className="h-12 sm:h-10 w-auto cursor-pointer hover:opacity-90 transition"
                onClick={() => navigate("/")}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate("/", { replace: true })}
                className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200/50 rounded-xl hover:shadow-md transition-all text-emerald-700 font-bold text-xs sm:text-sm"
              >
                <Home size={16} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Nouvelle</span>
              </button>

              <button
                onClick={openViral}
                className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-amber-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold text-xs sm:text-sm"
              >
                <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Partager</span>
              </button>
            </div>
          </div>

          {/* Stats badges */}
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-600 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-semibold">{globalStats.visits} visites</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="font-semibold">{globalStats.estimations} estimations</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="font-semibold">{globalStats.viralCards} cartes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Salary Card moderne (INCHANGÉE) */}
        <div
          className={`relative overflow-hidden rounded-3xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-10 lg:p-12 text-white border-2 transform hover:shadow-3xl transition-shadow duration-500 ${
            isPublic
              ? "bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-600 border-emerald-400/50"
              : "bg-gradient-to-br from-amber-600 via-amber-500 to-orange-600 border-amber-400/50"
          }`}
        >
          {/* Blobs décoratifs */}
          <div className="absolute top-0 right-0 w-80 h-80 sm:w-96 sm:h-96 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-64 sm:h-64 bg-white/5 rounded-full -ml-28 -mb-28 blur-3xl"></div>

          <div className="relative z-10 space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${isPublic ? 'bg-emerald-500/30' : 'bg-amber-500/30'} backdrop-blur-sm border border-white/20`}>
                  {isPublic ? <Landmark size={32} /> : <Building2 size={32} />}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black">
                    Ton estimation
                  </h2>
                  <p className="text-white/90 text-xs sm:text-sm font-medium mt-1">
                    {isPublic ? "🏛️ Fonction Publique" : `🏢 ${secteurLabel}`} • Côte d'Ivoire 🇨🇮
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Star className="text-yellow-300 fill-yellow-300" size={16} />
                <span className="text-sm font-bold">Vérifié</span>
              </div>
            </div>

            {/* Main content */}
            <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
              {/* Salary info */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/30">
                <div className="mb-5">
                  <p className="text-sm text-white/90 mb-2 font-medium">
                    💼 <span className="font-bold text-white">{jobLabel}</span>
                  </p>
                  <p className="text-sm text-white/90 font-medium">
                    📌 {isPublic ? `Grade ${gradePublic}` : `Niveau ${niveau}`}
                  </p>
                </div>

                <div className="border-t border-white/30 pt-5">
                  <p className="text-sm text-white/95 mb-4 font-semibold">💰 Salaire mensuel estimé</p>
                  <div className="flex items-baseline gap-3 mb-2">
                    <p className="text-4xl sm:text-5xl lg:text-6xl font-black">
                      <AnimatedNumber value={Math.round(minSalary / 1000)} shouldAnimate={animateStats} />K
                    </p>
                    <span className="text-2xl sm:text-3xl font-black">-</span>
                    <p className="text-4xl sm:text-5xl lg:text-6xl font-black">
                      <AnimatedNumber value={Math.round(maxSalary / 1000)} shouldAnimate={animateStats} />K
                    </p>
                  </div>
                  <p className="text-white/90 text-base sm:text-lg font-medium">FCFA / mois</p>
                  <p className="text-white/80 text-xs sm:text-sm mt-3 font-medium">
                    Moyenne: <span className="font-bold text-white">{formatFCFA(avgSalary)}</span>
                  </p>
                </div>
              </div>

              {/* Stats cards */}
              <div className="space-y-4">
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/30 hover:bg-white/20 transition-all">
                  <p className="text-xs text-white/80 mb-2 font-medium">Salaire moyen</p>
                  <p className="text-3xl sm:text-4xl font-black">
                    <AnimatedNumber value={Math.round(avgSalary / 1000)} shouldAnimate={animateStats} />K FCFA
                  </p>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/30 hover:bg-white/20 transition-all">
                  <p className="text-xs text-white/80 mb-2 font-medium">Salaire annuel brut</p>
                  <p className="text-3xl sm:text-4xl font-black">
                    <AnimatedNumber value={Math.round((avgSalary * 12) / 1000)} shouldAnimate={animateStats} />K FCFA
                  </p>
                </div>
              </div>
            </div>


            {/* Benefits */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/30">
              <h3 className="font-black mb-4 flex items-center gap-2 text-lg">
                <TrendingUp size={20} />
                Avantages du {isPublic ? "secteur public" : "secteur privé"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/95 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <CheckCircle2 size={16} className="text-white flex-shrink-0" />
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phrase du jour */}
            <div className="bg-black/20 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-xs text-white/90 mb-2 font-semibold">🎭 Phrase du jour</div>
              <div className="text-base sm:text-lg font-bold">
                "{getRandomMessageBySalary(avgSalary)}"
              </div>
            </div>
          </div>
        </div>



        {/* CTA moderne (INCHANGÉ) */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white relative overflow-hidden border border-emerald-500/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-amber-500 p-5 rounded-2xl shadow-2xl flex-shrink-0">
              <MessageCircle size={40} className="text-white" />
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold mb-4">
                <Sparkles size={12} />
                Propulsé par l'IA
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight">
                Mondje, mon estimateur de salaire en Côte d'Ivoire
              </h3>

              <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed font-medium">
                Estime, compare, et prépare tes négociations de salaire.
              </p>

              <button
                onClick={openViral}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/15 transition-all hover:scale-105"
              >
                🎨 Faire ma carte virale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ViralCardModal
        open={viralOpen}
        onClose={() => setViralOpen(false)}
        jobLabel={jobLabel}
        sectorLabel={isPublic ? "Fonction Publique" : secteurLabel}
        gradeLabel={isPublic ? `Grade ${gradePublic}` : `Niveau ${niveau}`}
        minSalary={minSalary}
        maxSalary={maxSalary}
        message={viralMessage}
        onRandomizeMessage={() => setViralMessage(getRandomMessageBySalary(avgSalary))}
      />

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}