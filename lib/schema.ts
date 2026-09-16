import { z } from "zod";
import { validateRut } from "./rut-validator";

// Esquema para un archivo adjunto (Base64 / URL con metadatos)
export const FileAttachmentSchema = z.object({
  name: z.string().min(1, "Nombre de archivo requerido"),
  size: z.number().max(10 * 1024 * 1024, "El archivo no debe exceder 10MB"),
  type: z.string().refine(
    (val) =>
      ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        val.toLowerCase()
      ),
    "Solo se permiten archivos PDF, JPG, PNG o WEBP"
  ),
  dataUrl: z.string().min(1, "Contenido de archivo requerido"),
});

export type FileAttachment = z.infer<typeof FileAttachmentSchema>;

// Paso 1: Datos Personales
export const Step1PersonalSchema = z.object({
  nombreCompleto: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(120, "El nombre es demasiado largo"),
  rut: z
    .string()
    .min(8, "RUT requerido")
    .refine((val) => validateRut(val), {
      message: "El RUT ingresado no es válido o el dígito verificador es incorrecto",
    }),
  direccion: z.string().min(3, "La dirección es requerida"),
  comuna: z.string().min(1, "Debe seleccionar una comuna"),
  telefonoPrincipal: z
    .string()
    .min(8, "Teléfono principal requerido")
    .refine(
      (val) => {
        const clean = val.replace(/\D/g, "");
        return clean.length >= 8 && clean.length <= 12;
      },
      { message: "Ingrese un número de teléfono válido (ej: +56 9 1234 5678)" }
    ),
  telefonoSecundario: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const clean = val.replace(/\D/g, "");
        return clean.length >= 8 && clean.length <= 12;
      },
      { message: "Ingrese un número secundario válido" }
    ),
  email: z.string().email("Ingrese un correo electrónico válido"),
  estadoCivil: z.string().min(1, "Seleccione un estado civil"),
  estudiosAlcanzados: z.string().min(1, "Seleccione el nivel de estudios"),
});

// Paso 2: Datos Bancarios
export const Step2BancosSchema = z.object({
  banco: z.string().min(1, "Seleccione un banco"),
  tipoCuenta: z.string().min(1, "Seleccione el tipo de cuenta"),
  numeroCuenta: z
    .string()
    .min(1, "El número de cuenta es requerido")
    .regex(/^\d+$/, "El número de cuenta solo debe contener dígitos numéricos"),
});

// Paso 3: Documentos Conductor
export const Step3DocsConductorSchema = z.object({
  certHojaVida: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "El certificado de hoja de vida del conductor es obligatorio"
  ),
  licenciaAnverso: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "La licencia de conducir (anverso) es obligatoria"
  ),
  licenciaReverso: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "La licencia de conducir (reverso) es obligatoria"
  ),
  carnetAnverso: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "La cédula de identidad (anverso) es obligatoria"
  ),
  carnetReverso: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "La cédula de identidad (reverso) es obligatoria"
  ),
  certAntecedentes: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "El certificado de antecedentes es obligatorio"
  ),
});

// Paso 4: Documentos Vehículo
export const Step4DocsVehiculoSchema = z.object({
  padron: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "El padrón del vehículo es obligatorio"
  ),
  soap: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "El seguro SOAP es obligatorio"
  ),
  permisoCirculacion: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "El permiso de circulación es obligatorio"
  ),
  revisionTecnica: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "La revisión técnica es obligatoria"
  ),
  certGases: FileAttachmentSchema.nullable().refine(
    (file) => file !== null,
    "El certificado de gases / homologación es obligatorio"
  ),
  tieneGps: z.enum(["si", "no"], {
    errorMap: () => ({ message: "Indique si el vehículo dispone de GPS" }),
  }),
  tieneSeguro: z.enum(["si", "no"], {
    errorMap: () => ({ message: "Indique si el vehículo dispone de seguro adicional" }),
  }),
});

// Paso 5: Documentos Empresa (Base Schema)
export const Step5EmpresaBaseSchema = z.object({
  registraEmpresa: z.enum(["si", "no"], {
    errorMap: () => ({ message: "Indique si registra empresa" }),
  }),
  estatutoActualizado: FileAttachmentSchema.nullable().optional(),
  vigenciaActualizada: FileAttachmentSchema.nullable().optional(),
  eRut: FileAttachmentSchema.nullable().optional(),
  carpetaTributaria: FileAttachmentSchema.nullable().optional(),
  comodatoNotarial: FileAttachmentSchema.nullable().optional(),
});

export const Step5EmpresaSchema = Step5EmpresaBaseSchema.superRefine((data, ctx) => {
  if (data.registraEmpresa === "si") {
    if (!data.estatutoActualizado) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["estatutoActualizado"],
        message: "El estatuto actualizado es obligatorio para empresas",
      });
    }
    if (!data.vigenciaActualizada) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vigenciaActualizada"],
        message: "La vigencia de poder actualizada es obligatoria",
      });
    }
    if (!data.eRut) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eRut"],
        message: "El E-RUT de la empresa es obligatorio",
      });
    }
    if (!data.carpetaTributaria) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["carpetaTributaria"],
        message: "La carpeta tributaria actualizada es obligatoria",
      });
    }
  }
});

// Paso 6: Consentimiento Ley 21.719 y Firma
export const Step6FirmaSchema = z.object({
  consentimientoLey21719: z.literal(true, {
    errorMap: () => ({
      message: "Debe autorizar el uso de sus datos conforme a la Ley 21.719 para continuar",
    }),
  }),
  firmaDigital: z
    .string()
    .min(100, "Debe realizar su firma digital en el recuadro"),
});

// Esquema Base Completo
export const FormularioConductorBaseSchema = Step1PersonalSchema
  .merge(Step2BancosSchema)
  .merge(Step3DocsConductorSchema)
  .merge(Step4DocsVehiculoSchema)
  .merge(Step5EmpresaBaseSchema)
  .merge(Step6FirmaSchema);

export const FormularioConductorSchema = FormularioConductorBaseSchema.superRefine(
  (data, ctx) => {
    if (data.registraEmpresa === "si") {
      if (!data.estatutoActualizado) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["estatutoActualizado"],
          message: "El estatuto actualizado es obligatorio para empresas",
        });
      }
      if (!data.vigenciaActualizada) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vigenciaActualizada"],
          message: "La vigencia de poder actualizada es obligatoria",
        });
      }
      if (!data.eRut) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["eRut"],
          message: "El E-RUT de la empresa es obligatorio",
        });
      }
      if (!data.carpetaTributaria) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["carpetaTributaria"],
          message: "La carpeta tributaria actualizada es obligatoria",
        });
      }
    }
  }
);

export type FormularioConductorValues = z.infer<typeof FormularioConductorBaseSchema>;
