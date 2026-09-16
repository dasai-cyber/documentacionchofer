"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormularioConductorValues } from "@/lib/schema";
import { FileUpload } from "../ui/FileUpload";
import { FileCheck2, ShieldCheck, Info } from "lucide-react";

interface StepProps {
  form: UseFormReturn<FormularioConductorValues>;
}

export const Step3DocsConductor: React.FC<StepProps> = ({ form }) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const certHojaVida = watch("certHojaVida");
  const licenciaAnverso = watch("licenciaAnverso");
  const licenciaReverso = watch("licenciaReverso");
  const carnetAnverso = watch("carnetAnverso");
  const carnetReverso = watch("carnetReverso");
  const certAntecedentes = watch("certAntecedentes");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200/80 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-dasai-600" />
          <span>Documentación Personal del Conductor</span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Adjunte copias legibles o fotografías nítidas de los documentos requeridos.
        </p>
      </div>

      <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 flex items-start gap-3 text-sky-800 text-xs">
        <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Recomendación:</span> Asegúrese de que todos los textos, fechas de vencimiento y códigos QR sean completamente legibles. Puede adjuntar archivos en formato PDF, JPG o PNG de hasta 10MB por documento.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cédula de Identidad Anverso */}
        <div>
          <FileUpload
            id="carnetAnverso"
            label="Cédula de Identidad (Anverso)"
            required
            value={carnetAnverso}
            onChange={(file) => setValue("carnetAnverso", file, { shouldValidate: true })}
            error={errors.carnetAnverso?.message as string}
            helperText="Foto frontal donde se vea el rostro y el RUT claramente"
          />
        </div>

        {/* Cédula de Identidad Reverso */}
        <div>
          <FileUpload
            id="carnetReverso"
            label="Cédula de Identidad (Reverso)"
            required
            value={carnetReverso}
            onChange={(file) => setValue("carnetReverso", file, { shouldValidate: true })}
            error={errors.carnetReverso?.message as string}
            helperText="Foto posterior con fecha de vencimiento y firma"
          />
        </div>

        {/* Licencia de Conducir Anverso */}
        <div>
          <FileUpload
            id="licenciaAnverso"
            label="Licencia de Conducir (Anverso)"
            required
            value={licenciaAnverso}
            onChange={(file) => setValue("licenciaAnverso", file, { shouldValidate: true })}
            error={errors.licenciaAnverso?.message as string}
            helperText="Debe indicar la clase de licencia (A2, A4, A5, etc.)"
          />
        </div>

        {/* Licencia de Conducir Reverso */}
        <div>
          <FileUpload
            id="licenciaReverso"
            label="Licencia de Conducir (Reverso)"
            required
            value={licenciaReverso}
            onChange={(file) => setValue("licenciaReverso", file, { shouldValidate: true })}
            error={errors.licenciaReverso?.message as string}
            helperText="Foto posterior de la licencia"
          />
        </div>

        {/* Hoja de Vida del Conductor */}
        <div>
          <FileUpload
            id="certHojaVida"
            label="Certificado Hoja de Vida del Conductor"
            required
            value={certHojaVida}
            onChange={(file) => setValue("certHojaVida", file, { shouldValidate: true })}
            error={errors.certHojaVida?.message as string}
            helperText="Emitido por el Registro Civil (vigencia menor a 30 días)"
          />
        </div>

        {/* Certificado de Antecedentes */}
        <div>
          <FileUpload
            id="certAntecedentes"
            label="Certificado de Antecedentes para Fines Especiales"
            required
            value={certAntecedentes}
            onChange={(file) => setValue("certAntecedentes", file, { shouldValidate: true })}
            error={errors.certAntecedentes?.message as string}
            helperText="Emitido por el Registro Civil (vigencia menor a 30 días)"
          />
        </div>
      </div>
    </div>
  );
};
