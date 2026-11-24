import { cookies } from 'next/headers';

export interface UserSession {
  username: string;
  role: 'propietario' | 'editor';
  name: string;
  loginTime: number;
}

const COOKIE_NAME = 'cantinero_admin_session';
const SECRET_KEY = process.env.ADMIN_JWT_SECRET || 'cantinero_sevilla_secret_key_2026_super_safe_token';

// Simple and secure HMAC SHA-256 token signer using Web Crypto
async function getCryptoKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET_KEY),
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

    // Expire after 7 days
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
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function validateAdminCredentials(user: string, pass: string): { valid: boolean; role: 'propietario' | 'editor'; name: string } {
  // Las credenciales pueden sobreescribirse mediante variables de entorno en producción
  const ownerUser = process.env.ADMIN_OWNER_USER || 'admin';
  const ownerPass = process.env.ADMIN_OWNER_PASS || 'CantineroTapas2026!';

  const editorUser = process.env.ADMIN_EDITOR_USER || 'editor';
  const editorPass = process.env.ADMIN_EDITOR_PASS || 'CantineroEditor2026!';

  if (user === ownerUser && pass === ownerPass) {
    return { valid: true, role: 'propietario', name: 'Gerencia El Cantinero' };
  }

  if (user === editorUser && pass === editorPass) {
    return { valid: true, role: 'editor', name: 'Equipo de Sala' };
  }

  return { valid: false, role: 'editor', name: '' };
}
