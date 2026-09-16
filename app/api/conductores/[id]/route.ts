import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { findMockConductor, updateMockConductor } from "@/lib/mockDb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("conductores")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    const item = findMockConductor(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Conductor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error al obtener conductor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { estado, observaciones_admin } = body;

    const validStates = ["pendiente_revision", "aprobado", "rechazado", "observado"];
    if (estado && !validStates.includes(estado)) {
      return NextResponse.json(
        { success: false, error: "Estado no válido" },
        { status: 400 }
      );
    }

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };
    if (estado) updatePayload.estado = estado;
    if (observaciones_admin !== undefined)
      updatePayload.observaciones_admin = observaciones_admin;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("conductores")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    const updatedItem = updateMockConductor(id, updatePayload);
    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: "Conductor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error al actualizar conductor" },
      { status: 500 }
    );
  }
}
