'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Utensils,
  FileText,
  Download,
  LogOut,
  ExternalLink,
  Plus,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { UserSession } from '@/lib/auth';
import cartaData from '@/data/carta.json';
import restauranteData from '@/data/restaurante.json';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('No autenticado');
        return res.json();
      })
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => {
        router.push('/admin/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0D0B] text-[#FDFCF7] flex items-center justify-center">
        <p className="text-xs text-[#A8A29E] animate-pulse">Cargando panel de gestión...</p>
      </div>
    );
  }

  const totalPlatos = cartaData.platos.length;
  const platosActivos = cartaData.platos.filter((p) => p.disponible).length;
  const platosDestacados = cartaData.platos.filter((p) => p.destacado).length;

  return (
    <div className="min-h-screen bg-[#0E0D0B] text-[#FDFCF7] pb-20">
      {/* Cabecera superior del panel */}
      <header className="bg-[#14120F] border-b border-white/10 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E5A93C]/40">
              <Image
                src="/assets/imagenes/identidad/logo-oficial.jpg"
                alt="El Cantinero Tapas"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-[#FDFCF7] leading-tight">
                El Cantinero Tapas &middot; Panel de Control
              </h1>
              <p className="text-[11px] text-[#E5A93C]">
                Conectado como <strong className="text-[#FDFCF7]">{user?.name}</strong> ({user?.role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F1C18] hover:bg-[#2A2621] text-xs font-semibold text-[#A8A29E] hover:text-[#FDFCF7] border border-white/10 transition-colors"
            >
              <span>Ver Web Pública</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-xs font-semibold text-red-200 border border-red-800/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Tarjetas de Métricas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#181613] rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A8A29E]">
              <span>Platos en Carta</span>
              <Utensils className="w-4 h-4 text-[#E5A93C]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#FDFCF7]">{totalPlatos}</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {platosActivos} disponibles hoy
            </p>
          </div>

          <div className="bg-[#181613] rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A8A29E]">
              <span>Especialidades Estrella</span>
              <Sparkles className="w-4 h-4 text-[#FCD34D]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#FCD34D]">{platosDestacados}</p>
            <p className="text-[11px] text-[#A8A29E]">Destacadas en portada</p>
          </div>

          <div className="bg-[#181613] rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A8A29E]">
              <span>Valoración en Google</span>
              <Star className="w-4 h-4 text-[#FCD34D] fill-current" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#FDFCF7]">
              {restauranteData.valoracionGoogle} <span className="text-sm font-normal text-[#A8A29E]">/ 5</span>
            </p>
            <p className="text-[11px] text-[#A8A29E]">
              {restauranteData.totalResenasGoogle}+ reseñas en Sevilla Este
            </p>
          </div>

          <div className="bg-[#181613] rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A8A29E]">
              <span>Teléfono de Contacto</span>
              <Phone className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-bold font-serif text-[#FDFCF7] mt-1">
              {restauranteData.telefono}
            </p>
            <p className="text-[11px] text-[#A8A29E]">Llamadas directas en 1 clic</p>
          </div>
        </div>

        {/* Secciones de Gestión */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Módulo Platos */}
          <Link
            href="/admin/platos"
            className="group bg-[#181613] rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-[#E5A93C] transition-all flex flex-col justify-between space-y-6 shadow-xl"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                Gestión de Platos y Precios
              </h2>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Añade o edita tapas, modifica precios de tapas y raciones, activa o desactiva disponibilidad según stock del día y asigna alérgenos.
              </p>
            </div>
            <span className="text-xs font-bold text-[#E5A93C] inline-flex items-center gap-1">
              Abrir Gestión de Carta &rarr;
            </span>
          </Link>

          {/* Módulo Contenido */}
          <Link
            href="/admin/contenido"
            className="group bg-[#181613] rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-[#E5A93C] transition-all flex flex-col justify-between space-y-6 shadow-xl"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                Horarios, Historia y Contacto
              </h2>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Actualiza el teléfono de atención, horarios semanales, textos de historia del restaurante y enlaces de redes sociales.
              </p>
            </div>
            <span className="text-xs font-bold text-[#E5A93C] inline-flex items-center gap-1">
              Editar Información &rarr;
            </span>
          </Link>

          {/* Módulo Copias de Seguridad */}
          <div className="bg-[#181613] rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                <Download className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#FDFCF7]">
                Copia de Seguridad
              </h2>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Descarga una instantánea completa en formato JSON con toda la carta, precios y configuración actual del restaurante.
              </p>
            </div>
            <a
              href="/api/admin/backup"
              download
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25221E] hover:bg-[#E5A93C] text-[#FDFCF7] hover:text-[#0E0D0B] font-bold text-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Copia de Seguridad</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
