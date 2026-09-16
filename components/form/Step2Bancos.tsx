"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormularioConductorValues } from "@/lib/schema";
import { BANCOS_CHILE, TIPOS_CUENTA } from "@/lib/chile-data";
import { Landmark, CreditCard, Hash, ShieldAlert } from "lucide-react";

interface StepProps {
  form: UseFormReturn<FormularioConductorValues>;
}

export const Step2Bancos: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200/80 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-dasai-600" />
          <span>Datos Bancarios para Transferencias</span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Indique la cuenta bancaria donde se realizarán las liquidaciones y pagos de servicios de transporte.
        </p>
      </div>

      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-800 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Importante:</span> La cuenta bancaria debe estar a nombre del transportista o de la empresa registrada para evitar rechazos o demoras en los pagos.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Banco */}
        <div className="space-y-1.5">
          <label htmlFor="banco" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-dasai-600" />
            <span>Institución Bancaria</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <select
            id="banco"
            {...register("banco")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
              errors.banco
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-dasai-500 focus:ring-dasai-100"
            }`}
          >
            <option value="">Seleccione un banco...</option>
            {BANCOS_CHILE.map((banco) => (
              <option key={banco} value={banco}>
                {banco}
              </option>
            ))}
          </select>
          {errors.banco?.message && (
            <p className="text-xs text-red-600 font-medium">{String(errors.banco.message)}</p>
          )}
        </div>

        {/* Tipo de Cuenta */}
        <div className="space-y-1.5">
          <label htmlFor="tipoCuenta" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-dasai-600" />
            <span>Tipo de Cuenta</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <select
            id="tipoCuenta"
            {...register("tipoCuenta")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
              errors.tipoCuenta
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-dasai-500 focus:ring-dasai-100"
            }`}
          >
            <option value="">Seleccione tipo de cuenta...</option>
            {TIPOS_CUENTA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errors.tipoCuenta?.message && (
            <p className="text-xs text-red-600 font-medium">{String(errors.tipoCuenta.message)}</p>
          )}
        </div>

        {/* Número de Cuenta */}
        <div className="md:col-span-2 space-y-1.5">
          <label htmlFor="numeroCuenta" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-dasai-600" />
            <span>Número de Cuenta</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            id="numeroCuenta"
            type="text"
            inputMode="numeric"
            {...register("numeroCuenta")}
            placeholder="Solo dígitos numéricos (ej: 123456789)"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-mono text-sm tracking-wider ${
              errors.numeroCuenta
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-dasai-500 focus:ring-dasai-100"
            }`}
          />
          {errors.numeroCuenta?.message && (
            <p className="text-xs text-red-600 font-medium">{String(errors.numeroCuenta.message)}</p>
          )}
        </div>
      </div>
    </div>
  );
};
