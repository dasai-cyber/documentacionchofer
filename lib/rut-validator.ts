/**
 * Utilidades para validación y formateo de RUT chileno
 */

/**
 * Limpia el RUT dejando solo números y dígito K
 */
export function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

/**
 * Calcula el dígito verificador usando el algoritmo de Módulo 11
 */
export function calculateDv(rutBody: string | number): string {
  let sum = 0;
  let multiplier = 2;
  const cleanBody = String(rutBody).replace(/[^0-9]/g, "");

  for (let i = cleanBody.length - 1; i >= 0; i--) {
    sum += parseInt(cleanBody.charAt(i), 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const result = 11 - remainder;

  if (result === 11) return "0";
  if (result === 10) return "K";
  return String(result);
}

/**
 * Valida si un RUT es válido (formato y dígito verificador correcto)
 */
export function validateRut(rut: string): boolean {
  if (!rut || typeof rut !== "string") return false;

  const cleaned = cleanRut(rut);
  if (cleaned.length < 8 || cleaned.length > 9) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  if (!/^\d+$/.test(body)) return false;

  const calculatedDv = calculateDv(body);
  return dv === calculatedDv;
}

/**
 * Formatea un RUT al estándar chileno: 12.345.678-K
 */
export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut);
  if (cleaned.length === 0) return "";
  if (cleaned.length === 1) return cleaned;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  // Formatear cuerpo con puntos
  let formattedBody = "";
  let count = 0;

  for (let i = body.length - 1; i >= 0; i--) {
    formattedBody = body.charAt(i) + formattedBody;
    count++;
    if (count === 3 && i > 0) {
      formattedBody = "." + formattedBody;
      count = 0;
    }
  }

  return `${formattedBody}-${dv}`;
}
