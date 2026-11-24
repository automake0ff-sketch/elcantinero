'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Maximize2, X } from 'lucide-react';

interface FotoGaleria {
  id: string;
  titulo: string;
  categoria: string;
  src: string;
  descripcion: string;
}

const fotos: FotoGaleria[] = [
  {
    id: 'terraza-exterior',
    titulo: 'Terraza al Aire Libre',
    categoria: 'ambiente',
    src: '/assets/imagenes/galeria/terraza.svg',
    descripcion: 'Espacio exterior amplio y agradable en Sevilla Este para disfrutar del buen clima y tapear con tranquilidad.',
  },
  {
    id: 'barra-tapas',
    titulo: 'Barra de Tapas y Encuentro',
    categoria: 'local',
    src: '/assets/imagenes/galeria/barra.svg',
    descripcion: 'El corazón de El Cantinero: vitrina de tapas frías recién preparadas y cerveza bien tirada.',
  },
  {
    id: 'salon-interior',
    titulo: 'Salón Comedor Climatizado',
    categoria: 'local',
    src: '/assets/imagenes/galeria/salon.svg',
    descripcion: 'Ambiente acogedor y cómodo para almuerzos familiares o entre amigos.',
  },
  {
    id: 'desayunos-manana',
    titulo: 'Primeras Horas: Desayunos',
    categoria: 'desayunos',
    src: '/assets/imagenes/galeria/desayunos.svg',
    descripcion: 'Pan tostado al momento, salmorejo casero, jamón y café recién hecho desde las 07:00 de la mañana.',
  },
];

export default function Galeria() {
  const [selectedFoto, setSelectedFoto] = useState<FotoGaleria | null>(null);

  return (
    <section id="galeria" className="py-20 bg-[#12100E] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-xs font-semibold text-[#FCD34D] uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-[#E5A93C]" />
            El Restaurante
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FDFCF7]">
            Galería y Ambiente
          </h2>
          <p className="text-sm sm:text-base text-[#A8A29E]">
            Conoce nuestras instalaciones en la Calle Periodista Juan Tribuna de Sevilla Este.
          </p>
        </div>

        {/* Rejilla de fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fotos.map((foto) => (
            <div
              key={foto.id}
              onClick={() => setSelectedFoto(foto)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1C1917] border border-white/10 hover:border-[#E5A93C] cursor-pointer shadow-lg transition-all duration-300"
            >
              <Image
                src={foto.src}
                alt={foto.titulo}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0B] via-[#0E0D0B]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors">
                    {foto.titulo}
                  </p>
                  <p className="text-[11px] text-[#A8A29E]">{foto.descripcion.slice(0, 45)}...</p>
                </div>
                <div className="p-1.5 rounded-lg bg-[#0E0D0B]/80 text-[#E5A93C] border border-[#E5A93C]/30 group-hover:scale-110 transition-transform">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal visor ampliado */}
      {selectedFoto && (
        <div
          role="dialog"
          aria-label={selectedFoto.titulo}
          className="fixed inset-0 z-50 bg-[#0E0D0B]/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedFoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#181613] rounded-2xl overflow-hidden border border-[#E5A93C]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-[#12100E]">
              <Image
                src={selectedFoto.src}
                alt={selectedFoto.titulo}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#FDFCF7]">
                  {selectedFoto.titulo}
                </h3>
                <p className="text-sm text-[#A8A29E] mt-1">
                  {selectedFoto.descripcion}
                </p>
              </div>
              <button
                onClick={() => setSelectedFoto(null)}
                className="p-2 rounded-full bg-[#25221E] text-[#FDFCF7] hover:bg-[#E5A93C] hover:text-[#0E0D0B] transition-colors"
                aria-label="Cerrar foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
