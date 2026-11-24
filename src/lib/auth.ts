import { cookies } from 'next/headers';

export interface UserSession {
  username: string;
  role: 'propietario' | 'editor';
  name: string;
  loginTime: number;
}

const COOKIE_NAME = 'cantinero_admin_session';

function getSecretKey(): string {
  return process.env.ADMIN_JWT_SECRET || 'cantinero_demo_jwt_secret_token_2026_sevilla_este';
}

async function getCryptoKey() {
  const enc = new TextEncoder();
  const secret = getSecretKey();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createSessionToken(user: UserSession): Promise<string> {
  const enc = new TextEncoder();
  const payloadStr = JSON.stringify(user);
  const payloadB64 = Buffer.from(payloadStr).toString('base64url');

  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const sigB64 = Buffer.from(signature).toString('base64url');

  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const [payloadB64, sigB64] = token.split('.');
    if (!payloadB64 || !sigB64) return null;

    const enc = new TextEncoder();
    const key = await getCryptoKey();
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      Buffer.from(sigB64, 'base64url'),
      enc.encode(payloadB64)
    );

    if (!isValid) return null;

    const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const user = JSON.parse(payloadStr) as UserSession;

    // Expira a los 7 días
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - user.loginTime > sevenDaysMs) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function getCurrentAdminUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function validateAdminCredentials(
  user: string,
  pass: string
): { valid: boolean; role: 'propietario' | 'editor'; name: string; error?: string } {
  const ownerUser = process.env.ADMIN_OWNER_USER || 'admin';
  const ownerPass = process.env.ADMIN_OWNER_PASS || 'Cantinero2026!';
  const editorUser = process.env.ADMIN_EDITOR_USER || 'editor';
  const editorPass = process.env.ADMIN_EDITOR_PASS || 'CantineroEditor2026!';

  // Verificación Propietario
  if (user === ownerUser && pass === ownerPass) {
    return { valid: true, role: 'propietario', name: 'Gerencia El Cantinero' };
  }

  // Verificación Editor
  if (user === editorUser && pass === editorPass) {
    return { valid: true, role: 'editor', name: 'Equipo de Sala' };
  }

  return { valid: false, role: 'editor', name: '', error: 'Credenciales no válidas.' };
}

export function requireRole(
  user: UserSession | null,
  allowedRoles: ('propietario' | 'editor')[]
): { authorized: boolean; reason?: string } {
  if (!user) {
    return { authorized: false, reason: 'No autenticado' };
  }
  if (!allowedRoles.includes(user.role)) {
    return { authorized: false, reason: `Acción reservada al rol ${allowedRoles.join(', ')}` };
  }
  return { authorized: true };
}
