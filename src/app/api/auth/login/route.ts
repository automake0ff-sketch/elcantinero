import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, createSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: 'Usuario y contraseña requeridos' },
        { status: 400 }
      );
    }

    const check = validateAdminCredentials(username, password);

    if (!check.valid) {
      return NextResponse.json(
        { ok: false, error: 'Credenciales incorrectas. Verifique usuario y clave.' },
        { status: 401 }
      );
    }

    const sessionToken = await createSessionToken({
      username,
      role: check.role,
      name: check.name,
      loginTime: Date.now(),
    });

    const response = NextResponse.json({
      ok: true,
      user: { username, role: check.role, name: check.name },
    });

    response.cookies.set('cantinero_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Error procesando autenticación' },
      { status: 500 }
    );
  }
}
