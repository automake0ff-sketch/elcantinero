'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
} from 'lucide-react';
import { Plato } from '@/lib/types';
import cartaDataRaw from '@/data/carta.json';

export default function AdminPlatosPage() {
  const [platos, setPlatos] = useState<Plato[]>(() => {
    return cartaDataRaw.platos.map((p) => ({
      ...p,
      estado: (p as { estado?: 'publicado' | 'borrador' }).estado || 'publicado',
    }));
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPlato, setEditingPlato] = useState<Plato | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const categorias = cartaDataRaw.categorias.filter((c) => c.id !== 'todas');

  // Toggle disponibilidad rápida
  const handleToggleDisponible = async (plato: Plato) => {
    const updated = { ...plato, disponible: !plato.disponible };
    try {
      const res = await fetch('/api/admin/platos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setPlatos((prev) => prev.map((p) => (p.id === plato.id ? updated : p)));
        setFeedbackMsg({ text: `Disponibilidad de "${plato.nombre}" actualizada.` });
      } else {
        setFeedbackMsg({ text: 'Error al actualizar disponibilidad', error: true });
      }
    } catch {
      setFeedbackMsg({ text: 'Error al conectar con la API', error: true });
    }
  };

  // Guardar creación o edición
  const handleSavePlato = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlato) return;

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/platos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPlato),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        if (isCreating) {
          setPlatos((prev) => [...prev, data.plato]);
          setFeedbackMsg({ text: 'Nuevo plato creado con éxito.' });
        } else {
          setPlatos((prev) => prev.map((p) => (p.id === data.plato.id ? data.plato : p)));
          setFeedbackMsg({ text: 'Plato actualizado correctamente.' });
        }
        setEditingPlato(null);
        setIsCreating(false);
      } else {
        setFeedbackMsg({ text: data.error || 'Error al guardar el plato', error: true });
      }
    } catch {
      setFeedbackMsg({ text: 'Error de conexión', error: true });
    }
  };

  // Eliminar con confirmación
  const handleDeletePlato = async (plato: Plato) => {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente "${plato.nombre}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/platos?id=${plato.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlatos((prev) => prev.filter((p) => p.id !== plato.id));
        setFeedbackMsg({ text: `Plato "${plato.nombre}" eliminado.` });
      } else {
        setFeedbackMsg({ text: 'Error al eliminar el plato', error: true });
      }
    } catch {
      setFeedbackMsg({ text: 'Error de conexión', error: true });
    }
  };

  const filteredPlatos = platos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="font-serif text-2xl font-bold text-[#FDFCF7]">
              Gestor de Platos y Precios
            </h1>
            <p className="text-xs text-[#A8A29E]">
              Control en tiempo real de la carta digital de El Cantinero Tapas
            </p>
          </div>

          <button
            onClick={() => {
              setEditingPlato({
                id: '',
                nombre: '',
                categoria: 'especialidades',
                descripcion: '',
                precioTapa: 3.5,
                precioRacion: null,
                destacado: false,
                disponible: true,
                estado: 'publicado',
                imagen: '/assets/imagenes/platos/croquetas-jamon.svg',
                alergenos: [],
                etiquetas: ['Casero'],
                modelo3d: null,
              });
              setIsCreating(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#C98A26] text-[#0E0D0B] font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Nuevo Plato</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {feedbackMsg && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
              feedbackMsg.error
                ? 'bg-red-950/40 border-red-800 text-red-200'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button onClick={() => setFeedbackMsg(null)} className="p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Buscador */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181613] border border-white/10 text-xs text-[#FDFCF7] placeholder-[#78716C] focus:outline-none focus:border-[#E5A93C]"
          />
        </div>

        {/* Tabla de Platos */}
        <div className="bg-[#181613] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12100E] border-b border-white/10 text-[#A8A29E] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Plato</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Tapa</th>
                  <th className="py-3.5 px-4">Ración</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPlatos.map((plato) => (
                  <tr key={plato.id} className="hover:bg-[#1F1C18] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#241E18] shrink-0">
                          <Image src={plato.imagen} alt={plato.nombre} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#FDFCF7]">{plato.nombre}</p>
                          {plato.destacado && (
                            <span className="text-[10px] text-[#FCD34D] font-bold">★ Destacado</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize text-[#A8A29E]">{plato.categoria.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#FCD34D]">
                      {plato.precioTapa ? `${plato.precioTapa.toFixed(2)} €` : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#FCD34D]">
                      {plato.precioRacion ? `${plato.precioRacion.toFixed(2)} €` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleDisponible(plato)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          plato.disponible
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                            : 'bg-red-950/60 text-red-400 border border-red-800/60'
                        }`}
                      >
                        {plato.disponible ? '✓ Disponible' : '✕ Agotado'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingPlato(plato);
                            setIsCreating(false);
                          }}
                          className="p-1.5 rounded-lg bg-[#25221E] hover:bg-[#E5A93C] text-[#A8A29E] hover:text-[#0E0D0B] transition-colors"
                          title="Editar plato"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlato(plato)}
                          className="p-1.5 rounded-lg bg-[#25221E] hover:bg-red-600 text-[#A8A29E] hover:text-white transition-colors"
                          title="Eliminar plato"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Editor / Creación */}
      {editingPlato && (
        <div className="fixed inset-0 z-50 bg-[#0E0D0B]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-xl w-full bg-[#181613] rounded-3xl p-6 sm:p-8 border border-[#E5A93C]/40 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-serif text-xl font-bold text-[#FDFCF7]">
                {isCreating ? 'Añadir Nuevo Plato a la Carta' : `Editar: ${editingPlato.nombre}`}
              </h2>
              <button
                onClick={() => setEditingPlato(null)}
                className="p-1.5 rounded-lg text-[#A8A29E] hover:text-[#FDFCF7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlato} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Nombre del Plato</label>
                <input
                  type="text"
                  required
                  value={editingPlato.nombre}
                  onChange={(e) => setEditingPlato({ ...editingPlato, nombre: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7] text-sm focus:border-[#E5A93C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A8A29E] font-semibold mb-1">Categoría</label>
                  <select
                    value={editingPlato.categoria}
                    onChange={(e) => setEditingPlato({ ...editingPlato, categoria: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7] focus:border-[#E5A93C]"
                  >
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#A8A29E] font-semibold mb-1">Ruta de Imagen (SVG/WebP)</label>
                  <input
                    type="text"
                    value={editingPlato.imagen}
                    onChange={(e) => setEditingPlato({ ...editingPlato, imagen: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7] focus:border-[#E5A93C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A8A29E] font-semibold mb-1">Precio Tapa (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={editingPlato.precioTapa ?? ''}
                    onChange={(e) =>
                      setEditingPlato({
                        ...editingPlato,
                        precioTapa: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7] focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29E] font-semibold mb-1">Precio Ración (€) [Opcional]</label>
                  <input
                    type="number"
                    step="0.10"
                    value={editingPlato.precioRacion ?? ''}
                    onChange={(e) =>
                      setEditingPlato({
                        ...editingPlato,
                        precioRacion: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7] focus:border-[#E5A93C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Descripción Gastronómica</label>
                <textarea
                  rows={3}
                  value={editingPlato.descripcion}
                  onChange={(e) => setEditingPlato({ ...editingPlato, descripcion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7] focus:border-[#E5A93C]"
                />
              </div>

              {/* Checkboxes de Destacado y Disponible */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlato.destacado}
                    onChange={(e) => setEditingPlato({ ...editingPlato, destacado: e.target.checked })}
                    className="rounded bg-[#12100E] text-[#E5A93C] focus:ring-0"
                  />
                  <span>Destacar en Portada</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlato.disponible}
                    onChange={(e) => setEditingPlato({ ...editingPlato, disponible: e.target.checked })}
                    className="rounded bg-[#12100E] text-[#E5A93C] focus:ring-0"
                  />
                  <span>Disponible para Servicio</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPlato(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#25221E] hover:bg-[#2A2621] text-[#FDFCF7] font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E5A93C] text-[#0E0D0B] font-bold hover:scale-105 active:scale-95 transition-all"
                >
                  Guardar Plato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
