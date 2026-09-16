"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormularioConductorValues } from "@/lib/schema";
import { FileUpload } from "../ui/FileUpload";
import { Truck, Navigation, Shield, AlertCircle } from "lucide-react";

interface StepProps {
  form: UseFormReturn<FormularioConductorValues>;
}

export const Step4DocsVehiculo: React.FC<StepProps> = ({ form }) => {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = form;

  const padron = watch("padron");
  const soap = watch("soap");
  const permisoCirculacion = watch("permisoCirculacion");
  const revisionTecnica = watch("revisionTecnica");
  const certGases = watch("certGases");
  const tieneGps = watch("tieneGps");
  const tieneSeguro = watch("tieneSeguro");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200/80 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-dasai-600" />
          <span>Documentación del Vehículo de Transporte</span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Adjunte la documentación al día del vehículo con el que operará en los servicios de Dasai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Padrón */}
        <div>
          <FileUpload
            id="padron"
            label="Padrón del Vehículo (Ambas Caras o Combinado)"
            required
            value={padron}
            onChange={(file) => setValue("padron", file, { shouldValidate: true })}
            error={errors.padron?.message as string}
            helperText="Certificado de inscripción en el Registro Nacional de Vehículos Motorizados"
          />
        </div>

        {/* SOAP */}
        <div>
          <FileUpload
            id="soap"
            label="SOAP — Seguro Obligatorio (Ambas Caras)"
            required
            value={soap}
            onChange={(file) => setValue("soap", file, { shouldValidate: true })}
            error={errors.soap?.message as string}
            helperText="Póliza SOAP con vigencia anual activa"
          />
        </div>

        {/* Permiso de Circulación */}
        <div>
          <FileUpload
            id="permisoCirculacion"
            label="Permiso de Circulación al Día"
            required
            value={permisoCirculacion}
            onChange={(file) => setValue("permisoCirculacion", file, { shouldValidate: true })}
            error={errors.permisoCirculacion?.message as string}
            helperText="Comprobante municipal de pago del permiso vigente"
          />
        </div>

        {/* Revisión Técnica */}
        <div>
          <FileUpload
            id="revisionTecnica"
            label="Certificado de Revisión Técnica Vigente"
            required
            value={revisionTecnica}
            onChange={(file) => setValue("revisionTecnica", file, { shouldValidate: true })}
            error={errors.revisionTecnica?.message as string}
            helperText="Certificado emitido por planta de revisión técnica autorizada"
          />
        </div>

        {/* Certificado de Gases */}
        <div className="md:col-span-2">
          <FileUpload
            id="certGases"
            label="Certificado de Emisión de Gases / Homologación"
            required
            value={certGases}
            onChange={(file) => setValue("certGases", file, { shouldValidate: true })}
            error={errors.certGases?.message as string}
            helperText="Certificado de análisis de gases contaminantes al día"
          />
        </div>
      </div>

      {/* Equipamiento y Seguridad (Radios) */}
      <div className="border-t border-slate-200/80 pt-6 space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Equipamiento y Seguridad Adicional
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GPS */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              errors.tieneGps
                ? "border-red-300 bg-red-50/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-dasai-600" />
              <span className="text-sm font-semibold text-slate-800">
                ¿Dispone de GPS en el vehículo? <span className="text-red-500 font-bold">*</span>
              </span>
            </div>
            <div className="flex items-center gap-6 mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="si"
                  {...register("tieneGps")}
                  className="w-4 h-4 text-dasai-600 border-slate-300 focus:ring-dasai-500"
                />
                <span className="text-sm font-medium text-slate-700">Sí, cuenta con GPS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="no"
                  {...register("tieneGps")}
                  className="w-4 h-4 text-slate-600 border-slate-300 focus:ring-dasai-500"
                />
                <span className="text-sm font-medium text-slate-700">No cuenta con GPS</span>
              </label>
            </div>
            {errors.tieneGps?.message && (
              <p className="text-xs text-red-600 font-medium mt-2">{String(errors.tieneGps.message)}</p>
            )}
          </div>

          {/* Seguro Adicional */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              errors.tieneSeguro
                ? "border-red-300 bg-red-50/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-dasai-600" />
              <span className="text-sm font-semibold text-slate-800">
                ¿Dispone de Seguro de Carga / Vehicular?{" "}
                <span className="text-red-500 font-bold">*</span>
              </span>
            </div>
            <div className="flex items-center gap-6 mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="si"
                  {...register("tieneSeguro")}
                  className="w-4 h-4 text-dasai-600 border-slate-300 focus:ring-dasai-500"
                />
                <span className="text-sm font-medium text-slate-700">Sí, cuenta con seguro</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="no"
                  {...register("tieneSeguro")}
                  className="w-4 h-4 text-slate-600 border-slate-300 focus:ring-dasai-500"
                />
                <span className="text-sm font-medium text-slate-700">No cuenta con seguro</span>
              </label>
            </div>
            {errors.tieneSeguro?.message && (
              <p className="text-xs text-red-600 font-medium mt-2">
                {String(errors.tieneSeguro.message)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
