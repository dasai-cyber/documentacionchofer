"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, Image as ImageIcon, X, CheckCircle, AlertCircle } from "lucide-react";
import { FileAttachment } from "@/lib/schema";
import { formatBytes } from "@/lib/utils";

interface FileUploadProps {
  id: string;
  label: string;
  required?: boolean;
  value?: FileAttachment | null;
  onChange: (file: FileAttachment | null) => void;
  error?: string;
  accept?: string;
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  required = false,
  value,
  onChange,
  error,
  accept = ".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf",
  helperText,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setLocalError(null);

    // Validar tamaño (máx 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLocalError(`El archivo supera el límite de 10MB (${formatBytes(file.size)})`);
      return;
    }

    // Validar tipo MIME
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setLocalError("Formato no válido. Solo se admiten archivos PDF, JPG, PNG o WEBP.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onChange({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl,
      });
    };
    reader.onerror = () => {
      setLocalError("Ocurrió un error al leer el archivo. Intenta de nuevo.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setLocalError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isPdf = value?.type === "application/pdf" || value?.name?.endsWith(".pdf");
  const isImage = value?.type?.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(value?.name || "");

  const displayError = error || localError;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        {value && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Adjuntado
          </span>
        )}
      </div>

      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}

      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-dasai-500 bg-dasai-50/60 scale-[1.01]"
              : displayError
              ? "border-red-300 bg-red-50/30 hover:border-red-400"
              : "border-slate-300 hover:border-dasai-400 bg-white/70 hover:bg-slate-50/80 shadow-sm"
          }`}
        >
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-11 h-11 rounded-full bg-dasai-100 text-dasai-600 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-sm font-medium text-slate-700">
              <span className="text-dasai-600 hover:underline">Haz clic para subir</span> o arrastra y suelta aquí
            </div>
            <p className="text-xs text-slate-400">PDF, JPG, PNG o WEBP (Máx. 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center space-x-3 truncate">
            {isImage ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value.dataUrl}
                  alt={value.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}

            <div className="truncate">
              <p className="text-sm font-medium text-slate-800 truncate" title={value.name}>
                {value.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{formatBytes(value.size)}</span>
                <span>•</span>
                <span className="uppercase font-semibold text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                  {isPdf ? "PDF" : "IMAGEN"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar archivo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 pt-0.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
};
