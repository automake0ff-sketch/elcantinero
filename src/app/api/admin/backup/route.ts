import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth';
import { getCartaData, getRestauranteData } from '@/lib/storage';

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user || user.role !== 'propietario') {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 403 });
  }

  try {
    const backup = {
      fechaExportacion: new Date().toISOString(),
      autor: user.name,
      restaurante: getRestauranteData(),
      carta: getCartaData(),
    };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="el-cantinero-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al generar la copia de seguridad';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
