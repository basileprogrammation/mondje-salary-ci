// src/components/ViralCardModal.jsx

import React, { useState } from "react";
import { X, RefreshCcw, Download } from "lucide-react";
import html2canvas from "html2canvas";

export default function ViralCardModal({
  open,
  onClose,
  jobLabel,
  sectorLabel,
  gradeLabel,
  minSalary,
  maxSalary,
  message,
  onRandomizeMessage,
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const cardElement = document.getElementById('viral-card-only');
      
      if (!cardElement) {
        console.error('❌ Élément carte non trouvé');
        alert('Erreur: Impossible de trouver la carte');
        return;
      }

      console.log('📸 Capture en cours...');

      const canvas = await html2canvas(cardElement, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `bahn-estimation-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ Téléchargement réussi');
    } catch (error) {
      console.error('❌ Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center p-4">
      <div className="relative w-full max-w-sm animate-fade-in">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-2 shadow-xl hover:scale-110 transition-transform"
        >
          <X size={20} className="text-gray-900" />
        </button>

        <div 
          id="viral-card-only"
          className="rounded-2xl shadow-2xl text-white p-6 mb-3"
          style={{
            background: 'linear-gradient(135deg, #3D9B9B 0%, #2D7A7A 60%, #F4C430 100%)'
          }}
        >
          {/* ✅ Header avec GRID pour centrage parfait */}
<div className="flex items-center gap-3 mb-4">
  <div className="relative">
    <div 
      className="w-12 h-12 rounded-xl relative"
      style={{ 
        backgroundColor: '#F4C430',
        display: 'grid',
        placeItems: 'center'
      }}
    >
      {/* Pétales emoji */}
      <span className="absolute -top-2 -right-2 text-base opacity-80 animate-bounce-slow">🌸</span>
      <span className="absolute -bottom-2 -left-2 text-sm opacity-70 animate-bounce-slow" style={{ animationDelay: '1s' }}>🌺</span>
      
      {/* Particules brillantes */}
      <div className="absolute -top-1 left-1 w-1.5 h-1.5 rounded-full bg-yellow-200 animate-ping"></div>
      <div className="absolute top-0 -right-1 w-1 h-1 rounded-full bg-pink-300 animate-ping" style={{ animationDelay: '0.5s' }}></div>
      
      <span 
        className="font-black relative z-10"
        style={{ 
          color: '#2D7A7A',
          fontSize: '28px',
          lineHeight: '1'
        }}
      >
        B
      </span>
    </div>
  </div>
  <h2 className="text-xl font-black leading-none">Carte BAHN 🇨🇮</h2>
</div>
          <div className="bg-white/20 rounded-xl p-4 text-center mb-3">
            <p className="text-sm opacity-90 mb-1">{jobLabel}</p>
            <p className="text-xs opacity-80 mb-3">{sectorLabel} • {gradeLabel}</p>

            <div className="my-4">
              <p className="text-3xl font-black">
                {Math.round(minSalary / 1000)}K – {Math.round(maxSalary / 1000)}K
              </p>
              <p className="text-sm opacity-90">FCFA / mois</p>
            </div>

            <p className="italic text-sm leading-relaxed">"{message}"</p>
          </div>

          <div className="text-center">
            <p className="text-white/80 text-xs font-medium">
              bahn-edu.com • Ton conseiller IA 🚀
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRandomizeMessage}
            className="flex-1 bg-white/90 hover:bg-white text-gray-900 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105"
          >
            <RefreshCcw size={16} />
            Changer
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(to right, #3D9B9B, #F4C430)'
            }}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Téléchargement...
              </>
            ) : (
              <>
                <Download size={16} />
                Télécharger
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
<style jsx>{`
  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }
  .animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
  }
`}</style>