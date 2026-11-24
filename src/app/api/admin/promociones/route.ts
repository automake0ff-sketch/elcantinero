import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth';
import { getPromociones, savePromocion, deletePromocion } from '@/lib/storage';
import { Promocion } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const soloActivas = searchParams.get('activas') === 'true';

  try {
    const promos = await getPromociones(soloActivas);
    return NextResponse.json({ ok: true, promociones: promos });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener promociones';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user || user.role !== 'propietario') {
    return NextResponse.json(
      { ok: false, error: 'Solo el propietario puede crear promociones' },
      { status: 403 }
    );
  }

  try {
    const body: Promocion = await req.json();
    if (!body.titulo || !body.fechaInicio || !body.fechaFin) {
      return NextResponse.json(
        { ok: false, error: 'Título y fechas de vigencia son obligatorios' },
        { status: 400 }
      );
    }

    const nuevaPromo: Promocion = {
      ...body,
      id: body.id || `promo-${Date.now()}`,
      imagen: body.imagen || '/assets/imagenes/platos/croquetas-jamon.svg',
      estado: body.estado || 'borrador',
      destacadaPortada: Boolean(body.destacadaPortada),
      orden: body.orden || 0,
    };

    await savePromocion(nuevaPromo);
    return NextResponse.json({ ok: true, promocion: nuevaPromo });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al guardar la promoción';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body: Promocion = await req.json();
    await savePromocion(body);
    return NextResponse.json({ ok: true, promocion: body });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al actualizar la promoción';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user || user.role !== 'propietario') {
    return NextResponse.json(
      { ok: false, error: 'Solo el propietario puede eliminar promociones' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID de promoción requerido' }, { status: 400 });
    }

    await deletePromocion(id);
    return NextResponse.json({ ok: true, message: 'Promoción eliminada' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al eliminar la promoción';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
