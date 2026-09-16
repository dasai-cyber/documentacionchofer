import { NextRequest, NextResponse } from "next/server";
import { FormularioConductorSchema } from "@/lib/schema";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { uploadDriverDocument } from "@/lib/storage";
import { getMockConductores, addMockConductor } from "@/lib/mockDb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar esquema completo
    const parsed = FormularioConductorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos de formulario inválidos",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Subir cada documento adjunto a Supabase Storage (o mock)
    const [
      certHojaVidaUrl,
      licenciaAnversoUrl,
      licenciaReversoUrl,
      carnetAnversoUrl,
      carnetReversoUrl,
      certAntecedentesUrl,
      padronUrl,
      soapUrl,
      permisoCirculacionUrl,
      revisionTecnicaUrl,
      certGasesUrl,
      estatutoActualizadoUrl,
      vigenciaActualizadaUrl,
      eRutUrl,
      carpetaTributariaUrl,
      comodatoNotarialUrl,
    ] = await Promise.all([
      data.certHojaVida
        ? uploadDriverDocument(data.rut, "cert_hoja_vida", data.certHojaVida)
        : "",
      data.licenciaAnverso
        ? uploadDriverDocument(data.rut, "licencia_anverso", data.licenciaAnverso)
        : "",
      data.licenciaReverso
        ? uploadDriverDocument(data.rut, "licencia_reverso", data.licenciaReverso)
        : "",
      data.carnetAnverso
        ? uploadDriverDocument(data.rut, "carnet_anverso", data.carnetAnverso)
        : "",
      data.carnetReverso
        ? uploadDriverDocument(data.rut, "carnet_reverso", data.carnetReverso)
        : "",
      data.certAntecedentes
        ? uploadDriverDocument(data.rut, "cert_antecedentes", data.certAntecedentes)
        : "",
      data.padron ? uploadDriverDocument(data.rut, "padron", data.padron) : "",
      data.soap ? uploadDriverDocument(data.rut, "soap", data.soap) : "",
      data.permisoCirculacion
        ? uploadDriverDocument(data.rut, "permiso_circulacion", data.permisoCirculacion)
        : "",
      data.revisionTecnica
        ? uploadDriverDocument(data.rut, "revision_tecnica", data.revisionTecnica)
        : "",
      data.certGases
        ? uploadDriverDocument(data.rut, "cert_gases", data.certGases)
        : "",
      data.estatutoActualizado
        ? uploadDriverDocument(data.rut, "estatuto_actualizado", data.estatutoActualizado)
        : null,
      data.vigenciaActualizada
        ? uploadDriverDocument(data.rut, "vigencia_actualizada", data.vigenciaActualizada)
        : null,
      data.eRut ? uploadDriverDocument(data.rut, "e_rut", data.eRut) : null,
      data.carpetaTributaria
        ? uploadDriverDocument(data.rut, "carpeta_tributaria", data.carpetaTributaria)
        : null,
      data.comodatoNotarial
        ? uploadDriverDocument(data.rut, "comodato_notarial", data.comodatoNotarial)
        : null,
    ]);

    const registroData = {
      nombre_completo: data.nombreCompleto,
      rut: data.rut,
      direccion: data.direccion,
      comuna: data.comuna,
      telefono_principal: data.telefonoPrincipal,
      telefono_secundario: data.telefonoSecundario || null,
      email: data.email,
      estado_civil: data.estadoCivil,
      estudios_alcanzados: data.estudiosAlcanzados,

      banco: data.banco,
      tipo_cuenta: data.tipoCuenta,
      numero_cuenta: data.numeroCuenta,

      cert_hoja_vida: certHojaVidaUrl,
      licencia_anverso: licenciaAnversoUrl,
      licencia_reverso: licenciaReversoUrl,
      carnet_anverso: carnetAnversoUrl,
      carnet_reverso: carnetReversoUrl,
      cert_antecedentes: certAntecedentesUrl,

      padron: padronUrl,
      soap: soapUrl,
      permiso_circulacion: permisoCirculacionUrl,
      revision_tecnica: revisionTecnicaUrl,
      cert_gases: certGasesUrl,
      tiene_gps: data.tieneGps === "si",
      tiene_seguro: data.tieneSeguro === "si",

      registra_empresa: data.registraEmpresa === "si",
      estatuto_actualizado: estatutoActualizadoUrl,
      vigencia_actualizada: vigenciaActualizadaUrl,
      e_rut: eRutUrl,
      carpeta_tributaria: carpetaTributariaUrl,
      comodato_notarial: comodatoNotarialUrl,

      consentimiento_ley_21719: data.consentimientoLey21719,
      firma_digital: data.firmaDigital,
      estado: "pendiente_revision",
      observaciones_admin: null,
    };

    let idGenerado = crypto.randomUUID();
    let createdAt = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data: dbData, error: dbError } = await supabase
        .from("conductores")
        .insert([registroData])
        .select("id, created_at")
        .single();

      if (dbError) {
        console.error("Error insertando en Supabase:", dbError);
        throw dbError;
      }

      if (dbData) {
        idGenerado = dbData.id;
        createdAt = dbData.created_at;
      }
    } else {
      // Guardar en mock store para visualización en panel admin local
      const record = {
        id: idGenerado,
        created_at: createdAt,
        updated_at: createdAt,
        ...registroData,
      };
      addMockConductor(record);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Ficha de conductor registrada con éxito",
        id: idGenerado,
        createdAt,
        conductor: {
          nombreCompleto: data.nombreCompleto,
          rut: data.rut,
          email: data.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error en API /conductores:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error interno del servidor al procesar la ficha",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("conductores")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, data: data || [] });
    }

    // Retornar base en memoria local
    return NextResponse.json({ success: true, data: getMockConductores() });
  } catch (error: any) {
    console.error("Error en GET /conductores:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al obtener conductores" },
      { status: 500 }
    );
  }
}
