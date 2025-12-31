// src/pages/ResultsPage.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { incrementStat, getStats } from "../utils/mondjeStats";
import { getSalairesPublic, getSalairesPrive } from '../services/salaryService';
import { calculateSalary } from "../utils/salaryCalculator";
import BAHNPromoSection from '../components/BAHNPromoSection';           
import GradeExplanationModal from '../components/GradeExplanationModal';
import {
  TrendingUp,
  Building2,
  Landmark,
  CheckCircle2,
  Star,
  Home,
  Share2,
} from "lucide-react";

import concours from "../data/concours.json";
import ViralCardModal from "../components/ViralCard";

// ========== PALETTE BAHN ==========
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
  ];

  const mid = [
    "Ça monte doucement… on pousse un peu la négociation 😎",
    "Là ça commence à respirer 😌",
    "Garba + jus… on tient le mois 😄",
    "Je peux au moins dire 'ça va' sans mentir 😅",
  ];

  const high = [
    "Mon banquier me respecte maintenant 😭🔥",
    "À ce niveau, même le DG dit bonjour 😎",
    "C'est moi qui vais recruter maintenant 😂",
    "Ma carte bancaire est devenue lourde dans ma poche 💳💎",
  ];

  if ((Number(avg) || 0) < 300000) return low[Math.floor(Math.random() * low.length)];
  if ((Number(avg) || 0) < 900000) return mid[Math.floor(Math.random() * mid.length)];
  return high[Math.floor(Math.random() * high.length)];
}

/** Avantages selon secteur */
function getAvantagesSecteur(sector) {
  if (sector === 'public') {
    return [
      'Sécurité de l\'emploi',
      'Avancement automatique',
      'Retraite garantie',
      'Mutuelle santé',
      'Congés réglementés',
      'Formation continue'
    ];
  }
  return [
    'Primes variables',
    'Formation continue',
    'Évolution rapide',
    'Avantages sociaux',
    'Bonus performance',
    'Mobilité interne'
  ];
}

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

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state || {};

  // ✅ ÉTATS FIRESTORE
  const [corpsMetiersData, setCorpsMetiersData] = useState(null);
  const [salairesPriveData, setSalairesPriveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  // États UI
  const [animateStats, setAnimateStats] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [viralOpen, setViralOpen] = useState(false);
  const [viralMessage, setViralMessage] = useState("😄");
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [globalStats, setGlobalStats] = useState({ visits: 0, estimations: 0, viralCards: 0 });

  const isPublic = formData.sector === "public";

  // ✅ CHARGER LES DONNÉES FIRESTORE
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        const [publicData, priveData, stats] = await Promise.all([
          getSalairesPublic(),
          getSalairesPrive(),
          getStats()
        ]);
        
        setCorpsMetiersData(publicData);
        setSalairesPriveData(priveData);
        setGlobalStats(stats);
        
        console.log('✅ Données chargées pour calcul');
      } catch (err) {
        console.error('❌ Erreur chargement données:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // ✅ CALCULER LE SALAIRE UNE FOIS LES DONNÉES CHARGÉES
  useEffect(() => {
    if (!loading && corpsMetiersData && salairesPriveData && formData) {
      const calculatedResult = calculateSalary(formData, corpsMetiersData, salairesPriveData);
      setResult(calculatedResult);
      setViralMessage(getRandomMessageBySalary(calculatedResult.salaireBrut || 0));
    }
  }, [loading, corpsMetiersData, salairesPriveData, formData]);

  // Validation et redirection
  useEffect(() => {
    if (!formData.sector) {
      navigate("/", { replace: true });
    }
  }, [formData, navigate]);

  // Animation stats
  useEffect(() => {
    const t = setTimeout(() => setAnimateStats(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Animation d'analyse
  useEffect(() => {
    if (!isAnalyzing) return;

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnimateStats(true);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isAnalyzing]);

  // ✅ DÉPLACER useMemo AVANT LES RETURNS CONDITIONNELS
  const jobLabel = useMemo(() => {
    if (!result) return 'Métier';
    return isPublic ? (result.metier || 'Métier') : (result.metierTitre || 'Métier');
  }, [result, isPublic]);

  const secteurLabel = useMemo(() => {
    if (!result || isPublic) return '';
    return result.secteurNom || '';
  }, [result, isPublic]);

  const gradePublic = useMemo(() => result?.grade || '', [result]);
  const niveau = useMemo(() => result?.niveau || '', [result]);

  const minSalary = useMemo(() => (result?.salaireBrut || 0) * 0.9, [result]);
  const maxSalary = useMemo(() => (result?.salaireBrut || 0) * 1.1, [result]);
  const avgSalary = useMemo(() => result?.salaireBrut || 0, [result]);

  const benefits = useMemo(() => getAvantagesSecteur(formData.sector), [formData.sector]);

  // Concours
  const competitions = useMemo(() => {
    if (!isPublic || !result) return [];
    
    const cat = result.categorieKey || 'categorie_B';
    const key = cat.replace('categorie_', 'categorie_').toUpperCase();
    
    let listeConcours = concours?.concours_par_categorie?.[key] || [];
    const jobLower = String(jobLabel || "").toLowerCase();

    if (jobLower.includes("enseignant") || jobLower.includes("professeur")) {
      const concoursEduc = concours?.concours_education?.concours || [];
      listeConcours = [...listeConcours, ...concoursEduc.slice(0, 2)];
    }

    if (jobLower.includes("infirmier") || jobLower.includes("santé")) {
      const concoursSante = concours?.concours_sante?.concours || [];
      listeConcours = [...listeConcours, ...concoursSante.slice(0, 2)];
    }

    return listeConcours.slice(0, 6).map((c) => ({
      title: c.intitule || c.title || "Concours",
      deadline: c.deadline || "À venir",
      type: c.type || "Fonction Publique",
      positions: c.nombre_postes ? `${c.nombre_postes} postes` : "—",
      level: c.diplome_requis || c.level || "Selon diplôme",
      description: c.description || `Concours ${c.intitule || ""}`,
      link: c.link || "#",
      status: c.status || "Inscriptions ouvertes",
    }));
  }, [result, jobLabel, isPublic]);

  const openViral = () => {
    setViralMessage(getRandomMessageBySalary(avgSalary));
    setViralOpen(true);
    incrementStat("viralCards").catch((error) => {
      console.error("❌ Impossible d'incrémenter viralCards:", error);
    });
  };

  // ✅ ÉCRAN DE CHARGEMENT (APRÈS TOUS LES HOOKS)
  if (loading || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ 
              borderColor: COLORS.teal.primary,
              borderTopColor: 'transparent'
            }}
          />
          <p className="text-gray-700 font-semibold text-lg">Calcul de votre salaire...</p>
          <p className="text-gray-500 text-sm mt-2">Analyse des données Firestore</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50 relative overflow-hidden">
      {/* Blobs décoratifs */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        style={{ background: `linear-gradient(135deg, ${COLORS.teal.primary}20, ${COLORS.teal.medium}20)` }}
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
        style={{ background: `linear-gradient(135deg, ${COLORS.gold.primary}20, ${COLORS.gold.dark}20)` }}
      />

      {/* ========== ÉCRAN D'ANALYSE ========== */}
      {isAnalyzing && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, #E6F5F5 0%, #FFFFFF 50%, #FEF9E6 100%)' }}
        >
          <div className="max-w-md w-full px-6">
            {/* Logo BAHN animé */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div 
                  className="absolute inset-0 rounded-3xl blur-xl opacity-75 animate-pulse"
                  style={{ background: `linear-gradient(135deg, ${COLORS.teal.primary}, ${COLORS.gold.primary})` }}
                />
                <div className="relative rounded-3xl flex items-center justify-center overflow-hidden px-16 py-10">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
                      style={{ backgroundColor: COLORS.gold.primary }}
                    >
                      <span 
                        className="font-black text-3xl"
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
              className="text-3xl font-black text-center mb-3"
              style={{ 
                background: `linear-gradient(to right, ${COLORS.teal.primary}, ${COLORS.gold.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Analyse en cours
            </h2>
            <p className="text-center text-gray-600 mb-8 font-medium">
              {jobLabel} • {isPublic ? "Fonction Publique" : secteurLabel}
            </p>

            {/* Messages d'étapes */}
            <div 
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl mb-6 border"
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
              <div className="h-3 bg-gray-200/80 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full transition-all duration-300 ease-out rounded-full relative"
                  style={{ 
                    width: `${analysisProgress}%`,
                    background: `linear-gradient(to right, ${COLORS.teal.primary}, ${COLORS.gold.primary})`
                  }}
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

      {/* ========== HEADER BAHN ========== */}
      <header className="relative bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo BAHN */}
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              onClick={() => window.location.href = 'https://bahn-edu.com'}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                style={{ backgroundColor: COLORS.gold.primary }}
              >
                <span 
                  className="font-black text-xl sm:text-2xl"
                  style={{ color: COLORS.teal.dark }}
                >
                  B
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div 
                  className="text-xl sm:text-2xl md:text-3xl font-black"
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
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate("/", { replace: true })}
                className="group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl hover:shadow-md transition-all font-bold text-xs sm:text-sm border"
                style={{
                  background: `linear-gradient(to right, ${COLORS.teal.light}, ${COLORS.teal.light})`,
                  color: COLORS.teal.dark,
                  borderColor: COLORS.teal.medium
                }}
              >
                <Home size={16} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Nouvelle</span>
              </button>

              <button
                onClick={openViral}
                className="group flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold text-xs sm:text-sm"
                style={{
                  background: `linear-gradient(to right, ${COLORS.teal.primary}, ${COLORS.gold.primary})`
                }}
              >
                <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Ma carte</span>
              </button>
            </div>
          </div>

          {/* Stats badges */}
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-600 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span 
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: COLORS.teal.primary }}
              />
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
      </header>

      {/* ========== CONTENU PRINCIPAL ========== */}
      <main className="relative max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Salary Card */}
        <div
          className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-10 lg:p-12 text-white border-2 transform hover:shadow-3xl transition-shadow duration-500"
          style={{
            background: isPublic
              ? `linear-gradient(135deg, ${COLORS.teal.primary}, ${COLORS.teal.dark})`
              : `linear-gradient(135deg, ${COLORS.gold.primary}, ${COLORS.gold.dark})`,
            borderColor: isPublic ? `${COLORS.teal.light}80` : `${COLORS.gold.light}80`
          }}
        >
          {/* Blobs décoratifs */}
          <div className="absolute top-0 right-0 w-80 h-80 sm:w-96 sm:h-96 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-64 sm:h-64 bg-white/5 rounded-full -ml-28 -mb-28 blur-3xl"></div>

          <div className="relative z-10 space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                  style={{ backgroundColor: isPublic ? `${COLORS.teal.primary}4D` : `${COLORS.gold.primary}4D` }}
                >
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
                "{viralMessage}"
              </div>
            </div>
          </div>
        </div>

        {/* Bouton comprendre les grades */}
        {isPublic && (
          <div className="text-center">
            <button
              onClick={() => setShowGradeModal(true)}
              className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm hover:bg-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 border-2"
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

      <BAHNPromoSection />

      <GradeExplanationModal 
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
      />

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

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}