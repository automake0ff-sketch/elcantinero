import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth';
import { getResumenEstadisticas } from '@/lib/storage';

export async function GET(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const periodo = parseInt(searchParams.get('periodo') || '30', 10);
    const resumen = await getResumenEstadisticas(periodo);

    return NextResponse.json({ ok: true, resumen });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener estadísticas';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
