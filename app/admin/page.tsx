"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Filter,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { DriverDetailsModal } from "@/components/admin/DriverDetailsModal";

export default function AdminPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/conductores");
      const json = await res.json();
      if (json.success) {
        setDrivers(json.data || []);
      }
    } catch (e) {
      console.error("Error al cargar conductores", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchSearch =
        d.nombre_completo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.rut?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.comuna?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || d.estado === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [drivers, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: drivers.length,
      pendientes: drivers.filter((d) => d.estado === "pendiente_revision" || !d.estado).length,
      aprobados: drivers.filter((d) => d.estado === "aprobado").length,
      rechazados: drivers.filter((d) => d.estado === "rechazado").length,
      observados: drivers.filter((d) => d.estado === "observado").length,
    };
  }, [drivers]);

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Aprobado
          </span>
        );
      case "rechazado":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
            <XCircle className="w-3 h-3" /> Rechazado
          </span>
        );
      case "observado":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> Observado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
            <Clock className="w-3 h-3" /> Pendiente
          </span>
        );
    }
  };

  const exportCsv = () => {
    if (drivers.length === 0) return;
    const headers = [
      "ID",
      "Fecha",
      "Nombre",
      "RUT",
      "Email",
      "Telefono",
      "Comuna",
      "Banco",
      "Tipo_Cuenta",
      "Numero_Cuenta",
      "Registra_Empresa",
      "GPS",
      "Seguro",
      "Estado",
    ];
    const rows = filteredDrivers.map((d) => [
      d.id,
      d.created_at,
      `"${d.nombre_completo}"`,
      d.rut,
      d.email,
      d.telefono_principal,
      `"${d.comuna}"`,
      `"${d.banco}"`,
      `"${d.tipo_cuenta}"`,
      `"${d.numero_cuenta}"`,
      d.registra_empresa ? "SI" : "NO",
      d.tiene_gps ? "SI" : "NO",
      d.tiene_seguro ? "SI" : "NO",
      d.estado || "pendiente_revision",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `conductores_dasai_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-dasai-600 hover:text-dasai-700 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al formulario
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-dasai-600" />
            <span>Panel de Revisión de Fichas — Dasai</span>
          </h1>
          <p className="text-xs text-slate-500">
            Administración, dictamen legal y validación de antecedentes de transportistas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchDrivers}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            title="Actualizar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-dasai-600" : ""}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>

          <button
            type="button"
            onClick={exportCsv}
            disabled={filteredDrivers.length === 0}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Recibidos</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
          <span className="text-xs font-bold text-sky-600 uppercase">Pendientes</span>
          <p className="text-2xl font-black text-sky-700 mt-1">{stats.pendientes}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase">Aprobados</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stats.aprobados}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm">
          <span className="text-xs font-bold text-red-600 uppercase">Rechazados / Obs</span>
          <p className="text-2xl font-black text-red-700 mt-1">
            {stats.rechazados + stats.observados}
          </p>
        </div>
      </div>

      {/* Filtros y Buscador */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por RUT, nombre o comuna..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dasai-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "Todos" },
            { id: "pendiente_revision", label: "Pendientes" },
            { id: "aprobado", label: "Aprobados" },
            { id: "rechazado", label: "Rechazados" },
            { id: "observado", label: "Observados" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-dasai-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Conductores */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-200 border-b border-slate-800">
                <th className="p-3.5 font-bold uppercase tracking-wider">Conductor / RUT</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Contacto</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Comuna</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Modalidad</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Estado</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Fecha</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    {loading ? "Cargando fichas de registro..." : "No se encontraron registros de conductores con los filtros aplicados."}
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{driver.nombre_completo}</p>
                      <p className="font-mono text-slate-500 text-[11px]">{driver.rut}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="text-slate-700">{driver.email}</p>
                      <p className="text-slate-500">{driver.telefono_principal}</p>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">{driver.comuna}</td>
                    <td className="p-3.5">
                      {driver.registra_empresa ? (
                        <span className="text-[10px] font-bold uppercase bg-dasai-50 text-dasai-700 px-2 py-0.5 rounded border border-dasai-200">
                          Empresa
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Persona Natural
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">{getStatusBadge(driver.estado || "pendiente_revision")}</td>
                    <td className="p-3.5 text-slate-500 text-[11px]">
                      {new Date(driver.created_at).toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDriver(driver);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-dasai-50 hover:bg-dasai-100 text-dasai-600 font-bold rounded-lg transition-colors text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Revisar</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      {selectedDriver && (
        <DriverDetailsModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onStatusUpdated={() => {
            fetchDrivers();
          }}
        />
      )}
    </div>
  );
}
