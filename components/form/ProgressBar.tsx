"use client";

import React from "react";
import {
  User,
  CreditCard,
  FileCheck,
  Truck,
  Building2,
  PenTool,
  Check,
} from "lucide-react";

export interface StepItem {
  id: number;
  title: string;
  shortTitle: string;
  icon: React.ElementType;
}

export const FORM_STEPS: StepItem[] = [
  { id: 1, title: "Datos Personales", shortTitle: "Personal", icon: User },
  { id: 2, title: "Datos Transferencia", shortTitle: "Banco", icon: CreditCard },
  { id: 3, title: "Docs Conductor", shortTitle: "Conductor", icon: FileCheck },
  { id: 4, title: "Docs Vehículo", shortTitle: "Vehículo", icon: Truck },
  { id: 5, title: "Docs Empresa", shortTitle: "Empresa", icon: Building2 },
  { id: 6, title: "Consentimiento y Firma", shortTitle: "Firma", icon: PenTool },
];

interface ProgressBarProps {
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  maxReachedStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  onStepClick,
  maxReachedStep,
}) => {
  const percentage = Math.round(((currentStep - 1) / (FORM_STEPS.length - 1)) * 100);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 mb-8">
      {/* Header con progreso porcentual */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-dasai-600 bg-dasai-50 px-2.5 py-1 rounded-md">
            Paso {currentStep} de {FORM_STEPS.length}
          </span>
          <h2 className="text-lg font-bold text-slate-800 mt-1">
            {FORM_STEPS[currentStep - 1].title}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-slate-900">{percentage}%</span>
          <p className="text-xs text-slate-400 font-medium">Completado</p>
        </div>
      </div>

      {/* Barra de progreso continua */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-gradient-to-r from-dasai-500 to-dasai-400 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Pasos en desktop */}
      <div className="hidden md:grid md:grid-cols-6 gap-2">
        {FORM_STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isAccessible = step.id <= maxReachedStep;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && onStepClick?.(step.id)}
              className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                isCurrent
                  ? "bg-dasai-50 border border-dasai-200 text-dasai-700 shadow-sm"
                  : isCompleted
                  ? "hover:bg-slate-50 text-slate-700 cursor-pointer"
                  : "opacity-40 text-slate-400 cursor-not-allowed"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                    : isCurrent
                    ? "bg-dasai-600 text-white shadow-md shadow-dasai-500/30 ring-4 ring-dasai-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className="text-xs font-semibold leading-tight line-clamp-1">
                {step.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mini resumen en móvil */}
      <div className="md:hidden flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
        <span className="font-medium text-slate-700">
          Siguiente: {FORM_STEPS[currentStep] ? FORM_STEPS[currentStep].title : "Finalizar y Enviar"}
        </span>
      </div>
    </div>
  );
};
