'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Tag, Plus, Edit2, Trash2, Calendar, Eye, X } from 'lucide-react';
import { Promocion } from '@/lib/types';

export default function AdminPromocionesPage() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [editingPromo, setEditingPromo] = useState<Promocion | null>(null);
  const [previewPromo, setPreviewPromo] = useState<Promocion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/promociones')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPromociones(data.promociones);
      });
  }, []);

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo) return;

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/promociones', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPromo),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        if (isCreating) {
          setPromociones((prev) => [...prev, data.promocion]);
          setFeedback('Promoción creada con éxito');
        } else {
          setPromociones((prev) =>
            prev.map((p) => (p.id === data.promocion.id ? data.promocion : p))
          );
          setFeedback('Promoción actualizada con éxito');
        }
        setEditingPromo(null);
        setIsCreating(false);
      } else {
        alert(data.error || 'Error al guardar');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!window.confirm(`¿Eliminar la promoción "${titulo}"?`)) return;

    const res = await fetch(`/api/admin/promociones?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPromociones((prev) => prev.filter((p) => p.id !== id));
      setFeedback('Promoción eliminada');
    }
  };

  const handleToggleEstado = async (promo: Promocion) => {
    const nuevoEstado = promo.estado === 'activa' ? 'pausada' : 'activa';
    const updated = { ...promo, estado: nuevoEstado as 'activa' | 'pausada' };
    const res = await fetch('/api/admin/promociones', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      setPromociones((prev) => prev.map((p) => (p.id === promo.id ? updated : p)));
    }
  };

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
              <Tag className="w-6 h-6 text-[#E5A93C]" />
              Promociones y Novedades
            </h1>
            <p className="text-xs text-[#A8A29E]">
              Campañas temporales, ofertas de desayunos y platos fuera de carta con programación por fechas
            </p>
          </div>

          <button
            onClick={() => {
              setEditingPromo({
                id: '',
                titulo: '',
                descripcion: '',
                imagen: '/assets/imagenes/platos/croquetas-jamon.svg',
                fechaInicio: new Date().toISOString().slice(0, 10),
                fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                estado: 'activa',
                destacadaPortada: true,
                condiciones: '',
                orden: 1,
              });
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#C98A26] text-[#0E0D0B] font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Promoción</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center justify-between">
            <span>{feedback}</span>
            <button onClick={() => setFeedback(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Listado de Promociones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promociones.map((p) => {
            const isVigente =
              p.estado === 'activa' &&
              new Date().getTime() >= new Date(p.fechaInicio).getTime() &&
              new Date().getTime() <= new Date(p.fechaFin).getTime();

            return (
              <div
                key={p.id}
                className="bg-[#181613] rounded-3xl overflow-hidden border border-white/10 hover:border-[#E5A93C]/40 transition-colors flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full bg-[#241E18]">
                    <Image src={p.imagen} alt={p.titulo} fill className="object-cover" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isVigente
                            ? 'bg-emerald-500 text-black'
                            : p.estado === 'borrador'
                            ? 'bg-stone-700 text-stone-200'
                            : 'bg-red-800 text-red-100'
                        }`}
                      >
                        {isVigente ? 'En Vigor' : p.estado === 'borrador' ? 'Borrador' : 'Pausada / Caducada'}
                      </span>
                      {p.destacadaPortada && (
                        <span className="bg-[#E5A93C] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ★ En Portada
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#FDFCF7]">{p.titulo}</h3>
                    <p className="text-xs text-[#A8A29E] line-clamp-2">{p.descripcion}</p>

                    <div className="pt-2 text-[11px] text-[#78716C] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#E5A93C]" />
                      <span>
                        {new Date(p.fechaInicio).toLocaleDateString('es-ES')} al {new Date(p.fechaFin).toLocaleDateString('es-ES')}
                      </span>
                    </div>

                    {p.condiciones && (
                      <p className="text-[10px] text-[#A8A29E]/80 italic pt-1">
                        Condiciones: {p.condiciones}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleEstado(p)}
                    className="text-[11px] font-bold text-[#E5A93C] hover:underline"
                  >
                    {p.estado === 'activa' ? 'Pausar' : 'Activar'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewPromo(p)}
                      className="p-1.5 rounded-lg bg-[#25221E] hover:bg-[#E5A93C] text-[#A8A29E] hover:text-[#0E0D0B]"
                      title="Previsualizar"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingPromo(p);
                        setIsCreating(false);
                      }}
                      className="p-1.5 rounded-lg bg-[#25221E] hover:bg-[#E5A93C] text-[#A8A29E] hover:text-[#0E0D0B]"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.titulo)}
                      className="p-1.5 rounded-lg bg-[#25221E] hover:bg-red-600 text-[#A8A29E] hover:text-white"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal Editor de Promoción */}
      {editingPromo && (
        <div className="fixed inset-0 z-50 bg-[#0E0D0B]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-lg w-full bg-[#181613] rounded-3xl p-6 sm:p-8 border border-[#E5A93C]/40 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#FDFCF7]">
                {isCreating ? 'Crear Nueva Promoción' : 'Editar Promoción'}
              </h3>
              <button onClick={() => setEditingPromo(null)} className="text-[#A8A29E] hover:text-[#FDFCF7]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Título de la Promoción</label>
                <input
                  type="text"
                  required
                  value={editingPromo.titulo}
                  onChange={(e) => setEditingPromo({ ...editingPromo, titulo: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>

              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  required
                  value={editingPromo.descripcion}
                  onChange={(e) => setEditingPromo({ ...editingPromo, descripcion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A8A29E] font-semibold mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={editingPromo.fechaInicio.slice(0, 10)}
                    onChange={(e) => setEditingPromo({ ...editingPromo, fechaInicio: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] font-semibold mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    required
                    value={editingPromo.fechaFin.slice(0, 10)}
                    onChange={(e) => setEditingPromo({ ...editingPromo, fechaFin: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A8A29E] font-semibold mb-1">Estado</label>
                  <select
                    value={editingPromo.estado}
                    onChange={(e) =>
                      setEditingPromo({
                        ...editingPromo,
                        estado: e.target.value as 'activa' | 'borrador' | 'pausada',
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                  >
                    <option value="activa">Activa (Pública en fecha)</option>
                    <option value="borrador">Borrador (No visible)</option>
                    <option value="pausada">Pausada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A8A29E] font-semibold mb-1">Imagen (Ruta)</label>
                  <input
                    type="text"
                    value={editingPromo.imagen}
                    onChange={(e) => setEditingPromo({ ...editingPromo, imagen: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Condiciones (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: De martes a jueves de 13:00 a 16:00"
                  value={editingPromo.condiciones}
                  onChange={(e) => setEditingPromo({ ...editingPromo, condiciones: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="destacada"
                  checked={editingPromo.destacadaPortada}
                  onChange={(e) => setEditingPromo({ ...editingPromo, destacadaPortada: e.target.checked })}
                  className="rounded bg-[#12100E] text-[#E5A93C]"
                />
                <label htmlFor="destacada" className="text-[#FDFCF7] cursor-pointer">
                  Destacar con banner en la portada principal
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingPromo(null)}
                  className="px-4 py-2 rounded-xl bg-[#25221E] text-[#FDFCF7]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#E5A93C] text-[#0E0D0B] font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Previsualización */}
      {previewPromo && (
        <div
          role="dialog"
          aria-label="Previsualización de Promoción"
          className="fixed inset-0 z-50 bg-[#0E0D0B]/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewPromo(null)}
        >
          <div
            className="relative max-w-md w-full bg-[#181613] rounded-3xl overflow-hidden border border-[#E5A93C] shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden">
              <Image src={previewPromo.imagen} alt="Preview" fill className="object-cover" />
            </div>
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider bg-[#E5A93C]/10 px-2 py-0.5 rounded-full border border-[#E5A93C]/30">
                Promoción Especial
              </span>
              <h3 className="font-serif text-xl font-bold text-[#FDFCF7]">{previewPromo.titulo}</h3>
              <p className="text-xs text-[#A8A29E]">{previewPromo.descripcion}</p>
              {previewPromo.condiciones && (
                <p className="text-[11px] text-[#FCD34D] pt-2">★ {previewPromo.condiciones}</p>
              )}
            </div>
            <button
              onClick={() => setPreviewPromo(null)}
              className="w-full py-2.5 rounded-xl bg-[#25221E] text-xs font-bold text-[#FDFCF7]"
            >
              Cerrar Vista Previa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
