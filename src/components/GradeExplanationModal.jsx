// src/components/GradeExplanationModal.jsx

import React from 'react';

const GradeExplanationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========== HEADER BAHN ========== */}
        <div 
          className="sticky top-0 p-6 text-white md:p-8 rounded-t-3xl"
          style={{
            background: `linear-gradient(135deg, #3D9B9B 0%, #2D7A7A 100%)`
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-black md:text-3xl">
                📚 Comprendre les Grades de la Fonction Publique
              </h2>
              <p className="text-sm font-medium text-white/90">
                Guide officiel conforme au Statut Général de la Fonction Publique Ivoirienne (Loi n°2023-892)
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 text-white transition rounded-full hover:bg-white/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ========== CONTENU ========== */}
        <div className="p-6 space-y-8 md:p-8">
          
          {/* Introduction */}
          <div 
            className="p-6 border-2 rounded-2xl"
            style={{ 
              backgroundColor: '#E6F5F5',
              borderColor: '#3D9B9B'
            }}
          >
            <h3 className="flex items-center mb-3 text-xl font-black text-gray-900">
              <span className="mr-3 text-2xl">🎯</span>
              Qu'est-ce qu'un grade ?
            </h3>
            <p className="mb-3 font-medium leading-relaxed text-gray-800">
              Le <strong>grade</strong> est le titre acquis par le fonctionnaire à l'intérieur de sa catégorie, 
              qui lui donne vocation à occuper un emploi dans sa spécialité et dans la hiérarchie administrative.
            </p>
            <p className="font-medium leading-relaxed text-gray-800">
              Le grade est désigné par une <strong>lettre</strong> (catégorie) suivie d'un <strong>chiffre</strong>. 
              Il détermine ton niveau de responsabilité, ton salaire de base et tes possibilités d'évolution de carrière.
            </p>
          </div>

          {/* Les 4 Catégories */}
          <div>
            <h3 className="flex items-center mb-6 text-2xl font-black text-gray-900">
              <span className="mr-3 text-2xl">📊</span>
              Les 4 Catégories de la Fonction Publique
            </h3>
            
            <div className="grid gap-4">
              {/* Catégorie A */}
              <div 
                className="p-5 border-l-4 rounded-2xl"
                style={{ 
                  backgroundColor: 'white',
                  borderLeftColor: '#3D9B9B',
                  boxShadow: '0 2px 8px rgba(61, 155, 155, 0.1)'
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="mb-1 text-lg font-black text-gray-900">Catégorie A</h4>
                    <p className="text-sm font-bold" style={{ color: '#2D7A7A' }}>
                      Études générales, conception, direction et supervision
                    </p>
                  </div>
                  <span 
                    className="text-white px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#3D9B9B' }}
                  >
                    Enseignement supérieur
                  </span>
                </div>
                <p className="mb-3 text-sm font-medium text-gray-800">
                  Diplôme universitaire général, technique ou professionnel (Licence, Master, Doctorat) 
                  ou tout diplôme admis en équivalence.
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-black text-gray-900">GRADES :</span>
                  <div className="flex flex-wrap gap-2">
                    {['A3', 'A4', 'A5', 'A6', 'A7'].map(grade => (
                      <span 
                        key={grade}
                        className="px-3 py-1 text-xs font-bold text-white rounded-full"
                        style={{ backgroundColor: '#3D9B9B' }}
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-700">
                  <span className="font-black text-gray-900">💼 Exemples :</span> Administrateur Civil, Médecin, 
                  Ingénieur, Professeur de Lycée, Inspecteur
                </div>
              </div>

              {/* Catégorie B */}
              <div 
                className="p-5 border-l-4 rounded-2xl"
                style={{ 
                  backgroundColor: 'white',
                  borderLeftColor: '#3D9B9B',
                  boxShadow: '0 2px 8px rgba(61, 155, 155, 0.1)'
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="mb-1 text-lg font-black text-gray-900">Catégorie B</h4>
                    <p className="text-sm font-bold" style={{ color: '#2D7A7A' }}>Fonctions d'application</p>
                  </div>
                  <span 
                    className="text-white px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#3D9B9B' }}
                  >
                    BAC à Licence
                  </span>
                </div>
                <p className="mb-3 text-sm font-medium text-gray-800">
                  Enseignement supérieur court (DEUG II, BTS, Licence) OU enseignement secondaire 2nd cycle 
                  (BAC, BT) ou tout diplôme admis en équivalence.
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-black text-gray-900">GRADES :</span>
                  <div className="flex flex-wrap gap-2">
                    {['B1', 'B2', 'B3'].map(grade => (
                      <span 
                        key={grade}
                        className="px-3 py-1 text-xs font-bold text-white rounded-full"
                        style={{ backgroundColor: '#3D9B9B' }}
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-700">
                  <span className="font-black text-gray-900">💼 Exemples :</span> Contrôleur, Secrétaire Administratif, 
                  Technicien Supérieur, Infirmier Diplômé d'État
                </div>
              </div>

              {/* Catégorie C */}
              <div 
                className="p-5 border-l-4 rounded-2xl"
                style={{ 
                  backgroundColor: 'white',
                  borderLeftColor: '#F4C430',
                  boxShadow: '0 2px 8px rgba(244, 196, 48, 0.1)'
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="mb-1 text-lg font-black text-gray-900">Catégorie C</h4>
                    <p className="text-sm font-bold" style={{ color: '#C29D26' }}>Fonctions d'exécution</p>
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
                <p className="mb-3 text-sm font-medium text-gray-800">
                  Enseignement secondaire 1er cycle général, technique ou professionnel 
                  ou tout diplôme admis en équivalence.
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-black text-gray-900">GRADES :</span>
                  <div className="flex flex-wrap gap-2">
                    {['C1', 'C2', 'C3'].map(grade => (
                      <span 
                        key={grade}
                        className="px-3 py-1 text-xs font-bold rounded-full"
                        style={{ 
                          backgroundColor: '#F4C430',
                          color: '#2D7A7A'
                        }}
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-700">
                  <span className="font-black text-gray-900">💼 Exemples :</span> Agent Administratif, 
                  Aide-Soignant, Secrétaire, Agent Technique
                </div>
              </div>

              {/* Catégorie D */}
              <div 
                className="p-5 border-l-4 rounded-2xl"
                style={{ 
                  backgroundColor: 'white',
                  borderLeftColor: '#FF8C42',
                  boxShadow: '0 2px 8px rgba(255, 140, 66, 0.1)'
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="mb-1 text-lg font-black text-gray-900">Catégorie D</h4>
                    <p className="text-sm font-bold" style={{ color: '#CC6F35' }}>Fonctions d'exécution simple</p>
                  </div>
                  <span 
                    className="px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
                    style={{ 
                      backgroundColor: '#FF8C42',
                      color: 'white'
                    }}
                  >
                    CEPE
                  </span>
                </div>
                <p className="mb-3 text-sm font-medium text-gray-800">
                  Certificat d'Études Primaires Élémentaires (CEPE). Niveau de formation de base.
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-black text-gray-900">GRADES :</span>
                  <div className="flex flex-wrap gap-2">
                    {['D1', 'D2'].map(grade => (
                      <span 
                        key={grade}
                        className="px-3 py-1 text-xs font-bold rounded-full"
                        style={{ 
                          backgroundColor: '#FF8C42',
                          color: 'white'
                        }}
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-700">
                  <span className="font-black text-gray-900">💼 Exemples :</span> Agent d'Accueil, Gardien, 
                  Chauffeur, Manœuvre, Planton
                </div>
              </div>
            </div>
          </div>

          {/* Structure des Classes et Échelons */}
          <div 
            className="p-6 border-2 rounded-2xl"
            style={{ 
              backgroundColor: '#FEF9E6',
              borderColor: '#F4C430'
            }}
          >
            <h3 className="flex items-center mb-3 text-xl font-black text-gray-900">
              <span className="mr-3 text-2xl">📈</span>
              Structure : Classes et Échelons
            </h3>
            <p className="mb-4 font-medium leading-relaxed text-gray-800">
              Chaque grade contient une <strong className="text-gray-900">échelle de traitement</strong> structurée 
              en <strong className="text-gray-900">4 classes</strong> avec plusieurs <strong>échelons</strong> :
            </p>
            
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              <div 
                className="p-4 bg-white border-2 rounded-xl"
                style={{ borderColor: '#F4C430' }}
              >
                <div className="mb-2 font-black text-gray-900">📊 2ème classe</div>
                <div className="text-sm font-semibold text-gray-700">4 échelons : 1, 2, 3, 4</div>
              </div>
              
              <div 
                className="p-4 bg-white border-2 rounded-xl"
                style={{ borderColor: '#F4C430' }}
              >
                <div className="mb-2 font-black text-gray-900">📊 1ère classe</div>
                <div className="text-sm font-semibold text-gray-700">3 échelons : 1, 2, 3</div>
              </div>
              
              <div 
                className="p-4 bg-white border-2 rounded-xl"
                style={{ borderColor: '#F4C430' }}
              >
                <div className="mb-2 font-black text-gray-900">📊 Classe principale</div>
                <div className="text-sm font-semibold text-gray-700">3 échelons : 1, 2, 3</div>
              </div>
              
              <div 
                className="p-4 bg-white border-2 rounded-xl"
                style={{ borderColor: '#F4C430' }}
              >
                <div className="mb-2 font-black text-gray-900">📊 Classe exceptionnelle</div>
                <div className="text-sm font-semibold text-gray-700">3 échelons : 1, 2, 3</div>
              </div>
            </div>

            <div 
              className="p-4 bg-white border-2 rounded-xl"
              style={{ borderColor: '#3D9B9B' }}
            >
              <p className="mb-2 text-sm font-semibold text-gray-800">
                <span className="font-black" style={{ color: '#2D7A7A' }}>💡 Total :</span> 
                <strong> 13 échelons</strong> répartis en 4 classes
              </p>
              <p className="text-sm font-semibold text-gray-800">
                <span className="font-black" style={{ color: '#2D7A7A' }}>💰 Impact :</span> 
                Chaque changement d'échelon ou de classe augmente ton <strong>indice de traitement</strong>, 
                donc ton salaire
              </p>
            </div>
          </div>

          {/* Calcul du Salaire */}
          <div 
            className="p-6 border-2 rounded-2xl"
            style={{ 
              backgroundColor: '#E6F5F5',
              borderColor: '#3D9B9B'
            }}
          >
            <h3 className="flex items-center mb-3 text-xl font-black text-gray-900">
              <span className="mr-3 text-2xl">💰</span>
              Comment est calculé ton salaire ?
            </h3>
            <p className="mb-4 font-medium leading-relaxed text-gray-800">
              Le salaire de base (traitement) est calculé avec la formule officielle :
            </p>
            
            <div 
              className="p-6 mb-4 text-center bg-white border-2 rounded-xl"
              style={{ borderColor: '#3D9B9B' }}
            >
              <div className="mb-2 text-2xl font-black" style={{ color: '#2D7A7A' }}>
                Traitement = Indice × 233,457 FCFA
              </div>
              <p className="text-sm font-semibold text-gray-700">
                L'indice dépend de ton grade, ta classe et ton échelon
              </p>
            </div>

            <div 
              className="p-4 bg-white border-l-4 rounded-xl"
              style={{ borderLeftColor: '#F4C430' }}
            >
              <p className="mb-2 text-sm font-semibold text-gray-800">
                <span className="font-black" style={{ color: '#C29D26' }}>📋 Exemple concret :</span>
              </p>
              <div className="space-y-1 text-sm text-gray-800">
                <div className="font-medium">• <strong>Fonctionnaire A4</strong>, 2ème classe, échelon 1</div>
                <div className="font-medium">• Indice = <strong>895</strong></div>
                <div className="font-medium">• Traitement = 895 × 233,457 = <strong className="text-green-600">208 844 FCFA</strong></div>
              </div>
            </div>
          </div>

          {/* ========== NOUVELLE SECTION : CONCOURS VS DÉCRET ========== */}
          <div>
            <h3 className="flex items-center mb-6 text-2xl font-black text-gray-900">
              <span className="mr-3 text-2xl">🎓</span>
              Concours vs Décret : Comment entrer et progresser ?
            </h3>

            {/* Encadré introductif */}
            <div 
              className="p-6 mb-6 border-2 rounded-2xl"
              style={{ 
                backgroundColor: '#E6F5F5',
                borderColor: '#3D9B9B'
              }}
            >
              <p className="font-medium leading-relaxed text-gray-800">
                Il existe <strong>2 voies</strong> pour entrer dans la fonction publique ou pour être promu : 
                le <strong className="text-teal-700">concours</strong> (voie normale) et 
                le <strong className="text-teal-700">décret présidentiel</strong> (voie exceptionnelle).
              </p>
            </div>

            {/* Tableau comparatif */}
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              {/* CONCOURS */}
              <div 
                className="p-6 border-2 rounded-2xl"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: '#3D9B9B',
                  boxShadow: '0 4px 12px rgba(61, 155, 155, 0.15)'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="flex items-center justify-center w-12 h-12 text-2xl rounded-full"
                    style={{ backgroundColor: '#E6F5F5' }}
                  >
                    ✅
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900">PAR CONCOURS</h4>
                    <p className="text-xs font-bold" style={{ color: '#2D7A7A' }}>Voie normale (90%+ des cas)</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="mb-1 font-black text-gray-900">📋 Principe</div>
                    <p className="font-medium text-gray-700">
                      Épreuves écrites et orales ouvertes à tous les candidats remplissant les conditions
                    </p>
                  </div>

                  <div>
                    <div className="mb-1 font-black text-gray-900">👥 Qui décide ?</div>
                    <p className="font-medium text-gray-700">Commission de concours indépendante</p>
                  </div>

                  <div>
                    <div className="mb-1 font-black text-gray-900">⚖️ Avantages</div>
                    <ul className="ml-4 space-y-1 font-medium text-gray-700">
                      <li>• Transparent et égalitaire</li>
                      <li>• Basé sur le mérite</li>
                      <li>• Respecte la Constitution</li>
                    </ul>
                  </div>

                  <div 
                    className="p-3 mt-4 rounded-xl"
                    style={{ backgroundColor: '#E6F5F5' }}
                  >
                    <div className="mb-2 text-xs font-black text-gray-900">💡 Exemple</div>
                    <p className="text-xs font-semibold leading-relaxed text-gray-800">
                      Concours d'Instituteur (B1) : 5000 candidats → Épreuves écrites → 500 admissibles → 
                      Oral → 200 admis → Formation CPFAE (1 an) → Titularisation
                    </p>
                  </div>
                </div>
              </div>

              {/* DÉCRET */}
              <div 
                className="p-6 border-2 rounded-2xl"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: '#FF8C42',
                  boxShadow: '0 4px 12px rgba(255, 140, 66, 0.15)'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="flex items-center justify-center w-12 h-12 text-2xl rounded-full"
                    style={{ backgroundColor: '#FFF4E6' }}
                  >
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900">PAR DÉCRET</h4>
                    <p className="text-xs font-bold" style={{ color: '#CC6F35' }}>Voie exceptionnelle (&lt;5% des cas)</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="mb-1 font-black text-gray-900">📋 Principe</div>
                    <p className="font-medium text-gray-700">
                      Nomination directe sans concours par décision présidentielle
                    </p>
                  </div>

                  <div>
                    <div className="mb-1 font-black text-gray-900">👑 Qui décide ?</div>
                    <p className="font-medium text-gray-700">
                      <strong>UNIQUEMENT</strong> le Président de la République
                    </p>
                  </div>

                  <div>
                    <div className="mb-1 font-black text-gray-900">🎯 Quand ?</div>
                    <ul className="ml-4 space-y-1 font-medium text-gray-700">
                      <li>• Compétences rares urgentes</li>
                      <li>• Services exceptionnels</li>
                      <li>• Raisons d'État</li>
                    </ul>
                  </div>

                  <div 
                    className="p-3 mt-4 rounded-xl"
                    style={{ backgroundColor: '#FFF4E6' }}
                  >
                    <div className="mb-2 text-xs font-black text-gray-900">💡 Exemple</div>
                    <p className="text-xs font-semibold leading-relaxed text-gray-800">
                      Expert international nommé Conseiller Technique au Ministère de l'Économie 
                      par décret présidentiel (expertise unique non disponible localement)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Promotion */}
            <div 
              className="p-6 border-2 rounded-2xl"
              style={{ 
                backgroundColor: '#FEF9E6',
                borderColor: '#F4C430'
              }}
            >
              <h4 className="flex items-center mb-4 text-lg font-black text-gray-900">
                <span className="mr-2 text-xl">🚀</span>
                La promotion (monter en grade)
              </h4>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div 
                    className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-black rounded-full"
                    style={{ backgroundColor: '#3D9B9B', color: 'white' }}
                  >
                    1
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 font-black text-gray-900">Par concours interne (normal)</div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Le fonctionnaire passe un <strong>concours professionnel</strong> réservé aux agents en poste
                    </p>
                    <div className="text-xs font-semibold text-gray-600">
                      Exemple : Contrôleur B3 (5 ans d'ancienneté) → Concours interne → 
                      Formation ENA → Promotion Attaché A3
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div 
                    className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-black rounded-full"
                    style={{ backgroundColor: '#FF8C42', color: 'white' }}
                  >
                    2
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 font-black text-gray-900">Par décret (exceptionnel)</div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Promotion <strong>sans concours</strong> pour services exceptionnels rendus à la Nation
                    </p>
                    <div className="text-xs font-semibold text-gray-600">
                      Exemple : Médecin A4 sauvant des centaines de vies lors d'une épidémie → 
                      Décret présidentiel → Promotion A6 (reconnaissance nationale)
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Encadré Important */}
            <div 
              className="p-4 mt-6 border-l-4 rounded-xl"
              style={{ 
                backgroundColor: '#FFF4E6',
                borderLeftColor: '#FF8C42'
              }}
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-2xl">⚠️</span>
                <div>
                  <div className="mb-2 font-black text-gray-900">Pourquoi ces 2 mécanismes ?</div>
                  <div className="space-y-2 text-sm font-medium text-gray-800">
                    <p>
                      • Le <strong>concours</strong> garantit l'égalité, la transparence et le mérite 
                      (Article 21 de la Constitution)
                    </p>
                    <p>
                      • Le <strong>décret</strong> permet la flexibilité dans des cas exceptionnels 
                      et reconnaît les services extraordinaires
                    </p>
                    <p className="font-bold text-red-700">
                      ⚖️ Le décret doit rester RARE pour éviter le favoritisme et protéger l'égalité
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ========== FIN NOUVELLE SECTION ========== */}

          {/* Évolution de Carrière */}
          <div>
            <h3 className="flex items-center mb-6 text-2xl font-black text-gray-900">
              <span className="mr-3 text-2xl">🚀</span>
              Comment évoluer dans ta carrière ?
            </h3>
            
            <div className="space-y-4">
              {/* Avancement d'échelon */}
              <div 
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ 
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(61, 155, 155, 0.1)'
                }}
              >
                <div 
                  className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-lg font-black text-white rounded-full"
                  style={{ backgroundColor: '#3D9B9B' }}
                >
                  1
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 font-black text-gray-900">Avancement d'échelon</h4>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Automatique <strong>tous les 2 ans</strong>, d'un échelon à l'échelon immédiatement supérieur
                  </p>
                  <div className="space-y-1 text-xs font-semibold text-gray-600">
                    <div>✅ <strong>Réduction possible :</strong> -3 ou -6 mois (fonctionnaires méritants)</div>
                    <div>⚠️ <strong>Majoration possible :</strong> +3 ou +6 mois (note &lt; 3/5)</div>
                  </div>
                </div>
              </div>

              {/* Avancement de classe */}
              <div 
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ 
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(61, 155, 155, 0.1)'
                }}
              >
                <div 
                  className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-lg font-black text-white rounded-full"
                  style={{ backgroundColor: '#3D9B9B' }}
                >
                  2
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 font-black text-gray-900">Avancement de classe</h4>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    <strong>Au choix uniquement</strong>, basé sur le mérite et l'inscription au tableau annuel d'avancement
                  </p>
                  <div className="text-xs font-semibold text-gray-600">
                    ℹ️ Après avis de la Commission Administrative de Recours
                  </div>
                </div>
              </div>

              {/* Promotion de grade */}
              <div 
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ 
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(61, 155, 155, 0.1)'
                }}
              >
                <div 
                  className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-lg font-black text-white rounded-full"
                  style={{ backgroundColor: '#3D9B9B' }}
                >
                  3
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 font-black text-gray-900">Promotion (changement de grade)</h4>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Passage au <strong>grade immédiatement supérieur</strong> (exemple : B3 → A3)
                  </p>
                  <div className="space-y-1 text-xs font-semibold text-gray-600">
                    <div>🎓 <strong>Par concours interne</strong> (voie normale)</div>
                    <div>📜 <strong>Par décret</strong> (voie exceptionnelle)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Âge de retraite */}
          <div 
            className="p-6 border-2 rounded-2xl"
            style={{ 
              backgroundColor: '#FFF4E6',
              borderColor: '#FF8C42'
            }}
          >
            <h3 className="flex items-center mb-3 text-xl font-black text-gray-900">
              <span className="mr-3 text-2xl">🎂</span>
              Limite d'âge (départ à la retraite)
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div 
                className="p-4 bg-white border-l-4 rounded-xl"
                style={{ borderLeftColor: '#FF8C42' }}
              >
                <div className="mb-2 font-black text-gray-900">D1 à A3</div>
                <div className="mb-1 text-3xl font-black" style={{ color: '#CC6F35' }}>60 ans</div>
                <div className="text-xs font-semibold text-gray-600">
                  Catégories D, C, B et grade A3
                </div>
              </div>
              
              <div 
                className="p-4 bg-white border-l-4 rounded-xl"
                style={{ borderLeftColor: '#3D9B9B' }}
              >
                <div className="mb-2 font-black text-gray-900">A4 à A7</div>
                <div className="mb-1 text-3xl font-black" style={{ color: '#2D7A7A' }}>65 ans</div>
                <div className="text-xs font-semibold text-gray-600">
                  Cadres supérieurs (A4, A5, A6, A7)
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs font-semibold text-gray-700">
              ℹ️ Départ effectif le 1er janvier de l'année suivant la date anniversaire
            </p>
          </div>

          {/* CTA BAHN */}
          <div 
            className="p-8 text-center text-white rounded-2xl"
            style={{
              background: `linear-gradient(135deg, #3D9B9B 0%, #2D7A7A 100%)`
            }}
          >
            <h3 className="mb-3 text-2xl font-black">💡 Besoin d'aide pour ta carrière ?</h3>
            <p className="mb-6 text-base font-medium text-white/95">
              BAHN te guide vers les meilleurs concours, formations et opportunités de la fonction publique ivoirienne
            </p>
            
            <a 
              href="https://bahn-edu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 text-lg font-black transition-transform shadow-xl rounded-xl hover:scale-105"
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
        <div className="p-6 text-center border-t border-gray-200 bg-gray-50 rounded-b-3xl">
          <p className="mb-4 text-xs font-semibold text-gray-600">
            Source officielle : Loi n°2023-892 du 23 novembre 2023 portant Statut Général de la Fonction Publique
          </p>
          <button
            onClick={onClose}
            className="px-10 py-4 text-base font-bold text-white transition bg-gray-900 rounded-xl hover:bg-gray-800"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeExplanationModal;