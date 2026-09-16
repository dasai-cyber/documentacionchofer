"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface PhoneInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder = "+56 9 1234 5678",
  helperText,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Normalizar números
    const digits = raw.replace(/\D/g, "");

    // Si el usuario empieza a escribir, formatear con +56 9
    let formatted = "";
    if (digits.length === 0) {
      formatted = "";
    } else if (digits.startsWith("569") && digits.length <= 11) {
      const rest = digits.slice(3);
      if (rest.length <= 4) {
        formatted = `+56 9 ${rest}`;
      } else {
        formatted = `+56 9 ${rest.slice(0, 4)} ${rest.slice(4, 8)}`;
      }
    } else if (digits.startsWith("9") && digits.length <= 9) {
      const rest = digits.slice(1);
      if (rest.length <= 4) {
        formatted = `+56 9 ${rest}`;
      } else {
        formatted = `+56 9 ${rest.slice(0, 4)} ${rest.slice(4, 8)}`;
      }
    } else if (digits.length <= 8) {
      if (digits.length <= 4) {
        formatted = `+56 9 ${digits}`;
      } else {
        formatted = `+56 9 ${digits.slice(0, 4)} ${digits.slice(4, 8)}`;
      }
    } else {
      // Fallback
      formatted = raw;
    }

    onChange(formatted);
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      </div>

      <div className="relative rounded-xl shadow-sm">
        <input
          id={id}
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm font-mono ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
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
