'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  Phone,
  MapPin,
  Utensils,
  QrCode,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { ResumenEstadisticas } from '@/lib/types';

export default function AdminEstadisticasPage() {
  const [periodo, setPeriodo] = useState<number>(30);
  const [resumen, setResumen] = useState<ResumenEstadisticas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/estadisticas?periodo=${periodo}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data.ok) setResumen(data.resumen);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [periodo]);

  const totalEventos = resumen
    ? resumen.totalVisitasHome +
      resumen.totalVisitasCarta +
      resumen.totalClicsLlamar +
      resumen.totalClicsMaps +
      resumen.totalClicsInstagram +
      resumen.totalClicsTikTok +
      resumen.totalEscaneosQR
    : 0;

  return (
    <div className="min-h-screen bg-[#0E0D0B] text-[#FDFCF7] pb-24">
      {/* Cabecera */}
      <div className="bg-[#14120F] border-b border-white/10 py-5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-[#A8A29E] hover:text-[#E5A93C] transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Panel Principal</span>
            </Link>
            <h1 className="font-serif text-2xl font-bold text-[#FDFCF7] flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#E5A93C]" />
              Estadísticas Comerciales y Conversión
            </h1>
            <p className="text-xs text-[#A8A29E]">
              Métricas reales agregadas, sin perfiles individuales y 100% respetuosas con el RGPD
            </p>
          </div>

          {/* Filtros de Periodo */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1C1917] border border-white/10">
            <button
              onClick={() => setPeriodo(7)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                periodo === 7 ? 'bg-[#E5A93C] text-black shadow' : 'text-[#A8A29E] hover:text-white'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setPeriodo(30)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                periodo === 30 ? 'bg-[#E5A93C] text-black shadow' : 'text-[#A8A29E] hover:text-white'
              }`}
            >
              30 Días
            </button>
            <button
              onClick={() => setPeriodo(90)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                periodo === 90 ? 'bg-[#E5A93C] text-black shadow' : 'text-[#A8A29E] hover:text-white'
              }`}
            >
              90 Días
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {loading ? (
          <div className="text-center py-20 text-xs text-[#A8A29E] animate-pulse">
            Calculando métricas agregadas...
          </div>
        ) : totalEventos === 0 ? (
          <div className="bg-[#181613] rounded-3xl p-12 text-center border border-white/10 space-y-3">
            <BarChart3 className="w-12 h-12 text-[#78716C] mx-auto mb-2" />
            <h3 className="font-serif text-xl font-bold text-[#FDFCF7]">
              Todavía no hay datos suficientes
            </h3>
            <p className="text-xs text-[#A8A29E] max-w-md mx-auto">
              A medida que los clientes consulten la web, escaneen los QRs de las mesas o pulsen en llamar, las métricas aparecerán aquí desglosadas por periodo.
            </p>
          </div>
        ) : (
          <>
            {/* Grid de Conversión y Métricas Clave */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#181613] rounded-3xl p-6 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span>Visitas a la Carta</span>
                  <Utensils className="w-4 h-4 text-[#E5A93C]" />
                </div>
                <p className="text-3xl font-serif font-bold text-[#FDFCF7]">
                  {resumen?.totalVisitasCarta || 0}
                </p>
                <p className="text-[11px] text-[#A8A29E]">Consultas al menú digital</p>
              </div>

              <div className="bg-[#181613] rounded-3xl p-6 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span>Llamadas Directas</span>
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-serif font-bold text-emerald-400">
                  {resumen?.totalClicsLlamar || 0}
                </p>
                <p className="text-[11px] text-[#A8A29E]">Conversión a teléfono (642 01 90 26)</p>
              </div>

              <div className="bg-[#181613] rounded-3xl p-6 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span>Rutas Google Maps</span>
                  <MapPin className="w-4 h-4 text-[#FCD34D]" />
                </div>
                <p className="text-3xl font-serif font-bold text-[#FCD34D]">
                  {resumen?.totalClicsMaps || 0}
                </p>
                <p className="text-[11px] text-[#A8A29E]">Peticiones de «Cómo llegar»</p>
              </div>

              <div className="bg-[#181613] rounded-3xl p-6 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span>Escaneos de Códigos QR</span>
                  <QrCode className="w-4 h-4 text-[#E5A93C]" />
                </div>
                <p className="text-3xl font-serif font-bold text-[#E5A93C]">
                  {resumen?.totalEscaneosQR || 0}
                </p>
                <p className="text-[11px] text-[#A8A29E]">Escaneos físicos en mesas y barra</p>
              </div>
            </div>

            {/* Redes y Desglose */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clics a Redes Sociales */}
              <div className="bg-[#181613] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7] flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#E5A93C]" />
                  Interacción con Redes Oficiales
                </h3>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#12100E] border border-white/5 space-y-1">
                    <p className="text-xs text-[#A8A29E]">Instagram (@elcantinerotapas)</p>
                    <p className="text-2xl font-bold font-serif text-[#FDFCF7]">
                      {resumen?.totalClicsInstagram || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#12100E] border border-white/5 space-y-1">
                    <p className="text-xs text-[#A8A29E]">TikTok (@cantinero.tapas)</p>
                    <p className="text-2xl font-bold font-serif text-[#FDFCF7]">
                      {resumen?.totalClicsTikTok || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Escaneos por Mesa */}
              <div className="bg-[#181613] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7] flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#E5A93C]" />
                  Escaneos de QRs por Mesa
                </h3>
                <div className="space-y-2">
                  {resumen?.escaneosPorMesa && resumen.escaneosPorMesa.length > 0 ? (
                    resumen.escaneosPorMesa.map((m) => (
                      <div
                        key={m.numeroMesa}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#12100E] border border-white/5 text-xs"
                      >
                        <span className="font-medium text-[#FDFCF7]">
                          {m.numeroMesa === 0 ? 'QR General' : `Mesa ${m.numeroMesa} (${m.nombre})`}
                        </span>
                        <span className="font-bold text-[#E5A93C]">{m.escaneos} escaneos</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#78716C]">Sin escaneos registrados aún.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Aviso de Privacidad RGPD */}
            <div className="p-4 rounded-2xl bg-[#14120F] border border-white/10 flex items-center gap-3 text-xs text-[#A8A29E]">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Privacidad Garantizada:</strong> Esta analítica se basa en contadores anónimos agregados en el servidor. No almacena direcciones IP, nombres, cookies de terceros ni elabora perfiles de usuario, cumpliendo estrictamente con el RGPD y la LOPDGDD.
              </span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
