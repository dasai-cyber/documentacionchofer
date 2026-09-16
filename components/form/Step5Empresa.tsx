"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormularioConductorValues } from "@/lib/schema";
import { FileUpload } from "../ui/FileUpload";
import { Building2, FileCheck, FileSignature, AlertTriangle, ShieldCheck } from "lucide-react";

interface StepProps {
  form: UseFormReturn<FormularioConductorValues>;
}

export const Step5Empresa: React.FC<StepProps> = ({ form }) => {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = form;

  const registraEmpresa = watch("registraEmpresa");
  const estatutoActualizado = watch("estatutoActualizado");
  const vigenciaActualizada = watch("vigenciaActualizada");
  const eRut = watch("eRut");
  const carpetaTributaria = watch("carpetaTributaria");
  const comodatoNotarial = watch("comodatoNotarial");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200/80 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-dasai-600" />
          <span>Documentación de Acreditación de Empresa</span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Indique si opera bajo una persona jurídica (empresa/SpA/Ltda) o como persona natural.
        </p>
      </div>

      {/* Selector Toggle Principal */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">¿Registra empresa o sociedad comercial?</h4>
            <p className="text-xs text-slate-500">
              Seleccione si emitirá facturas o si opera mediante una sociedad constituida.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto shadow-sm">
            <button
              type="button"
              onClick={() => setValue("registraEmpresa", "si", { shouldValidate: true })}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                registraEmpresa === "si"
                  ? "bg-dasai-600 text-white shadow-md shadow-dasai-600/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Sí, registro empresa
            </button>
            <button
              type="button"
              onClick={() => setValue("registraEmpresa", "no", { shouldValidate: true })}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                registraEmpresa === "no"
                  ? "bg-dasai-600 text-white shadow-md shadow-dasai-600/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              No registro empresa
            </button>
          </div>
        </div>

        {errors.registraEmpresa?.message && (
          <p className="text-xs text-red-600 font-medium">{String(errors.registraEmpresa.message)}</p>
        )}
      </div>

      {/* CASO 1: SÍ REGISTRA EMPRESA */}
      {registraEmpresa === "si" && (
        <div className="space-y-6 animate-fade-in border-t border-slate-200/80 pt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-dasai-700 bg-dasai-50 px-3 py-2 rounded-xl border border-dasai-200/60">
            <FileCheck className="w-4 h-4 text-dasai-600" />
            <span>Documentos societarios y tributarios obligatorios para empresas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estatuto Actualizado */}
            <div>
              <FileUpload
                id="estatutoActualizado"
                label="Estatuto Social Actualizado"
                required
                value={estatutoActualizado}
                onChange={(file) => setValue("estatutoActualizado", file, { shouldValidate: true })}
                error={errors.estatutoActualizado?.message as string}
                helperText="Escritura de constitución o estatutos actualizados del Registro de Empresas"
              />
            </div>

            {/* Vigencia Actualizada */}
            <div>
              <FileUpload
                id="vigenciaActualizada"
                label="Certificado de Vigencia Actualizado"
                required
                value={vigenciaActualizada}
                onChange={(file) => setValue("vigenciaActualizada", file, { shouldValidate: true })}
                error={errors.vigenciaActualizada?.message as string}
                helperText="Certificado de vigencia de la sociedad emitido en los últimos 60 días"
              />
            </div>

            {/* E-RUT */}
            <div>
              <FileUpload
                id="eRut"
                label="E-RUT de la Empresa"
                required
                value={eRut}
                onChange={(file) => setValue("eRut", file, { shouldValidate: true })}
                error={errors.eRut?.message as string}
                helperText="Documento oficial del SII con el RUT de la sociedad"
              />
            </div>

            {/* Carpeta Tributaria */}
            <div>
              <FileUpload
                id="carpetaTributaria"
                label="Carpeta Tributaria Actualizada"
                required
                value={carpetaTributaria}
                onChange={(file) => setValue("carpetaTributaria", file, { shouldValidate: true })}
                error={errors.carpetaTributaria?.message as string}
                helperText="Carpeta tributaria para solicitar créditos o acreditar renta (SII)"
              />
            </div>
          </div>
        </div>
      )}

      {/* CASO 2: NO REGISTRA EMPRESA */}
      {registraEmpresa === "no" && (
        <div className="space-y-6 animate-fade-in border-t border-slate-200/80 pt-4">
          <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Requisito Notarial para Personas que No Registran Empresa
                </h4>
                <p className="text-xs text-amber-800 mt-1.5 font-medium leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-200">
                  &ldquo;Quienes no registren empresa deberán realizar documento en notaría en formato comodato a título gratuito.&rdquo;
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  Si ya cuenta con el documento firmado ante notario, puede adjuntarlo a continuación o presentarlo posteriormente antes de su primera ruta.
                </p>
              </div>
            </div>
          </div>

          <div>
            <FileUpload
              id="comodatoNotarial"
              label="Comodato Notarial a Título Gratuito (Opcional en esta fase)"
              required={false}
              value={comodatoNotarial}
              onChange={(file) => setValue("comodatoNotarial", file, { shouldValidate: true })}
              error={errors.comodatoNotarial?.message as string}
              helperText="Copia escaneada o foto del documento de comodato autorizado ante notario público"
            />
          </div>
        </div>
      )}
    </div>
  );
};
