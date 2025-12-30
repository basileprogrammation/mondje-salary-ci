// src/components/BAHNPromoSection.jsx

import React, { useState } from 'react';

// ========== CONSTANTES ==========
const COLORS = {
  teal: {
    primary: '#3D9B9B',
    dark: '#2D7A7A',
    light: '#E6F5F5',
  },
  gold: {
    primary: '#F4C430',
    dark: '#C29D26',
  },
};

const FEATURES = [
  {
    emoji: '🎓',
    title: 'Bourses',
    description: 'Toutes les bourses d\'Afrique francophone, mises à jour chaque semaine',
    gradient: 'from-blue-50 to-blue-100'
  },
  {
    emoji: '📚',
    title: 'Formations',
    description: 'Formations certifiantes et recommandations personnalisées par l\'IA',
    gradient: 'from-purple-50 to-purple-100'
  },
  {
    emoji: '💼',
    title: 'Emplois',
    description: 'Jobs + génération automatique de CV et lettres de motivation',
    gradient: 'from-green-50 to-green-100'
  },
  {
    emoji: '🏆',
    title: 'Concours',
    description: 'Tous les concours disponibles avec préparation et coaching',
    gradient: 'from-orange-50 to-orange-100'
  }
];

const TESTIMONIALS = [
  {
    name: 'Aminata D.',
    role: 'Étudiante',
    text: 'J\'ai trouvé ma bourse Erasmus grâce à BAHN. Je n\'aurais jamais su qu\'elle existait sans la plateforme !',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    name: 'Kouassi M.',
    role: 'Développeur',
    text: 'Le CV généré par BAHN m\'a permis de décrocher 3 entretiens en 1 semaine. C\'est révolutionnaire !',
    gradient: 'from-green-400 to-green-600'
  },
  {
    name: 'Sarah K.',
    role: 'Lycéenne',
    text: 'L\'IA m\'a aidée à choisir ma filière universitaire. Meilleure décision de ma vie. Merci BAHN !',
    gradient: 'from-purple-400 to-purple-600'
  }
];

const FAQS = [
  {
    question: "C'est vraiment gratuit ?",
    answer: "Oui, 100% gratuit. Pas de frais cachés, pas de carte requise. Notre mission est de démocratiser l'accès aux opportunités en Afrique."
  },
  {
    question: "Comment BAHN obtient les données de salaires ?",
    answer: "Nous compilons des données de sites d'emploi, d'enquêtes sectorielles et de contributions anonymes d'utilisateurs. Les estimations sont mises à jour régulièrement."
  },
  {
    question: "BAHN fonctionne dans quels pays ?",
    answer: "BAHN couvre toute l'Afrique francophone : Côte d'Ivoire, Sénégal, Cameroun, Bénin, Mali, Burkina Faso, et plus encore."
  },
  {
    question: "Puis-je utiliser BAHN sur mobile ?",
    answer: "Oui ! BAHN est disponible en version web responsive et applications mobiles iOS et Android."
  }
];

// ========== COMPOSANTS ==========
const FeatureCard = ({ emoji, title, description, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left hover:shadow-lg transition-all hover:scale-105`}>
    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{emoji}</div>
    <h3 className="font-black text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">{title}</h3>
    <p className="text-gray-800 text-xs sm:text-sm font-semibold leading-relaxed">
      {description}
    </p>
  </div>
);

const TestimonialCard = ({ name, role, text, gradient }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition">
    <div className="flex items-center space-x-3 mb-3 sm:mb-4">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-full flex-shrink-0`}></div>
      <div className="min-w-0">
        <div className="font-bold text-gray-900 text-sm sm:text-base truncate">{name}</div>
        <div className="text-xs sm:text-sm text-gray-600">{role}</div>
      </div>
    </div>
    <p className="text-gray-800 text-xs sm:text-sm italic font-medium leading-relaxed">
      "{text}"
    </p>
    <div className="mt-3 sm:mt-4 text-yellow-500 text-xs sm:text-sm">⭐⭐⭐⭐⭐</div>
  </div>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div 
    className="bg-gray-50 rounded-xl p-4 sm:p-5 cursor-pointer hover:bg-gray-100 transition"
    onClick={onClick}
  >
    <div className="flex justify-between items-start gap-3">
      <span className="font-bold text-gray-900 text-sm sm:text-base flex-1">{question}</span>
      <span 
        className="text-xl sm:text-2xl font-bold flex-shrink-0"
        style={{ color: COLORS.teal.primary }}
      >
        {isOpen ? '−' : '+'}
      </span>
    </div>
    {isOpen && (
      <p className="text-gray-800 mt-3 text-xs sm:text-sm font-medium leading-relaxed">
        {answer}
      </p>
    )}
  </div>
);

// ========== COMPOSANT PRINCIPAL ==========
const BAHNPromoSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      {/* ========== SECTION FEATURES ========== */}
      <section className="py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <span 
              className="inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4"
              style={{ 
                backgroundColor: `${COLORS.teal.primary}1A`,
                color: COLORS.teal.primary 
              }}
            >
              💡 LE SAVIEZ-VOUS ?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 sm:mb-4 px-4">
              BAHN, c'est bien plus qu'un simulateur de salaire
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4 font-medium">
              Ton conseiller IA pour{' '}
              <span className="font-black" style={{ color: COLORS.teal.primary }}>
                TOUTE ta carrière
              </span>
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* CTA Box */}
          <div 
            className="rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-white shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${COLORS.teal.primary} 0%, ${COLORS.teal.dark} 100%)`
            }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4">
                🤖 Pose n'importe quelle question carrière
              </h3>
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed font-medium">
                "Trouve-moi des bourses en médecine" • "Formation Data Science 6 mois" • 
                "Jobs marketing Abidjan" • "Comment préparer l'ENA ?" • "Quel métier pour moi ?"
              </p>
              <p className="text-white/95 mb-6 sm:mb-8 text-xs sm:text-sm font-medium">
                L'IA BAHN centralise TOUT au même endroit et te répond en 2 minutes
              </p>
              <a 
                href="https://bahn-edu.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:shadow-2xl transform hover:scale-105 transition"
                style={{ 
                  backgroundColor: COLORS.gold.primary,
                  color: COLORS.teal.dark
                }}
              >
                Découvrir BAHN complet 🚀
              </a>
              <p className="text-white/90 text-xs mt-3 sm:mt-4 font-medium">
                ✅ 100% gratuit • ✅ Disponible web + mobile • ✅ 2,000+ utilisateurs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 sm:mb-4 px-4">
              Ils ont transformé leur carrière avec BAHN
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 sm:mb-8 text-center px-4">
            Questions fréquentes
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            {FAQS.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section 
        className="py-12 sm:py-16 px-4"
        style={{
          background: `linear-gradient(135deg, ${COLORS.teal.primary} 0%, ${COLORS.teal.dark} 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 px-4">
            Prêt à transformer ta carrière ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 font-medium px-4">
            Rejoins 2,000+ jeunes qui utilisent BAHN pour trouver bourses, formations et jobs
          </p>
          <a 
            href="https://bahn-edu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-black text-lg sm:text-xl hover:shadow-2xl transform hover:scale-105 transition"
            style={{ 
              backgroundColor: COLORS.gold.primary,
              color: COLORS.teal.dark
            }}
          >
            Découvrir BAHN 🚀
          </a>
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium px-4">
            <span>✅ 100% gratuit</span>
            <span>✅ Aucune carte requise</span>
            <span>✅ Web + Mobile</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default BAHNPromoSection;