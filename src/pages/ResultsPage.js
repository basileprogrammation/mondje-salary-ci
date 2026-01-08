// src/pages/ResultsPage.jsx
// ✅ VERSION MODIFIÉE : Gère l'affichage BASE vs AVEC PRIMES

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { incrementStat, getStats } from "../utils/mondjeStats";
import BAHNPromoSection from '../components/BAHNPromoSection';           
import GradeExplanationModal from '../components/GradeExplanationModal';
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
  X,
  Info,
} from "lucide-react";

import { calculerSalaire, getAvantagesSecteur } from "../utils/salaryCalculator";
import concours from "../data/concours.json";
import salairesPrives from "../data/salaires-secteur-prive.json";

import ViralCardModal from "../components/ViralCard";

// ========== PALETTE DE COULEURS BAHN ==========
const COLORS = {
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
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    600: '#4B5563',
    700: '#374151',
    900: '#111827',
  },
};

function formatFCFA(n) {
  const v = Number(n) || 0;
  return v.toLocaleString("fr-FR") + " FCFA";
}

/** Messages selon niveau de salaire */
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

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const sector = state.sector;

  // États SECTEUR PUBLIC
  const metierPublic = state.metier;
  const categoriePublic = state.categorie;
  const gradePublic = state.grade;
  const typeSalaire = state.typeSalaire || 'base'; // ✅ NOUVEAU : 'avec_primes' ou 'base'

  // États SECTEUR PRIVÉ
  const secteurActivite = state.secteur_activite;
  const sousDomaine = state.sous_domaine;
  const metierPriveKey = state.metier;
  const niveau = state.niveau;

  const [animateStats, setAnimateStats] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [viralOpen, setViralOpen] = useState(false);
  const [viralMessage, setViralMessage] = useState("😄");
  const [showGradeModal, setShowGradeModal] = useState(false);
  const isPublic = sector === "public";
  const [globalStats, setGlobalStats] = useState({ visits: 0, estimations: 0, uniqueVisitors: 0, viralCards: 0 });
  const [showToast, setShowToast] = useState(false); 
  
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

  // Animation d'analyse
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

  useEffect(() => {
    if (!isAnalyzing) {
      const timer = setTimeout(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 6000);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing]);

  // Récupération du label du métier privé
  const metierPriveLabel = useMemo(() => {
    if (sector !== 'private') return null;
    const titre = salairesPrives?.secteur_prive?.secteurs?.[secteurActivite]?.sous_domaines?.[sousDomaine]?.metiers?.[metierPriveKey]?.titre;
    return titre || "Métier";
  }, [sector, secteurActivite, sousDomaine, metierPriveKey]);

  // Récupération du label du secteur
  const secteurLabel = useMemo(() => {
    if (sector !== 'private') return null;
    return salairesPrives?.secteur_prive?.secteurs?.[secteurActivite]?.nom || "Secteur privé";
  }, [sector, secteurActivite]);

  const jobLabel = isPublic ? (metierPublic || "Métier") : metierPriveLabel;

  // ✅ NOUVEAU : Calcul du salaire avec typeSalaire
  const salaryResult = useMemo(() => {
    if (sector === "public") {
      return calculerSalaire({
        sector: "public",
        metier: metierPublic || "",
        categorie: categoriePublic,
        grade: gradePublic,
        typeSalaire: typeSalaire, // ✅ NOUVEAU : Passer le type de salaire
      });
    }

    if (sector === "private") {
      return calculerSalaire({
        sector: "private",
        secteur_activite: secteurActivite,
        sous_domaine: sousDomaine,
        metier: metierPriveKey,
        niveau,
      });
    }

    return { min: 200000, max: 600000, avg: 400000, categorie: "categorie_B", grade: "B1" };
  }, [sector, metierPublic, categoriePublic, gradePublic, secteurActivite, sousDomaine, metierPriveKey, niveau, typeSalaire]);

  const minSalary = Number(salaryResult?.min) || 0;
  const maxSalary = Number(salaryResult?.max) || 0;
  const avgSalary = Number(salaryResult?.avg) || 0;

  const categorieInfo = String(salaryResult?.categorie || "categorie_B");
  const gradeInfo = String(salaryResult?.grade || (isPublic ? gradePublic : niveau));

  // Concours
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

  const benefits = useMemo(() => {
    return getAvantagesSecteur(sector, jobLabel, gradeInfo);
  }, [sector, jobLabel, gradeInfo]);

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

      {/* ========== ÉCRAN D'ANALYSE ========== */}
      {isAnalyzing && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, #E6F5F5 0%, #FFFFFF 50%, #FEF9E6 100%)' }}
        >
          <div className="w-full max-w-md px-6">
            {/* Logo BAHN animé */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div 
                  className="absolute inset-0 opacity-75 rounded-3xl blur-xl animate-pulse"
                  style={{ background: `linear-gradient(135deg, ${COLORS.teal.primary}, ${COLORS.gold.primary})` }}
                />
                <div className="relative flex items-center justify-center px-16 py-10 overflow-hidden rounded-3xl">
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex items-center justify-center w-16 h-16 shadow-2xl rounded-2xl"
                      style={{ backgroundColor: COLORS.gold.primary }}
                    >
                      <span 
                        className="text-3xl font-black"
                        style={{ color: COLORS.teal.dark }}
                      >
                        B
                      </span>
                    </div>
                    <div 
                      className="text-4xl font-black"
                      style={{ color: COLORS.teal.dark }}
                    >
                      BAHN
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Titre */}
            <h2 
              className="mb-3 text-3xl font-black text-center"
              style={{ 
                background: `linear-gradient(to right, ${COLORS.teal.primary}, ${COLORS.gold.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Analyse en cours
            </h2>
            <p className="mb-8 font-medium text-center text-gray-600">
              {jobLabel} • {isPublic ? "Fonction Publique" : secteurLabel}
            </p>

            {/* Messages d'étapes */}
            <div 
              className="p-6 mb-6 border shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl"
              style={{ borderColor: COLORS.teal.light }}
            >
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
                          ? "scale-100"
                          : index === analysisStep
                          ? "scale-110"
                          : ""
                      }`}
                      style={{
                        backgroundColor: index < analysisStep 
                          ? COLORS.teal.light 
                          : index === analysisStep
                          ? COLORS.teal.primary
                          : COLORS.gray[100],
                        background: index === analysisStep
                          ? `linear-gradient(135deg, ${COLORS.teal.primary}, ${COLORS.gold.primary})`
                          : undefined
                      }}
                    >
                      {index < analysisStep ? (
                        <span style={{ color: COLORS.teal.primary }} className="text-xl font-bold">✓</span>
                      ) : (
                        <span className="text-xl">{step.icon}</span>
                      )}
                    </div>
                    <p
                      className={`font-semibold transition-colors ${
                        index === analysisStep
                          ? "text-gray-900"
                          : index < analysisStep
                          ? ""
                          : "text-gray-400"
                      }`}
                      style={{
                        color: index < analysisStep ? COLORS.teal.primary : undefined
                      }}
                    >
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Barre de progression */}
            <div className="relative">
              <div className="h-3 overflow-hidden rounded-full bg-gray-200/80 backdrop-blur-sm">
                <div
                  className="relative h-full transition-all duration-300 ease-out rounded-full"
                  style={{ 
                    width: `${analysisProgress}%`,
                    background: `linear-gradient(to right, ${COLORS.teal.primary}, ${COLORS.gold.primary})`
                  }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
              <p className="mt-3 text-sm font-bold text-center text-gray-600">
                {analysisProgress}%
              </p>
            </div>

            <p className="mt-6 text-xs text-center text-gray-500">
              Préparation de ton estimation personnalisée...
            </p>
          </div>
        </div>
      )}

      {/* ========== HEADER BAHN ========== */}
      <header className="relative sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-5">
          <div className="flex items-center justify-between gap-4">
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
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: COLORS.gold.primary }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center flex-shrink-0 gap-2">
              <button
                onClick={() => navigate("/", { replace: true })}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold transition-all border group sm:px-4 rounded-xl hover:shadow-md sm:text-sm"
                style={{
                  background: `linear-gradient(to right, ${COLORS.teal.light}, ${COLORS.teal.light})`,
                  color: COLORS.teal.dark,
                  borderColor: COLORS.teal.medium
                }}
              >
                <Home size={16} className="transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">Nouvelle</span>
              </button>

              <div className="relative">
                <button
                  onClick={openViral}
                  className="relative flex items-center gap-2 px-4 py-3 overflow-hidden text-sm font-bold text-white transition-all shadow-xl group sm:px-5 rounded-xl hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.teal.primary}, ${COLORS.gold.primary})`,
                    animation: 'gentle-pulse 3s ease-in-out infinite'
                  }}
                >
                  {/* Effet shimmer */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'shimmer 4s ease-in-out infinite'
                    }}
                  ></div>

                  <Share2 size={18} className="relative z-10 transition-transform group-hover:rotate-12" />
                  <span className="relative z-10 font-black">MA CARTE</span>

                  {/* Badge NEW */}
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full animate-pulse">
                    NEW
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-gray-600">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span 
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: COLORS.teal.primary }}
              />
              <span className="font-semibold">{globalStats.uniqueVisitors} visites</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="font-semibold">{globalStats.estimations} estimations</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="font-semibold">{globalStats.viralCards} cartes</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========== CONTENU PRINCIPAL ========== */}
      <main className="relative max-w-6xl px-4 py-8 mx-auto space-y-8 sm:py-12">
        {/* Salary Card */}
        <div
          className={`relative overflow-hidden rounded-3xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-10 lg:p-12 text-white border-2 transform hover:shadow-3xl transition-shadow duration-500`}
          style={{
            background: isPublic
              ? `linear-gradient(135deg, ${COLORS.teal.primary}, ${COLORS.teal.dark})`
              : `linear-gradient(135deg, ${COLORS.gold.primary}, ${COLORS.gold.dark})`,
            borderColor: isPublic ? `${COLORS.teal.light}80` : `${COLORS.gold.light}80`
          }}
        >
          {/* Blobs décoratifs */}
          <div className="absolute top-0 right-0 -mt-40 -mr-40 rounded-full w-80 h-80 sm:w-96 sm:h-96 bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full sm:w-64 sm:h-64 bg-white/5 -ml-28 -mb-28 blur-3xl"></div>

          <div className="relative z-10 space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div 
                  className="flex items-center justify-center border w-14 h-14 sm:w-16 sm:h-16 rounded-2xl backdrop-blur-sm border-white/20"
                  style={{ backgroundColor: isPublic ? `${COLORS.teal.primary}4D` : `${COLORS.gold.primary}4D` }}
                >
                  {isPublic ? <Landmark size={32} /> : <Building2 size={32} />}
                </div>
                <div>
                  <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl">
                    Ton estimation
                  </h2>
                  <p className="mt-1 text-xs font-medium text-white/90 sm:text-sm">
                    {isPublic ? "🏛️ Fonction Publique" : `🏢 ${secteurLabel}`} • Côte d'Ivoire 🇨🇮
                  </p>
                </div>
              </div>

              <div className="items-center hidden gap-2 px-4 py-2 border rounded-full sm:flex bg-white/20 backdrop-blur-sm border-white/30">
                <Star className="text-yellow-300 fill-yellow-300" size={16} />
                <span className="text-sm font-bold">Vérifié</span>
              </div>
            </div>

            {/* ✅ NOUVEAU : Badge Type de Salaire */}
            {isPublic && (
              <div className="flex flex-wrap items-center gap-3">
                {typeSalaire === 'avec_primes' ? (
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 rounded-xl bg-white/20 backdrop-blur-sm border-white/40"
                  >
                    <span className="text-xl">💰</span>
                    <span className="text-sm font-bold">Salaire TOTAL (base + primes)</span>
                  </div>
                ) : (
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 rounded-xl bg-white/20 backdrop-blur-sm border-white/40"
                  >
                    <span className="text-xl">📊</span>
                    <span className="text-sm font-bold">Salaire de BASE</span>
                  </div>
                )}
              </div>
            )}

            {/* Main content */}
            <div className="grid gap-5 lg:grid-cols-2 sm:gap-6">
              {/* Salary info */}
              <div className="p-5 border bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl sm:p-8 border-white/30">
                <div className="mb-5">
                  <p className="mb-2 text-sm font-medium text-white/90">
                    💼 <span className="font-bold text-white">{jobLabel}</span>
                  </p>
                  <p className="text-sm font-medium text-white/90">
                    📌 {isPublic ? `Grade ${gradePublic}` : `Niveau ${niveau}`}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/30">
                  <p className="mb-4 text-sm font-semibold text-white/95">💰 Salaire mensuel estimé</p>
                  <div className="flex items-baseline gap-3 mb-2">
                    <p className="text-4xl font-black sm:text-5xl lg:text-6xl">
                      <AnimatedNumber value={Math.round(minSalary / 1000)} shouldAnimate={animateStats} />K
                    </p>
                    <span className="text-2xl font-black sm:text-3xl">-</span>
                    <p className="text-4xl font-black sm:text-5xl lg:text-6xl">
                      <AnimatedNumber value={Math.round(maxSalary / 1000)} shouldAnimate={animateStats} />K
                    </p>
                  </div>
                  <p className="text-base font-medium text-white/90 sm:text-lg">FCFA / mois</p>
                  <p className="mt-3 text-xs font-medium text-white/80 sm:text-sm">
                    Moyenne: <span className="font-bold text-white">{formatFCFA(avgSalary)}</span>
                  </p>
                </div>
              </div>

              {/* Stats cards */}
              <div className="space-y-4">
                <div className="p-5 transition-all border bg-white/15 backdrop-blur-md rounded-2xl border-white/30 hover:bg-white/20">
                  <p className="mb-2 text-xs font-medium text-white/80">Salaire moyen</p>
                  <p className="text-3xl font-black sm:text-4xl">
                    <AnimatedNumber value={Math.round(avgSalary / 1000)} shouldAnimate={animateStats} />K FCFA
                  </p>
                </div>
                <div className="p-5 transition-all border bg-white/15 backdrop-blur-md rounded-2xl border-white/30 hover:bg-white/20">
                  <p className="mb-2 text-xs font-medium text-white/80">Salaire annuel brut</p>
                  <p className="text-3xl font-black sm:text-4xl">
                    <AnimatedNumber value={Math.round((avgSalary * 12) / 1000)} shouldAnimate={animateStats} />K FCFA
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ NOUVEAU : Note explicative pour AVEC PRIMES */}
            {isPublic && typeSalaire === 'avec_primes' && (
              <div 
                className="flex items-start gap-3 p-5 border rounded-2xl bg-white/15 backdrop-blur-md border-white/30"
              >
                <Info size={20} className="flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-bold">ℹ️ Important à savoir :</p>
                  <p className="leading-relaxed text-white/95">
                    Ce montant représente votre <strong>salaire réel mensuel</strong>, incluant :
                  </p>
                  <ul className="pl-5 space-y-1 list-disc text-white/90">
                    <li>Salaire de base (traitement indiciaire)</li>
                    <li>Primes et indemnités spécifiques à votre corps</li>
                    <li>Indemnités de sujétion, risque, ou pédagogiques</li>
                  </ul>
                  <p className="text-xs italic text-white/80">
                    Le salaire de base officiel est souvent faible mais compensé par d'importantes primes (100-400% selon le corps).
                  </p>
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="p-5 border bg-white/15 backdrop-blur-md rounded-2xl sm:rounded-3xl sm:p-6 border-white/30">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-black">
                <TrendingUp size={20} />
                Avantages du {isPublic ? "secteur public" : "secteur privé"}
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 text-sm text-white/95 bg-white/10 rounded-xl backdrop-blur-sm">
                    <CheckCircle2 size={16} className="flex-shrink-0 text-white" />
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phrase du jour */}
            <div className="p-5 border bg-black/20 border-white/20 rounded-2xl backdrop-blur-sm">
              <div className="mb-2 text-xs font-semibold text-white/90">🎭 Phrase du jour</div>
              <div className="text-base font-bold sm:text-lg">
                "{getRandomMessageBySalary(avgSalary)}"
              </div>
            </div>
          </div>
        </div>

        {/* Bouton comprendre les grades (seulement si fonction publique) */}
        {isPublic && (
          <div className="text-center">
            <button
              onClick={() => setShowGradeModal(true)}
              className="inline-flex items-center px-6 py-4 space-x-2 font-bold transition-all border-2 shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white rounded-2xl hover:shadow-xl hover:scale-105"
              style={{
                color: COLORS.teal.dark,
                borderColor: COLORS.teal.light
              }}
            >
              <span className="text-xl">📚</span>
              <span>Comprendre les grades de la fonction publique</span>
            </button>
          </div>
        )}
      </main>

      {showToast && (
        <div 
          className="fixed z-50 bg-white border-2 shadow-2xl bottom-24 sm:bottom-8 right-4 left-4 sm:left-auto sm:max-w-sm rounded-2xl animate-slide-up"
          style={{ borderColor: COLORS.teal.primary }}
          onClick={() => {
            setShowToast(false);
            openViral();
          }}
        >
          <div className="p-4 transition-colors cursor-pointer hover:bg-gray-50 rounded-2xl">
            <div className="flex items-start gap-3">
              <div 
                className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl animate-bounce-slow"
                style={{ background: `linear-gradient(135deg, ${COLORS.teal.primary}, ${COLORS.gold.primary})` }}
              >
                <span className="text-2xl">📸</span>
              </div>

              <div className="flex-1">
                <p className="mb-1 font-black text-gray-900">
                  N'oublie pas ta carte ! 🎉
                </p>
                <p className="text-sm text-gray-600">
                  Télécharge et partage ton estimation
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowToast(false);
                }}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-1 mt-3 overflow-hidden bg-gray-200 rounded-full">
              <div 
                className="h-full rounded-full"
                style={{ 
                  background: `linear-gradient(to right, ${COLORS.teal.primary}, ${COLORS.gold.primary})`,
                  animation: 'progress 6s linear forwards'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Sections BAHN */}
      <BAHNPromoSection />

      {/* Modal Grades */}
      <GradeExplanationModal 
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
      />

      {/* Modal Viral */}
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

      {/* Animations CSS */}
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
        
        @keyframes gentle-pulse {
          0%, 100% {
            box-shadow: 0 4px 15px rgba(61, 155, 155, 0.3);
          }
          50% {
            box-shadow: 0 6px 25px rgba(61, 155, 155, 0.5), 0 0 30px rgba(244, 196, 48, 0.3);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}