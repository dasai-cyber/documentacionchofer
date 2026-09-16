"use client";

import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, FileCheck, Layers } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-dasai-600 to-dasai-400 flex items-center justify-center shadow-lg shadow-dasai-500/20 group-hover:scale-105 transition-transform">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white">DASAI</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-dasai-500/20 text-dasai-300 px-1.5 py-0.5 rounded border border-dasai-400/30">
                Logística
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none">
              Ficha de Registro Conductores
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ley 21.719 Cumplimiento</span>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-dasai-400" />
            <span>Panel Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
