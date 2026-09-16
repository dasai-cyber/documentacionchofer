"use client";

import React, { useState } from "react";
import {
  X,
  User,
  CreditCard,
  Building2,
  FileCheck,
  Truck,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  PenTool,
} from "lucide-react";

interface DriverDetailsModalProps {
  driver: any;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({
  driver,
  onClose,
  onStatusUpdated,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; url: string } | null>(null);
  const [newStatus, setNewStatus] = useState<string>(driver.estado || "pendiente_revision");
  const [adminNotes, setAdminNotes] = useState<string>(driver.observaciones_admin || "");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setUpdateMsg(null);
    try {
      const res = await fetch(`/api/conductores/${driver.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: newStatus,
          observaciones_admin: adminNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al actualizar estado");
      }
      setUpdateMsg("Estado actualizado correctamente");
      setTimeout(() => {
        onStatusUpdated();
        onClose();
      }, 800);
    } catch (e: any) {
      setUpdateMsg(e.message || "Error al actualizar");
    } finally {
      setIsUpdating(false);
    }
  };

  const docsList = [
    { key: "carnet_anverso", title: "Cédula de Identidad (Anverso)", url: driver.carnet_anverso },
    { key: "carnet_reverso", title: "Cédula de Identidad (Reverso)", url: driver.carnet_reverso },
    { key: "licencia_anverso", title: "Licencia de Conducir (Anverso)", url: driver.licencia_anverso },
    { key: "licencia_reverso", title: "Licencia de Conducir (Reverso)", url: driver.licencia_reverso },
    { key: "cert_hoja_vida", title: "Hoja de Vida del Conductor", url: driver.cert_hoja_vida },
    { key: "cert_antecedentes", title: "Certificado de Antecedentes", url: driver.cert_antecedentes },
    { key: "padron", title: "Padrón del Vehículo", url: driver.padron },
    { key: "soap", title: "Seguro SOAP", url: driver.soap },
    { key: "permiso_circulacion", title: "Permiso de Circulación", url: driver.permiso_circulacion },
    { key: "revision_tecnica", title: "Revisión Técnica", url: driver.revision_tecnica },
    { key: "cert_gases", title: "Certificado de Gases", url: driver.cert_gases },
    { key: "estatuto_actualizado", title: "Estatuto Social", url: driver.estatuto_actualizado },
    { key: "vigencia_actualizada", title: "Certificado de Vigencia", url: driver.vigencia_actualizada },
    { key: "e_rut", title: "E-RUT Empresa", url: driver.e_rut },
    { key: "carpeta_tributaria", title: "Carpeta Tributaria", url: driver.carpetaTributaria || driver.carpeta_tributaria },
    { key: "comodato_notarial", title: "Comodato Notarial", url: driver.comodato_notarial },
  ].filter((d) => Boolean(d.url));

  const isBase64 = (url: string) => url?.startsWith("data:");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-dasai-400">
              Detalle de Ficha de Registro
            </span>
            <h3 className="text-xl font-bold text-white">{driver.nombre_completo}</h3>
            <p className="text-xs text-slate-400 font-mono">RUT: {driver.rut} • Folio: {driver.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* Fila 1: Datos Personales y Bancarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personales */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1.5">
                <User className="w-4 h-4 text-dasai-600" />
                <span>Datos del Conductor</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Email:</span>
                  <p className="font-medium text-slate-800 truncate">{driver.email}</p>
                </div>
                <div>
                  <span className="text-slate-400">Teléfono:</span>
                  <p className="font-medium text-slate-800">{driver.telefono_principal}</p>
                </div>
                <div>
                  <span className="text-slate-400">Dirección:</span>
                  <p className="font-medium text-slate-800">{driver.direccion}, {driver.comuna}</p>
                </div>
                <div>
                  <span className="text-slate-400">Estado Civil / Estudios:</span>
                  <p className="font-medium text-slate-800">{driver.estado_civil} • {driver.estudios_alcanzados}</p>
                </div>
              </div>
            </div>

            {/* Bancarios */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1.5">
                <CreditCard className="w-4 h-4 text-dasai-600" />
                <span>Datos de Transferencia</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Banco:</span>
                  <p className="font-medium text-slate-800">{driver.banco}</p>
                </div>
                <div>
                  <span className="text-slate-400">Tipo de Cuenta:</span>
                  <p className="font-medium text-slate-800">{driver.tipo_cuenta}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Número de Cuenta:</span>
                  <p className="font-bold font-mono text-slate-900 text-sm">{driver.numero_cuenta}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fila 2: Modalidad Empresa y Vehículo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1.5">
                <Building2 className="w-4 h-4 text-dasai-600" />
                <span>Modalidad Tributaria</span>
              </h4>
              <p className="text-xs">
                {driver.registra_empresa ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-dasai-700 bg-dasai-50 px-2 py-0.5 rounded-md border border-dasai-200">
                    Registra Empresa Comercial
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    Persona Natural (Comodato Notarial)
                  </span>
                )}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1.5">
                <Truck className="w-4 h-4 text-dasai-600" />
                <span>Equipamiento y Archivos</span>
              </h4>
              <div className="flex flex-wrap gap-3 text-xs font-medium">
                <span>GPS: <strong>{driver.tiene_gps ? "Sí" : "No"}</strong></span>
                <span>•</span>
                <span>Seguro: <strong>{driver.tiene_seguro ? "Sí" : "No"}</strong></span>
              </div>
              {driver.google_drive_folder && (
                <div className="pt-2">
                  <a
                    href={driver.google_drive_folder}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors border border-blue-200"
                  >
                    <span>Abrir en Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Documentos Adjuntos y Firma */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-dasai-600" />
              <span>Documentos Adjuntos ({docsList.length})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {docsList.map((doc) => (
                <div
                  key={doc.key}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-dasai-400 transition-colors shadow-sm"
                >
                  <span className="font-medium text-xs text-slate-700 truncate mr-2" title={doc.title}>
                    {doc.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(doc)}
                    className="p-1.5 bg-dasai-50 text-dasai-600 hover:bg-dasai-100 rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Ver</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Firma Digital */}
          {driver.firma_digital && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-dasai-600" />
                <span>Firma Digital del Conductor</span>
              </h4>
              <div className="bg-white p-3 rounded-xl border border-slate-200 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={driver.firma_digital}
                  alt="Firma Digital"
                  className="max-h-24 object-contain"
                />
              </div>
            </div>
          )}

          {/* Gestión de Estado Administrativo */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-dasai-300">
              Gestión de Estado y Dictamen de Ficha
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Estado de la Solicitud
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-dasai-400"
                >
                  <option value="pendiente_revision">⏳ Pendiente de Revisión</option>
                  <option value="aprobado">✅ Aprobado (Listo para Operar)</option>
                  <option value="rechazado">❌ Rechazado</option>
                  <option value="observado">⚠️ Observado (Requiere corregir doc)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Observaciones Internas / Motivo
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ej: Licencia vigente validada, apto para flota"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-dasai-400"
                />
              </div>
            </div>

            {updateMsg && (
              <p className="text-xs font-bold text-emerald-400">{updateMsg}</p>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-5 py-2 rounded-xl bg-dasai-600 hover:bg-dasai-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                <span>Guardar Dictamen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visor Flotante de Documento */}
        {selectedDoc && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 border-b flex items-center justify-between bg-slate-900 text-white">
                <span className="font-bold text-sm">{selectedDoc.title}</span>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-100">
                {selectedDoc.url.startsWith("data:application/pdf") || selectedDoc.url.endsWith(".pdf") ? (
                  <iframe
                    src={selectedDoc.url}
                    className="w-full h-[65vh] rounded-lg border border-slate-300"
                    title={selectedDoc.title}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedDoc.url}
                    alt={selectedDoc.title}
                    className="max-h-[65vh] object-contain rounded-lg shadow-sm"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
