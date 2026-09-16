"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { RotateCcw, PenTool, CheckCircle2, AlertCircle } from "lucide-react";

interface SignaturePadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  error?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  value,
  onChange,
  error,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(Boolean(value));

  const getCanvasContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  }, []);

  // Inicializar canvas y adaptar resolución retina
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar dimensiones reales y CSS
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5;

    // Si ya existe un valor guardado (ej. borrador restaurado), pintarlo
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = value;
    }
  }, [value]);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const ctx = getCanvasContext();
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    if (!isDrawing) return;

    const ctx = getCanvasContext();
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onChange(dataUrl);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onChange("");
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <PenTool className="w-4 h-4 text-dasai-600" />
          <span>Firma del Conductor / Responsable</span>
          <span className="text-red-500 font-bold">*</span>
        </label>

        {hasDrawn ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Firmado
            </span>
            <button
              type="button"
              onClick={clearSignature}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Limpiar
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">Dibuje con el dedo o mouse</span>
        )}
      </div>

      <div
        className={`relative w-full h-44 bg-white border-2 rounded-xl overflow-hidden touch-none transition-all shadow-sm ${
          error
            ? "border-red-300 ring-2 ring-red-100"
            : hasDrawn
            ? "border-emerald-300 ring-2 ring-emerald-50"
            : "border-slate-300 hover:border-dasai-400"
        }`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="w-full h-full cursor-crosshair"
        />

        {/* Línea guía de firma */}
        <div className="absolute bottom-8 left-8 right-8 border-b border-dashed border-slate-200 pointer-events-none flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-slate-300 tracking-wider">
            Línea de firma
          </span>
          <span className="text-[10px] text-slate-300">X</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
