'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle2, Phone, MapPin, Clock, FileText, Globe } from 'lucide-react';
import restauranteDataRaw from '@/data/restaurante.json';
import { DatosRestaurante } from '@/lib/types';

export default function AdminContenidoPage() {
  const [data, setData] = useState<DatosRestaurante>(restauranteDataRaw as DatosRestaurante);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/admin/contenido', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (res.ok && resData.ok) {
        setSuccess(true);
      } else {
        setError(resData.error || 'Error al guardar los datos');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0D0B] text-[#FDFCF7] pb-24">
      <div className="bg-[#14120F] border-b border-white/10 py-5 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-[#A8A29E] hover:text-[#E5A93C] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Panel Principal</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#FDFCF7]">
            Gestión de Horarios, Contacto y Contenidos
          </h1>
          <p className="text-xs text-[#A8A29E]">
            Modifica la información que se muestra en la web pública de El Cantinero Tapas
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-8">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Información actualizada y guardada correctamente en el sistema.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Bloque 1: Teléfono y Dirección */}
          <div className="bg-[#181613] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#FDFCF7] flex items-center gap-2 border-b border-white/10 pb-3">
              <Phone className="w-4 h-4 text-[#E5A93C]" />
              Contacto y Localización
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Teléfono Principal</label>
                <input
                  type="text"
                  value={data.telefono}
                  onChange={(e) =>
                    setData({
                      ...data,
                      telefono: e.target.value,
                      telefonoHref: `tel:${e.target.value.replace(/\s+/g, '')}`,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>

              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Dirección Completa</label>
                <input
                  type="text"
                  value={data.direccion}
                  onChange={(e) => setData({ ...data, direccion: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>

              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Barrio / Zona</label>
                <input
                  type="text"
                  value={data.barrio}
                  onChange={(e) => setData({ ...data, barrio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>

              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={data.instagramUrl}
                  onChange={(e) => setData({ ...data, instagramUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>
            </div>
          </div>

          {/* Bloque 2: Horarios */}
          <div className="bg-[#181613] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#FDFCF7] flex items-center gap-2 border-b border-white/10 pb-3">
              <Clock className="w-4 h-4 text-[#E5A93C]" />
              Horarios Semanales
            </h2>

            <div className="space-y-3 text-xs">
              {data.horarios.map((item, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#12100E] border border-white/5">
                  <div>
                    <label className="block text-[#78716C] mb-1">Días</label>
                    <input
                      type="text"
                      value={item.dias}
                      onChange={(e) => {
                        const newHorarios = [...data.horarios];
                        newHorarios[index].dias = e.target.value;
                        setData({ ...data, horarios: newHorarios });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#181613] border border-white/10 text-[#FDFCF7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#78716C] mb-1">Horas</label>
                    <input
                      type="text"
                      value={item.horas}
                      onChange={(e) => {
                        const newHorarios = [...data.horarios];
                        newHorarios[index].horas = e.target.value;
                        setData({ ...data, horarios: newHorarios });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#181613] border border-white/10 text-[#E5A93C] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[#78716C] mb-1">Tipo de Servicio</label>
                    <input
                      type="text"
                      value={item.tipo}
                      onChange={(e) => {
                        const newHorarios = [...data.horarios];
                        newHorarios[index].tipo = e.target.value;
                        setData({ ...data, horarios: newHorarios });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#181613] border border-white/10 text-[#A8A29E]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bloque 3: Textos de Historia */}
          <div className="bg-[#181613] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#FDFCF7] flex items-center gap-2 border-b border-white/10 pb-3">
              <FileText className="w-4 h-4 text-[#E5A93C]" />
              Historia y Filosofía del Restaurante
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Título de la Sección</label>
                <input
                  type="text"
                  value={data.historia.titulo}
                  onChange={(e) =>
                    setData({
                      ...data,
                      historia: { ...data.historia, titulo: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>

              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Párrafo 1</label>
                <textarea
                  rows={2}
                  value={data.historia.parrafo1}
                  onChange={(e) =>
                    setData({
                      ...data,
                      historia: { ...data.historia, parrafo1: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>

              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Párrafo 2</label>
                <textarea
                  rows={2}
                  value={data.historia.parrafo2}
                  onChange={(e) =>
                    setData({
                      ...data,
                      historia: { ...data.historia, parrafo2: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#C98A26] text-[#0E0D0B] font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Guardando cambios...' : 'Guardar Todos los Cambios'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
