import React from "react";
import { Shield, FileText, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-8 mt-12 text-slate-500 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>
            Transmisión encriptada y protegida según la legislación chilena (Ley 21.719).
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 hover:text-slate-700 transition-colors">
            <Shield className="w-3.5 h-3.5 text-dasai-500" />
            <span>Privacidad de Datos</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 hover:text-slate-700 transition-colors">
            <FileText className="w-3.5 h-3.5 text-dasai-500" />
            <span>Términos Dasai</span>
          </span>
          <span>•</span>
          <span>© {new Date().getFullYear()} Dasai SpA</span>
        </div>
      </div>
    </footer>
  );
};
