import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth';
import { getCartaData, saveCartaData } from '@/lib/storage';
import { Plato } from '@/lib/types';

export async function GET() {
  try {
    const data = getCartaData();
    return NextResponse.json({ ok: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener la carta';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const newPlato: Plato = await req.json();

    if (!newPlato.nombre || !newPlato.categoria) {
      return NextResponse.json(
        { ok: false, error: 'Nombre y categoría son obligatorios' },
        { status: 400 }
      );
    }

    const data = getCartaData();
    // Generar ID slug único
    const slug = newPlato.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const id = `${slug}-${Date.now().toString().slice(-4)}`;

    const platoToSave: Plato = {
      ...newPlato,
      id: newPlato.id || id,
      disponible: newPlato.disponible !== false,
      imagen: newPlato.imagen || '/assets/imagenes/platos/croquetas-jamon.svg',
      alergenos: newPlato.alergenos || [],
      etiquetas: newPlato.etiquetas || [],
      modelo3d: newPlato.modelo3d || null,
    };

    data.platos.push(platoToSave);
    saveCartaData(data);

    return NextResponse.json({ ok: true, plato: platoToSave });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al guardar el plato';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const updatedPlato: Plato = await req.json();
    if (!updatedPlato.id) {
      return NextResponse.json({ ok: false, error: 'ID de plato requerido' }, { status: 400 });
    }

    const data = getCartaData();
    const index = data.platos.findIndex((p) => p.id === updatedPlato.id);

    if (index === -1) {
      return NextResponse.json({ ok: false, error: 'Plato no encontrado' }, { status: 404 });
    }

    data.platos[index] = {
      ...data.platos[index],
      ...updatedPlato,
    };

    saveCartaData(data);
    return NextResponse.json({ ok: true, plato: data.platos[index] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al actualizar el plato';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user || user.role !== 'propietario') {
    return NextResponse.json(
      { ok: false, error: 'Solo el propietario puede eliminar platos' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID de plato requerido' }, { status: 400 });
    }

    const data = getCartaData();
    const originalLength = data.platos.length;
    data.platos = data.platos.filter((p) => p.id !== id);

    if (data.platos.length === originalLength) {
      return NextResponse.json({ ok: false, error: 'Plato no encontrado' }, { status: 404 });
    }

    saveCartaData(data);
    return NextResponse.json({ ok: true, message: 'Plato eliminado correctamente' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al eliminar el plato';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
