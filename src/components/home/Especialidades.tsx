'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import cartaData from '@/data/carta.json';

export default function Especialidades() {
  const platosDestacados = cartaData.platos.filter((p) => p.destacado).slice(0, 4);

  return (
    <section id="especialidades" className="py-20 bg-[#12100E] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-xs font-semibold text-[#FCD34D] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
            Nuestra Cocina
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FDFCF7]">
            Especialidades que no te puedes perder
          </h2>
          <p className="text-sm sm:text-base text-[#A8A29E]">
            Elaboraciones caseras reconocidas por nuestros clientes habituales en Sevilla Este.
          </p>
        </div>

        {/* Rejilla de platos destacados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {platosDestacados.map((plato) => (
            <div
              key={plato.id}
              className="group bg-[#181613] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E5A93C]/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[#E5A93C]/10"
            >
              {/* Imagen del plato */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#241E18]">
                <Image
                  src={plato.imagen}
                  alt={plato.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {plato.etiquetas && plato.etiquetas[0] && (
                  <span className="absolute top-3 left-3 bg-[#0E0D0B]/85 backdrop-blur-sm text-[#FCD34D] border border-[#E5A93C]/30 text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {plato.etiquetas[0]}
                  </span>
                )}
              </div>

              {/* Información */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors leading-snug">
                    {plato.nombre}
                  </h3>
                  <p className="text-xs text-[#A8A29E] line-clamp-3 mt-1.5 leading-relaxed">
                    {plato.descripcion}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    {plato.precioTapa && (
                      <span className="text-sm font-bold text-[#FCD34D]">
                        Tapa: {plato.precioTapa.toFixed(2)} €
                      </span>
                    )}
                    {plato.precioRacion && (
                      <span className="text-xs text-[#A8A29E] block">
                        Ración: {plato.precioRacion.toFixed(2)} €
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/carta?categoria=${plato.categoria}`}
                    className="p-2 rounded-lg bg-[#25221E] hover:bg-[#E5A93C] text-[#A8A29E] hover:text-[#0E0D0B] transition-colors"
                    aria-label={`Ver más sobre ${plato.nombre}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA a la carta completa */}
        <div className="text-center">
          <Link
            href="/carta"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#1C1917] hover:bg-[#25221E] text-[#FDFCF7] border border-[#E5A93C]/40 hover:border-[#E5A93C] font-bold text-sm tracking-wide shadow-md transition-all"
          >
            <span>Ver la Carta Digital Completa</span>
            <ArrowRight className="w-4 h-4 text-[#E5A93C]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
