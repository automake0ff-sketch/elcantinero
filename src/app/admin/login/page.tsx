'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, User, KeyRound, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Credenciales no válidas.');
      }
    } catch {
      setError('Error de conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0D0B] text-[#FDFCF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#A8A29E] hover:text-[#E5A93C] transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la web del restaurante</span>
          </Link>
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#E5A93C] mx-auto shadow-2xl">
            <Image
              src="/assets/imagenes/identidad/logo-oficial.jpg"
              alt="Logotipo oficial de El Cantinero Tapas"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FDFCF7]">
            Panel de Administración
          </h1>
          <p className="text-xs text-[#A8A29E]">
            Gestión privada para El Cantinero Tapas Sevilla
          </p>
        </div>

        <div className="bg-[#181613] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 flex items-center gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A8A29E] uppercase tracking-wider mb-1.5">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin o editor"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7] text-sm focus:outline-none focus:border-[#E5A93C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A8A29E] uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7] text-sm focus:outline-none focus:border-[#E5A93C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5A93C] via-[#D97706] to-[#B45309] text-[#0E0D0B] font-bold text-sm shadow-lg hover:shadow-[#E5A93C]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Comprobando acceso...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-[#A8A29E]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acceso seguro protegido con tokens de sesión encriptados.</span>
            </div>
            <p className="text-[10px] text-[#78716C] leading-normal">
              Roles disponibles: <strong>Propietario</strong> (acceso total a platos, precios y contenidos) y <strong>Editor</strong> (gestión rápida de carta).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
