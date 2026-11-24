import { NextRequest, NextResponse } from 'next/server';
import { registrarEventoMetrica } from '@/lib/storage';
import { TipoEventoMetrica } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, entidadId, metadata } = body;

    const tiposValidos: TipoEventoMetrica[] = [
      'visita_home',
      'visita_carta',
      'clic_llamar',
      'clic_maps',
      'clic_instagram',
      'clic_tiktok',
      'escaneo_qr',
      'consulta_plato',
    ];

    if (!tipo || !tiposValidos.includes(tipo)) {
      return NextResponse.json({ ok: false, error: 'Tipo de evento no válido' }, { status: 400 });
    }

    // Registro anónimo respetuoso con RGPD (sin IPs fijas ni rastreo individual)
    await registrarEventoMetrica({
      tipo,
      entidadId: entidadId ? String(entidadId).slice(0, 50) : undefined,
      metadata: metadata && typeof metadata === 'object' ? metadata : {},
      fecha: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
