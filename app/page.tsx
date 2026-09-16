"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  FormularioConductorSchema,
  FormularioConductorValues,
} from "@/lib/schema";
import { ProgressBar, FORM_STEPS } from "@/components/form/ProgressBar";
import { Step1Personal } from "@/components/form/Step1Personal";
import { Step2Bancos } from "@/components/form/Step2Bancos";
import { Step3DocsConductor } from "@/components/form/Step3DocsConductor";
import { Step4DocsVehiculo } from "@/components/form/Step4DocsVehiculo";
import { Step5Empresa } from "@/components/form/Step5Empresa";
import { Step6Firma } from "@/components/form/Step6Firma";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Save,
  RotateCcw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  BookmarkCheck,
} from "lucide-react";

const STORAGE_KEY = "dasai_conductor_draft_v1";

const STEP_FIELDS: Record<number, (keyof FormularioConductorValues)[]> = {
  1: [
    "nombreCompleto",
    "rut",
    "direccion",
    "comuna",
    "telefonoPrincipal",
    "telefonoSecundario",
    "email",
    "estadoCivil",
    "estudiosAlcanzados",
  ],
  2: ["banco", "tipoCuenta", "numeroCuenta"],
  3: [
    "certHojaVida",
    "licenciaAnverso",
    "licenciaReverso",
    "carnetAnverso",
    "carnetReverso",
    "certAntecedentes",
  ],
  4: [
    "padron",
    "soap",
    "permisoCirculacion",
    "revisionTecnica",
    "certGases",
    "tieneGps",
    "tieneSeguro",
  ],
  5: [
    "registraEmpresa",
    "estatutoActualizado",
    "vigenciaActualizada",
    "eRut",
    "carpetaTributaria",
    "comodatoNotarial",
  ],
  6: ["consentimientoLey21719", "firmaDigital"],
};

export default function FormularioRegistroPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState<boolean>(false);
  const [draftSavedToast, setDraftSavedToast] = useState<boolean>(false);

  const form = useForm<FormularioConductorValues>({
    resolver: zodResolver(FormularioConductorSchema),
    mode: "onChange",
    defaultValues: {
      nombreCompleto: "",
      rut: "",
      direccion: "",
      comuna: "",
      telefonoPrincipal: "",
      telefonoSecundario: "",
      email: "",
      estadoCivil: "",
      estudiosAlcanzados: "",
      banco: "",
      tipoCuenta: "",
      numeroCuenta: "",
      certHojaVida: null,
      licenciaAnverso: null,
      licenciaReverso: null,
      carnetAnverso: null,
      carnetReverso: null,
      certAntecedentes: null,
      padron: null,
      soap: null,
      permisoCirculacion: null,
      revisionTecnica: null,
      certGases: null,
      tieneGps: "si",
      tieneSeguro: "si",
      registraEmpresa: "no",
      estatutoActualizado: null,
      vigenciaActualizada: null,
      eRut: null,
      carpetaTributaria: null,
      comodatoNotarial: null,
      consentimientoLey21719: false as any,
      firmaDigital: "",
    },
  });

  const { handleSubmit, trigger, reset, getValues } = form;

  // Cargar borrador al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Object.keys(parsed).length > 0) {
          reset(parsed);
          setShowDraftBanner(true);
        }
      }
    } catch (e) {
      console.warn("No se pudo cargar el borrador de localStorage", e);
    }
  }, [reset]);

  // Guardar borrador manual o al avanzar
  const saveDraft = () => {
    try {
      const values = getValues();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 3000);
    } catch (e) {
      console.warn("Error guardando borrador", e);
    }
  };

  const clearDraft = () => {
    if (confirm("¿Estás seguro de que deseas limpiar todos los campos del formulario?")) {
      localStorage.removeItem(STORAGE_KEY);
      reset({
        nombreCompleto: "",
        rut: "",
        direccion: "",
        comuna: "",
        telefonoPrincipal: "",
        telefonoSecundario: "",
        email: "",
        estadoCivil: "",
        estudiosAlcanzados: "",
        banco: "",
        tipoCuenta: "",
        numeroCuenta: "",
        certHojaVida: null,
        licenciaAnverso: null,
        licenciaReverso: null,
        carnetAnverso: null,
        carnetReverso: null,
        certAntecedentes: null,
        padron: null,
        soap: null,
        permisoCirculacion: null,
        revisionTecnica: null,
        certGases: null,
        tieneGps: "si",
        tieneSeguro: "si",
        registraEmpresa: "no",
        estatutoActualizado: null,
        vigenciaActualizada: null,
        eRut: null,
        carpetaTributaria: null,
        comodatoNotarial: null,
        consentimientoLey21719: false as any,
        firmaDigital: "",
      });
      setCurrentStep(1);
      setMaxReachedStep(1);
      setShowDraftBanner(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isStepValid = await trigger(fieldsToValidate as any);

    if (isStepValid) {
      saveDraft();
      const next = currentStep + 1;
      setCurrentStep(next);
      setMaxReachedStep((prev) => Math.max(prev, next));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = async (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const isCurrentValid = await trigger(STEP_FIELDS[currentStep] as any);
      if (isCurrentValid && stepId <= maxReachedStep) {
        setCurrentStep(stepId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const onSubmit = async (data: FormularioConductorValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/conductores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Ocurrió un problema al procesar su registro.");
      }

      // Limpiar borrador local
      localStorage.removeItem(STORAGE_KEY);

      // Guardar comprobante temporal en sessionStorage para la página de éxito
      sessionStorage.setItem(
        "dasai_comprobante",
        JSON.stringify({
          id: json.id,
          createdAt: json.createdAt,
          nombreCompleto: data.nombreCompleto,
          rut: data.rut,
          email: data.email,
          telefonoPrincipal: data.telefonoPrincipal,
          banco: data.banco,
          tipoCuenta: data.tipoCuenta,
          numeroCuenta: data.numeroCuenta,
          registraEmpresa: data.registraEmpresa,
        })
      );

      router.push("/exito");
    } catch (err: any) {
      setSubmitError(err.message || "Error al enviar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Aviso de borrador restaurado */}
      {showDraftBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Hemos restaurado tus datos guardados automáticamente de tu sesión previa.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowDraftBanner(false)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 ml-2"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Notificación flotante de borrador guardado */}
      {draftSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Borrador guardado en tu navegador</span>
        </div>
      )}

      {/* Stepper / Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        onStepClick={goToStep}
        maxReachedStep={maxReachedStep}
      />

      {/* Formulario Principal */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-8"
      >
        {currentStep === 1 && <Step1Personal form={form} />}
        {currentStep === 2 && <Step2Bancos form={form} />}
        {currentStep === 3 && <Step3DocsConductor form={form} />}
        {currentStep === 4 && <Step4DocsVehiculo form={form} />}
        {currentStep === 5 && <Step5Empresa form={form} />}
        {currentStep === 6 && <Step6Firma form={form} />}

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error al enviar la ficha:</span>
              <p className="mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        {/* Barra de Navegación de Pasos */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            )}

            <button
              type="button"
              onClick={saveDraft}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors"
              title="Guardar borrador para continuar después"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Borrador</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={clearDraft}
              className="text-xs text-slate-400 hover:text-red-500 font-medium px-2 py-1 transition-colors"
            >
              Limpiar todo
            </button>

            {currentStep < FORM_STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-dasai-600 hover:bg-dasai-700 text-white text-sm font-bold shadow-lg shadow-dasai-600/20 hover:shadow-dasai-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Siguiente Paso</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Procesando y Subiendo Documentos...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Registro Completo</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
