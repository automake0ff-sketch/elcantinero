import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getCurrentAdminUser } from '@/lib/auth';
import { getMesasQR, saveMesaQR } from '@/lib/storage';
import { MesaQR } from '@/lib/types';

export async function GET(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const mesaParam = searchParams.get('numeroMesa');
    const format = searchParams.get('format'); // 'svg' | 'png' | 'json'

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elcantinerotapas.es';

    // Si se pide generar el código visual directo
    if (mesaParam !== null) {
      const num = parseInt(mesaParam, 10);
      const targetUrl = num === 0 ? `${baseUrl}/carta` : `${baseUrl}/carta?mesa=${num}`;

      if (format === 'svg') {
        const svg = await QRCode.toString(targetUrl, {
          type: 'svg',
          color: { dark: '#0E0D0B', light: '#FFFFFF' },
          margin: 2,
        });
        return new NextResponse(svg, {
          headers: { 'Content-Type': 'image/svg+xml' },
        });
      }

      const dataUrl = await QRCode.toDataURL(targetUrl, {
        width: 600,
        margin: 2,
        color: { dark: '#0E0D0B', light: '#FFFFFF' },
      });
      return NextResponse.json({ ok: true, dataUrl, targetUrl });
    }

    // Listar todas las mesas
    const mesas = await getMesasQR();
    return NextResponse.json({ ok: true, mesas, baseUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error procesando códigos QR';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user || user.role !== 'propietario') {
    return NextResponse.json(
      { ok: false, error: 'Solo el propietario puede crear o configurar mesas' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { numeroMesa, nombre } = body;

    if (numeroMesa === undefined || !nombre) {
      return NextResponse.json(
        { ok: false, error: 'Número de mesa y nombre requeridos' },
        { status: 400 }
      );
    }

    const mesas = await getMesasQR();
    if (mesas.some((m) => m.numeroMesa === Number(numeroMesa))) {
      return NextResponse.json(
        { ok: false, error: `Ya existe una mesa con el número ${numeroMesa}` },
        { status: 409 }
      );
    }

    const nuevaMesa: MesaQR = {
      id: `mesa-${numeroMesa}`,
      numeroMesa: Number(numeroMesa),
      nombre,
      activa: true,
      totalEscaneos: 0,
      fechaCreacion: new Date().toISOString(),
    };

    await saveMesaQR(nuevaMesa);
    return NextResponse.json({ ok: true, mesa: nuevaMesa });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al crear la mesa';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body: MesaQR = await req.json();
    await saveMesaQR(body);
    return NextResponse.json({ ok: true, mesa: body });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al actualizar la mesa';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
