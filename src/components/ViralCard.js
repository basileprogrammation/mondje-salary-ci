import React from "react";
import { X, RefreshCcw, Download } from "lucide-react";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gradient-to-br from-green-600 to-orange-500 w-full max-w-sm rounded-2xl shadow-2xl text-white p-4 animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-bold">Carte Mondje 🇨🇮</div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Card */}
        <div className="bg-white/20 rounded-xl p-3 text-center mb-3">
          <p className="text-xs opacity-90">{jobLabel}</p>
          <p className="text-xs opacity-80">{sectorLabel} • {gradeLabel}</p>

          <div className="my-3">
            <p className="text-2xl font-black">
              {Math.round(minSalary / 1000)}K – {Math.round(maxSalary / 1000)}K
            </p>
            <p className="text-xs">FCFA / mois</p>
          </div>

          <p className="italic text-sm">“{message}”</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onRandomizeMessage}
            className="flex-1 bg-white/20 py-2 rounded-lg text-xs flex items-center justify-center gap-1"
          >
            <RefreshCcw size={14} />
            Changer
          </button>

          <button
            onClick={() => alert("Téléchargement bientôt 📸")}
            className="flex-1 bg-black/20 py-2 rounded-lg text-xs flex items-center justify-center gap-1"
          >
            <Download size={14} />
            Télécharger
          </button>
        </div>
      </div>
    </div>
  );
}
