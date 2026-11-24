import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, createSessionToken } from '@/lib/auth';
import { checkRateLimit, registerFailedAttempt, resetRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Obtener IP del cliente para control de intentos
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  // Verificar rate limiting
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `Demasiados intentos erróneos. Acceso temporalmente bloqueado por seguridad. Inténtelo de nuevo en ${rateLimit.retryAfterSec} segundos.`,
      },
      { status: 429 }
    );
  }

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
      const failed = registerFailedAttempt(ip);
      const remainingMsg =
        failed.remainingAttempts > 0
          ? ` Le quedan ${failed.remainingAttempts} intento(s) antes del bloqueo temporal.`
          : ' Cuenta temporalmente bloqueada por seguridad.';

      return NextResponse.json(
        { ok: false, error: (check.error || 'Credenciales incorrectas.') + remainingMsg },
        { status: check.error?.startsWith('CONFIG_ERROR') ? 503 : 401 }
      );
    }

    // Login exitoso: resetear contador de rate limit
    resetRateLimit(ip);

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error procesando autenticación';
    return NextResponse.json(
      { ok: false, error: message.startsWith('ADMIN_JWT_SECRET_MISSING') ? 'Error de configuración de seguridad en el servidor.' : 'Error al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
