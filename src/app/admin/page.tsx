'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Utensils,
  FileText,
  Download,
  Upload,
  LogOut,
  ExternalLink,
  Star,
  CheckCircle2,
  Sparkles,
  Phone,
  QrCode,
  Tag,
  BarChart3,
  Layers,
  Camera,
  Settings,
} from 'lucide-react';
import { UserSession } from '@/lib/auth';
import cartaData from '@/data/carta.json';
import restauranteData from '@/data/restaurante.json';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [backupRestoreMsg, setBackupRestoreMsg] = useState<{ text: string; error?: boolean } | null>(null);

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

  const handleRestaurarBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('¿Está seguro de restaurar esta copia de seguridad? Se sincronizarán los datos del archivo.')) {
      e.target.value = '';
      return;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setBackupRestoreMsg({ text: 'Copia de seguridad restaurada correctamente.' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setBackupRestoreMsg({ text: data.error || 'Error al restaurar', error: true });
      }
    } catch {
      setBackupRestoreMsg({ text: 'Archivo JSON no válido o dañado', error: true });
    }
    e.target.value = '';
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
    <div className="min-h-screen bg-[#0E0D0B] text-[#FDFCF7] pb-24">
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

        {backupRestoreMsg && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
              backupRestoreMsg.error
                ? 'bg-red-950/40 border-red-800 text-red-200'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            }`}
          >
            <span>{backupRestoreMsg.text}</span>
            <button onClick={() => setBackupRestoreMsg(null)}>✕</button>
          </div>
        )}

        {/* 1. MÓDULO RESUMEN: Métricas Principales */}
        <div>
          <h2 className="font-serif text-xl font-bold text-[#FDFCF7] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E5A93C]" />
            1. Resumen y Métricas Rápidas
          </h2>
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
        </div>

        {/* MÓDULOS DE GESTIÓN (10 Secciones Estructuradas) */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#FDFCF7] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E5A93C]" />
            Módulos del Panel de Administración
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 2. Módulo Carta */}
            <Link
              href="/admin/platos"
              className="group bg-[#181613] rounded-3xl p-6 border border-white/10 hover:border-[#E5A93C] transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                  2. Carta y Platos
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  Añade platos, modifica precios (tapa/ración), cambia disponibilidad diaria y gestiona borradores y alérgenos.
                </p>
              </div>
              <span className="text-xs font-bold text-[#E5A93C]">Abrir Gestor de Platos &rarr;</span>
            </Link>

            {/* 3. Módulo Categorías */}
            <Link
              href="/admin/platos"
              className="group bg-[#181613] rounded-3xl p-6 border border-white/10 hover:border-[#E5A93C] transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                  3. Categorías de Carta
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  Especialidades, Desayunos, Tapas Frías, Guisos, Pescados, Montaditos y Postres.
                </p>
              </div>
              <span className="text-xs font-bold text-[#E5A93C]">Organizar Categorías &rarr;</span>
            </Link>

            {/* 4. Módulo Galería */}
            <Link
              href="/#galeria"
              target="_blank"
              className="group bg-[#181613] rounded-3xl p-6 border border-white/10 hover:border-[#E5A93C] transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                  4. Galería del Local
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  Fotografías de terraza exterior, barra de tapas, salón comedor y desayunos andaluces.
                </p>
              </div>
              <span className="text-xs font-bold text-[#E5A93C]">Ver Galería Pública &rarr;</span>
            </Link>

            {/* 5. Módulo Promociones */}
            <Link
              href="/admin/promociones"
              className="group bg-[#181613] rounded-3xl p-6 border border-white/10 hover:border-[#E5A93C] transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Tag className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                  5. Promociones y Novedades
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  Campañas temporales, ofertas de desayunos y novedades con fechas de vigencia programadas.
                </p>
              </div>
              <span className="text-xs font-bold text-[#E5A93C]">Gestionar Promociones &rarr;</span>
            </Link>

            {/* 6. Módulo QR y Mesas */}
            <Link
              href="/admin/qr"
              className="group bg-[#181613] rounded-3xl p-6 border border-white/10 hover:border-[#E5A93C] transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                  6. Códigos QR y Mesas
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  QR general de carta, QRs individuales por mesa, descarga PNG/SVG e impresión con logotipo.
                </p>
              </div>
              <span className="text-xs font-bold text-[#E5A93C]">Abrir Gestor de Mesas &rarr;</span>
            </Link>

            {/* 7. Módulo Estadísticas */}
            <Link
              href="/admin/estadisticas"
              className="group bg-[#181613] rounded-3xl p-6 border border-white/10 hover:border-[#E5A93C] transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                  7. Estadísticas y RGPD
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  Visitas a la carta, clics en llamar, rutas Google Maps, escaneos QR y métricas de 7/30/90 días.
                </p>
              </div>
              <span className="text-xs font-bold text-[#E5A93C]">Ver Métricas Reales &rarr;</span>
            </Link>

            {/* 8. Módulo Contenido */}
            <Link
              href="/admin/contenido"
              className="group bg-[#181613] rounded-3xl p-6 border border-white/10 hover:border-[#E5A93C] transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                  8. Contenido y Horarios
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  Teléfono (642 01 90 26), dirección, horarios semanales, historia del restaurante y redes sociales.
                </p>
              </div>
              <span className="text-xs font-bold text-[#E5A93C]">Editar Contenidos &rarr;</span>
            </Link>

            {/* 9. Módulo Configuración y Redes */}
            <Link
              href="/admin/contenido"
              className="group bg-[#181613] rounded-3xl p-6 border border-white/10 hover:border-[#E5A93C] transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                  9. Configuración y Redes
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  Enlaces directos a Instagram y TikTok (@cantinero.tapas) y parámetros de servicio.
                </p>
              </div>
              <span className="text-xs font-bold text-[#E5A93C]">Ajustar Configuración &rarr;</span>
            </Link>

            {/* 10. Módulo Copias de Seguridad */}
            <div className="bg-[#181613] rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7]">
                  10. Copias de Seguridad
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  Exportación JSON de platos, precios, configuración y mesas. Restauración segura para el propietario.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="/api/admin/backup"
                  download
                  className="flex-1 py-2 px-3 rounded-xl bg-[#25221E] hover:bg-[#E5A93C] text-[#FDFCF7] hover:text-[#0E0D0B] font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar
                </a>
                <label className="flex-1 py-2 px-3 rounded-xl bg-[#25221E] hover:bg-[#2A2621] text-[#A8A29E] hover:text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/10">
                  <Upload className="w-3.5 h-3.5" />
                  Restaurar
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestaurarBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
