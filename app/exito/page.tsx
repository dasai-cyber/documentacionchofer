"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  FileCheck,
  Calendar,
  User,
  CreditCard,
  Building2,
  Phone,
  Mail,
  Printer,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function ExitoPage() {
  const [comprobante, setComprobante] = useState<any>(null);

  useEffect(() => {
    try {
      const data = sessionStorage.getItem("dasai_comprobante");
      if (data) {
        setComprobante(JSON.parse(data));
      }
    } catch (e) {
      console.warn("No se pudo leer el comprobante", e);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Tarjeta de Éxito */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Registro Recibido Correctamente
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ¡Ficha de Conductor Registrada!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Hemos recibido satisfactoriamente tus antecedentes y documentación vehicular. Tu solicitud ha entrado al proceso de revisión por parte del equipo de operaciones de Dasai.
          </p>
        </div>

        {/* Resumen del Comprobante */}
        {comprobante && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Folio de Registro</span>
                <p className="text-xs font-mono font-bold text-slate-800 break-all">{comprobante.id}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Fecha de Envío</span>
                <p className="text-xs font-semibold text-slate-700">
                  {new Date(comprobante.createdAt).toLocaleDateString("es-CL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Conductor:</span>
                <p className="font-bold text-slate-800 text-sm">{comprobante.nombreCompleto}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">RUT:</span>
                <p className="font-bold text-slate-800 font-mono text-sm">{comprobante.rut}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Correo Electrónico:</span>
                <p className="font-semibold text-slate-700">{comprobante.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Teléfono:</span>
                <p className="font-semibold text-slate-700">{comprobante.telefonoPrincipal}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Banco Receptor:</span>
                <p className="font-semibold text-slate-700">
                  {comprobante.banco} ({comprobante.tipoCuenta})
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Modalidad Tributaria:</span>
                <p className="font-semibold text-slate-700">
                  {comprobante.registraEmpresa === "si" ? "Con Empresa Registrada" : "Persona Natural (Comodato)"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Próximos pasos */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 text-left text-xs text-sky-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sky-800">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>¿Qué sigue ahora?</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Nuestro equipo legal y de operaciones validará la vigencia de tus documentos en un plazo de 24 a 48 horas hábiles.</li>
            <li>Recibirás una notificación por correo electrónico y WhatsApp con el estado de tu postulación.</li>
            <li>Una vez aprobado, serás contactado para la inducción operativa y asignación de rutas Dasai.</li>
          </ul>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Comprobante</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-dasai-600 hover:bg-dasai-700 text-white text-xs font-bold shadow-lg shadow-dasai-600/20 transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
