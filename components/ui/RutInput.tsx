"use client";

import React from "react";
import { formatRut, validateRut, cleanRut } from "@/lib/rut-validator";
import { Check, AlertCircle } from "lucide-react";

interface RutInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

export const RutInput: React.FC<RutInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  required = true,
  placeholder = "12.345.678-K",
  helperText = "Sin puntos ni guión o con formato estándar",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleaned = cleanRut(rawVal);
    // Limitar longitud máxima de RUT chileno (9 caracteres limpios = hasta 99.999.999-K)
    if (cleaned.length <= 9) {
      const formatted = formatRut(rawVal);
      onChange(formatted);
    }
  };

  const isValid = value.length >= 8 && validateRut(value);

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        {isValid && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3" /> RUT Válido
          </span>
        )}
      </div>

      <div className="relative rounded-xl shadow-sm">
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-mono text-sm tracking-wide ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : isValid
              ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100"
              : "border-slate-300 focus:border-dasai-500 focus:ring-dasai-100"
          }`}
        />
      </div>

      {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
