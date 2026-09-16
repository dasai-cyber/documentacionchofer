import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { cleanRut } from "./rut-validator";
import { FileAttachment } from "./schema";

export const BUCKET_NAME = "adjuntos-conductores";

/**
 * Convierte un Data URL Base64 a Blob o Buffer
 */
export function dataUrlToBlob(dataUrl: string): { blob: Blob; extension: string } {
  const [header, base64Data] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: mimeType });

  let extension = "pdf";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) extension = "jpg";
  else if (mimeType.includes("png")) extension = "png";
  else if (mimeType.includes("webp")) extension = "webp";

  return { blob, extension };
}

/**
 * Sube un archivo a Supabase Storage organizado por RUT
 */
export async function uploadDriverDocument(
  rut: string,
  documentKey: string,
  file: FileAttachment
): Promise<string> {
  const rutClean = cleanRut(rut);
  const timestamp = Date.now();

  if (!isSupabaseConfigured || !supabase) {
    // Modo simulación/local: retornar dataUrl directamente o ruta virtual
    console.info(`[STORAGE MOCK] Guardado archivo '${documentKey}' para RUT ${rutClean}`);
    return file.dataUrl;
  }

  try {
    const { blob, extension } = dataUrlToBlob(file.dataUrl);
    const filePath = `${rutClean}/${documentKey}_${timestamp}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: true,
      });

    if (uploadError) {
      console.error(`Error subiendo ${documentKey}:`, uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error(`Fallo subida a storage para ${documentKey}:`, error);
    // Fallback amigable
    return file.dataUrl;
  }
}
