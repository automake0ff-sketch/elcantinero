/**
 * Rate Limiter seguro en memoria para control de intentos de autenticación.
 * Bloquea IPs tras 5 intentos erróneos durante 15 minutos para evitar ataques de fuerza bruta.
 */

interface RateLimitRecord {
  attempts: number;
  blockedUntil: number | null;
  lastAttempt: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutos
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000; // Ventana de 10 minutos

export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Comprobar si está bloqueado actualmente
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfterSec = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSec };
  }

  // Si pasó la ventana sin llegar al bloqueo, resetear
  if (now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

export function registerFailedAttempt(ip: string): { remainingAttempts: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, blockedUntil: null, lastAttempt: now };

  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    loginAttempts.set(ip, record);
    return { remainingAttempts: 0, retryAfterSec: Math.ceil(BLOCK_DURATION_MS / 1000) };
  }

  loginAttempts.set(ip, record);
  return { remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.attempts) };
}

export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}
