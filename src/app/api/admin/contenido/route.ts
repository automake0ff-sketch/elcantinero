import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth';
import { getRestauranteData, saveRestauranteData } from '@/lib/storage';
import { DatosRestaurante } from '@/lib/types';

export async function GET() {
  try {
    const data = getRestauranteData();
    return NextResponse.json({ ok: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener la información';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user || user.role !== 'propietario') {
    return NextResponse.json(
      { ok: false, error: 'Solo el propietario puede modificar contenidos y datos del negocio' },
      { status: 403 }
    );
  }

  try {
    const updatedData: DatosRestaurante = await req.json();
    saveRestauranteData(updatedData);
    return NextResponse.json({ ok: true, message: 'Datos actualizados con éxito' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al guardar los cambios';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
