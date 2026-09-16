"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormularioConductorValues } from "@/lib/schema";
import { SignaturePad } from "../ui/SignaturePad";
import { ShieldCheck, FileText, CheckCircle2, ChevronDown, ChevronUp, Lock } from "lucide-react";

interface StepProps {
  form: UseFormReturn<FormularioConductorValues>;
}

export const Step6Firma: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const consentimiento = watch("consentimientoLey21719");
  const firmaDigital = watch("firmaDigital") || "";
  const [showFullLegal, setShowFullLegal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200/80 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-dasai-600" />
          <span>Consentimiento de Datos (Ley 21.719) y Firma Digital</span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Revise la cláusula de tratamiento de datos personales y estampe su firma manuscrita para finalizar su registro.
        </p>
      </div>

      {/* Tarjeta Legal Ley 21.719 */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold tracking-wide uppercase text-slate-200">
              Tratamiento de Datos Personales — Ley Nº 21.719
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setShowFullLegal(!showFullLegal)}
            className="text-xs text-dasai-400 hover:text-dasai-300 flex items-center gap-1 font-semibold"
          >
            {showFullLegal ? (
              <>
                <span>Ocultar texto legal</span> <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Ver cláusula completa</span> <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          En cumplimiento con la legislación chilena sobre protección de la vida privada y datos personales (Ley 21.719 y concordantes), la información y documentación proporcionada en este formulario será resguardada bajo estrictos estándares de confidencialidad y utilizada exclusivamente para los procesos de validación, contratación y coordinación operativa de servicios logísticos con <strong>Dasai</strong>.
        </p>

        {showFullLegal && (
          <div className="text-[11px] text-slate-400 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-2 animate-fade-in leading-relaxed">
            <p>
              1. <strong>Finalidad del Tratamiento:</strong> Los datos personales, antecedentes comerciales, certificados de idoneidad y documentación vehicular recopilados tienen como única finalidad la verificación de antecedentes legales, cumplimiento normativo de transporte terrestre y ejecución de los contratos de prestación de servicios entre el transportista y Dasai.
            </p>
            <p>
              2. <strong>No cesión a terceros:</strong> Dasai se compromete expresamente a no comercializar, ceder ni transferir sus datos a terceras partes ajenas a la relación contractual o a los requerimientos de la autoridad competente.
            </p>
            <p>
              3. <strong>Derechos ARCO:</strong> El titular de los datos podrá ejercer en cualquier momento sus derechos de acceso, rectificación, cancelación y oposición dirigiendo una comunicación a los canales formales de soporte de Dasai.
            </p>
          </div>
        )}

        {/* Checkbox de Consentimiento Obligatorio */}
        <div className="pt-2 border-t border-slate-800">
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              {...register("consentimientoLey21719")}
              className="w-5 h-5 rounded border-slate-700 text-dasai-500 focus:ring-dasai-400 focus:ring-offset-slate-900 mt-0.5"
            />
            <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
              Autorizo el uso de mis datos personales conforme a la <strong>Ley 21.719</strong> y la política de privacidad, para uso estrictamente contractual con Dasai, sin ser compartidos con otros fines.
              <span className="text-red-400 font-bold ml-1">*</span>
            </span>
          </label>
        </div>
      </div>

      {errors.consentimientoLey21719?.message && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
          {String(errors.consentimientoLey21719.message)}
        </div>
      )}

      {/* Canvas de Firma Digital */}
      <div className="pt-2">
        <SignaturePad
          value={firmaDigital}
          onChange={(dataUrl) => setValue("firmaDigital", dataUrl, { shouldValidate: true })}
          error={errors.firmaDigital?.message as string}
        />
      </div>

      {/* Declaración Jurada */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-dasai-600 flex-shrink-0" />
        <span>
          Al firmar digitalmente y presionar <strong>&ldquo;Enviar Registro Completo&rdquo;</strong>, declaro bajo juramento que toda la información y documentos adjuntados son fidedignos y se encuentran vigentes a la fecha.
        </span>
      </div>
    </div>
  );
};
