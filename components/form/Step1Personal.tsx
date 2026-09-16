"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormularioConductorValues } from "@/lib/schema";
import { RutInput } from "../ui/RutInput";
import { PhoneInput } from "../ui/PhoneInput";
import {
  REGIONES_Y_COMUNAS,
  TODAS_LAS_COMUNAS,
  ESTADOS_CIVILES,
  ESTUDIOS_ALCANZADOS,
} from "@/lib/chile-data";
import { User, MapPin, Mail, GraduationCap, Heart, Phone } from "lucide-react";

interface StepProps {
  form: UseFormReturn<FormularioConductorValues>;
}

export const Step1Personal: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const rutValue = watch("rut") || "";
  const telefonoPrincipalValue = watch("telefonoPrincipal") || "";
  const telefonoSecundarioValue = watch("telefonoSecundario") || "";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200/80 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-dasai-600" />
          <span>Datos Personales del Conductor</span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Ingrese la información básica del transportista. Estos datos deben coincidir con su cédula de identidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre completo */}
        <div className="md:col-span-2 space-y-1.5">
          <label htmlFor="nombreCompleto" className="text-sm font-medium text-slate-700">
            Nombre Completo <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            id="nombreCompleto"
            type="text"
            {...register("nombreCompleto")}
            placeholder="Ej: Juan Carlos Pérez González"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${
              errors.nombreCompleto
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-dasai-500 focus:ring-dasai-100"
            }`}
          />
          {errors.nombreCompleto?.message && (
            <p className="text-xs text-red-600 font-medium">{String(errors.nombreCompleto.message)}</p>
          )}
        </div>

        {/* RUT */}
        <div>
          <RutInput
            id="rut"
            label="RUT del Conductor"
            value={rutValue}
            onChange={(val) => setValue("rut", val, { shouldValidate: true })}
            error={errors.rut?.message as string}
            required
            placeholder="12.345.678-K"
            helperText="Formato estándar chileno con dígito verificador"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-dasai-600" />
            <span>Correo Electrónico de Contacto</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="ejemplo@correo.cl"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${
              errors.email
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-dasai-500 focus:ring-dasai-100"
            }`}
          />
          {errors.email?.message && (
            <p className="text-xs text-red-600 font-medium">{String(errors.email.message)}</p>
          )}
        </div>

        {/* Dirección */}
        <div className="space-y-1.5">
          <label htmlFor="direccion" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-dasai-600" />
            <span>Dirección de Residencia</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            id="direccion"
            type="text"
            {...register("direccion")}
            placeholder="Calle, número, depto / villa"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${
              errors.direccion
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-dasai-500 focus:ring-dasai-100"
            }`}
          />
          {errors.direccion?.message && (
            <p className="text-xs text-red-600 font-medium">{String(errors.direccion.message)}</p>
          )}
        </div>

        {/* Comuna */}
        <div className="space-y-1.5">
          <label htmlFor="comuna" className="text-sm font-medium text-slate-700">
            Comuna <span className="text-red-500 font-bold">*</span>
          </label>
          <select
            id="comuna"
            {...register("comuna")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
              errors.comuna
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-dasai-500 focus:ring-dasai-100"
            }`}
          >
            <option value="">Seleccione una comuna...</option>
            {REGIONES_Y_COMUNAS.map((region) => (
              <optgroup key={region.id} label={`Región ${region.name}`}>
                {region.communes.map((comuna) => (
                  <option key={comuna} value={comuna}>
                    {comuna}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.comuna?.message && (
            <p className="text-xs text-red-600 font-medium">{String(errors.comuna.message)}</p>
          )}
        </div>

        {/* Teléfono Principal */}
        <div>
          <PhoneInput
            id="telefonoPrincipal"
            label="Teléfono Principal"
            value={telefonoPrincipalValue}
            onChange={(val) => setValue("telefonoPrincipal", val, { shouldValidate: true })}
            error={errors.telefonoPrincipal?.message as string}
            required
            placeholder="+56 9 1234 5678"
            helperText="Número de contacto directo"
          />
        </div>

        {/* Teléfono Secundario / WhatsApp */}
        <div>
          <PhoneInput
            id="telefonoSecundario"
            label="Teléfono Secundario / WhatsApp"
            value={telefonoSecundarioValue}
            onChange={(val) => setValue("telefonoSecundario", val, { shouldValidate: true })}
            error={errors.telefonoSecundario?.message as string}
            required={false}
            placeholder="+56 9 8765 4321"
            helperText="Opcional para avisos de emergencia"
          />
        </div>

        {/* Estado Civil */}
        <div className="space-y-1.5">
          <label htmlFor="estadoCivil" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-dasai-600" />
            <span>Estado Civil</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <select
            id="estadoCivil"
            {...register("estadoCivil")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
              errors.estadoCivil
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-dasai-500 focus:ring-dasai-100"
            }`}
          >
            <option value="">Seleccione estado civil...</option>
            {ESTADOS_CIVILES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.estadoCivil?.message && (
            <p className="text-xs text-red-600 font-medium">{String(errors.estadoCivil.message)}</p>
          )}
        </div>

        {/* Estudios alcanzados */}
        <div className="space-y-1.5">
          <label htmlFor="estudiosAlcanzados" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-dasai-600" />
            <span>Nivel de Estudios Alcanzados</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <select
            id="estudiosAlcanzados"
            {...register("estudiosAlcanzados")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
              errors.estudiosAlcanzados
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-dasai-500 focus:ring-dasai-100"
            }`}
          >
            <option value="">Seleccione nivel educacional...</option>
            {ESTUDIOS_ALCANZADOS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.estudiosAlcanzados?.message && (
            <p className="text-xs text-red-600 font-medium">{String(errors.estudiosAlcanzados.message)}</p>
          )}
        </div>
      </div>
    </div>
  );
};
