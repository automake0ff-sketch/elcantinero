'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Utensils, X, Info, Sparkles, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import { Plato, CategoriaPlato, AlergenoItem } from '@/lib/types';
import cartaData from '@/data/carta.json';
import PlatoModal from './PlatoModal';

export default function MenuExplorer() {
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPlato, setSelectedPlato] = useState<Plato | null>(null);
  const [selectedAlergenoFilter, setSelectedAlergenoFilter] = useState<string>('');

  const { categorias, alergenosCatalogo, platos } = cartaData as {
    categorias: CategoriaPlato[];
    alergenosCatalogo: AlergenoItem[];
    platos: Plato[];
  };

  const filteredPlatos = useMemo(() => {
    return platos.filter((plato) => {
      // Filtro de categoría
      const matchesCategory =
        selectedCategoria === 'todas' ||
        plato.categoria === selectedCategoria ||
        (selectedCategoria === 'especialidades' && plato.destacado);

      // Filtro de búsqueda textual
      const matchesSearch =
        plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plato.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plato.etiquetas?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro de alérgenos (excluir o buscar platos libres de ese alérgeno si se desea, o que contengan)
      const matchesAlergeno =
        !selectedAlergenoFilter || !plato.alergenos.includes(selectedAlergenoFilter);

      return matchesCategory && matchesSearch && matchesAlergeno;
    });
  }, [selectedCategoria, searchTerm, selectedAlergenoFilter, platos]);

  return (
    <div className="w-full">
      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-[#181613] rounded-3xl p-4 sm:p-6 border border-white/10 shadow-xl mb-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Buscador en vivo */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Buscar por plato, ingrediente o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7] placeholder-[#78716C] focus:outline-none focus:border-[#E5A93C] transition-colors text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#A8A29E] hover:text-[#FDFCF7]"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtro rápido sin alérgenos */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-[#A8A29E] whitespace-nowrap hidden sm:inline">Excluir alérgeno:</span>
            <select
              value={selectedAlergenoFilter}
              onChange={(e) => setSelectedAlergenoFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7] text-xs focus:outline-none focus:border-[#E5A93C]"
            >
              <option value="">Todos los platos (sin filtro de alérgeno)</option>
              {alergenosCatalogo.map((a) => (
                <option key={a.codigo} value={a.codigo}>
                  Sin {a.nombre} {a.icono}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categorías como chips horizontales desplazables */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categorias.map((cat) => {
            const isActive = selectedCategoria === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoria(cat.id)}
                type="button"
                className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#E5A93C] text-[#0E0D0B] shadow-md shadow-[#E5A93C]/20 scale-105'
                    : 'bg-[#25221E] text-[#A8A29E] hover:text-[#FDFCF7] hover:bg-[#2F2B26] border border-white/5'
                }`}
              >
                <span>{cat.nombre}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between text-xs text-[#A8A29E] mb-6 px-1">
        <span>Mostrando {filteredPlatos.length} platos disponibles</span>
        {selectedAlergenoFilter && (
          <span className="text-[#E5A93C] bg-[#E5A93C]/10 px-2.5 py-1 rounded-full border border-[#E5A93C]/20">
            Filtro activo: Sin {alergenosCatalogo.find((a) => a.codigo === selectedAlergenoFilter)?.nombre}
          </span>
        )}
      </div>

      {/* Grid de Platos */}
      {filteredPlatos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlatos.map((plato) => (
            <div
              key={plato.id}
              onClick={() => setSelectedPlato(plato)}
              className="group bg-[#181613] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E5A93C]/60 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[#E5A93C]/15 cursor-pointer transform hover:-translate-y-1"
            >
              {/* Imagen y etiquetas */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#241E18]">
                <Image
                  src={plato.imagen}
                  alt={plato.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181613] via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {plato.destacado && (
                    <span className="bg-[#E5A93C] text-[#0E0D0B] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                      ★ Destacado
                    </span>
                  )}
                  {plato.etiquetas?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#0E0D0B]/80 backdrop-blur-sm text-[#FDFCF7] border border-white/10 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {!plato.disponible && (
                  <span className="absolute inset-0 bg-[#0E0D0B]/80 flex items-center justify-center text-xs font-bold text-red-400">
                    Temporalmente Agotado
                  </span>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors leading-snug">
                    {plato.nombre}
                  </h3>
                  <p className="text-xs text-[#A8A29E] line-clamp-3 mt-1.5 leading-relaxed">
                    {plato.descripcion}
                  </p>
                </div>

                {/* Alérgenos iconos */}
                {plato.alergenos && plato.alergenos.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-[#78716C] mr-1">Alérgenos:</span>
                    {plato.alergenos.map((code) => {
                      const item = alergenosCatalogo.find((a) => a.codigo === code);
                      return (
                        <span
                          key={code}
                          title={item ? item.nombre : code}
                          className="w-5 h-5 rounded-full bg-[#25221E] border border-white/5 flex items-center justify-center text-[10px]"
                        >
                          {item?.icono || '⚠️'}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Precios y botón ver */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    {plato.precioTapa && (
                      <p className="text-sm font-extrabold text-[#FCD34D]">
                        Tapa: {plato.precioTapa.toFixed(2)} €
                      </p>
                    )}
                    {plato.precioRacion && (
                      <p className="text-xs text-[#A8A29E]">
                        Ración: {plato.precioRacion.toFixed(2)} €
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#E5A93C] bg-[#E5A93C]/10 px-3 py-1.5 rounded-lg border border-[#E5A93C]/20 group-hover:bg-[#E5A93C] group-hover:text-[#0E0D0B] transition-colors">
                    Ver Detalle &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#181613] rounded-3xl border border-white/10 p-8 space-y-3">
          <Utensils className="w-10 h-10 text-[#78716C] mx-auto mb-2" />
          <h3 className="font-serif text-lg font-bold text-[#FDFCF7]">
            No se han encontrado platos con los criterios seleccionados
          </h3>
          <p className="text-xs text-[#A8A29E] max-w-sm mx-auto">
            Prueba a cambiar el término de búsqueda o a restablecer los filtros de alérgenos y categorías.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategoria('todas');
              setSelectedAlergenoFilter('');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-[#E5A93C] text-[#0E0D0B] font-bold text-xs"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* Modal interactivo de plato individual */}
      {selectedPlato && (
        <PlatoModal
          plato={selectedPlato}
          alergenosCatalogo={alergenosCatalogo}
          onClose={() => setSelectedPlato(null)}
        />
      )}
    </div>
  );
}
