// src/components/GradeExplanationModal.jsx

import React from 'react';

const GradeExplanationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========== HEADER BAHN ========== */}
        <div 
          className="sticky top-0 text-white p-6 md:p-8 rounded-t-3xl"
          style={{
            background: `linear-gradient(135deg, #3D9B9B 0%, #2D7A7A 100%)`
          }}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-black mb-2">
                📚 Comprendre les Grades de la Fonction Publique
              </h2>
              <p className="text-white/90 text-sm font-medium">
                Guide complet pour naviguer dans la hiérarchie administrative ivoirienne
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ========== CONTENU ========== */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Introduction */}
          <div 
            className="rounded-2xl p-6 border-2"
            style={{ 
              backgroundColor: '#E6F5F5',
              borderColor: '#3D9B9B'
            }}
          >
            <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              Qu'est-ce qu'un grade ?
            </h3>
            <p className="text-gray-800 leading-relaxed font-medium">
              Le grade est le titre qui définit ta position dans la hiérarchie de la fonction publique. 
              Il détermine ton niveau de responsabilité, ton salaire de base et tes possibilités d'évolution 
              de carrière. Chaque grade correspond à une catégorie et à des échelons spécifiques.
            </p>
          </div>

          {/* Les 4 Catégories */}
          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-3">📊</span>
              Les 4 Catégories de la Fonction Publique
            </h3>
            
            <div className="grid gap-4">
              {/* Catégorie A */}
              <div 
                className="rounded-2xl p-5 border-l-4"
                style={{ 
                  backgroundColor: 'white',
                  borderLeftColor: '#3D9B9B',
                  boxShadow: '0 2px 8px rgba(61, 155, 155, 0.1)'
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-gray-900 mb-1">Catégorie A</h4>
                    <p className="text-sm font-bold" style={{ color: '#2D7A7A' }}>Cadres supérieurs</p>
                  </div>
                  <span 
                    className="text-white px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#3D9B9B' }}
                  >
                    BAC +3 minimum
                  </span>
                </div>
                <p className="text-gray-800 text-sm mb-3 font-medium">
                  Postes de direction, conception et encadrement. Nécessite un diplôme universitaire.
                </p>
                <div className="text-xs text-gray-700 font-semibold">
                  <span className="text-gray-900 font-black">Exemples :</span> Inspecteur, Administrateur, Ingénieur, Médecin, Professeur
                </div>
              </div>

              {/* Catégorie B */}
              <div 
                className="rounded-2xl p-5 border-l-4"
                style={{ 
                  backgroundColor: 'white',
                  borderLeftColor: '#3D9B9B',
                  boxShadow: '0 2px 8px rgba(61, 155, 155, 0.1)'
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-gray-900 mb-1">Catégorie B</h4>
                    <p className="text-sm font-bold" style={{ color: '#2D7A7A' }}>Cadres moyens</p>
                  </div>
                  <span 
                    className="text-white px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#3D9B9B' }}
                  >
                    BAC +2
                  </span>
                </div>
                <p className="text-gray-800 text-sm mb-3 font-medium">
                  Postes d'application et d'encadrement intermédiaire. Formation supérieure courte.
                </p>
                <div className="text-xs text-gray-700 font-semibold">
                  <span className="text-gray-900 font-black">Exemples :</span> Contrôleur, Technicien supérieur, Secrétaire administratif
                </div>
              </div>

              {/* Catégorie C */}
              <div 
                className="rounded-2xl p-5 border-l-4"
                style={{ 
                  backgroundColor: 'white',
                  borderLeftColor: '#3D9B9B',
                  boxShadow: '0 2px 8px rgba(61, 155, 155, 0.1)'
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-gray-900 mb-1">Catégorie C</h4>
                    <p className="text-sm font-bold" style={{ color: '#2D7A7A' }}>Agents d'exécution qualifiés</p>
                  </div>
                  <span 
                    className="text-white px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#3D9B9B' }}
                  >
                    BAC / BT
                  </span>
                </div>
                <p className="text-gray-800 text-sm mb-3 font-medium">
                  Postes d'exécution spécialisés nécessitant une qualification professionnelle.
                </p>
                <div className="text-xs text-gray-700 font-semibold">
                  <span className="text-gray-900 font-black">Exemples :</span> Agent administratif, Aide-soignant, Secrétaire
                </div>
              </div>

              {/* Catégorie D */}
              <div 
                className="rounded-2xl p-5 border-l-4"
                style={{ 
                  backgroundColor: 'white',
                  borderLeftColor: '#F4C430',
                  boxShadow: '0 2px 8px rgba(244, 196, 48, 0.1)'
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-gray-900 mb-1">Catégorie D</h4>
                    <p className="text-sm font-bold" style={{ color: '#C29D26' }}>Agents d'exécution</p>
                  </div>
                  <span 
                    className="px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
                    style={{ 
                      backgroundColor: '#F4C430',
                      color: '#2D7A7A'
                    }}
                  >
                    BEPC / CAP
                  </span>
                </div>
                <p className="text-gray-800 text-sm mb-3 font-medium">
                  Postes d'exécution simple ne nécessitant pas de qualification particulière.
                </p>
                <div className="text-xs text-gray-700 font-semibold">
                  <span className="text-gray-900 font-black">Exemples :</span> Agent d'accueil, Gardien, Chauffeur, Manœuvre
                </div>
              </div>
            </div>
          </div>

          {/* Les Échelons */}
          <div 
            className="rounded-2xl p-6 border-2"
            style={{ 
              backgroundColor: '#FEF9E6',
              borderColor: '#F4C430'
            }}
          >
            <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">📈</span>
              Comment fonctionnent les échelons ?
            </h3>
            <p className="text-gray-800 mb-4 leading-relaxed font-medium">
              Chaque grade est divisé en <strong className="text-gray-900">échelons</strong> (généralement 1 à 10). 
              L'échelon détermine ton ancienneté dans le grade et influence directement ton salaire.
            </p>
            <div 
              className="bg-white rounded-xl p-4 border-2"
              style={{ borderColor: '#F4C430' }}
            >
              <p className="text-sm text-gray-800 font-semibold">
                <span 
                  className="font-black"
                  style={{ color: '#C29D26' }}
                >
                  💡 Exemple :
                </span> Un Administrateur (Catégorie A) commence à l'échelon 1, 
                puis progresse tous les 2-3 ans jusqu'à l'échelon 10, avec une augmentation 
                salariale à chaque passage.
              </p>
            </div>
          </div>

          {/* Évolution de Carrière */}
          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-3">🚀</span>
              Comment évoluer dans sa carrière ?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div 
                  className="text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-lg flex-shrink-0"
                  style={{ backgroundColor: '#3D9B9B' }}
                >
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 mb-1">Avancement d'échelon</h4>
                  <p className="text-sm text-gray-700 font-medium">Automatique tous les 2-3 ans en fonction de l'ancienneté</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-lg flex-shrink-0"
                  style={{ backgroundColor: '#3D9B9B' }}
                >
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 mb-1">Avancement de grade</h4>
                  <p className="text-sm text-gray-700 font-medium">Par concours professionnel ou examen d'aptitude</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-lg flex-shrink-0"
                  style={{ backgroundColor: '#3D9B9B' }}
                >
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 mb-1">Changement de catégorie</h4>
                  <p className="text-sm text-gray-700 font-medium">Via concours interne avec diplôme requis</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA BAHN */}
          <div 
            className="rounded-2xl p-8 text-white text-center"
            style={{
              background: `linear-gradient(135deg, #3D9B9B 0%, #2D7A7A 100%)`
            }}
          >
            <h3 className="text-2xl font-black mb-3">💡 Besoin d'aide pour ta carrière ?</h3>
            <p className="text-white/95 text-base mb-6 font-medium">
              BAHN te guide vers les meilleurs concours, formations et opportunités de la fonction publique
            </p>
            
            <a 
              href="https://bahn-edu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-xl"
              style={{ 
                backgroundColor: '#F4C430',
                color: '#2D7A7A'
              }}
            >
              Découvrir BAHN 🚀
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-3xl text-center border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-800 transition text-base"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeExplanationModal;