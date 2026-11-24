import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth';
import {
  getCartaData,
  saveCartaData,
  getRestauranteData,
  saveRestauranteData,
  getPromociones,
  savePromocion,
  getMesasQR,
  saveMesaQR,
} from '@/lib/storage';

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user || user.role !== 'propietario') {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 403 });
  }

  try {
    const backup = {
      version: '2.0',
      fechaExportacion: new Date().toISOString(),
      generadoPor: user.name,
      restaurante: getRestauranteData(),
      carta: getCartaData(),
      promociones: await getPromociones(),
      mesasQR: await getMesasQR(),
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

export async function POST(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user || user.role !== 'propietario') {
    return NextResponse.json(
      { ok: false, error: 'Acción restringida: Solo el propietario puede restaurar copias de seguridad' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    // Validación estricta de estructura antes de restaurar
    if (!body.carta || !Array.isArray(body.carta.platos) || !body.restaurante) {
      return NextResponse.json(
        { ok: false, error: 'Estructura de copia de seguridad no válida. Compruebe el archivo JSON.' },
        { status: 400 }
      );
    }

    // Restaurar carta
    saveCartaData(body.carta);

    // Restaurar datos de restaurante
    if (body.restaurante.nombre) {
      saveRestauranteData(body.restaurante);
    }

    // Restaurar promociones si existen
    if (Array.isArray(body.promociones)) {
      for (const p of body.promociones) {
        if (p.id && p.titulo) await savePromocion(p);
      }
    }

    // Restaurar mesas si existen
    if (Array.isArray(body.mesasQR)) {
      for (const m of body.mesasQR) {
        if (m.id && m.numeroMesa !== undefined) await saveMesaQR(m);
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'Copia de seguridad restaurada con éxito. Todos los datos han sido sincronizados.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al procesar la restauración';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
